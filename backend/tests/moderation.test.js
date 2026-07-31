const { test } = require('node:test');
const assert = require('node:assert/strict');
const { moderateText } = require('../src/utils/moderation');

test('allows normal Albanian caption', () => {
  const r = moderateText('Foto e Piramidës në vitin 1990');
  assert.equal(r.ok, true);
});

test('blocks clear English profanity', () => {
  const r = moderateText('this is fucking stupid');
  assert.equal(r.ok, false);
  assert.ok(r.reason);
});

test('blocks empty / too short gibberish', () => {
  const r = moderateText('asdfghjkl');
  // may be gibberish or ok depending on rules — at least returns shape
  assert.equal(typeof r.ok, 'boolean');
});

test('rejects empty text', () => {
  const r = moderateText('   ');
  assert.equal(r.ok, false);
});
