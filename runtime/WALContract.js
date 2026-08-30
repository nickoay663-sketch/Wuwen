/**
 * Wuwen Accountability Layer
 * WAL Contract v1.0
 *
 * Core principle:
 * Expression is signed.
 * Publication is preceded by responsibility review.
 *
 * WAL does not equate:
 * - signature with truth
 * - identity with responsibility
 * - storage with verification
 * - discovery with evidence
 * - verification with legal judgment
 */

class WALContract {

    static VERSION = "1.0";

    static NAME = "Wuwen Accountability Layer";

    static IDENTIFIER = "WAL";

    static PRINCIPLE =
        "Expression is signed, and publication is preceded by responsibility review.";

    static RESPONSIBILITY_STATES = Object.freeze({
        UNKNOWN: "UNKNOWN",
        UNESTABLISHED: "UNESTABLISHED",
        ESTABLISHED: "ESTABLISHED",
        PARTIAL: "PARTIAL",
        DISPUTED: "DISPUTED"
    });

    static VERIFICATION_STATES = Object.freeze({
        UNKNOWN: "UNKNOWN",
        UNVERIFIED: "UNVERIFIED",
        DISCOVERED: "DISCOVERED",
        SUPPORTED: "SUPPORTED",
        VERIFIED: "VERIFIED",
        CONTRADICTED: "CONTRADICTED"
    });

    static PROPAGATION_STATES = Object.freeze({
        ALLOW: "ALLOW",
        ALLOW_WITH_BOUNDARY: "ALLOW_WITH_BOUNDARY",
        REQUIRE_VERIFICATION: "REQUIRE_VERIFICATION",
        BLOCK: "BLOCK"
    });

    /**
     * Required structural fields.
     *
     * IMPORTANT:
     *
     * undefined means the field does not exist.
     *
     * null means the field exists but its value is explicitly unknown
     * or not established.
     *
     * WAL must preserve this distinction because:
     *
     * UNKNOWN MUST REMAIN EXPLICIT
     * NO_IDENTITY_INFERENCE
     */
    static REQUIRED_FIELDS = Object.freeze([
        "eventId",
        "expression",
        "identity",
        "timestamp",
        "verificationState",
        "responsibilityState",
        "propagationState",
        "runtimeVersion",
        "contractVersion"
    ]);

    static RESPONSIBILITY_FIELDS = Object.freeze([
        "subject",
        "scope",
        "basis",
        "limitations"
    ]);

    static AUDIT_FIELDS = Object.freeze([
        "eventId",
        "timestamp",
        "runtimeVersion",
        "contractVersion",
        "identity",
        "verificationState",
        "responsibilityState",
        "propagationState"
    ]);

    /**
     * Create a normalized WAL contract envelope.
     *
     * This method records supplied information only.
     * It does not infer identity, responsibility, evidence,
     * verification, signature, or propagation authority.
     */
    static createEnvelope(data = {}) {

        return {
            WAL: {
                name: WALContract.NAME,
                identifier: WALContract.IDENTIFIER,
                version: WALContract.VERSION
            },

            eventId:
                data.eventId || null,

            expression:
                data.expression || null,

            identity:
                data.identity ?? null,

            timestamp:
                data.timestamp || null,

            verificationState:
                data.verificationState ??
                WALContract.VERIFICATION_STATES.UNKNOWN,

            responsibilityState:
                data.responsibilityState ??
                WALContract.RESPONSIBILITY_STATES.UNKNOWN,

            responsibility:
                data.responsibility ?? null,

            propagationState:
                data.propagationState ??
                WALContract.PROPAGATION_STATES.REQUIRE_VERIFICATION,

            evidence:
                Array.isArray(data.evidence)
                    ? data.evidence
                    : [],

            auditTrail:
                Array.isArray(data.auditTrail)
                    ? data.auditTrail
                    : [],

            signature:
                data.signature ?? null,

            runtimeVersion:
                data.runtimeVersion ?? null,

            contractVersion:
                data.contractVersion ?? null
        };
    }

    /**
     * Validate structural WAL compliance.
     *
     * Contract validation is NOT factual verification.
     *
     * A field with value null is structurally present.
     * This is required so explicit unknown values remain unknown
     * rather than being converted into an artificial identity,
     * responsibility, or certainty.
     */
    static validate(envelope = {}) {

        const missingFields =
            WALContract.REQUIRED_FIELDS.filter(
                field =>
                    envelope[field] === undefined
            );

        const validVerificationStates =
            Object.values(
                WALContract.VERIFICATION_STATES
            );

        const validResponsibilityStates =
            Object.values(
                WALContract.RESPONSIBILITY_STATES
            );

        const validPropagationStates =
            Object.values(
                WALContract.PROPAGATION_STATES
            );

        const verificationStateValid =
            validVerificationStates.includes(
                envelope.verificationState
            );

        const responsibilityStateValid =
            validResponsibilityStates.includes(
                envelope.responsibilityState
            );

        const propagationStateValid =
            validPropagationStates.includes(
                envelope.propagationState
            );

        const valid =
            missingFields.length === 0 &&
            verificationStateValid &&
            responsibilityStateValid &&
            propagationStateValid;

        return {
            valid,

            contract: {
                name: WALContract.NAME,
                identifier: WALContract.IDENTIFIER,
                version: WALContract.VERSION
            },

            missingFields,

            stateValidation: {
                verificationStateValid,
                responsibilityStateValid,
                propagationStateValid
            },

            principle:
                WALContract.PRINCIPLE
        };
    }

    /**
     * Determine whether publication requires further verification.
     *
     * This is a responsibility gate, not a truth oracle.
     */
    static requiresVerification(envelope = {}) {

        if (
            envelope.verificationState ===
            WALContract.VERIFICATION_STATES.VERIFIED
        ) {
            return false;
        }

        return true;
    }

    /**
     * Determine whether an envelope may enter propagation.
     *
     * Structural validity does not grant propagation authority.
     */
    static canPropagate(envelope = {}) {

        const validation =
            WALContract.validate(envelope);

        if (!validation.valid) {
            return false;
        }

        return (
            envelope.propagationState ===
            WALContract.PROPAGATION_STATES.ALLOW
        ) ||
            (
                envelope.propagationState ===
                WALContract.PROPAGATION_STATES.ALLOW_WITH_BOUNDARY
            );
    }

    static invariants() {

        return Object.freeze([
            "SIGNATURE_IS_NOT_TRUTH",
            "IDENTITY_IS_NOT_AUTOMATIC_RESPONSIBILITY",
            "STORAGE_IS_NOT_VERIFICATION",
            "DISCOVERY_IS_NOT_EVIDENCE",
            "VERIFICATION_IS_NOT_LEGAL_JUDGMENT",
            "UNKNOWN_MUST_NOT_BE_PRESENTED_AS_KNOWN",
            "RESPONSIBILITY_MUST_NOT_EXCEED_EVIDENCE",
            "PROPAGATION_MUST_RESPECT_VERIFICATION_STATE"
        ]);
    }
}

export default WALContract;
