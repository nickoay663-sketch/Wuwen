import ExternalSourceConnector from "./ExternalSourceConnector.js";

const fakeAdapter = {

    name:
        "TrustedProvider",

    version:
        "1.0",

    async search() {

        return {

            status:
                "search-completed",

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

                }

            ]

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

            questions:
                result.questions ||
                []

        },

        null,

        2

    )
);

