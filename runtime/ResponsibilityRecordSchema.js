/**
 * @file ResponsibilityRecordSchema.js
 * @description WAL Responsibility Record v1 Schema Definition (ESM)
 */

import WALContract from "./WALContract.js";

const ResponsibilityRecordSchema = {
    validate(recordData) {
        if (!recordData || typeof recordData !== "object") {
            return { valid: false, error: "Record data must be a non-null object." };
        }

        if (typeof recordData.id !== "string" || !recordData.id.startsWith("rec_")) {
            return { valid: false, error: "Invalid or missing record ID prefix." };
        }

        const validResponsibilityStates = Object.values(WALContract.RESPONSIBILITY_STATES);
        if (!validResponsibilityStates.includes(recordData.epistemicState)) {
            return { valid: false, error: "Invalid epistemicState: " + recordData.epistemicState };
        }

        const validVerificationStates = Object.values(WALContract.VERIFICATION_STATES);
        if (!validVerificationStates.includes(recordData.verificationStatus)) {
            return { valid: false, error: "Invalid verificationStatus: " + recordData.verificationStatus };
        }

        if (recordData.canPublish === true && recordData.verifiedEvidenceCount <= 0) {
            return { valid: false, error: "Contract Violation: Cannot publish without verified evidence." };
        }

        return { valid: true };
    }
};

export default ResponsibilityRecordSchema;
