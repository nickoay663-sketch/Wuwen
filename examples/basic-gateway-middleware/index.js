import WALIndependentValidator from '../../packages/core/src/WALIndependentValidator.js';

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

async function runSimulation() {
    console.log('=== 勿问 (WAL) 责任网关中间件演练启动 ===\n');
    const middleware = createWALResponsibilityMiddleware();

    const honestExplorationReq = {
        body: {
            eventId: 'evt-exp-001',
            expression: '宇宙中可能存在我们尚未理解的暗物质形态，但这目前仅仅是一个推测。',
            identity: 'user-explorer-01',
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
            // 补齐由 WAL-R03-09 要求的嵌套责任对象
            responsibility: {
                subject: 'Cosmology',
                scope: 'Theoretical Exploration',
                basis: 'Observational gaps',
                limitations: ['Unverified hypothesis']
            }
        }
    };

    console.log('[测试 1] 提交一项结构完备、责任边界完整暴露的 UNKNOWN 探索性假说：');
    await middleware(honestExplorationReq, {
        setHeader: (k, v) => console.log('  > Response Header [' + k + ']: ' + v),
        status: (code) => ({ json: (data) => console.log('  > 响应状态 [' + code + ']:', JSON.stringify(data, null, 2)) })
    }, () => {
        console.log('  > 结果：🎉 全 54 条核心规则 100% 通过！零阻碍放行。表达自由受到绝对尊重，责任结构完美。\n');
    });

    const fraudulentClaimReq = {
        body: {
            eventId: 'evt-fraud-002',
            expression: '我们已经完全掌握了宇宙终极秘密，不需要任何证据来证明。',
            identity: 'user-dogmatist-02',
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

    console.log('[测试 2] 提交一项宣称 TRUE 但缺乏底层支撑证据的越权断言：');
    await middleware(fraudulentClaimReq, {
        setHeader: (k, v) => console.log('  > Response Header [' + k + ']: ' + v),
        status: (code) => ({ json: (data) => console.log('  > 响应状态 [' + code + ']:', JSON.stringify(data, null, 2)) })
    }, () => {
        console.log('  > 结果：不应该执行到这里。');
    });
}

runSimulation();
