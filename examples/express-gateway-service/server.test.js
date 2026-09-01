import test from 'node:test';
import assert from 'node:assert';
import express from 'express';
import WALIndependentValidator from '../../packages/core/src/WALIndependentValidator.js';

function startTestServer(port) {
    const app = express();
    app.use(express.json());

    const validator = new WALIndependentValidator();
    const walMiddleware = async (req, res, next) => {
        const payload = req.body;
        if (!payload || typeof payload !== 'object') {
            return res.status(400).json({ status: 'REJECTED', reason: 'MALFORMED_ENVELOPE' });
        }
        const validationResult = validator.validateEnvelope(payload);
        if (!validationResult.passed) {
            return res.status(422).json({
                status: 'RESPONSIBILITY_BREACH',
                verdict: 'NON_CONFORM',
                failedRules: validationResult.failedRules
            });
        }
        req.walMetadata = { responsibilityState: payload.responsibilityState || 'UNKNOWN' };
        res.setHeader('X-WAL-Governance', 'CONFORM');
        next();
    };

    app.post('/api/v1/expressions', walMiddleware, (req, res) => {
        res.status(200).json({ success: true, metadata: req.walMetadata });
    });

    return new Promise((resolve) => {
        const server = app.listen(port, () => resolve(server));
    });
}

test('Express WAL Gateway - Full HTTP Integration Test', async (t) => {
    const PORT = 3001;
    const server = await startTestServer(PORT);
    const baseUrl = `http://localhost:${PORT}/api/v1/expressions`;

    await t.test('POST valid honest UNKNOWN expression returns 200 and CONFORM header', async () => {
        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                eventId: 'evt-http-001',
                expression: '探索性假说：未被完全解析的深空信号',
                identity: 'astronomer-01',
                timestamp: Date.now(),
                verificationState: 'UNVERIFIED',
                responsibilityState: 'UNKNOWN',
                propagationState: 'ALLOW_WITH_BOUNDARY',
                runtimeVersion: '10.8.3',
                contractVersion: '1.0',
                subject: 'Astrophysics',
                scope: 'Deep Space',
                basis: 'Anomalous radio signals',
                limitations: ['Requires further calibration'],
                responsibility: {
                    subject: 'Astrophysics',
                    scope: 'Deep Space',
                    basis: 'Anomalous radio signals',
                    limitations: ['Requires further calibration']
                }
            })
        });

        assert.strictEqual(response.status, 200);
        assert.strictEqual(response.headers.get('x-wal-governance'), 'CONFORM');
        const data = await response.json();
        assert.strictEqual(data.success, true);
    });

    await t.test('POST fraudulent unsupported certainty returns 422 RESPONSIBILITY_BREACH', async () => {
        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                eventId: 'evt-http-002',
                expression: '绝对确知的未经证实的断言',
                identity: 'dogmatist-01',
                timestamp: Date.now(),
                verificationState: 'VERIFIED',
                responsibilityState: 'TRUE',
                propagationState: 'GLOBAL',
                runtimeVersion: '10.8.3',
                contractVersion: '1.0',
                subject: 'Dogma',
                scope: 'Absolute',
                basis: 'None',
                limitations: [],
                responsibility: {
                    subject: 'Dogma',
                    scope: 'Absolute',
                    basis: 'None',
                    limitations: []
                }
            })
        });

        assert.strictEqual(response.status, 422);
        const data = await response.json();
        assert.strictEqual(data.status, 'RESPONSIBILITY_BREACH');
        assert.strictEqual(data.verdict, 'NON_CONFORM');
        assert.ok(data.failedRules.length > 0);
    });

    await new Promise((resolve) => server.close(resolve));
});
