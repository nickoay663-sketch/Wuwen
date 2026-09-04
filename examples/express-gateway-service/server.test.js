import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';

import { app } from './server.js';

function startTestServer() {
    return new Promise((resolve) => {
        const server = app.listen(0, () => {
            const address = server.address();

            resolve({
                server,
                baseUrl: `http://127.0.0.1:${address.port}/api/v1/expressions`
            });
        });
    });
}

test('Express WAL Gateway - Production Server HTTP Integration', async (t) => {
    const { server, baseUrl } = await startTestServer();

    try {
        await t.test(
            'POST valid honest UNKNOWN expression returns 200 and CONFORM header',
            async () => {
                const response = await fetch(baseUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        eventId: 'evt-http-001',
                        expression:
                            '探索性假说：未被完全解析的深空信号',
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
                        limitations: [
                            'Requires further calibration'
                        ],
                        responsibility: {
                            subject: 'Astrophysics',
                            scope: 'Deep Space',
                            basis: 'Anomalous radio signals',
                            limitations: [
                                'Requires further calibration'
                            ]
                        }
                    })
                });

                assert.equal(response.status, 200);
                assert.equal(
                    response.headers.get('x-wal-governance'),
                    'CONFORM'
                );
                assert.equal(
                    response.headers.get(
                        'x-wal-responsibility-state'
                    ),
                    'UNKNOWN'
                );

                const data = await response.json();

                assert.equal(data.success, true);
                assert.equal(
                    data.metadata.status,
                    'CONFORM_WITH_RESPONSIBILITY'
                );
                assert.equal(
                    data.metadata.responsibilityState,
                    'UNKNOWN'
                );
                assert.equal(
                    data.metadata.responsibilityBound,
                    true
                );
            }
        );

        await t.test(
            'POST fraudulent unsupported certainty returns 422 RESPONSIBILITY_BREACH',
            async () => {
                const response = await fetch(baseUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        eventId: 'evt-http-002',
                        expression:
                            '绝对确知的未经证实的断言',
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
                            basis: 'None'
                        }
                    })
                });

                assert.equal(response.status, 422);

                const data = await response.json();

                assert.equal(
                    data.status,
                    'RESPONSIBILITY_BREACH'
                );

                assert.equal(
                    data.verdict,
                    'NON_CONFORM'
                );

                assert.ok(
                    Array.isArray(data.failedRules)
                );

                assert.ok(
                    data.failedRules.length > 0
                );
            }
        );

        await t.test(
            'POST malformed payload returns 400 without entering protected route',
            async () => {
                const response = await fetch(baseUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(null)
                });

                assert.equal(response.status, 400);

                const data = await response.json();

                assert.equal(
                    data.status,
                    'REJECTED'
                );

                assert.equal(
                    data.reason,
                    'MALFORMED_ENVELOPE'
                );
            }
        );

        await t.test(
            'GET health endpoint returns healthy gateway status',
            async () => {
                const healthUrl =
                    baseUrl.replace(
                        '/api/v1/expressions',
                        '/health'
                    );

                const response = await fetch(healthUrl);

                assert.equal(response.status, 200);

                const data = await response.json();

                assert.equal(
                    data.status,
                    'HEALTHY'
                );
            }
        );
    } finally {
        await new Promise((resolve) => {
            server.close(resolve);
        });
    }
});
