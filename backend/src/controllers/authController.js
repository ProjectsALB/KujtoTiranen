const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const signToken = (id) => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 8) {
    const err = new Error(
      'JWT_SECRET mungon ose është shumë i shkurtër. Krijo backend/.env nga .env.example dhe rinise serverin.'
    );
    err.statusCode = 500;
    throw err;
  }
  return jwt.sign({ id }, secret, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
};

exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0]?.msg || 'Validation error',
        errors: errors.array(),
      });
    }
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    if (!name || name.length < 2) {
      return res.status(400).json({ success: false, message: 'Emri duhet të ketë të paktën 2 karaktere' });
    }
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Email i pavlefshëm' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password min. 6 karaktere' });
    }

    const existing = await User.findOne({ email }).select('+password');
    if (existing) {
      // Same email already in system → try login with given password (no double register)
      const match = existing.password && (await existing.comparePassword(password));
      if (!match) {
        return res.status(400).json({
          success: false,
          message: 'Ky email ekziston. Password i gabuar — provo Hyr me password-in tënd, ose përdor email tjetër.',
        });
      }
      const token = signToken(existing._id);
      return res.status(200).json({
        success: true,
        message: 'Ky email ekzistonte — u identifikove automatikisht.',
        token,
        user: {
          id: existing._id,
          name: existing.name,
          email: existing.email,
          role: existing.role,
          favorites: existing.favorites || [],
        },
      });
    }

    const user = await User.create({ name, email, password });
    const token = signToken(user._id);
    res.status(201).json({
      success: true,
      message: 'Llogaria u krijua me sukses',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        favorites: user.favorites || [],
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email dhe password janë të detyrueshëm' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.password) {
      return res.status(401).json({
        success: false,
        message: 'Email ose password i gabuar. Nëse nuk ke llogari, kliko Regjistrohu.',
      });
    }
    const ok = await user.comparePassword(password);
    if (!ok) {
      return res.status(401).json({
        success: false,
        message: 'Email ose password i gabuar.',
      });
    }

    const token = signToken(user._id);
    res.json({
      success: true,
      message: 'U identifikove me sukses',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        favorites: user.favorites || [],
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      favorites: req.user.favorites || [],
      points: req.user.points,
      badges: req.user.badges,
    },
  });
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password i ri min. 6 karaktere' });
    }
    const user = await User.findById(req.user._id).select('+password');
    if (!user || !(await user.comparePassword(currentPassword || ''))) {
      return res.status(400).json({ success: false, message: 'Password aktual i gabuar' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password u ndryshua. Hyr me password-in e ri herën tjetër.' });
  } catch (err) {
    next(err);
  }
};

exports.toggleFavorite = async (req, res, next) => {
  try {
    const key = String(req.body.locationKey || '').trim().toLowerCase();
    if (!key) return res.status(400).json({ success: false, message: 'locationKey required' });
    const user = await User.findById(req.user._id);
    const i = user.favorites.indexOf(key);
    if (i >= 0) user.favorites.splice(i, 1);
    else user.favorites.push(key);
    await user.save();
    res.json({ success: true, favorites: user.favorites, favorited: i < 0 });
  } catch (err) {
    next(err);
  }
};


exports.googleLogin = async (req, res, next) => {
  try {
    const { credential, idToken } = req.body;
    const token = credential || idToken;
    if (!token) {
      return res.status(400).json({ success: false, message: 'Google credential required' });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      return res.status(503).json({
        success: false,
        message: 'Google OAuth nuk është konfiguruar. Vendos GOOGLE_CLIENT_ID në backend/.env',
      });
    }

    const { OAuth2Client } = require('google-auth-library');
    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({ idToken: token, audience: clientId });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(401).json({ success: false, message: 'Google token i pavlefshëm' });
    }

    const email = payload.email.toLowerCase();
    const googleId = payload.sub;
    const name = payload.name || email.split('@')[0];
    const avatar = payload.picture || '';

    let user = await User.findOne({ $or: [{ googleId }, { email }] });
    if (!user) {
      user = await User.create({ name, email, googleId, avatar, role: 'user' });
    } else {
      if (!user.googleId) user.googleId = googleId;
      if (avatar) user.avatar = avatar;
      if (name && user.name !== name) user.name = name;
      await user.save();
    }

    const jwtToken = signToken(user._id);
    res.json({
      success: true,
      message: 'U identifikove me Google',
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        favorites: user.favorites || [],
      },
    });
  } catch (err) {
    console.error('Google auth error:', err.message);
    next(err);
  }
};

exports.oauthConfig = async (_req, res) => {
  res.json({
    success: true,
    googleClientId: process.env.GOOGLE_CLIENT_ID || null,
    googleEnabled: Boolean(process.env.GOOGLE_CLIENT_ID),
  });
};
