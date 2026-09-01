import test from 'node:test';
import assert from 'node:assert/strict';
import { BrowserWALSession } from '../src/index.js';

test('Web adapter creates a WAL envelope without manufacturing responsibility authority', () => {
  const session = new BrowserWALSession('test-author');

  assert.equal(session.authorIdentityHash, 'test-author');

  const record = session.appendRecord('test content');

  assert.equal(record.expression, 'test content');
  assert.equal(record.identity, null);
  assert.equal(record.verificationState, 'UNKNOWN');
  assert.equal(record.responsibilityState, 'UNESTABLISHED');
  assert.equal(record.propagationState, 'REQUIRE_VERIFICATION');

  const chain = session.getLedgerChain();

  assert.equal(chain.length, 1);
  assert.ok(chain[0].eventId);
});
