import ExternalSourceConnector from "./ExternalSourceConnector.js";

const connector =
    new ExternalSourceConnector({

        keyword:
            "Wuwen capability positive test",

        adapter: {

            name:
                "TestExternalSearchAdapter",

            version:
                "TEST-1.0",

            async search() {

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
                                "External discovery test",

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
        result,
        null,
        2
    )
);
