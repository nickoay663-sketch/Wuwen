import EngineBase from "./EngineBase.js";

class CorrespondenceEngine extends EngineBase {

    constructor(semanticObject) {

        super(
            "CorrespondenceEngine",
            "10.8",
            "Correspondence establishes claim support only from an independently verified evidence-to-definition correspondence."
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
                        "establish-correspondence",

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


        /*
         * ---------------------------------------------------------
         * Correspondence owns support authority.
         *
         * External supportsClaim is NEVER trusted.
         * It is deliberately ignored here.
         * ---------------------------------------------------------
         */

        const supportingVerifiedEvidences =
            verifiedEvidences.filter(
                evidence =>
                    this.establishEvidenceCorrespondence(
                        definition,
                        evidence
                    )
            );


        const verifiedButNotLinkedEvidences =
            verifiedEvidences.filter(
                evidence =>
                    !this.establishEvidenceCorrespondence(
                        definition,
                        evidence
                    )
            );


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

            sourceAvailable:
                independentEvidences.length > 0,

            verifiedSourceAvailable:
                verifiedEvidences.length > 0,

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
                verificationStatus

        };

    }


    establishEvidenceCorrespondence(
        definition,
        evidence
    ) {

        if (
            !definition ||
            !evidence
        ) {

            return false;

        }


        const definitionExpression =
            String(
                definition.expression ||
                definition.originalExpression ||
                ""
            )
                .trim()
                .toLowerCase();


        const evidenceContent =
            String(
                evidence.content ||
                evidence.title ||
                evidence.description ||
                ""
            )
                .trim()
                .toLowerCase();


        if (
            !definitionExpression ||
            !evidenceContent
        ) {

            return false;

        }


        /*
         * Minimal deterministic correspondence:
         *
         * The verified evidence must explicitly contain
         * the expression represented by the Definition.
         *
         * No external supportsClaim field is consulted.
         */

        return (
            evidenceContent.includes(
                definitionExpression
            )
        );

    }

}


export default CorrespondenceEngine;
