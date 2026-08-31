class ResponsibilityRecord {
    constructor(eventData = {}) {
        if (!eventData || !eventData.engine) {
            throw new Error("ResponsibilityRecord Violation: Cannot instantiate without a valid certified event source.");
        }

        this.id = eventData.id || "rec_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
        this.payload = eventData.payload || null;
        this.content = eventData.content || null;

        this.epistemicState = eventData.epistemicState || "UNKNOWN";
        this.verificationStatus = eventData.verificationStatus || "UNVERIFIED";
        this.verifiedEvidenceCount = typeof eventData.verifiedEvidenceCount === "number" ? eventData.verifiedEvidenceCount : 0;
        this.sourceCount = eventData.sourceCount || 0;
        this.provenance = Array.isArray(eventData.provenance) ? [...eventData.provenance] : [];

        this.canPropagate = Boolean(eventData.canPropagate);
        this.canPublish = Boolean(eventData.canPublish);
        this.timestamp = eventData.timestamp || Date.now();
        this.traceSignature = eventData.trace || [];

        Object.freeze(this);
    }

    toJSON() {
        return {
            id: this.id,
            epistemicState: this.epistemicState,
            verificationStatus: this.verificationStatus,
            verifiedEvidenceCount: this.verifiedEvidenceCount,
            canPropagate: this.canPropagate,
            canPublish: this.canPublish,
            timestamp: this.timestamp
        };
    }

    static fromEvent(eventResult) {
        if (!eventResult || eventResult.status === "VIOLATION") {
            throw new Error("ResponsibilityRecord Factory Error: Cannot build record from a violated or null event.");
        }
        return new ResponsibilityRecord(eventResult);
    }
}

module.exports = ResponsibilityRecord;
