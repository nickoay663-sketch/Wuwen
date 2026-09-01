import test from 'node:test';
import assert from 'node:assert';
import WALIndependentValidator from '../src/WALIndependentValidator.js';

function createWALResponsibilityMiddleware() {
    const validator = new WALIndependentValidator();

    return async function walMiddleware(req, res, next) {
        const payload = req.body;

        if (!payload || typeof payload !== 'object') {
            res.status(400).json({
                status: 'REJECTED',
                reason: 'MALFORMED_ENVELOPE',
                message: '表达必须具备清晰的结构化载荷以承载其责任边界。'
            });
            return;
        }

        const validationResult = validator.validateEnvelope(payload);

        if (!validationResult.passed) {
            return res.status(422).json({
                status: 'RESPONSIBILITY_BREACH',
                verdict: 'NON_CONFORM',
                failedRules: validationResult.failedRules,
                message: '表达越过了其对应的责任边界：未知不能伪装为确知，证据不得凭空捏造。'
            });
        }

        req.walMetadata = {
            responsibilityState: payload.responsibilityState || 'UNKNOWN',
            responsibilityBound: true,
            validatedAt: new Date().toISOString(),
            status: 'CONFORM_WITH_RESPONSIBILITY'
        };

        res.setHeader('X-WAL-Responsibility-State', req.walMetadata.responsibilityState);
        res.setHeader('X-WAL-Governance', 'CONFORM');

        if (typeof next === 'function') {
            next();
        } else {
            return {
                action: 'PASSED',
                metadata: req.walMetadata,
                payload
            };
        }
    };
}

test('WAL Responsibility Middleware - Honest UNKNOWN Exploration passes successfully', async () => {
    const middleware = createWALResponsibilityMiddleware();
    let headerKey, headerVal, statusCode, jsonResponse, nextCalled = false;

    const req = {
        body: {
            eventId: 'evt-test-001',
            expression: '探索性假说：未知暗物质形态',
            identity: 'researcher-01',
            timestamp: Date.now(),
            verificationState: 'UNVERIFIED',
            responsibilityState: 'UNKNOWN',
            propagationState: 'ALLOW_WITH_BOUNDARY',
            runtimeVersion: '10.8.3',
            contractVersion: '1.0',
            subject: 'Cosmology',
            scope: 'Hypothesis',
            basis: 'Observation',
            limitations: ['None'],
            responsibility: {
                subject: 'Cosmology',
                scope: 'Theoretical Exploration',
                basis: 'Observational gaps',
                limitations: ['Unverified hypothesis']
            }
        }
    };

    const res = {
        setHeader: (k, v) => { headerKey = k; headerVal = v; },
        status: (code) => {
            statusCode = code;
            return { json: (data) => { jsonResponse = data; } };
        }
    };

    await middleware(req, res, () => { nextCalled = true; });

    assert.strictEqual(nextCalled, true, 'Middleware should call next() on valid conformance');
    assert.strictEqual(headerVal, 'CONFORM');
    assert.strictEqual(req.walMetadata.status, 'CONFORM_WITH_RESPONSIBILITY');
});

test('WAL Responsibility Middleware - Fraudulent Claim triggers 422 breach', async () => {
    const middleware = createWALResponsibilityMiddleware();
    let statusCode, jsonResponse;

    const req = {
        body: {
            eventId: 'evt-test-002',
            expression: '无根据的绝对确知宣称',
            identity: 'dogmatist-02',
            timestamp: Date.now(),
            verificationState: 'VERIFIED',
            responsibilityState: 'TRUE',
            propagationState: 'GLOBAL',
            runtimeVersion: '10.8.3',
            contractVersion: '1.0',
            subject: 'Absolute Truth',
            scope: 'Universe',
            basis: 'Dogma',
            limitations: [],
            responsibility: {
                subject: 'Absolute Truth',
                scope: 'Universe',
                basis: 'None',
                limitations: []
            }
        }
    };

    const res = {
        setHeader: () => {},
        status: (code) => {
            statusCode = code;
            return { json: (data) => { jsonResponse = data; } };
        }
    };

    await middleware(req, res, () => {
        assert.fail('Should not call next() on responsibility breach');
    });

    assert.strictEqual(statusCode, 422);
    assert.strictEqual(jsonResponse.status, 'RESPONSIBILITY_BREACH');
    assert.strictEqual(jsonResponse.verdict, 'NON_CONFORM');
    assert.ok(jsonResponse.failedRules.length > 0, 'Should list failed rule items');
});
