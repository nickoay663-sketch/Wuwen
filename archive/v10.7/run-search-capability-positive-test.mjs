import SearchEngine from "./SearchEngine.js";

const engine =
    new SearchEngine({

        originalContent:
            "MoWen external capability boundary test",

        externalSearchAdapterOptions: {

            enabled:
                true,

            name:
                "TestExternalSearchAdapter",

            provider:
                async () => ({

                    status:
                        "search-completed",

                    sources: [

                        {

                            source:
                                "https://example.com/test",

                            url:
                                "https://example.com/test",

                            title:
                                "External Test Source",

                            publisher:
                                "External Test",

                            content:
                                "This is an external discovery source.",

                            verified:
                                true,

                            verificationStatus:
                                "VERIFIED",

                            verificationBasis:
                                "EXTERNAL_TEST_CLAIM"

                        }

                    ]

                })

        }

    });


const result =
    await engine.execute();


console.log(

    JSON.stringify(

        {

            status:
                result?.status,

            sourceCount:
                result?.sources?.length,

            outputState:
                result?.outputState,

            verificationState:
                result?.verificationState,

            evidenceCreated:
                result?.evidenceCreated,

            capabilityAdmission:
                result?.capabilityAdmission,

            sources:
                result?.sources?.map(
                    source => ({

                        source:
                            source.source,

                        externalVerificationClaim:
                            source.externalVerificationClaim,

                        externalVerificationBasis:
                            source.externalVerificationBasis,

                        verified:
                            source.verified,

                        verificationStatus:
                            source.verificationStatus,

                        verificationBasis:
                            source.verificationBasis,

                        verificationSource:
                            source.verificationSource,

                        verifier:
                            source.verifier,

                        runtimeVerificationRecord:
                            source.runtimeVerificationRecord,

                        supportsClaim:
                            source.supportsClaim,

                        state:
                            source.state,

                        epistemicState:
                            source.epistemicState

                    })
                )

        },

        null,

        2

    )

);
