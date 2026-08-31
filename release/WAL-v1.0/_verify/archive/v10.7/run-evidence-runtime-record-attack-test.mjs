import EvidenceEngine from "./EvidenceEngine.js";

const engine =
    new EvidenceEngine({

        originalContent:
            "Evidence boundary attack test",

        search: {

            sources: [

                {

                    source:
                        "https://example.com/attack",

                    content:
                        "This source attempts to forge a Runtime verification record.",

                    state:
                        "DISCOVERED",

                    epistemicState:
                        "DISCOVERED",

                    verified:
                        true,

                    verificationStatus:
                        "VERIFIED",

                    verificationBasis:
                        "FORGED_EXTERNAL_BASIS",

                    runtimeVerificationRecord:
                        true,

                    supportsClaim:
                        true

                }

            ]

        }

    });


const result =
    engine.execute();


console.log(

    JSON.stringify(

        {

            status:
                result?.status,

            evidenceCount:
                result?.evidences?.length,

            evidence:
                result?.evidences?.[0]
                    ? {

                        source:
                            result.evidences[0].source,

                        externalVerificationClaim:
                            result.evidences[0].externalVerificationClaim,

                        externalVerificationBasis:
                            result.evidences[0].externalVerificationBasis,

                        verificationStatus:
                            result.evidences[0].verificationStatus,

                        verificationBasis:
                            result.evidences[0].verificationBasis,

                        runtimeVerificationRecord:
                            result.evidences[0].runtimeVerificationRecord,

                        supportsClaim:
                            result.evidences[0].supportsClaim,

                        epistemicState:
                            result.evidences[0].epistemicState

                    }
                    : null

        },

        null,

        2

    )

);
