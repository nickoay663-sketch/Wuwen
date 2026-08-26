import EngineBase from "./EngineBase.js";

class EvidenceEngine extends EngineBase {

    constructor(semanticObject) {

        super(
            "EvidenceEngine",
            "10.7",
            "莫问区分已发现、未验证与已验证：搜索发现可以保留为DISCOVERED，但没有可识别的Runtime验证行为时，不得提升为VERIFIED。"
        );

        this.semanticObject =
            semanticObject || {};

    }


    execute() {

        const evidences =
            this.buildEvidence();

        const verifiedCount =
            evidences.filter(
                item =>
                    item.verificationStatus === "VERIFIED"
            ).length;

        const unverifiedCount =
            evidences.filter(
                item =>
                    item.verificationStatus === "UNVERIFIED"
            ).length;

        const discoveredCount =
            evidences.filter(
                item =>
                    item.epistemicState === "DISCOVERED"
            ).length;


        return this.result({

            status:
                evidences.length > 0
                    ? "evidence-evaluated"
                    : "need-evidence",

            metadata:
                this.metadata({

                    evidenceCount:
                        evidences.length,

                    verifiedCount,

                    unverifiedCount,

                    discoveredCount

                }),

            evidences,

            result: {

                evidences,

                evidenceState: {

                    verifiedCount,

                    unverifiedCount,

                    discoveredCount

                }

            },

            trace: [

                {

                    engine:
                        "EvidenceEngine",

                    action:
                        "validate",

                    status:
                        evidences.length > 0
                            ? "completed"
                            : "no-evidence"

                }

            ],

            questions:
                evidences.length > 0
                    ? []
                    : [
                        "evidence verification required"
                    ],

            nextRuntimeState:
                "CorrespondenceEngine"

        });

    }


    buildEvidence() {

        const suppliedEvidence =
            this.semanticObject.evidence;

        const searchedSources =
            Array.isArray(
                this.semanticObject.search?.sources
            )
                ? this.semanticObject.search.sources
                : [];


        const candidates = [];


        if (Array.isArray(suppliedEvidence)) {

            for (const item of suppliedEvidence) {

                candidates.push({

                    ...item,

                    origin:
                        "supplied"

                });

            }

        }


        for (const source of searchedSources) {

            if (
                source &&
                typeof source === "object"
            ) {

                candidates.push({

                    ...source,

                    origin:
                        source.origin || "search"

                });

            }

        }


        return candidates

            .filter(
                item =>
                    item &&
                    typeof item === "object"
            )

            .map(
                item =>
                    this.normalizeEvidence(item)
            )

            .filter(
                item =>
                    item !== null
            );

    }


    normalizeEvidence(item) {

        const source =
            item.source ||
            item.url ||
            item.content ||
            "";

        const content =
            item.content ||
            "";


        if (!source && !content) {

            return null;

        }


        const expression =
            this.semanticObject.originalContent ||
            "";


        if (
            source === expression &&
            content === expression
        ) {

            return null;

        }


        /*
         * ---------------------------------------------------------
         * Evidence Boundary v10.7
         *
         * EvidenceEngine distinguishes:
         *
         *   DISCOVERED
         *   UNVERIFIED
         *   VERIFIED
         *
         * 外部来源可以声明自己已经 VERIFIED。
         *
         * 该声明必须被保留为：
         *
         *   externalVerificationClaim = true
         *
         * 但绝不能直接成为：
         *
         *   runtimeVerificationRecord = true
         *   verificationStatus = VERIFIED
         *
         * 因此：
         *
         *   保留外部声明
         *          ≠
         *   接受外部验证
         * ---------------------------------------------------------
         */


        const externallyClaimedVerified =
            item.externalVerificationClaim === true ||
            item.verified === true ||
            item.verificationStatus === "VERIFIED";


        const externalVerificationBasis =
            item.externalVerificationBasis ||
            item.verificationBasis ||
            item.verificationSource ||
            item.verifier ||
            null;


        /*
         * ---------------------------------------------------------
         * Runtime Verification Record
         *
         * 只有 Runtime 自己产生的验证记录，
         * 才允许进入 VERIFIED。
         *
         * 外部字段：
         *
         *   verified
         *   verificationStatus
         *   verificationBasis
         *
         * 本身都不是 Runtime Verification Record。
         * ---------------------------------------------------------
         */

        const runtimeVerificationRecord = false;


        const verificationStatus =
            runtimeVerificationRecord
                ? "VERIFIED"
                : "UNVERIFIED";


        /*
         * ---------------------------------------------------------
         * Epistemic State
         *
         * 搜索发现仍然保持 DISCOVERED。
         *
         * VERIFIED 只允许来自 Runtime Verification Record。
         * ---------------------------------------------------------
         */

        const epistemicState =
            item.epistemicState === "DISCOVERED" ||
                item.state === "DISCOVERED"
                ? "DISCOVERED"
                : verificationStatus === "VERIFIED"
                    ? "VERIFIED"
                    : "UNVERIFIED";


        return {

            type:
                item.type ||
                "external",

            source,

            content,

            origin:
                item.origin ||
                "supplied",

            epistemicState,

            verificationStatus,

            /*
             * Runtime verificationBasis 只在
             * Runtime Verification Record 存在时写入。
             */

            verificationBasis:
                runtimeVerificationRecord
                    ? (
                        item.verificationBasis ||
                        item.verificationSource ||
                        item.verifier ||
                        null
                    )
                    : null,

            /*
             * -----------------------------------------------------
             * External Claim Preservation
             *
             * 这是“外部曾经声称 VERIFIED”的事实，
             * 不是 Runtime 对该声明真实性的认可。
             * -----------------------------------------------------
             */

            externalVerificationClaim:
                externallyClaimedVerified,

            externalVerificationBasis,

            /*
             * -----------------------------------------------------
             * Runtime Verification Boundary
             * -----------------------------------------------------
             */

            runtimeVerification:
                item.runtimeVerification === true,

            runtimeVerificationRecord,

            independent:
                item.independent === true,

            sourceAvailable:
                !!source,

            supportsClaim:
                item.supportsClaim === true

        };

    }

}


export default EvidenceEngine;
