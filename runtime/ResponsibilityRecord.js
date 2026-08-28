/**
 * @file ResponsibilityRecord.js
 * @description MWAL Immutable Responsibility Record Factory v3
 *              (Evidence-Bound Cryptographic & Chained)
 */

import crypto from "crypto";
import Schema from "./ResponsibilityRecordSchema.js";

class ResponsibilityRecord {
    constructor(recordData, previousHash = null) {
        // 1. 强制执行 Schema 契约校验
        const validationResult = Schema.validate(recordData);

        if (!validationResult.valid) {
            throw new Error(
                `[CRITICAL CONTRACT VIOLATION] Cannot mint ResponsibilityRecord: ${validationResult.error}`
            );
        }

        // 2. 基础责任属性
        this.id = recordData.id;
        this.epistemicState = recordData.epistemicState;
        this.verificationStatus = recordData.verificationStatus;
        this.verifiedEvidenceCount = recordData.verifiedEvidenceCount;
        this.canPublish = recordData.canPublish;

        // 3. 证据必须成为记录本体的一部分
        this.evidence = Array.isArray(recordData.evidence)
            ? structuredClone(recordData.evidence)
            : [];

        this.timestamp = Date.now();

        // 4. 密码学证据根
        const rawEvidenceString = JSON.stringify(this.evidence);

        this.evidenceHash = crypto
            .createHash("sha256")
            .update(rawEvidenceString)
            .digest("hex");

        // 5. 前向责任链
        this.previousHash =
            previousHash || "genesis_mowen_root";

        // 6. 当前记录密码学指纹
        this.signature = this.#generateSignature();

        // 7. 物理封印
        Object.freeze(this);
    }

    /**
     * 生成当前责任记录的防篡改指纹
     */
    #generateSignature() {
        const payload =
            `${this.id}:${this.epistemicState}:${this.verificationStatus}:` +
            `${this.verifiedEvidenceCount}:${this.evidenceHash}:` +
            `${this.previousHash}:${this.timestamp}`;

        return crypto
            .createHash("sha256")
            .update(payload)
            .digest("hex");
    }

    /**
     * 铸造责任记录
     */
    static mint(recordData, previousRecord = null) {
        const prevHash =
            previousRecord
                ? previousRecord.signature
                : null;

        return new ResponsibilityRecord(
            recordData,
            prevHash
        );
    }
}

export default ResponsibilityRecord;
