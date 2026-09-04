import express from 'express';
import { fileURLToPath } from 'node:url';

import WALIndependentValidator from '../../packages/core/src/WALIndependentValidator.js';

const app = express();

/**
 * JSON body parser.
 *
 * Parsing errors are handled by the dedicated error middleware below.
 */
app.use(express.json());

/**
 * WAL Responsibility Gateway Middleware
 *
 * Boundary:
 * - malformed structured payload -> REJECTED / 400
 * - WAL validation failure -> RESPONSIBILITY_BREACH / 422
 * - valid WAL envelope -> CONFORM / next()
 *
 * This middleware does not create evidence or infer truth.
 * It only enforces the independent WAL validation result.
 */
function createWALResponsibilityMiddleware() {
    const validator = new WALIndependentValidator();

    return async function walMiddleware(req, res, next) {
        const payload = req.body;

        if (
            !payload ||
            typeof payload !== 'object' ||
            Array.isArray(payload)
        ) {
            return res.status(400).json({
                status: 'REJECTED',
                reason: 'MALFORMED_ENVELOPE',
                message:
                    '表达必须具备清晰的结构化载荷以承载其责任边界。'
            });
        }

        const validationResult =
            validator.validateEnvelope(payload);

        if (!validationResult.passed) {
            return res.status(422).json({
                status: 'RESPONSIBILITY_BREACH',
                verdict: 'NON_CONFORM',
                failedRules: validationResult.failedRules,
                message:
                    '表达越过了其对应的责任边界：未知不能伪装为确知，证据不得凭空捏造。'
            });
        }

        req.walMetadata = {
            responsibilityState:
                payload.responsibilityState || 'UNKNOWN',
            responsibilityBound: true,
            validatedAt: new Date().toISOString(),
            status: 'CONFORM_WITH_RESPONSIBILITY'
        };

        res.setHeader(
            'X-WAL-Responsibility-State',
            req.walMetadata.responsibilityState
        );

        res.setHeader(
            'X-WAL-Governance',
            'CONFORM'
        );

        next();
    };
}

/**
 * Protected expression submission endpoint.
 */
app.post(
    '/api/v1/expressions',
    createWALResponsibilityMiddleware(),
    (req, res) => {
        return res.status(200).json({
            success: true,
            message:
                '表达式已成功通过 WAL 责任网关审核并安全接入。',
            metadata: req.walMetadata,
            receivedPayload: req.body
        });
    }
);

/**
 * Health check.
 */
app.get('/health', (req, res) => {
    return res.status(200).json({
        status: 'HEALTHY',
        runtime: 'Wuwen WAL Gateway v10.8.3'
    });
});

/**
 * JSON parsing error boundary.
 *
 * express.json() executes before the WAL middleware.
 * Therefore malformed JSON must be rejected here instead of
 * being mistaken for a WAL responsibility decision.
 */
app.use((error, req, res, next) => {
    if (
        error &&
        error instanceof SyntaxError &&
        error.type === 'entity.parse.failed'
    ) {
        return res.status(400).json({
            status: 'REJECTED',
            reason: 'MALFORMED_ENVELOPE',
            message:
                '请求载荷不是合法的 JSON 结构。'
        });
    }

    next(error);
});

/**
 * Start the HTTP server only when this module is executed
 * directly. Importing server.js for integration tests must
 * not create a second listener.
 */
function startServer(port = process.env.PORT || 3000) {
    return app.listen(port, () => {
        console.log(
            `🚀 勿问 (WAL) 责任网关服务已在端口 ${port} 启动运行`
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
    startServer
};
