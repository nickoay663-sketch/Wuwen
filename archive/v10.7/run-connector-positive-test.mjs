import ExternalSourceConnector from "./ExternalSourceConnector.js";

const connector =
    new ExternalSourceConnector({

        keyword:
            "MoWen capability positive test",

        adapter: {

            name:
                "TestExternalSearchAdapter",

            version:
                "TEST-1.0",

            async search(query) {

                return {

                    status:
                        "search-completed",

                    sources: [

                        {

                            source:
                                "test://external-source",

                            url:
                                "test://external-source",

                            title:
                                "Capability Positive Test",

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

                    ],

                    capability: {

                        contract:
                            "CapabilityContract",

                        contractVersion:
                            "1.0",

                        capability:
                            "external-search",

                        provider:
                            "TestExternalSearchAdapter",

                        providerVersion:
                            "TEST-1.0",

                        admission:
                            "PASS"

                    },

                    capabilityAdmission:
                        "PASS"

                };

            }

        }

    });


const result =
    await connector.run();


console.log(
    JSON.stringify(
        {

            status:
                result.status,

            sourceCount:
                Array.isArray(result.sources)
                    ? result.sources.length
                    : 0,

            capabilityAdmission:
                result.capabilityAdmission,

            outputState:
                result.result?.outputState,

            verificationState:
                result.result?.verificationState,

            evidenceCreated:
                result.result?.evidenceCreated,

            sourceRuntimeVerificationRecord:
                result.sources?.[0]?.runtimeVerificationRecord,

            sourceVerificationStatus:
                result.sources?.[0]?.verificationStatus,

            sourceVerified:
                result.sources?.[0]?.verified,

            externalVerificationClaim:
                result.sources?.[0]?.externalVerificationClaim,

            supportsClaim:
                result.sources?.[0]?.supportsClaim

        },

        null,

        2

    )

);
