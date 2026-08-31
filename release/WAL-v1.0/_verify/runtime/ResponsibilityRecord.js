/**
 * @file ResponsibilityRecord.js
 * @description WAL Immutable Responsibility Record Factory v3
 *              (Evidence-Bound Cryptographic & Chained)
 */

import crypto from "crypto";
import Schema from "./ResponsibilityRecordSchema.js";

class ResponsibilityRecord {
    constructor(recordData, previousHash = null) {
        // 1. 寮哄埗鎵ц Schema 濂戠害鏍￠獙
        const validationResult = Schema.validate(recordData);

        if (!validationResult.valid) {
            throw new Error(
                `[CRITICAL CONTRACT VIOLATION] Cannot mint ResponsibilityRecord: ${validationResult.error}`
            );
        }

        // 2. 鍩虹璐ｄ换灞炴€?
        this.id = recordData.id;
        this.epistemicState = recordData.epistemicState;
        this.verificationStatus = recordData.verificationStatus;
        this.verifiedEvidenceCount = recordData.verifiedEvidenceCount;
        this.canPublish = recordData.canPublish;

        // 3. 璇佹嵁蹇呴』鎴愪负璁板綍鏈綋鐨勪竴閮ㄥ垎
        this.evidence = Array.isArray(recordData.evidence)
            ? structuredClone(recordData.evidence)
            : [];

        this.timestamp = Date.now();

        // 4. 瀵嗙爜瀛﹁瘉鎹牴
        const rawEvidenceString = JSON.stringify(this.evidence);

        this.evidenceHash = crypto
            .createHash("sha256")
            .update(rawEvidenceString)
            .digest("hex");

        // 5. 鍓嶅悜璐ｄ换閾?
        this.previousHash =
            previousHash || "genesis_Wuwen_root";

        // 6. 褰撳墠璁板綍瀵嗙爜瀛︽寚绾?
        this.signature = this.#generateSignature();

        // 7. 鐗╃悊灏佸嵃
        Object.freeze(this);
    }

    /**
     * 鐢熸垚褰撳墠璐ｄ换璁板綍鐨勯槻绡℃敼鎸囩汗
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
     * 閾搁€犺矗浠昏褰?
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
