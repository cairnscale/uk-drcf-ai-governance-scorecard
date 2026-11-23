import test from 'node:test';
import assert from 'node:assert/strict';
import { CONTROLS, scoreReadiness } from './index.mjs';

test('scores partial and full UK DRCF / EU AI Act Art 50 readiness deterministically', () => {
  const empty = scoreReadiness({});
  assert.equal(empty.scorePercent, 0);
  assert.equal(empty.band, 'HIGH_RISK_EXPOSURE');
  assert.equal(empty.missingControlCount, CONTROLS.length);

  const fullState = Object.fromEntries(CONTROLS.map((c) => [c.id, true]));
  const full = scoreReadiness(fullState);
  assert.equal(full.scorePercent, 100);
  assert.equal(full.band, 'STRONG_READINESS');
  assert.equal(full.missingControlCount, 0);
});
