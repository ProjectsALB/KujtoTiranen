const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

test('server.js exposes health route', () => {
  const src = fs.readFileSync(path.join(__dirname, '../src/server.js'), 'utf8');
  assert.match(src, /\/api\/v1\/health/);
  assert.match(src, /version/);
});
