import ExternalSearchAdapter from "./ExternalSearchAdapter.js";
import ExternalSourceConnector from "./ExternalSourceConnector.js";

const adapter =
    new ExternalSearchAdapter({

        name:
            "TestExternalSearchAdapter",

        enabled:
            true,

        provider:
            async (query) => {

                return {

                    status:
                        "provider-success",

                    sources: [

                        {

                            source:
                                "test://external-source",

                            url:
                                "test://external-source",

                            title:
                                "External Capability Boundary Test",

                            content:
                                `External discovery for: ${query}`,

                            verified:
                                true,

                            verificationStatus:
                                "VERIFIED",

                            verificationBasis:
                                "EXTERNAL_TEST_CLAIM",

                            verifier:
                                "ExternalTestProvider"

                        }

                    ]

                };

            }

    });


const connector =
    new ExternalSourceConnector({

        keyword:
            "Wuwen real adapter positive test",

        adapter

    });


const result =
    await connector.run();


console.log(
    JSON.stringify(
        {

            status:
                result.status,

            capabilityAdmission:
                result.capabilityAdmission,

            sourceCount:
                result.sources?.length || 0,

            outputState:
                result.result?.outputState,

            verificationState:
                result.result?.verificationState,

            evidenceCreated:
                result.result?.evidenceCreated,

            source:
                result.sources?.[0]
                    ? {

                        externalVerificationClaim:
                            result.sources[0]
                                .externalVerificationClaim,

                        externalVerificationBasis:
                            result.sources[0]
                                .externalVerificationBasis,

                        verified:
                            result.sources[0]
                                .verified,

                        verificationStatus:
                            result.sources[0]
                                .verificationStatus,

                        verificationBasis:
                            result.sources[0]
                                .verificationBasis,

                        verificationSource:
                            result.sources[0]
                                .verificationSource,

                        verifier:
                            result.sources[0]
                                .verifier,

                        runtimeVerificationRecord:
                            result.sources[0]
                                .runtimeVerificationRecord,

                        supportsClaim:
                            result.sources[0]
                                .supportsClaim,

                        state:
                            result.sources[0]
                                .state,

                        epistemicState:
                            result.sources[0]
                                .epistemicState

                    }
                    : null,

            trace:
                result.trace

        },

        null,

        2

    )
);
