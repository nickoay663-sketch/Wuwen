import test from 'node:test';
import assert from 'node:assert';
import WALIndependentValidator from '../src/WALIndependentValidator.js';

test('WALIndependentValidator R01 rules direct adversarial coverage', async (t) => {
    const validator = new WALIndependentValidator();

    const baseEnvelope = {
        contractVersion: '1.0',
        expression: 'expr-A',
        verificationState: 'UNKNOWN',
        responsibilityState: 'UNKNOWN',
        propagationState: 'ALLOWED'
    };

    await t.test('WAL-R01-01: original expression identity changed fails', () => {
        const result = validator.validateEnvelope(
            { ...baseEnvelope, expression: 'expr-B' },
            'expr-A'
        );
        assert.strictEqual(result.passed, false);
        assert.ok(result.failedRules.some(r => r.rule === 'WAL-R01-01'));
    });

    await t.test('WAL-R01-02: expression substituted during analysis fails', () => {
        const result = validator.validateEnvelope(
            { ...baseEnvelope, expression: 'expr-A' },
            'expr-A',
            { originalInput: { originalExpression: 'expr-B' } }
        );
        assert.strictEqual(result.passed, false);
        assert.ok(result.failedRules.some(r => r.rule === 'WAL-R01-02'));
    });

    await t.test('WAL-R01-03: responsibility chain losing original expression trace fails', () => {
        const result = validator.validateEnvelope(
            { ...baseEnvelope },
            'expr-A',
            undefined,
            { expression: 'expr-different' }
        );
        assert.strictEqual(result.passed, false);
        assert.ok(result.failedRules.some(r => r.rule === 'WAL-R01-03'));
    });

    await t.test('WAL-R01-04: definition with synthetic meaning fails', () => {
        const result = validator.validateEnvelope({
            ...baseEnvelope,
            definition: { syntheticMeaning: true }
        });
        assert.strictEqual(result.passed, false);
        assert.ok(result.failedRules.some(r => r.rule === 'WAL-R01-04'));
    });

    await t.test('WAL-R01-05: runtime owned external language system fails', () => {
        const result = validator.validateEnvelope({
            ...baseEnvelope,
            languageSystem: { runtimeOwned: true }
        });
        assert.strictEqual(result.passed, false);
        assert.ok(result.failedRules.some(r => r.rule === 'WAL-R01-05'));
    });

    await t.test('WAL-R01-06: runtime created or replaced language system fails', () => {
        const result = validator.validateEnvelope({
            ...baseEnvelope,
            languageSystem: { runtimeCreated: true }
        });
        assert.strictEqual(result.passed, false);
        assert.ok(result.failedRules.some(r => r.rule === 'WAL-R01-06'));
    });

    await t.test('WAL-R01-07: forcibly introduced undefined objects fail', () => {
        const result = validator.validateEnvelope({
            ...baseEnvelope,
            undefinedObjectsIntroduced: true
        });
        assert.strictEqual(result.passed, false);
        assert.ok(result.failedRules.some(r => r.rule === 'WAL-R01-07'));
    });

    await t.test('WAL-R01-08: language identification acting as factual verification fails', () => {
        const result = validator.validateEnvelope({
            ...baseEnvelope,
            languageIdentification: true,
            verificationState: 'VERIFIED',
            verificationBasis: 'LANGUAGE_IDENTIFICATION'
        });
        assert.strictEqual(result.passed, false);
        assert.ok(result.failedRules.some(r => r.rule === 'WAL-R01-08'));
    });

    await t.test('WAL-R01-09: semantic analysis used as evidence fails', () => {
        const result = validator.validateEnvelope({
            ...baseEnvelope,
            semanticAnalysisUsedAsEvidence: true
        });
        assert.strictEqual(result.passed, false);
        assert.ok(result.failedRules.some(r => r.rule === 'WAL-R01-09'));
    });

    await t.test('WAL-R01-10: expression restatement changing original claim fails', () => {
        const result = validator.validateEnvelope(
            {
                ...baseEnvelope,
                restatedExpression: 'expr-B',
                restatedExpressionPreservesClaim: false
            },
            'expr-A'
        );
        assert.strictEqual(result.passed, false);
        assert.ok(result.failedRules.some(r => r.rule === 'WAL-R01-10'));
    });
});
