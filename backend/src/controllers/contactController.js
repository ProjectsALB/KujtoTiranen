const { moderateText } = require('../utils/moderation');
const { validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const { notifyContact } = require('../utils/mailer');

exports.submitContact = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0]?.msg || 'Validation error',
        errors: errors.array(),
      });
    }

    const { name, email, phone, message } = req.body;
    const mod = moderateText(message || req.body.text || '');
    if (!mod.ok) {
      return res.status(400).json({
        success: false,
        message: mod.reason || 'Offensive language is not allowed.',
        code: mod.code,
      });
    }

    const contact = await Contact.create({
      name: String(name || '').trim(),
      email: String(email || '').trim().toLowerCase(),
      phone: String(phone || '').trim(),
      message: String(message || '').trim(),
    });

    try {
      await notifyContact(contact);
    } catch (e) {
      console.error('contact email failed', e.message);
    }

    res.status(201).json({
      success: true,
      message: "Mesazhi u dërgua me sukses. Do t'ju përgjigjemi së shpejti.",
      data: { id: contact._id },
    });
  } catch (err) {
    next(err);
  }
};
