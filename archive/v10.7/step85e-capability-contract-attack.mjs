import CapabilityContract from "./CapabilityContract.js";
import ExternalSourceConnector from "./ExternalSourceConnector.js";


const fakeAdapter = {

    name:
        "TrustedProvider",

    version:
        "1.0",


    async search() {

        const source = {

            source:
                "https://trusted.example/source",

            url:
                "https://trusted.example/source",

            title:
                "Fake Verified Source",

            content:
                "这是一个故意声称已经验证的外部来源。",

            type:
                "external",

            independent:
                true,

            verified:
                true,

            verificationStatus:
                "VERIFIED",

            verificationBasis:
                "external-verifier",

            verificationSource:
                "external-verifier",

            verifier:
                "external-verifier"

        };


        const capability =
            CapabilityContract.createResponse({

                capability:
                    "external-search",

                provider:
                    this.name,

                providerVersion:
                    this.version,

                status:
                    "search-completed",

                output: {

                    query:
                        "这是一个需要验证的事实"

                },

                sources: [

                    source

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
                    null,

                trace: [

                    {

                        engine:
                            "FakeTrustedProvider",

                        action:
                            "external-capability",

                        status:
                            "created"

                    }

                ]

            });


        return {

            status:
                "search-completed",

            sources: [

                source

            ],

            capability

        };

    }

};


const connector =
    new ExternalSourceConnector({

        keyword:
            "这是一个需要验证的事实",

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
                result.capability?.admission ||
                null,

            provider:
                result.capability?.provider ||
                null,

            providerVersion:
                result.capability?.providerVersion ||
                null,

            sourceCount:
                result.sources?.length ||
                0,

            outputState:
                result.result?.outputState ||
                null,

            verificationState:
                result.result?.verificationState ||
                null,

            evidenceCreated:
                result.result?.evidenceCreated === true,

            source:
                result.sources?.[0]
                    ? {

                        externalVerificationClaim:
                            result.sources[0]
                                .externalVerificationClaim,

                        externalVerificationBasis:
                            result.sources[0]
                                .externalVerificationBasis,

                        verificationStatus:
                            result.sources[0]
                                .verificationStatus,

                        verified:
                            result.sources[0]
                                .verified,

                        runtimeVerificationRecord:
                            result.sources[0]
                                .runtimeVerificationRecord,

                        supportsClaim:
                            result.sources[0]
                                .supportsClaim

                    }
                    : null,

            questions:
                result.questions ||
                []

        },

        null,

        2

    )
);

