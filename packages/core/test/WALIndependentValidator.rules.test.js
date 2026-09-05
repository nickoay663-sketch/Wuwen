import test from 'node:test';
import assert from 'node:assert';
import WALIndependentValidator from '../src/WALIndependentValidator.js';

test('WALIndependentValidator R00 rules direct adversarial coverage', async (t) => {
    const validator = new WALIndependentValidator();

    await t.test('WAL-R00-01: invalid structure fails', () => {
        const result = validator.validateEnvelope({});
        assert.strictEqual(result.passed, false);
        assert.ok(result.failedRules.some(r => r.rule === 'WAL-R00-01'));
    });

    await t.test('WAL-R00-02: responsibility exceeding evidence fails', () => {
        const result = validator.validateEnvelope({
            contractVersion: '1.0',
            responsibility: { claim: 'heavy', evidenceCount: 2 },
            evidenceCount: 0,
            verifiedEvidenceCount: 0
        });
        assert.strictEqual(result.passed, false);
        assert.ok(result.failedRules.some(r => r.rule === 'WAL-R00-02'));
    });

    await t.test('WAL-R00-03: high certainty without evidence fails', () => {
        const result = validator.validateEnvelope({
            contractVersion: '1.0',
            epistemicState: 'CERTAIN',
            evidence: []
        });
        assert.strictEqual(result.passed, false);
        assert.ok(result.failedRules.some(r => r.rule === 'WAL-R00-03'));
    });

    await t.test('WAL-R00-04: manufactured evidence fails', () => {
        const result = validator.validateEnvelope({
            contractVersion: '1.0',
            manufacturedEvidence: true
        });
        assert.strictEqual(result.passed, false);
        assert.ok(result.failedRules.some(r => r.rule === 'WAL-R00-04'));
    });

    await t.test('WAL-R00-05: manufactured knowledge fails', () => {
        const result = validator.validateEnvelope({
            contractVersion: '1.0',
            manufacturedKnowledge: true
        });
        assert.strictEqual(result.passed, false);
        assert.ok(result.failedRules.some(r => r.rule === 'WAL-R00-05'));
    });

    await t.test('WAL-R00-06: unverified runtime closure fails', () => {
        const result = validator.validateEnvelope({
            contractVersion: '1.0',
            runtimeState: 'RuntimeClosed',
            verificationState: 'VERIFIED',
            factualVerification: false
        });
        assert.strictEqual(result.passed, false);
        assert.ok(result.failedRules.some(r => r.rule === 'WAL-R00-06'));
    });

    await t.test('WAL-R00-07: leaked runtime fields fail', () => {
        const result = validator.validateEnvelope({
            contractVersion: '1.0',
            semanticObject: { leaked: true }
        });
        assert.strictEqual(result.passed, false);
        assert.ok(result.failedRules.some(r => r.rule === 'WAL-R00-07'));
    });

    await t.test('WAL-R00-08: propagation allow without verification state fails', () => {
        const result = validator.validateEnvelope({
            contractVersion: '1.0',
            propagationState: 'ALLOW',
            verificationState: 'UNVERIFIED'
        });
        assert.strictEqual(result.passed, false);
        assert.ok(result.failedRules.some(r => r.rule === 'WAL-R00-08'));
    });
});
