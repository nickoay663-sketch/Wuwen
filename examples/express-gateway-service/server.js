import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

import WALIndependentValidator from '../../packages/core/src/WALIndependentValidator.js';
import GatewayAuditLedger from '../../packages/core/src/GatewayAuditLedger.js';
import GatewayAuditEvent from '../../packages/core/src/GatewayAuditEvent.js';

const app = express();

const defaultLedgerPath = path.resolve(
    process.cwd(),
    'data',
    'gateway-audit.jsonl'
);

function createDefaultLedger(customPath = defaultLedgerPath) {
    const dir = path.dirname(customPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    return new GatewayAuditLedger(customPath);
}

app.use(express.json());

function createWALResponsibilityMiddleware(ledger = createDefaultLedger()) {
    const validator = new WALIndependentValidator();

    return async function walMiddleware(req, res, next) {
        const payload = req.body;
        const requestId = payload?.eventId || `req-${crypto.randomUUID()}`;

        if (
            !payload ||
            typeof payload !== 'object' ||
            Array.isArray(payload)
        ) {
            try {
                const auditEvent = GatewayAuditEvent.create({
                    id: `audit-${crypto.randomUUID()}`,
                    eventType: 'REJECTED_MALFORMED',
                    decision: 'BLOCK',
                    responsibilityState: 'UNKNOWN',
                    verificationState: 'UNVERIFIED',
                    propagationState: 'BLOCK',
                    failedRules: ['MALFORMED_ENVELOPE'],
                    requestId,
                    timestamp: new Date().toISOString()
                });
                ledger.append(auditEvent);

                const integrity = ledger.verifyIntegrity();
                if (!integrity.valid) {
                    throw new Error(`Audit ledger integrity breach: ${integrity.error}`);
                }
            } catch (err) {
                console.error('[Gateway Fatal] Malformed request audit persistence or integrity failure:', err);
                return res.status(503).json({
                    status: 'INTERNAL_ERROR',
                    reason: 'AUDIT_INTEGRITY_OR_PERSISTENCE_FAILURE',
                    message: 'Audit persistence or integrity failure, gateway enforced fail-closed.'
                });
            }

            return res.status(400).json({
                status: 'REJECTED',
                reason: 'MALFORMED_ENVELOPE',
                message: 'Expressions must possess a clear structured payload to carry their responsibility boundaries.'
            });
        }

        const validationResult = validator.validateEnvelope(payload);
        const decision = validationResult.passed ? 'ALLOW' : 'BLOCK';
        const eventType = validationResult.passed ? 'RESPONSIBILITY_CONFORM' : 'RESPONSIBILITY_BREACH';

        try {
            const auditEvent = GatewayAuditEvent.create({
                id: `audit-${crypto.randomUUID()}`,
                eventType,
                decision,
                responsibilityState: payload.responsibilityState || 'UNKNOWN',
                verificationState: payload.verificationState || 'UNVERIFIED',
                propagationState: payload.propagationState || 'REQUIRE_VERIFICATION',
                failedRules: validationResult.failedRules || [],
                requestId,
                timestamp: new Date().toISOString()
            });
            ledger.append(auditEvent);

            const integrity = ledger.verifyIntegrity();
            if (!integrity.valid) {
                throw new Error(`Audit ledger integrity breach: ${integrity.error}`);
            }
        } catch (err) {
            console.error('[Gateway Fatal] Audit persistence or integrity failure, triggering fail-closed:', err);
            return res.status(503).json({
                status: 'INTERNAL_ERROR',
                reason: 'AUDIT_INTEGRITY_OR_PERSISTENCE_FAILURE',
                message: 'Audit ledger persistence or integrity verification failed, gateway enforced fail-closed.'
            });
        }

        if (!validationResult.passed) {
            return res.status(422).json({
                status: 'RESPONSIBILITY_BREACH',
                verdict: 'NON_CONFORM',
                failedRules: validationResult.failedRules,
                message: 'Expression breached its responsibility boundary: unknowns cannot be disguised as certainties, and evidence must not be fabricated.'
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

        next();
    };
}

app.post(
    '/api/v1/expressions',
    createWALResponsibilityMiddleware(),
    (req, res) => {
        return res.status(200).json({
            success: true,
            message: 'Expression successfully audited and securely admitted by WAL responsibility gateway.',
            metadata: req.walMetadata,
            receivedPayload: req.body
        });
    }
);

app.get('/health', (req, res) => {
    try {
        const ledger = createDefaultLedger();
        const integrity = ledger.verifyIntegrity();

        if (!integrity.valid) {
            return res.status(503).json({
                status: 'UNHEALTHY',
                reason: 'AUDIT_INTEGRITY_BREACH',
                details: integrity.error,
                runtime: 'Wuwen WAL Gateway v10.9.0'
            });
        }

        return res.status(200).json({
            status: 'HEALTHY',
            auditRecords: integrity.totalRecords,
            runtime: 'Wuwen WAL Gateway v10.9.0'
        });
    } catch (err) {
        return res.status(503).json({
            status: 'UNHEALTHY',
            reason: err.message,
            runtime: 'Wuwen WAL Gateway v10.9.0'
        });
    }
});

app.use((error, req, res, next) => {
    if (
        error &&
        error instanceof SyntaxError &&
        error.type === 'entity.parse.failed'
    ) {
        return res.status(400).json({
            status: 'REJECTED',
            reason: 'MALFORMED_ENVELOPE',
            message: 'Request payload is not a valid JSON structure.'
        });
    }

    next(error);
});

function startServer(port = process.env.PORT || 3000, ledgerPath = defaultLedgerPath) {
    const ledger = createDefaultLedger(ledgerPath);
    
    const integrity = ledger.verifyIntegrity();
    if (!integrity.valid) {
        console.error(`[Gateway Fatal] Startup self-check failed: Audit ledger integrity check failed (${integrity.error}). Gateway enforced fail-closed shutdown.`);
        process.exit(1);
    }

    return app.listen(port, () => {
        console.log(
            `🚀 Wuwen WAL Responsibility Gateway running on port ${port} [Audit Chain Status: Healthy, Records: ${integrity.totalRecords}]`
        );
    });
}

const executedDirectly =
    process.argv[1] &&
    fileURLToPath(import.meta.url) ===
        fileURLToPath(new URL(`file://${process.argv[1]}`));

if (executedDirectly) {
    startServer();
}

export {
    app,
    createWALResponsibilityMiddleware,
    startServer,
    createDefaultLedger
};
