import EngineBase from "./EngineBase.js";

class ReconstructionEngine extends EngineBase {

    constructor(runtimeObject) {

        super(
            "ReconstructionEngine",
            "10.7",
            "莫问根据责任、证据与认识状态重构表达，不增加未经验证的信息，不改变原事实内容的证据地位，并为最终生成提供责任边界内的表达。"
        );

        this.runtimeObject =
            runtimeObject || {};

    }


    execute() {

        const metadata =
            this.buildMetadata();

        const reconstruction =
            this.buildReconstruction();

        return {

            engine:
                this.engine,

            version:
                this.version,

            semanticObject:
    (() => {

        const source =
            this.runtimeObject.semanticObject || {};

        const {
            engineRegistry,
            engines,
            runtimeTrace,
            ...serializableSemanticObject
        } = source;

        return {

            ...serializableSemanticObject,

            engineRegistry:
                engineRegistry
                    ?.describe?.() || [],

            runtimeTrace:
                Array.isArray(runtimeTrace)
                    ? runtimeTrace
                    : []

        };

    })(),

            principle:
                this.principle,

            metadata,

            reconstruction,

            result: {

                metadata,

                reconstruction

            },

            trace:
                this.runtimeObject.runtimeTrace || [],

            nextRuntimeState:
                "GeneratorEngine",

            status:
                reconstruction.responsibilityCount > 0
                    ? "reconstruction-evaluated"
                    : "need-reconstruction",

            questions:
                reconstruction.responsibilityCount > 0
                    ? []
                    : [
                        "当前责任链是否完整？"
                    ]

        };

    }


    buildMetadata() {

        return {

            reconstructedAt:
                new Date().toISOString(),

            runtimeVersion:
                this.runtimeObject.contract?.identity?.runtimeVersion ||
                this.runtimeObject.contract?.version ||
                "",

            contractVersion:
                this.runtimeObject.contract?.version ||
                "",

            engineVersion:
                this.version,

            engineCount:
                Object.keys(
                    this.runtimeObject.engines || {}
                ).length,

            traceCount:
                (this.runtimeObject.runtimeTrace || []).length,

            reconstructionMode:
                "responsibility-aware-expression-reconstruction",

            publicationMode:
                "boundary-preserving"

        };

    }


    buildReconstruction() {

        const responsibilityObject =
            this.runtimeObject.responsibility || {};

        const responsibilities =
            Array.isArray(
                responsibilityObject.responsibilities
            )
                ? responsibilityObject.responsibilities
                : Array.isArray(
                    responsibilityObject.result?.responsibilities
                )
                    ? responsibilityObject.result.responsibilities
                    : [];

        const sources =
            responsibilities.flatMap(
                item =>
                    Array.isArray(item?.sources)
                        ? item.sources
                        : []
            );

        const evidenceChain =
            responsibilities.map(
                item => ({

                    definition:
                        item?.definition,

                    evidenceCount:
                        Number(
                            item?.evidenceCount || 0
                        ),

                    verifiedEvidenceCount:
                        Number(
                            item?.verifiedEvidenceCount || 0
                        ),

                    sourceCount:
                        Number(
                            item?.sourceCount || 0
                        ),

                    verifiedSourceCount:
                        Number(
                            item?.verifiedSourceCount || 0
                        ),

                    verificationStatus:
                        item?.verificationStatus ||
                        item?.epistemicState ||
                        "UNKNOWN",

                    supported:
                        item?.supported === true,

                    responsibilityBoundary:
                        item?.responsibilityBoundary ||
                        {}

                })
            );

        const language =
            this.runtimeObject.semanticObject?.languageSystem ??
            null;

        const originalExpression =
            typeof this.runtimeObject.semanticObject?.originalContent === "string"
                ? this.runtimeObject.semanticObject.originalContent.trim()
                : String(
                    this.runtimeObject.semanticObject?.originalContent ??
                    ""
                ).trim();

        const finalState =
            this.deriveReconstructionState(
                responsibilities
            );

        const reconstructedExpression =
            this.reconstructExpression(
                originalExpression,
                finalState,
                responsibilities
            );

        return {

            originalExpression,

            reconstructedExpression,

            language,

            reconstructionState:
                finalState,

            responsibilityChain:
                responsibilities,

            responsibilityCount:
                responsibilities.length,

            evidenceChain,

            sources,

            sourceCount:
                sources.length,

            boundaries: {

                evidence:
                    "preserved",

                source:
                    "preserved",

                responsibility:
                    "preserved",

                language:
                    "externally-supplied-and-preserved",

                publication:
                    "responsibility-bound"

            },

            expansion:
                false,

            sourceExpansion:
                false,

            evidenceExpansion:
                false,

            reconstructionType:
                "responsibility-aware-expression-reconstruction",

            verificationStatus:
                this.calculateVerificationStatus(
                    finalState
                ),

            publishable:
                finalState === "SUPPORTED",

            runtimeTrace:
                this.runtimeObject.runtimeTrace || [],

            engineRegistry:
                this.runtimeObject.engineRegistry?.describe?.() || []

        };

    }


    deriveReconstructionState(
        responsibilities
    ) {

        if (
            responsibilities.length === 0
        ) {

            return "UNKNOWN";

        }

        const states =
            responsibilities.map(
                item =>
                    item?.verificationStatus ||
                    item?.epistemicState ||
                    "UNKNOWN"
            );

        /*
         * =========================================================
         * EPISTEMIC STATE MUST NOT BE OVERWRITTEN BY RESPONSIBILITY
         * BOUNDARY.
         *
         * responsibilityBoundary.status === "exceeded"
         * means the current evidence capacity is insufficient for
         * publication/responsibility.
         *
         * It does NOT mean that the epistemic state is UNKNOWN.
         *
         * Therefore reconstructionState is derived from the actual
         * verification state first, while publishability remains
         * responsibility-bound.
         * =========================================================
         */

        if (
            states.includes("CONTRADICTED")
        ) {

            return "CONTRADICTED";

        }

        const allSupported =
            responsibilities.every(
                item =>
                    item?.supported === true &&
                    (
                        item?.verificationStatus ===
                        "SUPPORTED" ||
                        item?.epistemicState ===
                        "SUPPORTED"
                    ) &&
                    item?.responsibilityBoundary?.status ===
                    "matched"
            );

        if (
            allSupported
        ) {

            return "SUPPORTED";

        }

        if (
            states.includes("VERIFIED_BUT_NOT_LINKED")
        ) {

            return "VERIFIED_BUT_NOT_LINKED";

        }

        if (
            states.includes("UNVERIFIED")
        ) {

            return "UNVERIFIED";

        }

        if (
            states.includes("PARTIAL") ||
            states.includes("UNRESOLVED")
        ) {

            return "UNVERIFIED";

        }

        return "UNKNOWN";

    }


    reconstructExpression(
        originalExpression,
        state,
        responsibilities
    ) {

        const original =
            typeof originalExpression === "string"
                ? originalExpression.trim()
                : String(
                    originalExpression ?? ""
                ).trim();

        if (
            original.length === 0
        ) {

            return "";

        }

        /*
         * SUPPORTED：
         *
         * 责任链已经明确允许承担，
         * 因此不再人为修改原表达。
         */

        if (
            state === "SUPPORTED"
        ) {

            return original;

        }


        /*
         * CONTRADICTED：
         *
         * 不制造反事实，
         * 不把原文修改成另一个未经验证的事实。
         */

        if (
            state === "CONTRADICTED"
        ) {

            return (
                "经当前核验，原表达与已获得的核验结果存在冲突，" +
                "因此不能作为已经成立的事实直接发布。\n\n" +
                original
            );

        }


        /*
         * VERIFIED_BUT_NOT_LINKED：
         *
         * 来源本身已经得到验证，但 Runtime 尚未建立
         * 该来源与当前定义之间的支持关系。
         *
         * 因此不能发布，但也不能错误地降级为 UNKNOWN。
         */

        if (
            state === "VERIFIED_BUT_NOT_LINKED"
        ) {

            return (
                "当前已有经过验证的来源，但尚未证明其支持下述表达。" +
                "因此该表达目前不能作为已经获得证据支持的事实发布。" +
                "\n\n" +
                original
            );

        }


        /*
         * UNVERIFIED：
         *
         * 保留原始内容，同时明确其认识地位。
         */

        if (
            state === "UNVERIFIED"
        ) {

            return (
                "当前核验尚不足以支持将下述内容作为已经确认的事实发布。" +
                "以下内容应作为待核实表达处理：\n\n" +
                original
            );

        }


        /*
         * UNKNOWN：
         *
         * Runtime 无法建立明确的认识状态。
         */

        return (
            "当前运行尚不足以确定下述表达的认识状态，" +
            "因此不能作为已经确认的事实直接发布。\n\n" +
            original
        );

    }


    calculateVerificationStatus(
        state
    ) {

        if (
            state === "SUPPORTED"
        ) {

            return "SUPPORTED";

        }

        if (
            state === "CONTRADICTED"
        ) {

            return "CONTRADICTED";

        }

        if (
            state === "VERIFIED_BUT_NOT_LINKED"
        ) {

            return "VERIFIED_BUT_NOT_LINKED";

        }

        if (
            state === "UNVERIFIED"
        ) {

            return "UNVERIFIED";

        }

        return "UNKNOWN";

    }

}

export default ReconstructionEngine;
