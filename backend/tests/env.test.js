const { test } = require('node:test');
const assert = require('node:assert/strict');

test('env module exports expected keys', () => {
  // Ensure JWT for test process
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret_min_8_chars_xx';
  const { env } = require('../src/config/env');
  assert.ok(env.port);
  assert.ok(env.mongoUri);
  assert.equal(typeof env.storageDriver, 'string');
});
