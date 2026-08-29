import WuwenResponsibilityIdentity from "./WuwenResponsibilityIdentity.js";

class ResponsibilityEvent {

    constructor({
        eventId = null,
        identity = null,
        expression = null,
        testimony = null,
        definition = null,
        responsibility = null,
        evidence = null,
        correspondence = null,
        reasoning = null,
        epistemicState = "UNKNOWN",
        verificationBoundary = null,
        runtimeTrace = [],
        runtimeVersion = null,
        contractVersion = null,
        source = "MoWen Runtime"
    } = {}) {

        this.type = "ResponsibilityEvent";
        this.responsibilityIdentity = WuwenResponsibilityIdentity;
        this.version = "1.2";
        this.createdAt = new Date().toISOString();
        this.source = source;

        this.eventId =
            eventId ||
            `mwal-${Date.now()}-${Math.random()
                .toString(36)
                .slice(2, 10)}`;

        this.identity =
            identity || null;

        this.runtimeVersion = runtimeVersion;
        this.contractVersion = contractVersion;

        this.expression = expression;
        this.testimony = testimony;
        this.definition = definition;

        this.epistemicState =
            epistemicState || "UNKNOWN";

        this.responsibility = responsibility;
        this.evidence = evidence;
        this.correspondence = correspondence;
        this.reasoning = reasoning;
        this.verificationBoundary = verificationBoundary;

        this.runtimeTrace =
            Array.isArray(runtimeTrace)
                ? [...runtimeTrace]
                : [];

        this.responsibilityRecords =
            this.collectResponsibilityRecords(
                responsibility
            );

        const primary =
            this.responsibilityRecords[0] ||
            {};

        this.responsibilityBoundary =
            primary.responsibilityBoundary ||
            null;

        this.verificationStatus =
            primary.verificationStatus ||
            "UNKNOWN";

        this.supported =
            primary.supported === true;

        this.responsibilityCapacity =
            primary.responsibilityCapacity ||
            null;

        this.responsibilityDemand =
            primary.responsibilityDemand ||
            null;

        this.responsibilityJudgment =
            primary.responsibilityJudgment ||
            null;

        this.runtimeIdentity = {

            name:
                "MoWen",

            identity:
                "Honest Runtime",

            runtimeVersion:
                runtimeVersion,

            contractVersion:
                contractVersion

        };

        this.boundary = {

            epistemic:
                this.epistemicState,

            verification:
                this.verificationStatus,

            responsibility:
                this.responsibilityBoundary,

            supported:
                this.supported

        };

    }


    isNormalizedResponsibilityRecord(
        record
    ) {

        if (
            !record ||
            typeof record !== "object" ||
            Array.isArray(record)
        ) {

            return false;

        }

        return (

            Object.prototype.hasOwnProperty.call(
                record,
                "expression"
            ) ||

            Object.prototype.hasOwnProperty.call(
                record,
                "responsibilityBoundary"
            ) ||

            Object.prototype.hasOwnProperty.call(
                record,
                "responsibilityJudgment"
            ) ||

            Object.prototype.hasOwnProperty.call(
                record,
                "responsibilityDemand"
            ) ||

            Object.prototype.hasOwnProperty.call(
                record,
                "responsibilityCapacity"
            ) ||

            Object.prototype.hasOwnProperty.call(
                record,
                "verificationStatus"
            )

        );

    }


    collectResponsibilityRecords(
        responsibility
    ) {

        if (
            !responsibility ||
            typeof responsibility !== "object"
        ) {

            return [];

        }

        /*
         * ResponsibilityEngine owns the normalized responsibility
         * record collection.
         *
         * ResponsibilityEvent must not reconstruct the same
         * responsibility record from wrapper/result layers.
         *
         * Priority:
         *   1. responsibility.responsibilities
         *   2. direct normalized responsibility
         *
         * Nested result wrappers are intentionally ignored here.
         */

        if (
            Array.isArray(
                responsibility.responsibilities
            )
        ) {

            return responsibility.responsibilities.filter(
                record =>
                    this.isNormalizedResponsibilityRecord(
                        record
                    )
            );

        }

        if (
            this.isNormalizedResponsibilityRecord(
                responsibility
            )
        ) {

            return [
                responsibility
            ];

        }

        return [];

    }


    /*
     * =========================================================
     * Responsibility Consistency
     * =========================================================
     *
     * Consistency means internal logical agreement.
     *
     * IMPORTANT:
     *
     * responsibilityBoundary.status === "exceeded"
     * and responsibilityJudgment.gap === true
     *
     * are NOT themselves inconsistencies.
     *
     * They are legitimate responsibility-capacity outcomes:
     *
     * demand > verified capacity.
     *
     * MoWen must preserve these states while still allowing the
     * responsibility record to be internally consistent.
     * =========================================================
     */

    getResponsibilityConsistency() {

        const errors = [];

        const records =
            this.responsibilityRecords;

        if (
            records.length === 0
        ) {

            return {

                consistent:
                    false,

                errors: [
                    "No responsibility record available."
                ]

            };

        }

        /*
         * ---------------------------------------------------------
         * Supported state consistency
         * ---------------------------------------------------------
         */

        const supportedValues =
            records
                .filter(
                    record =>
                        typeof record.supported ===
                        "boolean"
                )
                .map(
                    record =>
                        record.supported
                );

        if (
            supportedValues.includes(true) &&
            supportedValues.includes(false)
        ) {

            errors.push(
                "Conflicting supported states across responsibility records."
            );

        }

        /*
         * ---------------------------------------------------------
         * Verification state consistency
         * ---------------------------------------------------------
         */

        const verificationValues =
            records
                .filter(
                    record =>
                        typeof record.verificationStatus ===
                        "string"
                )
                .map(
                    record =>
                        record.verificationStatus
                );

        if (
            verificationValues.includes(
                "SUPPORTED"
            ) &&
            verificationValues.some(
                value =>
                    value !== "SUPPORTED"
            )
        ) {

            errors.push(
                "Conflicting verificationStatus across responsibility records."
            );

        }

        /*
         * ---------------------------------------------------------
         * Boundary / judgment logical consistency
         *
         * "exceeded" + gap:true is a valid state.
         *
         * It becomes inconsistent only when the same record claims
         * that the responsibility capacity is sufficient.
         * ---------------------------------------------------------
         */

        for (
            const record
            of records
        ) {

            const boundaryStatus =
                record.responsibilityBoundary?.status;

            const gap =
                record.responsibilityJudgment?.gap;

            const capacityLevel =
                record.responsibilityCapacity?.level;

            const actualSupport =
                record.responsibilityCapacity?.actualSupport;

            if (
                boundaryStatus ===
                "exceeded" &&
                gap === false
            ) {

                errors.push(
                    "Responsibility boundary is exceeded while responsibility judgment reports no capacity gap."
                );

            }

            if (
                gap === true &&
                (
                    capacityLevel ===
                    "sufficient" ||
                    capacityLevel ===
                    "full"
                )
            ) {

                errors.push(
                    "Responsibility judgment reports a capacity gap while responsibility capacity is sufficient."
                );

            }

            if (
                actualSupport ===
                true &&
                capacityLevel ===
                "none"
            ) {

                errors.push(
                    "Responsibility capacity reports no capacity while actual support is true."
                );

            }

            if (
                boundaryStatus ===
                "matched" &&
                gap === true
            ) {

                errors.push(
                    "Responsibility boundary is matched while responsibility judgment reports a capacity gap."
                );

            }

        }

        return {

            consistent:
                errors.length === 0,

            errors

        };

    }


    validate() {

        const errors = [];

        if (
            this.type !==
            "ResponsibilityEvent"
        ) {

            errors.push(
                "Invalid event type."
            );

        }

        if (
            !this.version
        ) {

            errors.push(
                "Missing event version."
            );

        }

        if (
            !this.createdAt
        ) {

            errors.push(
                "Missing createdAt."
            );

        }

        if (
            !this.eventId
        ) {

            errors.push(
                "Missing eventId."
            );

        }

        if (
            !this.expression
        ) {

            errors.push(
                "Missing expression."
            );

        }

        if (
            !this.epistemicState
        ) {

            errors.push(
                "Missing epistemicState."
            );

        }

        const allowedStates = [

            "DISCOVERED",
            "UNVERIFIED",
            "VERIFIED",
            "VERIFIED_BUT_NOT_LINKED",
            "SUPPORTED",
            "CONTRADICTED",
            "PARTIAL",
            "UNRESOLVED",
            "OUT_OF_DOMAIN",
            "UNKNOWN"

        ];

        if (
            !allowedStates.includes(
                this.epistemicState
            )
        ) {

            errors.push(
                `Invalid epistemicState: ${this.epistemicState}`
            );

        }

        if (
            !Array.isArray(
                this.runtimeTrace
            )
        ) {

            errors.push(
                "runtimeTrace must be an array."
            );

        }

        return {

            passed:
                errors.length === 0,

            errors

        };

    }


    isPublishable() {

        if (
            this.epistemicState !==
            "SUPPORTED"
        ) {

            return false;

        }

        if (
            this.supported !==
            true
        ) {

            return false;

        }

        if (
            this.verificationStatus !==
            "SUPPORTED"
        ) {

            return false;

        }

        if (
            !this.responsibilityBoundary ||
            this.responsibilityBoundary.status !==
            "matched"
        ) {

            return false;

        }

        const consistency =
            this.getResponsibilityConsistency();

        if (
            consistency.consistent !==
            true
        ) {

            return false;

        }

        return true;

    }


    getResponsibilityState() {

        return {

            epistemicState:
                this.epistemicState,

            verificationStatus:
                this.verificationStatus,

            supported:
                this.supported,

            responsibilityDemand:
                this.responsibilityDemand,

            responsibilityCapacity:
                this.responsibilityCapacity,

            responsibilityJudgment:
                this.responsibilityJudgment,

            responsibilityBoundary:
                this.responsibilityBoundary,

            responsibilityConsistency:
                this.getResponsibilityConsistency()

        };

    }


    toJSON() {

        return {

            type:
                this.type,

            version:
                this.version,

            createdAt:
                this.createdAt,

            source:
                this.source,

            eventId:
                this.eventId,

            identity:
                this.identity,

            runtimeVersion:
                this.runtimeVersion,

            contractVersion:
                this.contractVersion,

            expression:
                this.expression,

            testimony:
                this.testimony,

            epistemicState:
                this.epistemicState,

            verificationStatus:
                this.verificationStatus,

            supported:
                this.supported,

            responsibility:
                this.responsibility,

            responsibilityDemand:
                this.responsibilityDemand,

            responsibilityCapacity:
                this.responsibilityCapacity,

            responsibilityJudgment:
                this.responsibilityJudgment,

            responsibilityBoundary:
                this.responsibilityBoundary,

            responsibilityRecords:
                this.responsibilityRecords,

            responsibilityConsistency:
                this.getResponsibilityConsistency(),

            evidence:
                this.evidence,

            correspondence:
                this.correspondence,

            reasoning:
                this.reasoning,

            verificationBoundary:
                this.verificationBoundary,

            runtimeTrace:
                this.runtimeTrace,

            runtimeIdentity:
                this.runtimeIdentity,

            boundary:
                this.boundary

        };

    }

}


export default ResponsibilityEvent;
