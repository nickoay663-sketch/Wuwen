/**
 * @file ResponsibilityLedger.js
 * @description WAL Append-Only Responsibility Ledger for Cryptographic Chained Records
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import ResponsibilityRecord from "./ResponsibilityRecord.js";

class ResponsibilityLedger {
    constructor(ledgerPath = "./Wuwen-ledger.jsonl") {
        this.ledgerPath = path.resolve(ledgerPath);
    }

    /**
     * 鑾峰彇璐︽湰涓渶鍚庝竴鏉¤褰曪紙鐢ㄤ簬閾惧紡婧簮鐨勯敋鐐癸級
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
     * 鍚戣处鏈畨鍏ㄨ拷鍔犱竴寮犺矗浠婚€氳璇?
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
     * 鏍规嵁 ResponsibilityRecord 鐨勭鍚嶇畻娉曢噸鏂拌绠楄褰曟寚绾广€?
     *
     * 娉ㄦ剰锛?
     * ResponsibilityRecord.#generateSignature() 鏄鏈夋柟娉曪紝
     * 鍥犳 Ledger 鍦ㄨ繖閲屽繀椤讳弗鏍煎鐜板悓涓€绛惧悕杞借嵎銆?
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
     * 鏍规嵁璁板綍涓殑 evidence 閲嶆柊璁＄畻璇佹嵁鍝堝笇銆?
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
     * 楠岃瘉鏁存湰璐︽湰鐨勫瘑鐮佸瀹屾暣鎬с€?
     *
     * 鍚屾椂楠岃瘉锛?
     * 1. previousHash 閾?
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

        let expectedPrevHash = "genesis_Wuwen_root";

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

            // 1. 楠岃瘉鍓嶅悜閾惧紡鍜悎
            if (record.previousHash !== expectedPrevHash) {
                return {
                    valid: false,
                    totalRecords: lines.length,
                    error:
                        `Chain broken at index ${i} ` +
                        `(Record ID: ${record.id}): previousHash mismatch.`
                };
            }

            // 2. 楠岃瘉 evidenceHash
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

            // 3. 閲嶆柊璁＄畻 signature
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
