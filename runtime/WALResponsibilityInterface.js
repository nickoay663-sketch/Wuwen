import WALContract from "./WALContract.js";

/**
 * Wuwen Accountability Layer
 * Responsibility Interface v2.2
 *
 * Provenance Boundary:
 *
 *     WAL translates trusted responsibility records.
 *     WAL never trusts authority claimed by the event envelope.
 *
 * Core rule:
 *
 *     Event metadata is descriptive.
 *     Responsibility records are authoritative only when they
 *     carry an explicit Runtime provenance marker.
 *
 * Therefore:
 *
 *     event.epistemicState       -> NEVER authoritative
 *     event.responsibilityState  -> NEVER authoritative
 *     event.propagationState     -> NEVER authoritative
 *     event.supported            -> NEVER authoritative
 *
 * Only normalized ResponsibilityEngine records carrying the
 * explicit Wuwen Runtime provenance marker may establish WAL
 * verification or responsibility state.
 */

class WALResponsibilityInterface {

    static VERSION = "2.2";

    static NAME =
        "WALResponsibilityInterface";

    static PROVENANCE_MARKER =
        "Wuwen.ResponsibilityEngine";

    static PROVENANCE_VERSION =
        "1.0";


    /*
     * =========================================================
     * Trusted Responsibility Record Detection
     * =========================================================
     *
     * A record is not trusted merely because its shape looks like
     * a responsibility record.
     *
     * WAL requires explicit provenance.
     *
     * This prevents an untrusted caller from manufacturing:
     *
     *     VERIFIED
     *     ESTABLISHED
     *     ALLOW
     *
     * merely by constructing an object with those fields.
     */

    static isTrustedResponsibilityRecord(
        record
    ) {

        if (
            !record ||
            typeof record !==
                "object" ||
            Array.isArray(record)
        ) {

            return false;

        }

        const provenance =
            record.provenance ||
            record.sourceProvenance ||
            null;

        if (
            !provenance ||
            typeof provenance !==
                "object"
        ) {

            return false;

        }

        return (

            provenance.provider ===
                WALResponsibilityInterface.PROVENANCE_MARKER &&

            provenance.version ===
                WALResponsibilityInterface.PROVENANCE_VERSION

        );

    }


    /*
     * =========================================================
     * Verification State Mapping
     * =========================================================
     *
     * IMPORTANT:
     *
     * This method accepts only a value already extracted from a
     * trusted responsibility record.
     *
     * The event envelope must never be used as a fallback.
     */

    static mapVerificationState(
        epistemicState
    ) {

        const state =
            epistemicState || "UNKNOWN";

        const map = {

            DISCOVERED:
                WALContract.VERIFICATION_STATES.DISCOVERED,

            UNVERIFIED:
                WALContract.VERIFICATION_STATES.UNVERIFIED,

            VERIFIED:
                WALContract.VERIFICATION_STATES.VERIFIED,

            SUPPORTED:
                WALContract.VERIFICATION_STATES.SUPPORTED,

            CONTRADICTED:
                WALContract.VERIFICATION_STATES.CONTRADICTED,

            UNKNOWN:
                WALContract.VERIFICATION_STATES.UNKNOWN

        };

        return (
            map[state] ||
            WALContract.VERIFICATION_STATES.UNKNOWN
        );

    }


    /*
     * =========================================================
     * Responsibility State Mapping
     * =========================================================
     *
     * No trusted record:
     *
     *     UNESTABLISHED
     *
     * This is intentionally stronger than UNKNOWN at the WAL
     * responsibility boundary.
     *
     * WAL must not claim that responsibility is merely unknown
     * when no responsibility authority has crossed the boundary.
     */

    static mapResponsibilityState(
        responsibilityRecord
    ) {

        if (
            !WALResponsibilityInterface
                .isTrustedResponsibilityRecord(
                    responsibilityRecord
                )
        ) {

            return (
                WALContract
                    .RESPONSIBILITY_STATES
                    .UNESTABLISHED
            );

        }

        const record =
            responsibilityRecord;

        if (
            record.responsibilityState &&
            Object.values(
                WALContract.RESPONSIBILITY_STATES
            ).includes(
                record.responsibilityState
            )
        ) {

            return record.responsibilityState;

        }

        if (
            record.responsibilityBoundary?.status ===
            "exceeded"
        ) {

            return (
                WALContract
                    .RESPONSIBILITY_STATES
                    .UNESTABLISHED
            );

        }

        if (
            record.responsibilityJudgment?.gap ===
            true
        ) {

            return (
                WALContract
                    .RESPONSIBILITY_STATES
                    .UNESTABLISHED
            );

        }

        if (
            record.supported === true &&
            record.verificationStatus ===
                WALContract.VERIFICATION_STATES.SUPPORTED
        ) {

            return (
                WALContract
                    .RESPONSIBILITY_STATES
                    .ESTABLISHED
            );

        }

        return (
            WALContract
                .RESPONSIBILITY_STATES
                .UNESTABLISHED
        );

    }


    /*
     * =========================================================
     * Propagation State Mapping
     * =========================================================
     *
     * PROPAGATION IS NEVER READ FROM THE EVENT.
     *
     * event.propagationState = ALLOW is therefore ignored.
     *
     * ALLOW may only be derived after:
     *
     * 1. trusted responsibility record exists
     * 2. verification is SUPPORTED
     * 3. responsibility is ESTABLISHED
     * 4. boundary is matched
     * 5. no unresolved responsibility gap exists
     */

    static mapPropagationState(
        responsibilityEvent,
        responsibilityRecord
    ) {

        const trusted =
            WALResponsibilityInterface
                .isTrustedResponsibilityRecord(
                    responsibilityRecord
                );

        if (
            trusted !== true
        ) {

            return (
                WALContract
                    .PROPAGATION_STATES
                    .REQUIRE_VERIFICATION
            );

        }

        const record =
            responsibilityRecord;

        if (
            record.responsibilityBoundary?.status ===
                "exceeded" ||
            record.responsibilityJudgment?.gap ===
                true
        ) {

            return (
                WALContract
                    .PROPAGATION_STATES
                    .REQUIRE_VERIFICATION
            );

        }

        if (
            record.supported !== true
        ) {

            return (
                WALContract
                    .PROPAGATION_STATES
                    .REQUIRE_VERIFICATION
            );

        }

        if (
            record.verificationStatus !==
            WALContract.VERIFICATION_STATES.SUPPORTED
        ) {

            return (
                WALContract
                    .PROPAGATION_STATES
                    .REQUIRE_VERIFICATION
            );

        }

        if (
            record.responsibilityBoundary?.status !==
            "matched"
        ) {

            return (
                WALContract
                    .PROPAGATION_STATES
                    .REQUIRE_VERIFICATION
            );

        }

        return (
            WALContract
                .PROPAGATION_STATES
                .ALLOW
        );

    }


    /*
     * =========================================================
     * Responsibility Record Extraction
     * =========================================================
     *
     * Only explicitly proven Runtime responsibility records may
     * cross the WAL boundary.
     *
     * Shape alone is insufficient.
     */

    static extractResponsibilityRecords(
        responsibilityEvent
    ) {

        const event =
            responsibilityEvent || {};

        const candidates = [];

        if (
            Array.isArray(
                event.responsibilityRecords
            )
        ) {

            candidates.push(
                ...event.responsibilityRecords
            );

        }

        if (
            Array.isArray(
                event.responsibility?.responsibilities
            )
        ) {

            candidates.push(
                ...event.responsibility.responsibilities
            );

        }

        return [
            ...new Set(
                candidates.filter(
                    record =>
                        WALResponsibilityInterface
                            .isTrustedResponsibilityRecord(
                                record
                            )
                )
            )
        ];

    }


    /*
     * =========================================================
     * Responsibility Projection
     * =========================================================
     */

    static projectResponsibility(
        responsibilityRecord
    ) {

        if (
            !WALResponsibilityInterface
                .isTrustedResponsibilityRecord(
                    responsibilityRecord
                )
        ) {

            return null;

        }

        const record =
            responsibilityRecord;

        return {

            subject:
                record.responsibilityActor ||
                null,

            scope:
                record.responsibilityScope ||
                null,

            basis: {

                expression:
                    record.expression ||
                    null,

                definition:
                    record.definition ||
                    null,

                epistemicState:
                    record.epistemicState ||
                    "UNKNOWN",

                supported:
                    record.supported === true,

                evidenceCount:
                    Number.isFinite(
                        record.evidenceCount
                    )
                        ? record.evidenceCount
                        : 0,

                verifiedEvidenceCount:
                    Number.isFinite(
                        record.verifiedEvidenceCount
                    )
                        ? record.verifiedEvidenceCount
                        : 0,

                sourceCount:
                    Number.isFinite(
                        record.sourceCount
                    )
                        ? record.sourceCount
                        : 0,

                verifiedSourceCount:
                    Number.isFinite(
                        record.verifiedSourceCount
                    )
                        ? record.verifiedSourceCount
                        : 0,

                verificationStatus:
                    record.verificationStatus ||
                    "UNKNOWN"

            },

            limitations: {

                responsibilityDemand:
                    record.responsibilityDemand ||
                    null,

                responsibilityCapacity:
                    record.responsibilityCapacity ||
                    null,

                responsibilityBoundary:
                    record.responsibilityBoundary ||
                    null,

                responsibilityJudgment:
                    record.responsibilityJudgment ||
                    null,

                expressionResponsibility:
                    record.expressionResponsibility ||
                    null,

                evidenceResponsibility:
                    record.evidenceResponsibility ||
                    null,

                sourceResponsibility:
                    record.sourceResponsibility ||
                    null,

                verificationResponsibility:
                    record.verificationResponsibility ||
                    null

            }

        };

    }


    /*
     * =========================================================
     * WAL Envelope Construction
     * =========================================================
     *
     * Event-level authority claims are deliberately ignored.
     */

    static fromResponsibilityEvent(
        responsibilityEvent = {}
    ) {

        const event =
            responsibilityEvent || {};

        const records =
            WALResponsibilityInterface
                .extractResponsibilityRecords(
                    event
                );

        const primaryRecord =
            records[0] || null;

        const verificationState =
            primaryRecord
                ? WALResponsibilityInterface
                    .mapVerificationState(
                        primaryRecord.epistemicState
                    )
                : WALContract
                    .VERIFICATION_STATES
                    .UNKNOWN;

        const responsibilityState =
            WALResponsibilityInterface
                .mapResponsibilityState(
                    primaryRecord
                );

        const propagationState =
            WALResponsibilityInterface
                .mapPropagationState(
                    event,
                    primaryRecord
                );

        const projectedResponsibility =
            primaryRecord
                ? WALResponsibilityInterface
                    .projectResponsibility(
                        primaryRecord
                    )
                : null;

        return WALContract.createEnvelope({

            eventId:
                event.eventId ||
                null,

            expression:
                event.expression ||
                primaryRecord?.expression ||
                null,

            identity:
                primaryRecord
                    ?.responsibilityActor
                    ?.identity ||
                null,

            timestamp:
                event.timestamp ||
                event.createdAt ||
                null,

            verificationState,

            responsibilityState,

            responsibility:
                projectedResponsibility,

            propagationState,

            evidence:
                Array.isArray(event.evidence)
                    ? event.evidence
                    : [],

            auditTrail:
                Array.isArray(event.auditTrail)
                    ? event.auditTrail
                    : [],

            signature:
                event.signature ||
                null,

            runtimeVersion:
                event.runtimeVersion ||
                null,

            contractVersion:
                event.contractVersion ||
                WALContract.VERSION

        });

    }


    /*
     * =========================================================
     * Build + Validate
     * =========================================================
     */

    static buildValidatedEnvelope(
        responsibilityEvent = {}
    ) {

        const envelope =
            WALResponsibilityInterface
                .fromResponsibilityEvent(
                    responsibilityEvent
                );

        const validation =
            WALResponsibilityInterface
                .validate(
                    envelope
                );

        return {

            envelope,

            validation,

            valid:
                validation.valid === true

        };

    }


    /*
     * =========================================================
     * Structural Validation
     * =========================================================
     */

    static validate(
        WALEnvelope = {}
    ) {

        return WALContract.validate(
            WALEnvelope
        );

    }


    /*
     * =========================================================
     * Propagation
     * =========================================================
     */

    static canPropagate(
        WALEnvelope = {}
    ) {

        return WALContract.canPropagate(
            WALEnvelope
        );

    }


    static requiresVerification(
        WALEnvelope = {}
    ) {

        return WALContract.requiresVerification(
            WALEnvelope
        );

    }


    /*
     * =========================================================
     * Interface Contract
     * =========================================================
     */

    static contract() {

        return Object.freeze({

            name:
                WALResponsibilityInterface.NAME,

            version:
                WALResponsibilityInterface.VERSION,

            contract:
                WALContract.IDENTIFIER,

            contractVersion:
                WALContract.VERSION,

            purpose:
                "Translate explicitly proven Runtime responsibility records into an WAL accountability envelope without trusting event-level authority claims.",

            principles: Object.freeze([

                "TRANSLATION_NOT_INFERENCE",

                "PROVENANCE_BEFORE_AUTHORITY",

                "NORMALIZED_RECORDS_ONLY",

                "EXPLICIT_RUNTIME_PROVENANCE_REQUIRED",

                "EVENT_STATE_IS_NOT_AUTHORITY",

                "NO_RUNTIME_INTERNAL_EXPORT",

                "NO_IDENTITY_INFERENCE",

                "NO_RESPONSIBILITY_INFERENCE",

                "NO_EVIDENCE_CREATION",

                "NO_FACTUAL_VERIFICATION",

                "NO_SIGNATURE_MANUFACTURE",

                "NO_EVENT_ID_MANUFACTURE",

                "NO_PROPAGATION_AUTHORIZATION_INFERENCE",

                "NO_LEGAL_JUDGMENT",

                "UNKNOWN_MUST_REMAIN_EXPLICIT",

                "UNESTABLISHED_MUST_REMAIN_EXPLICIT",

                "REQUIRE_VERIFICATION_IS_DEFAULT"

            ]),

            excludedRuntimeFields: Object.freeze([

                "semanticObject",

                "engineRegistry",

                "engines",

                "runtimeContext",

                "metadata",

                "trace",

                "nextRuntimeState"

            ]),

            provenance: Object.freeze({

                provider:
                    WALResponsibilityInterface
                        .PROVENANCE_MARKER,

                version:
                    WALResponsibilityInterface
                        .PROVENANCE_VERSION

            }),

            invariants:
                WALContract.invariants()

        });

    }

}

export default WALResponsibilityInterface;
