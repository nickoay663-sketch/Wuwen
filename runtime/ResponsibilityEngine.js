import EngineBase from "./EngineBase.js";

class ResponsibilityEngine extends EngineBase {

    constructor(semanticObject) {

        super(
            "ResponsibilityEngine",
            "10.7",
            "莫问仅依据当前运行中实际提取、实际来源、实际验证并实际建立对应关系的证据计算责任能力，不信任上游声明的验证、支持或容量字段。"
        );

        this.semanticObject =
            semanticObject || {};

    }


    execute() {

        const metadata =
            this.buildMetadata();

        const responsibilities =
            this.buildResponsibilities();

        const status =
            responsibilities.length > 0
                ? "responsibility-evaluated"
                : "need-responsibility";

        const passed =
            responsibilities.length > 0 &&
            responsibilities.every(
                item =>
                    item.responsibilityBoundary.status !==
                    "exceeded"
            );

        const primaryResponsibility =
            responsibilities[0] || {};

        const epistemicState =
            primaryResponsibility.epistemicState ||
            "UNKNOWN";

        const verificationStatus =
            primaryResponsibility.verificationStatus ||
            "UNKNOWN";

        const supported =
            primaryResponsibility.supported === true;

        return this.result({
principle:
                this.principle,

            metadata,

            responsibilities,

            epistemicState,

            verificationStatus,

            supported,

            passed,

            status,

            result: {

                metadata,

                responsibilities,

                epistemicState,

                verificationStatus,

                supported,

                passed,

                status

            },

            trace:
                this.semanticObject.runtimeTrace || [],

            questions:
                passed
                    ? []
                    : [
                        "responsibility boundary verification required"
                    ],

            nextRuntimeState:
                "ReconstructionEngine",

            status

        });

    }


    buildMetadata() {

        const reasonings =
            Array.isArray(
                this.semanticObject.reasonings
            )
                ? this.semanticObject.reasonings
                : [];

        const supportedCount =
            reasonings.filter(
                reasoning =>
                    this.hasActualVerifiedSupport(
                        reasoning
                    )
            ).length;

        const unverifiedCount =
            reasonings.filter(
                reasoning =>
                    (
                        reasoning.verificationStatus ||
                        reasoning.epistemicState
                    ) === "UNVERIFIED"
            ).length;

        const unknownCount =
            reasonings.filter(
                reasoning =>
                    (
                        reasoning.verificationStatus ||
                        reasoning.epistemicState
                    ) === "UNKNOWN"
            ).length;

        return this.metadata({

            generatedAt:
                new Date().toISOString(),

            runtimeVersion:
                this.semanticObject.contract
                    ?.identity
                    ?.runtimeVersion ||
                "10.7",

            contractVersion:
                this.semanticObject.contract
                    ?.version ||
                "10.7",

            engineCount:
                this.semanticObject.engineRegistry?.list?.().length ||
                Object.keys(
                    this.semanticObject.engines || {}
                ).length,

            traceCount:
                (
                    this.semanticObject.runtimeTrace || []
                ).length,

            supportedCount,

            unverifiedCount,

            unknownCount

        });

    }


    buildResponsibilities() {

        const reasonings =
            Array.isArray(
                this.semanticObject.reasonings
            )
                ? this.semanticObject.reasonings
                : [];

        const testimony =
            this.semanticObject.testimony || null;

        return reasonings.map(
            reasoning => {

                /*
                 * =====================================================
                 * GATE 6
                 * =====================================================
                 *
                 * Never trust upstream responsibility-capacity fields.
                 *
                 * All responsibility capacity is reconstructed from
                 * actual evidence observed during this execution.
                 * =====================================================
                 */

                const verifiedEvidences =
                    this.extractActualVerifiedEvidence(
                        reasoning
                    );

                const evidences =
                    Array.isArray(reasoning.evidences)
                        ? reasoning.evidences
                        : [];

                const evidenceCount =
                    evidences.length;

                const sourceCount =
                    this.countActualSources(
                        evidences
                    );

                const sourceAvailable =
                    sourceCount > 0;

                const verifiedEvidenceCount =
                    verifiedEvidences.length;

                const verifiedSourceCount =
                    this.countActualSources(
                        verifiedEvidences
                    );

                const verifiedSourceAvailable =
                    verifiedSourceCount > 0;

                const actualSupport =
                    verifiedEvidenceCount > 0 &&
                    verifiedSourceAvailable &&
                    this.actualEvidenceSupportsDefinition(
                        verifiedEvidences,
                        reasoning.definition
                    );

                const actualVerificationStatus =
                    this.deriveVerificationStatus({

                        reasoning,

                        verifiedEvidenceCount,

                        actualSupport

                    });

                /*
                 * The normalized object is reconstructed from actual
                 * runtime observations. Upstream claims are overwritten.
                 */
                const normalizedReasoning = {

                    ...reasoning,

                    evidences,

                    verifiedEvidences,

                    evidenceCount,

                    verifiedEvidenceCount,

                    sourceCount,

                    sourceAvailable,

                    verifiedSourceCount,

                    verifiedSourceAvailable,

                    supported:
                        actualSupport,

                    verificationStatus:
                        actualVerificationStatus,

                    epistemicState:
                        actualVerificationStatus

                };

                const demand =
                    this.analyzeResponsibilityDemand(
                        normalizedReasoning
                    );

                /*
                 * IMPORTANT:
                 *
                 * Capacity is derived ONLY from actual normalized
                 * evidence values produced above.
                 */
                const capacity =
                    this.deriveActualResponsibilityCapacity({

                        verificationStatus:
                            actualVerificationStatus,

                        verifiedEvidenceCount,

                        verifiedSourceCount,

                        actualSupport

                    });

                const boundary =
                    this.calculateBoundary(
                        demand,
                        capacity,
                        normalizedReasoning
                    );

                const verifiedEvidenceRequired =
                    this.calculateVerifiedEvidenceRequirement(
                        normalizedReasoning
                    );

                return {

                    provenance: {

                        provider:
                            "MoWen.ResponsibilityEngine",

                        version:
                            "1.0"

                    },

                    testimony,

                    responsibilityActor: {

                        identity:
                            null,

                        role:
                            "expression-owner",

                        authority:
                            null

                    },

                    responsibilityScope: {

                        claims:
                            reasoning.definition
                                ? [
                                    reasoning.definition
                                ]
                                : [],

                        evidenceRequired:
                            evidenceCount,

                        verifiedEvidenceRequired,

                        verificationRequired:
                            true

                    },

                    expression:
                        this.semanticObject
                            .originalContent || "",

                    definition:
                        reasoning.definition,

                    supported:
                        actualSupport,

                    epistemicState:
                        actualVerificationStatus,

                    evidenceCount,

                    verifiedEvidenceCount,

                    sourceCount,

                    sourceAvailable,

                    verifiedSourceCount,

                    verifiedSourceAvailable,

                    sources:
                        evidences,

                    verifiedSources:
                        verifiedEvidences,

                    responsibilityDemand:
                        demand,

                    responsibilityCapacity:
                        capacity,

                    responsibilityBoundary:
                        boundary,

                    responsibilityJudgment: {

                        demand:
                            demand.level,

                        capacity:
                            capacity.level,

                        gap:
                            demand.level !== capacity.level

                    },

                    expressionResponsibility:
                        demand.level,

                    evidenceResponsibility:
                        capacity.level,

                    sourceResponsibility:
                        sourceAvailable
                            ? "available"
                            : "missing",

                    verificationResponsibility:
                        "required",

                    responsibilityType:
                        "subject-responsibility-evaluation",

                    verificationStatus:
                        actualVerificationStatus,

                    runtimeTrace:
                        this.semanticObject
                            .runtimeTrace || [],

                    engineRegistry:
                        this.semanticObject
                            .engineRegistry
                            ?.describe?.() || []

                };

            }
        );

    }


    extractActualVerifiedEvidence(reasoning) {

        const candidates =
            Array.isArray(
                reasoning?.verifiedEvidences
            )
                ? reasoning.verifiedEvidences
                : [];

        return candidates.filter(
            evidence =>
                evidence &&
                evidence.verificationStatus ===
                "VERIFIED" &&
                evidence.epistemicState ===
                "VERIFIED" &&
                evidence.verificationBasis != null &&
                evidence.sourceAvailable === true
        );

    }


    countActualSources(evidences) {

        return new Set(

            (Array.isArray(evidences)
                ? evidences
                : []
            )
                .map(
                    evidence =>
                        evidence &&
                        (
                            evidence.source ||
                            evidence.url
                        )
                )
                .filter(Boolean)

        ).size;

    }


    actualEvidenceSupportsDefinition(
        evidences,
        definition
    ) {

        if (
            !definition ||
            !Array.isArray(evidences) ||
            evidences.length === 0
        ) {

            return false;

        }

        return evidences.some(
            evidence =>
                evidence &&
                evidence.supportsClaim === true
        );

    }


    deriveVerificationStatus({
        reasoning,
        verifiedEvidenceCount,
        actualSupport
    }) {

        if (actualSupport) {

            return "SUPPORTED";

        }

        if (verifiedEvidenceCount > 0) {

            return "VERIFIED_BUT_NOT_LINKED";

        }

        if (
            reasoning?.verificationStatus ===
            "CONTRADICTED"
        ) {

            return "CONTRADICTED";

        }

        if (
            reasoning?.verificationStatus ===
            "UNVERIFIED"
        ) {

            return "UNVERIFIED";

        }

        return "UNKNOWN";

    }


    hasActualVerifiedSupport(reasoning) {

        const evidences =
            this.extractActualVerifiedEvidence(
                reasoning
            );

        return (
            evidences.length > 0 &&
            this.actualEvidenceSupportsDefinition(
                evidences,
                reasoning?.definition
            )
        );

    }


    calculateVerifiedEvidenceRequirement(reasoning) {

        const verificationStatus =
            reasoning?.verificationStatus ||
            reasoning?.epistemicState ||
            "UNKNOWN";

        if (
            verificationStatus ===
            "SUPPORTED"
        ) {

            return 1;

        }

        if (
            verificationStatus ===
            "CONTRADICTED"
        ) {

            return 0;

        }

        return 1;

    }


    analyzeResponsibilityDemand(reasoning) {

        const content =
            this.semanticObject.originalContent || "";

        let level =
            "medium";

        const highResponsibilityMarkers = [

            "一定",

            "必然",

            "所有",

            "绝对",

            "必定",

            "必然如此",

            "毫无例外"

        ];

        if (
            highResponsibilityMarkers.some(
                marker =>
                    content.includes(marker)
            )
        ) {

            level =
                "high";

        }

        return {

            level,

            source:
                "expression-strength"

        };

    }


    /*
     * =====================================================
     * GATE 6 CAPACITY DERIVATION
     * =====================================================
     *
     * This method deliberately does NOT accept a reasoning object.
     *
     * It receives only values reconstructed by ResponsibilityEngine
     * from actual evidence in the current execution.
     *
     * Therefore fields such as:
     *
     * reasoning.supported
     * reasoning.verificationStatus
     * reasoning.verifiedEvidenceCount
     * reasoning.verifiedSourceAvailable
     * reasoning.responsibilityCapacity
     *
     * cannot directly manufacture responsibility capacity.
     * =====================================================
     */
    deriveActualResponsibilityCapacity({

        verificationStatus,

        verifiedEvidenceCount,

        verifiedSourceCount,

        actualSupport

    }) {

        const actualVerifiedEvidenceCount =
            Number.isFinite(
                Number(verifiedEvidenceCount)
            )
                ? Number(verifiedEvidenceCount)
                : 0;

        const actualVerifiedSourceCount =
            Number.isFinite(
                Number(verifiedSourceCount)
            )
                ? Number(verifiedSourceCount)
                : 0;

        const actualSourceAvailable =
            actualVerifiedSourceCount > 0;

        let level =
            "none";

        if (
            verificationStatus ===
            "SUPPORTED" &&
            actualSupport === true &&
            actualVerifiedEvidenceCount > 0 &&
            actualSourceAvailable
        ) {

            level =
                "medium";

        }

        if (
            verificationStatus ===
            "SUPPORTED" &&
            actualSupport === true &&
            actualVerifiedEvidenceCount > 3 &&
            actualVerifiedSourceCount > 0
        ) {

            level =
                "high";

        }

        return {

            level,

            verifiedEvidenceCount:
                actualVerifiedEvidenceCount,

            sourceAvailable:
                actualSourceAvailable,

            verifiedSourceCount:
                actualVerifiedSourceCount,

            actualSupport:
                actualSupport === true,

            source:
                "actual-runtime-verified-evidence"

        };

    }


    calculateBoundary(
        demand,
        capacity,
        reasoning
    ) {

        const verificationStatus =
            reasoning.verificationStatus ||
            "UNKNOWN";

        if (
            verificationStatus !==
            "SUPPORTED"
        ) {

            return {

                status:
                    "exceeded",

                explanation:
                    "当前表达的责任要求超过当前可直接核验的已验证证据能力。",

                epistemicBoundary:
                    "UNKNOWN_OR_UNVERIFIED"

            };

        }

        if (
            demand.level === "high" &&
            capacity.level !== "high"
        ) {

            return {

                status:
                    "exceeded",

                explanation:
                    "主体表达要求承担的责任超过当前已验证证据支持能力。",

                epistemicBoundary:
                    "VERIFIED_SUPPORT_INSUFFICIENT"

            };

        }

        if (
            demand.level === "medium" &&
            capacity.level === "none"
        ) {

            return {

                status:
                    "exceeded",

                explanation:
                    "表达要求承担责任，但当前没有已验证支持。",

                epistemicBoundary:
                    "NO_VERIFIED_SUPPORT"

            };

        }

        return {

            status:
                "matched",

            explanation:
                "主体责任要求没有超过当前已验证证据支持能力。",

            epistemicBoundary:
                "VERIFIED_SUPPORT"

        };

    }

}


export default ResponsibilityEngine;
