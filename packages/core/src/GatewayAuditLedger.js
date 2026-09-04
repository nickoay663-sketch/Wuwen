/**
 * @file GatewayAuditLedger.js
 * @description
 * Append-only cryptographic ledger for Gateway governance audit events.
 *
 * Architectural boundary:
 * Gateway audit records are governance records.
 * They are NOT WAL Evidence and MUST remain separate from
 * ResponsibilityLedger / ResponsibilityRecord evidence semantics.
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import GatewayAuditEvent from "./GatewayAuditEvent.js";

const GENESIS_HASH = "genesis_Wuwen_gateway_audit";

class GatewayAuditLedger {
    constructor(ledgerPath = "./Wuwen-gateway-audit.jsonl") {
        this.ledgerPath = path.resolve(ledgerPath);
    }

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

        const lastRecord = JSON.parse(lines[lines.length - 1]);

        return {
            signature: lastRecord.signature
        };
    }

    #canonicalPayload(record) {
        return JSON.stringify({
            id: record.id,
            eventType: record.eventType,
            source: record.source,
            decision: record.decision,
            responsibilityState: record.responsibilityState,
            verificationStatus: record.verificationStatus,
            failedRules: record.failedRules,
            requestId: record.requestId,
            timestamp: record.timestamp,
            previousHash: record.previousHash
        });
    }

    #calculateSignature(record) {
        return crypto
            .createHash("sha256")
            .update(this.#canonicalPayload(record), "utf8")
            .digest("hex");
    }

    append(event) {
        if (!(event instanceof GatewayAuditEvent)) {
            throw new TypeError(
                "GatewayAuditLedger.append requires a GatewayAuditEvent."
            );
        }

        const lastRecord = this.getLastRecord();

        const record = {
            id: event.id,
            eventType: event.eventType,
            source: event.source,
            decision: event.decision,
            responsibilityState: event.responsibilityState,
            verificationStatus: event.verificationStatus,
            failedRules: [...event.failedRules],
            requestId: event.requestId,
            timestamp: event.timestamp,
            previousHash: lastRecord
                ? lastRecord.signature
                : GENESIS_HASH
        };

        record.signature = this.#calculateSignature(record);

        fs.mkdirSync(path.dirname(this.ledgerPath), {
            recursive: true
        });

        fs.appendFileSync(
            this.ledgerPath,
            JSON.stringify(record) + "\n",
            "utf8"
        );

        return Object.freeze({
            ...record,
            failedRules: Object.freeze([...record.failedRules])
        });
    }

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

        let expectedPreviousHash = GENESIS_HASH;

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

            if (record.previousHash !== expectedPreviousHash) {
                return {
                    valid: false,
                    totalRecords: lines.length,
                    error:
                        `Chain broken at index ${i} ` +
                        `(Audit ID: ${record.id}): previousHash mismatch.`
                };
            }

            let calculatedSignature;

            try {
                calculatedSignature = this.#calculateSignature(record);
            } catch (error) {
                return {
                    valid: false,
                    totalRecords: lines.length,
                    error:
                        `Invalid audit record structure at index ${i}.`
                };
            }

            if (record.signature !== calculatedSignature) {
                return {
                    valid: false,
                    totalRecords: lines.length,
                    error:
                        `Signature mismatch at index ${i} ` +
                        `(Audit ID: ${record.id}).`
                };
            }

            expectedPreviousHash = record.signature;
        }

        return {
            valid: true,
            totalRecords: lines.length
        };
    }
}

export default GatewayAuditLedger;
