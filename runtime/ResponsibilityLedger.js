/**
 * @file ResponsibilityLedger.js
 * @description MWAL Append-Only Responsibility Ledger for Cryptographic Chained Records
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import ResponsibilityRecord from "./ResponsibilityRecord.js";

class ResponsibilityLedger {
    constructor(ledgerPath = "./mowen-ledger.jsonl") {
        this.ledgerPath = path.resolve(ledgerPath);
    }

    /**
     * 获取账本中最后一条记录（用于链式溯源的锚点）
     */
    getLastRecord() {
        if (!fs.existsSync(this.ledgerPath)) {
            return null;
        }

        const lines = fs.readFileSync(this.ledgerPath, "utf8")
            .split("\n")
            .filter(line => line.trim() !== "");

        if (lines.length === 0) {
            return null;
        }

        const lastData = JSON.parse(lines[lines.length - 1]);

        return {
            signature: lastData.signature
        };
    }

    /**
     * 向账本安全追加一张责任通行证
     */
    append(recordData, evidence = []) {
        const lastRecord = this.getLastRecord();

        const newRecord = ResponsibilityRecord.mint({
            ...recordData,
            evidence
        }, lastRecord);

        fs.appendFileSync(
            this.ledgerPath,
            JSON.stringify(newRecord) + "\n",
            "utf8"
        );

        return newRecord;
    }

    /**
     * 根据 ResponsibilityRecord 的签名算法重新计算记录指纹。
     *
     * 注意：
     * ResponsibilityRecord.#generateSignature() 是私有方法，
     * 因此 Ledger 在这里必须严格复现同一签名载荷。
     */
    calculateSignature(record) {
        const payload =
            `${record.id}:${record.epistemicState}:${record.verificationStatus}:${record.verifiedEvidenceCount}:${record.evidenceHash}:${record.previousHash}:${record.timestamp}`;

        return crypto
            .createHash("sha256")
            .update(payload)
            .digest("hex");
    }

    /**
     * 根据记录中的 evidence 重新计算证据哈希。
     */
    calculateEvidenceHash(record) {
        const rawEvidenceString =
            JSON.stringify(record.evidence || []);

        return crypto
            .createHash("sha256")
            .update(rawEvidenceString)
            .digest("hex");
    }

    /**
     * 验证整本账本的密码学完整性。
     *
     * 同时验证：
     * 1. previousHash 链
     * 2. evidenceHash
     * 3. signature
     */
    verifyIntegrity() {
        if (!fs.existsSync(this.ledgerPath)) {
            return {
                valid: true,
                totalRecords: 0
            };
        }

        const lines = fs.readFileSync(this.ledgerPath, "utf8")
            .split("\n")
            .filter(line => line.trim() !== "");

        let expectedPrevHash = "genesis_mowen_root";

        for (let i = 0; i < lines.length; i++) {
            let record;

            try {
                record = JSON.parse(lines[i]);
            } catch (error) {
                return {
                    valid: false,
                    totalRecords: lines.length,
                    error: `Invalid JSON at index ${i}.`
                };
            }

            // 1. 验证前向链式咬合
            if (record.previousHash !== expectedPrevHash) {
                return {
                    valid: false,
                    totalRecords: lines.length,
                    error:
                        `Chain broken at index ${i} ` +
                        `(Record ID: ${record.id}): previousHash mismatch.`
                };
            }

            // 2. 验证 evidenceHash
            const calculatedEvidenceHash =
                this.calculateEvidenceHash(record);

            if (record.evidenceHash !== calculatedEvidenceHash) {
                return {
                    valid: false,
                    totalRecords: lines.length,
                    error:
                        `Evidence hash mismatch at index ${i} ` +
                        `(Record ID: ${record.id}).`
                };
            }

            // 3. 重新计算 signature
            const calculatedSignature =
                this.calculateSignature(record);

            if (record.signature !== calculatedSignature) {
                return {
                    valid: false,
                    totalRecords: lines.length,
                    error:
                        `Signature mismatch at index ${i} ` +
                        `(Record ID: ${record.id}).`
                };
            }

            expectedPrevHash = record.signature;
        }

        return {
            valid: true,
            totalRecords: lines.length
        };
    }
}

export default ResponsibilityLedger;
