import WALIndependentValidator from './packages/core/src/WALIndependentValidator.js';
import { createValidEnvelope } from './defaultEnvelope.js';

export class RuntimePipeline {
    constructor() {
        this.validator = new WALIndependentValidator();
    }

    /**
     * 处理输入数据，经过 WAL Protocol 54条规则的严格审查
     * @param {Object} inputOverride 原始输入数据或信封定制属性
     * @returns {Object} 包含处理结果、状态及审计信息的对象
     */
    process(inputOverride = {}) {
        const envelope = createValidEnvelope(inputOverride);
        const validationResult = this.validator.validateEnvelope(envelope);

        if (validationResult.status === 'CONFORM') {
            return {
                action: 'ALLOW',
                message: '合规：数据已通过完整责任链校验',
                envelope,
                validation: validationResult
            };
        } else {
            // 直接从 failedRules 中提取未通过的规则条目
            const violations = validationResult.failedRules || [];
            return {
                action: 'BLOCK',
                message: '拦截：检测到违规或不合规状态',
                envelope,
                validation: validationResult,
                violations
            };
        }
    }
}
