import EngineBase from "./EngineBase.js";

class CorrespondenceEngine extends EngineBase {

    constructor(semanticObject) {

        super(
            "CorrespondenceEngine",
            "10.7",
            "莫问判断定义、证据与表达之间的真实对应关系，不把发现、未验证或仅已验证但未建立对应关系的证据扩大为支持。"
        );

        this.semanticObject =
            semanticObject || {};

    }


    execute() {

        const correspondences =
            this.buildCorrespondences();

        const supportedCount =
            correspondences.filter(
                item =>
                    item.supported === true &&
                    item.verificationStatus === "SUPPORTED"
            ).length;

        const unverifiedCount =
            correspondences.filter(
                item =>
                    item.verificationStatus === "UNVERIFIED"
            ).length;

        const verifiedButNotLinkedCount =
            correspondences.filter(
                item =>
                    item.verificationStatus ===
                    "VERIFIED_BUT_NOT_LINKED"
            ).length;

        const unknownCount =
            correspondences.filter(
                item =>
                    item.verificationStatus === "UNKNOWN"
            ).length;


        return this.result({

            status:
                correspondences.length > 0
                    ? "correspondence-evaluated"
                    : "need-correspondence",

            metadata:
                this.metadata({

                    correspondenceCount:
                        correspondences.length,

                    supportedCount,

                    unverifiedCount,

                    verifiedButNotLinkedCount,

                    unknownCount

                }),

            correspondences,

            result: {

                correspondences,

                epistemicBoundary: {

                    supportedCount,

                    unverifiedCount,

                    verifiedButNotLinkedCount,

                    unknownCount

                }

            },

            trace: [

                {

                    engine:
                        "CorrespondenceEngine",

                    action:
                        "check",

                    status:
                        "completed"

                }

            ],

            questions:
                correspondences.some(
                    item =>
                        item.verificationStatus !==
                        "SUPPORTED"
                )
                    ? [
                        "definition-evidence correspondence verification required"
                    ]
                    : [],

            nextRuntimeState:
                "ReasoningEngine"

        });

    }


    buildCorrespondences() {

        const definitions =
            Array.isArray(
                this.semanticObject.definitions
            )
                ? this.semanticObject.definitions
                : [];


        const evidences =
            Array.isArray(
                this.semanticObject.evidences
            )
                ? this.semanticObject.evidences
                : [];


        if (
            definitions.length === 0
        ) {

            return [];

        }


        return definitions.map(
            definition =>
                this.buildCorrespondence(
                    definition,
                    evidences
                )
        );

    }


    buildCorrespondence(
        definition,
        evidences
    ) {

        const independentEvidences =
            evidences.filter(
                evidence =>
                    evidence &&
                    evidence.independent === true
            );


        /*
         * =========================================================
         * CORRESPONDENCE BOUNDARY v10.7
         * =========================================================
         *
         * EvidenceEngine 已经完成第一道边界：
         *
         *   DISCOVERED / UNVERIFIED
         *       ≠
         *   VERIFIED
         *
         * CorrespondenceEngine 再完成第二道边界：
         *
         *   VERIFIED
         *       ≠
         *   SUPPORTED
         *
         * VERIFIED 只能说明 Runtime 存在可识别的验证记录。
         *
         * 只有：
         *
         *   1. independent === true
         *   2. verificationStatus === VERIFIED
         *   3. epistemicState === VERIFIED
         *   4. supportsClaim === true
         *
         * 才能建立当前 Definition 的 SUPPORTED。
         *
         * =========================================================
         */

        const verifiedEvidences =
            independentEvidences.filter(
                evidence =>
                    evidence.verificationStatus ===
                        "VERIFIED" &&
                    evidence.epistemicState ===
                        "VERIFIED" &&
                    evidence.runtimeVerificationRecord ===
                        true &&
                    evidence.sourceAvailable ===
                        true
            );


        const unverifiedEvidences =
            independentEvidences.filter(
                evidence =>
                    evidence.verificationStatus ===
                        "UNVERIFIED" ||
                    evidence.epistemicState ===
                        "DISCOVERED"
            );


        const verifiedButNotLinkedEvidences =
            verifiedEvidences.filter(
                evidence =>
                    evidence.supportsClaim !== true
            );


        const supportingVerifiedEvidences =
            verifiedEvidences.filter(
                evidence =>
                    evidence.supportsClaim === true
            );


        const sourceAvailable =
            independentEvidences.length > 0;


        const verifiedSourceAvailable =
            verifiedEvidences.length > 0;


        const supported =
            supportingVerifiedEvidences.length > 0;


        let verificationStatus =
            "UNKNOWN";


        if (
            supported
        ) {

            verificationStatus =
                "SUPPORTED";

        } else if (
            unverifiedEvidences.length > 0
        ) {

            verificationStatus =
                "UNVERIFIED";

        } else if (
            verifiedButNotLinkedEvidences.length > 0
        ) {

            verificationStatus =
                "VERIFIED_BUT_NOT_LINKED";

        } else if (
            verifiedEvidences.length > 0
        ) {

            verificationStatus =
                "VERIFIED_BUT_NOT_LINKED";

        }


        /*
         * SUPPORTED 是 CorrespondenceEngine 自己建立的关系结果，
         * 不是 EvidenceEngine 提供的事实字段。
         */

        const epistemicState =
            verificationStatus;


        return {

            definitionCount:
                1,

            evidenceCount:
                independentEvidences.length,

            verifiedEvidenceCount:
                verifiedEvidences.length,

            supportingVerifiedEvidenceCount:
                supportingVerifiedEvidences.length,

            unverifiedEvidenceCount:
                unverifiedEvidences.length,

            verifiedButNotLinkedEvidenceCount:
                verifiedButNotLinkedEvidences.length,

            matched:
                supported,

            supported,

            sourceAvailable,

            verifiedSourceAvailable,

            sourceCount:
                independentEvidences.length,

            verificationStatus,

            epistemicState,

            definition,

            evidences:
                independentEvidences,

            verifiedEvidences,

            supportingVerifiedEvidences,

            unverifiedEvidences,

            verifiedButNotLinkedEvidences,

            responsibilityBoundary:
                supported
                    ? "SUPPORTED"
                    : "NOT_SUPPORTED",

            knowledgeBoundary:
                supported
                    ? "VERIFIED_SUPPORT"
                    : "UNKNOWN_OR_UNVERIFIED"

        };

    }

}


export default CorrespondenceEngine;
