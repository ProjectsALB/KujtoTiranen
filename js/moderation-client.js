/**
 * Kujto Tiranën — moderation-client.js
 * Client-side text checks before submit (mirrors server rules).
 * Do not remove without checking index.html script order.
 */
/**
 * Client-side moderation mirror (EN/SQ + obfuscation).
 * Backend remains the final authority — this only improves UX before submit.
 */
(function (global) {
  'use strict';

  var EN_WORDS = [
    'fuck', 'fucking', 'fucked', 'fucker', 'motherfucker', 'mf',
    'fuk', 'fucc', 'fack', 'fck', 'fuc', 'phuck', 'fook',
    'shit', 'bullshit', 'shitty', 'sht',
    'bitch', 'bastard', 'btch',
    'asshole', 'ass',
    'dick', 'cock', 'pussy', 'cunt',
    'whore', 'slut',
    'retard', 'retarded',
    'idiot', 'moron', 'stupid', 'loser', 'jerk',
    'dumbass', 'dipshit', 'prick', 'wanker', 'twat', 'jackass',
    'nigger', 'nigga', 'faggot', 'fag',
    'nazi', 'hitler'
  ];

  var EN_PHRASES = [
    'son of a bitch', 'piece of shit', 'go to hell', 'screw you',
    'kill yourself', 'kys', 'go die'
  ];

  var SQ_WORDS = [
    'kar', 'kari', 'pidh',
    'kurve', 'kurva', 'kurvar', 'kurvare', 'kurvarllek',
    'qij', 'qifsha',
    'robt', 'ropt', 'robqir',
    'bythe', 'bytha', 'bythqir',
    'gomar', 'budalla', 'budalle',
    'idiot', 'debil',
    'palle', 'palla', 'lesh', 'mut', 'hale', 'maskara',
    'plehre', 'plehra', 'kopil', 'qen', 'kafshe', 'kafsha', 'injorant'
  ];

  var SQ_PHRASES = [
    'kari im', 'kari jot', 'pidh motre', 'pidh motren', 'pidh robi',
    'qifsha ropt', 'qifsha motren', 'qifsha nanen',
    'ta qifsha', 'ta qifsha nanen', 'ta qifsha motren',
    'shko ne ferr', 'shko n ferr'
  ];

  var LEET = {
    '0': 'o', '1': 'i', '2': 'z', '3': 'e', '4': 'a', '5': 's',
    '6': 'g', '7': 't', '8': 'b', '9': 'g',
    '@': 'a', '$': 's', '!': 'i', '|': 'i', '+': 't',
    '*': '', '#': '', '%': '', '&': '', '^': '', '~': '', '`': '',
    "'": '', '"': '', '´': '', '’': '', '‘': ''
  };

  var OBFUSCATION_RES = [
    /\bf+\s*u+\s*c+\s*k+/i,
    /\bf+\s*[u*]+\s*[c*]+\s*k+/i,
    /\bs+\s*h+\s*[i1!]+\s*t+/i,
    /\bb+\s*[i1!]+\s*t+\s*c+\s*h+/i,
    /\ba+\s*s+\s*s+\s*h+\s*o+\s*l+\s*e+/i,
    /\bk+\s*[a4@]+\s*r+\b/i,
    /\bp+\s*[i1!]+\s*d+\s*h+/i,
    /\bq+\s*[i1!]+\s*f+\s*s+\s*h+\s*a+/i,
    /\bk+\s*u+\s*r+\s*v+[e3a]*/i
  ];

  var MASH = [
    /^(asdf+|qwer+|zxcv+|hjkl+|yuiop+|dfgh+|sdfg+|qwerty|asdasd|abcabc|123123)+$/i,
    /^[bcdfghjklmnpqrstvwxz]{6,}$/i
  ];

  function stripDiacritics(s) {
    return String(s || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ë/g, 'e').replace(/ç/g, 'c')
      .replace(/Ë/g, 'e').replace(/Ç/g, 'c');
  }

  function normalizeText(input) {
    var t = stripDiacritics(String(input || '')).toLowerCase();
    var out = '';
    for (var i = 0; i < t.length; i++) {
      var ch = t.charAt(i);
      out += Object.prototype.hasOwnProperty.call(LEET, ch) ? LEET[ch] : ch;
    }
    t = out.replace(/[^a-z0-9\s]/g, ' ');
    t = t.replace(/(.)\1{2,}/g, '$1$1').replace(/(.)\1/g, '$1');
    return t.replace(/\s+/g, ' ').trim();
  }

  function normalizeTextStrict(input) {
    var t = stripDiacritics(String(input || '')).toLowerCase();
    t = t.replace(/[@*#$%^&~`'"´’‘|]/g, '');
    var out = '';
    for (var i = 0; i < t.length; i++) {
      var ch = t.charAt(i);
      out += Object.prototype.hasOwnProperty.call(LEET, ch) ? LEET[ch] : ch;
    }
    t = out.replace(/[^a-z0-9\s]/g, ' ');
    t = t.replace(/(.)\1{2,}/g, '$1$1').replace(/(.)\1/g, '$1');
    return t.replace(/\s+/g, ' ').trim();
  }

  function compactText(n) {
    return String(n || '').replace(/\s+/g, '');
  }

  function buildSet(arr) {
    var s = {};
    for (var i = 0; i < arr.length; i++) {
      var n = normalizeText(arr[i]);
      if (n) s[n] = true;
    }
    return s;
  }

  var EN_SET = buildSet(EN_WORDS);
  var SQ_SET = buildSet(SQ_WORDS);
  var EN_PH = EN_PHRASES.map(normalizeText);
  var SQ_PH = SQ_PHRASES.map(normalizeText);

  function matchNormalized(normalized, compact) {
    var i, w, tok, tokens;
    for (i = 0; i < EN_PH.length; i++) {
      if (normalized.indexOf(EN_PH[i]) !== -1 || compact.indexOf(EN_PH[i].replace(/\s+/g, '')) !== -1) return true;
    }
    for (i = 0; i < SQ_PH.length; i++) {
      if (normalized.indexOf(SQ_PH[i]) !== -1 || compact.indexOf(SQ_PH[i].replace(/\s+/g, '')) !== -1) return true;
    }
    tokens = normalized.split(/\s+/);
    for (i = 0; i < tokens.length; i++) {
      tok = tokens[i];
      if (EN_SET[tok] || SQ_SET[tok]) return true;
    }
    for (w in EN_SET) {
      if (EN_SET.hasOwnProperty(w) && w.length >= 3 && compact.indexOf(w) !== -1) return true;
    }
    for (w in SQ_SET) {
      if (SQ_SET.hasOwnProperty(w) && w.length >= 3 && compact.indexOf(w) !== -1) return true;
    }
    return false;
  }

  function containsProfanity(raw) {
    var normalized = normalizeText(raw);
    var compact = compactText(normalized);
    var strict = normalizeTextStrict(raw);
    var compactStrict = compactText(strict);
    var i;

    if (matchNormalized(normalized, compact)) return true;
    if (matchNormalized(strict, compactStrict)) return true;

    for (i = 0; i < OBFUSCATION_RES.length; i++) {
      if (OBFUSCATION_RES[i].test(raw)) return true;
    }
    return false;
  }

  function looksLikeGibberish(text) {
    var t = String(text || '').trim();
    if (t.length < 3) return true;
    var noSpace = t.replace(/\s+/g, '');
    var i;
    for (i = 0; i < MASH.length; i++) {
      if (MASH[i].test(noSpace)) return true;
    }
    var letters = t.replace(/[^a-zA-ZëËçÇäöüáéíóúàèìòùâêîôû]/g, '');
    if (letters.length < 3) return true;
    var vowels = (letters.match(/[aeiouyëäöüáéíóúàèìòùâêîôûAEIOUYË]/g) || []).length;
    if (letters.length >= 6 && vowels / letters.length < 0.15) return true;
    if (/[bcdfghjklmnpqrstvwxzBCDFGHJKLMNPQRSTVWXZ]{6,}/.test(letters)) return true;
    if (!/\s/.test(t) && t.length > 16 && vowels / Math.max(letters.length, 1) < 0.28) return true;
    if (/([a-z]{2,4})\1{3,}/i.test(t)) return true;
    var words = t.split(/\s+/).filter(Boolean);
    if (words.length === 1 && t.length >= 8 && vowels / letters.length < 0.25) return true;
    return false;
  }

  var MSG_PROFANITY =
    'Your comment contains inappropriate language. Please edit it before submitting. / Përmbajtja përmban gjuhë të papërshtatshme. Hiq fjalët fyese dhe provo përsëri.';
  var MSG_OFFENSIVE = 'Offensive language is not allowed. / Gjuha fyese nuk lejohet.';

  /**
   * @returns {string|null} error message or null if OK
   */
  function validateCaption(text) {
    var t = String(text || '').trim();
    if (t.length < 2) return 'Teksti është shumë i shkurtër. / Text is too short.';
    if (t.length > 2000) return 'Teksti është shumë i gjatë. / Text is too long.';
    if (containsProfanity(t)) return MSG_PROFANITY;
    if (!/[a-zA-Zà-ÿëçËÇ\u00C0-\u024F]{2,}/.test(t)) {
      return 'Shkruaj fjalë të lexueshme në shqip ose anglisht. / Write readable words in Albanian or English.';
    }
    if (looksLikeGibberish(t)) {
      return 'Teksti duket pa kuptim. Shkruaj qartë në shqip ose anglisht. / Text looks meaningless. Write clearly.';
    }
    return null;
  }

  function validateYear(year) {
    var y = Number(year);
    var maxY = new Date().getFullYear() + 1;
    if (!Number.isFinite(y) || y < 1400 || y > maxY) {
      return 'Viti duhet të jetë numër midis 1400 dhe ' + maxY + '. / Year must be between 1400 and ' + maxY + '.';
    }
    return null;
  }

  /** Full result object (mirrors backend shape) */
  function moderateText(text) {
    var err = validateCaption(text);
    if (err) return { ok: false, reason: err };
    return { ok: true };
  }

  global.ktLooksLikeGibberish = looksLikeGibberish;
  global.ktValidateCaption = validateCaption;
  global.ktValidateYear = validateYear;
  global.ktModerateText = moderateText;
  global.ktContainsProfanity = containsProfanity;
  global.ktNormalizeText = normalizeText;
})(window);
