/**
 * Content moderation — EN/SQ profanity + obfuscation + gibberish
 * Production-ready utility used by comments, photo captions, contact messages.
 *
 * Backend is the final authority; frontend mirrors the same rules for UX.
 */

'use strict';

// ---------------------------------------------------------------------------
// Blacklists (base forms — checked after normalization)
// ---------------------------------------------------------------------------

const EN_WORDS = [
  'fuck', 'fucking', 'fucked', 'fucker', 'motherfucker', 'mf',
  // common misspellings / stripped forms
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
  'nazi', 'hitler',
];

const EN_PHRASES = [
  'son of a bitch',
  'piece of shit',
  'go to hell',
  'screw you',
  'kill yourself',
  'kys',
  'go die',
];

const SQ_WORDS = [
  'kar', 'kari',
  'pidh',
  'kurve', 'kurva', 'kurvar', 'kurvare', 'kurvarllek',
  'qij', 'qifsha',
  'robt', 'ropt', 'robqir',
  'bythe', 'bytha', 'bythqir',
  'gomar', 'budalla', 'budalle',
  'idiot', 'debil',
  'palle', 'palla',
  'lesh',
  'mut', 'hale',
  'maskara',
  'plehre', 'plehra',
  'kopil',
  'qen',
  'kafshe', 'kafsha',
  'injorant',
];

const SQ_PHRASES = [
  'kari im',
  'kari jot',
  'pidh motre',
  'pidh motren',
  'pidh robi',
  'qifsha ropt',
  'qifsha motren',
  'qifsha nanen',
  'ta qifsha',
  'ta qifsha nanen',
  'ta qifsha motren',
  'shko ne ferr',
  'shko n ferr',
];

// Extra spam / abuse patterns (post-normalization)
const SPAM_PATTERNS = [
  /\b(porn|xxx|nude|onlyfans|viagra|casino\s*bonus|crypto\s*giveaway)\b/i,
  /(https?:\/\/[^\s]+){3,}/i,
  /(.)\1{8,}/,
];

const KEYBOARD_MASH = [
  /^(asdf+|qwer+|zxcv+|hjkl+|yuiop+|dfgh+|sdfg+|qwerty|asdasd|abcabc|123123)+$/i,
  /^[bcdfghjklmnpqrstvwxz]{6,}$/i,
];

// ---------------------------------------------------------------------------
// Normalization — handles leetspeak, symbols, repeats, punctuation
// ---------------------------------------------------------------------------

const LEET_MAP = {
  '0': 'o',
  '1': 'i',
  '2': 'z',
  '3': 'e',
  '4': 'a',
  '5': 's',
  '6': 'g',
  '7': 't',
  '8': 'b',
  '9': 'g',
  '@': 'a',
  '$': 's',
  '!': 'i',
  '|': 'i',
  '+': 't',
  '€': 'e',
  '£': 'e',
  '¥': 'y',
  '§': 's',
  '°': 'o',
  '*': '',
  '#': '',
  '%': '',
  '&': '',
  '^': '',
  '~': '',
  '`': '',
  "'": '',
  '"': '',
  '´': '',
  '’': '',
  '‘': '',
};

function stripDiacritics(s) {
  return String(s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Albanian-specific leftovers
    .replace(/ë/g, 'e')
    .replace(/ç/g, 'c')
    .replace(/Ë/g, 'e')
    .replace(/Ç/g, 'c');
}

/**
 * Normalize text for matching:
 * - lowercase
 * - strip diacritics
 * - map leetspeak / symbols → letters
 * - remove remaining punctuation
 * - collapse repeated letters (fuuuck → fuck, kaar → kar)
 * - collapse whitespace
 */
function normalizeText(input) {
  let t = stripDiacritics(String(input || '')).toLowerCase();

  // Map leet / symbols char by char
  let out = '';
  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    if (Object.prototype.hasOwnProperty.call(LEET_MAP, ch)) {
      out += LEET_MAP[ch];
    } else {
      out += ch;
    }
  }
  t = out;

  // Keep letters, digits (already mapped), spaces; drop other punctuation
  t = t.replace(/[^a-z0-9\s]/g, ' ');

  // Collapse 3+ repeated letters to 2, then 2 → 1 for matching base forms
  // e.g. fuckkk → fuckk → fuck
  t = t.replace(/(.)\1{2,}/g, '$1$1');
  t = t.replace(/(.)\1/g, '$1');

  // Collapse whitespace
  t = t.replace(/\s+/g, ' ').trim();
  return t;
}

/** Alternate normalization: treat @ * # as removed (f@ck → fck) */
function normalizeTextStrict(input) {
  let t = stripDiacritics(String(input || '')).toLowerCase();
  t = t.replace(/[@*#$%^&~`'"´’‘|]/g, '');
  let out = '';
  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    if (Object.prototype.hasOwnProperty.call(LEET_MAP, ch)) {
      out += LEET_MAP[ch];
    } else {
      out += ch;
    }
  }
  t = out.replace(/[^a-z0-9\s]/g, ' ');
  t = t.replace(/(.)\1{2,}/g, '$1$1').replace(/(.)\1/g, '$1');
  return t.replace(/\s+/g, ' ').trim();
}

/**
 * Also produce a "compact" form with no spaces for phrase/word boundary tricks
 * e.g. "f u c k" → "fuck"
 */
function compactText(normalized) {
  return String(normalized || '').replace(/\s+/g, '');
}

// ---------------------------------------------------------------------------
// Matching
// ---------------------------------------------------------------------------

function buildWordSet(words) {
  return new Set(words.map((w) => normalizeText(w)).filter(Boolean));
}

function buildPhraseList(phrases) {
  return phrases.map((p) => normalizeText(p)).filter(Boolean);
}

const EN_WORD_SET = buildWordSet(EN_WORDS);
const SQ_WORD_SET = buildWordSet(SQ_WORDS);
const EN_PHRASE_LIST = buildPhraseList(EN_PHRASES);
const SQ_PHRASE_LIST = buildPhraseList(SQ_PHRASES);

// Known obfuscation regexes that survive light normalization edge-cases
const OBFUSCATION_RES = [
  /\bf+\s*u+\s*c+\s*k+/i,
  /\bf+\s*[u*]+\s*[c*]+\s*k+/i,
  /\bs+\s*h+\s*[i1!]+\s*t+/i,
  /\bb+\s*[i1!]+\s*t+\s*c+\s*h+/i,
  /\ba+\s*s+\s*s+\s*h+\s*o+\s*l+\s*e+/i,
  /\bk+\s*[a4@]+\s*r+\b/i,
  /\bp+\s*[i1!]+\s*d+\s*h+/i,
  /\bq+\s*[i1!]+\s*f+\s*s+\s*h+\s*a+/i,
  /\bk+\s*u+\s*r+\s*v+[e3a]*/i,
];

function matchAgainst(normalized, compact) {
  for (const phrase of EN_PHRASE_LIST) {
    if (normalized.includes(phrase) || compact.includes(phrase.replace(/\s+/g, ''))) {
      return true;
    }
  }
  for (const phrase of SQ_PHRASE_LIST) {
    if (normalized.includes(phrase) || compact.includes(phrase.replace(/\s+/g, ''))) {
      return true;
    }
  }

  const tokens = normalized.split(/\s+/).filter(Boolean);
  for (const tok of tokens) {
    if (EN_WORD_SET.has(tok) || SQ_WORD_SET.has(tok)) return true;
  }

  for (const w of EN_WORD_SET) {
    if (w.length >= 3 && compact.includes(w)) return true;
  }
  for (const w of SQ_WORD_SET) {
    if (w.length >= 3 && compact.includes(w)) return true;
  }

  return false;
}

function containsBlacklistedWord(normalized, compact, normalizedStrict, compactStrict) {
  if (matchAgainst(normalized, compact)) return true;
  if (normalizedStrict && matchAgainst(normalizedStrict, compactStrict || compactText(normalizedStrict))) {
    return true;
  }
  return false;
}

function matchesObfuscationRegex(original) {
  const raw = String(original || '');
  for (const re of OBFUSCATION_RES) {
    if (re.test(raw)) return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// Gibberish
// ---------------------------------------------------------------------------

function looksLikeGibberish(text) {
  const t = String(text || '').trim();
  if (t.length < 3) return true;

  const noSpace = t.replace(/\s+/g, '');
  for (const re of KEYBOARD_MASH) {
    if (re.test(noSpace)) return true;
  }

  const letters = t.replace(/[^a-zA-ZëËçÇäöüáéíóúàèìòùâêîôû]/g, '');
  if (letters.length < 3) return true;

  const vowels = (letters.match(/[aeiouyëäöüáéíóúàèìòùâêîôûAEIOUYË]/g) || []).length;
  if (letters.length >= 6 && vowels / letters.length < 0.15) return true;
  if (/[bcdfghjklmnpqrstvwxzBCDFGHJKLMNPQRSTVWXZ]{6,}/.test(letters)) return true;
  if (!/\s/.test(t) && t.length > 16 && vowels / Math.max(letters.length, 1) < 0.28) return true;
  if (/([a-z]{2,4})\1{3,}/i.test(t)) return true;

  const words = t.split(/\s+/).filter(Boolean);
  if (words.length === 1 && t.length >= 8 && vowels / letters.length < 0.25) return true;

  return false;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

const MSG = {
  short: 'Teksti është shumë i shkurtër (min. 2 karaktere). / Text is too short (min. 2 characters).',
  long: 'Teksti është shumë i gjatë (max. 2000 karaktere). / Text is too long (max. 2000 characters).',
  profanity:
    'Your comment contains inappropriate language. Please edit it before submitting. / Përmbajtja përmban gjuhë të papërshtatshme. Hiq fjalët fyese dhe provo përsëri.',
  offensive: 'Offensive language is not allowed. / Gjuha fyese nuk lejohet.',
  spam: 'Përmbajtja nuk është e lejuar (spam / e papërshtatshme). / Content not allowed (spam / inappropriate).',
  readable: 'Teksti duhet të përmbajë fjalë të lexueshme në shqip ose anglisht. / Text must contain readable words in Albanian or English.',
  gibberish:
    'Teksti duket pa kuptim (p.sh. "dvjssdsdjk"). Shkruaj një koment/përshkrim të qartë në shqip ose anglisht. / Text looks meaningless. Write a clear comment in Albanian or English.',
};

/**
 * Moderate free-form user text.
 * @returns {{ ok: boolean, reason?: string, code?: string }}
 */
function moderateText(text = '') {
  const raw = String(text || '').trim();

  if (raw.length < 2) {
    return { ok: false, reason: MSG.short, code: 'TOO_SHORT' };
  }
  if (raw.length > 2000) {
    return { ok: false, reason: MSG.long, code: 'TOO_LONG' };
  }

  const normalized = normalizeText(raw);
  const compact = compactText(normalized);
  const normalizedStrict = normalizeTextStrict(raw);
  const compactStrict = compactText(normalizedStrict);

  if (
    containsBlacklistedWord(normalized, compact, normalizedStrict, compactStrict) ||
    matchesObfuscationRegex(raw)
  ) {
    return { ok: false, reason: MSG.profanity, code: 'PROFANITY' };
  }

  for (const re of SPAM_PATTERNS) {
    if (re.test(raw) || re.test(normalized)) {
      return { ok: false, reason: MSG.spam, code: 'SPAM' };
    }
  }

  if (!/[a-zA-Zà-ÿëçËÇ\u00C0-\u024F]{2,}/.test(raw)) {
    return { ok: false, reason: MSG.readable, code: 'NOT_READABLE' };
  }

  if (looksLikeGibberish(raw)) {
    return { ok: false, reason: MSG.gibberish, code: 'GIBBERISH' };
  }

  return { ok: true };
}

/**
 * Moderate photo metadata (caption + year).
 */
function moderatePhotoMeta({ caption, year }) {
  const textCheck = moderateText(caption);
  if (!textCheck.ok) return textCheck;

  const y = Number(year);
  const maxY = new Date().getFullYear() + 1;
  if (!Number.isFinite(y) || y < 1400 || y > maxY) {
    return {
      ok: false,
      reason: `Viti duhet të jetë një numër midis 1400 dhe ${maxY}. / Year must be between 1400 and ${maxY}.`,
      code: 'INVALID_YEAR',
    };
  }
  return { ok: true };
}

/**
 * Test helper / admin: check if a single string would be blocked.
 */
function isProfane(text) {
  const r = moderateText(text);
  return !r.ok && (r.code === 'PROFANITY' || r.code === 'SPAM');
}

module.exports = {
  moderateText,
  moderatePhotoMeta,
  looksLikeGibberish,
  normalizeText,
  isProfane,
  MSG,
};
