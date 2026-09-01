import express from 'express';
import WALIndependentValidator from '../../packages/core/src/WALIndependentValidator.js';

const app = express();
app.use(express.json());

// 勿问 (WAL) 责任网关中间件工厂
function createWALResponsibilityMiddleware() {
    const validator = new WALIndependentValidator();

    return async function walMiddleware(req, res, next) {
        const payload = req.body;

        if (!payload || typeof payload !== 'object') {
            return res.status(400).json({
                status: 'REJECTED',
                reason: 'MALFORMED_ENVELOPE',
                message: '表达必须具备清晰的结构化载荷以承载其责任边界。'
            });
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

        next();
    };
}

// 挂载 WAL 中间件到受保护的表达式提交路由
app.post('/api/v1/expressions', createWALResponsibilityMiddleware(), (req, res) => {
    res.status(200).json({
        success: true,
        message: '表达式已成功通过 WAL 责任网关审核并安全接入。',
        metadata: req.walMetadata,
        receivedPayload: req.body
    });
});

// 健康检查路由
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'HEALTHY', runtime: 'MoWen WAL Gateway v10.8.3' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(🚀 勿问 (WAL) 责任网关服务已在端口  启动运行);
});
