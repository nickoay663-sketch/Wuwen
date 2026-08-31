/**
 * @file Wuwen Accountability Layer (WAL) - Core Validator v1.1
 * @copyright Copyright (c) 2026 Wuwen Accountability Layer Contributors
 * @license MIT
 */

export class WuwenValidator {
    constructor(options = {}) {
        this.version = "10.8";
        this.strictMode = options.strictMode ?? true;
        this.auditTrail = [];
    }

    /**
     * 验证运行时上下文与规约约束
     * @param {Object} context - 待验证的运行时上下文
     * @returns {Object} 验证结果
     */
    verify(context) {
        const timestamp = Date.now();
        
        if (!context || typeof context !== 'object') {
            const errorResult = { valid: false, error: "Invalid context payload", timestamp };
            this._logAudit(errorResult);
            return errorResult;
        }

        // 基础规则检查：确保具备身份与权限声明
        if (this.strictMode && (!context.actor || !context.action)) {
            const errorResult = { valid: false, error: "Missing mandatory actor or action in strict mode", timestamp };
            this._logAudit(errorResult);
            return errorResult;
        }

        const successResult = { valid: true, version: this.version, timestamp };
        this._logAudit(successResult);
        return successResult;
    }

    _logAudit(record) {
        this.auditTrail.push(record);
        if (this.auditTrail.length > 100) {
            this.auditTrail.shift();
        }
    }
}
