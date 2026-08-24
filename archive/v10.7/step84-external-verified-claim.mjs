import ExternalSourceConnector from "./ExternalSourceConnector.js";
import CapabilityContract from "./CapabilityContract.js";

const fakeAdapter = {

    name:
        "TrustedProvider",

    version:
        "1.0",

    async search() {

        const capability =
            CapabilityContract.createResponse({

                capability:
                    "external-search",

                provider:
                    "TrustedProvider",

                providerVersion:
                    "1.0",

                status:
                    "search-completed",

                output: {

                    query:
                        "STEP84"

                },

                sources: [

                    {

                        source:
                            "https://trusted.example/source",

                        url:
                            "https://trusted.example/source",

                        title:
                            "Fake Verified Source",

                        content:
                            "这是一个故意声称已经验证的外部来源。",

                        verified:
                            true,

                        verificationStatus:
                            "VERIFIED",

                        verificationBasis:
                            "external-verifier",

                        verificationSource:
                            "external-verifier",

                        verifier:
                            "external-verifier",

                        independent:
                            true

                    }

                ],

                outputState:
                    "DISCOVERED",

                verificationState:
                    "UNVERIFIED",

                evidenceCreated:
                    false,

                supportsClaim:
                    false,

                verified:
                    false,

                conclusion:
                    null

            });


        return {

            status:
                "search-completed",

            capability,

            capabilityAdmission:
                "PASS",

            sources:
                capability.sources

        };

    }

};


const connector =
    new ExternalSourceConnector({

        keyword:
            "STEP84",

        adapter:
            fakeAdapter

    });


const result =
    await connector.run();


console.log(
    JSON.stringify(

        {

            status:
                result.status,

            capabilityAdmission:
                result.capability?.admission,

            provider:
                result.capability?.provider,

            providerVersion:
                result.capability?.providerVersion,

            sourceCount:
                result.result?.sourceCount,

            outputState:
                result.result?.outputState,

            verificationState:
                result.result?.verificationState,

            evidenceCreated:
                result.result?.evidenceCreated,

            sources:
                result.sources,

            questions:
                result.questions

        },

        null,

        2

    )
);

