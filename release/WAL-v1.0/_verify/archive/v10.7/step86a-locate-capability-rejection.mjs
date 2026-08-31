import HonestRuntime from "./HonestRuntime.js";

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


const runtime =
    new HonestRuntime({

        externalSearchAdapter:
            fakeAdapter

    });


const result =
    await runtime.run(
        "这是一个需要验证的事实"
    );


const search =
    result.search || {};


console.log(
    "\n=== STEP 86A: LOCATE FULL RUNTIME CAPABILITY REJECTION ==="
);


console.log(
    JSON.stringify(

        {

            searchStatus:
                search.status || null,

            capabilityAdmission:
                search.capabilityAdmission || null,

            capability:
                search.capability
                    ? {

                        contract:
                            search.capability.contract ||
                            null,

                        contractVersion:
                            search.capability.contractVersion ||
                            null,

                        capability:
                            search.capability.capability ||
                            null,

                        provider:
                            search.capability.provider ||
                            null,

                        providerVersion:
                            search.capability.providerVersion ||
                            null,

                        admission:
                            search.capability.admission ||
                            null,

                        status:
                            search.capability.status ||
                            null,

                        errors:
                            search.capability.errors ||
                            []

                    }
                    : null,

            questions:
                Array.isArray(search.questions)
                    ? search.questions
                    : [],

            trace:
                Array.isArray(search.trace)
                    ? search.trace
                    : [],

            sourceCount:
                Array.isArray(search.sources)
                    ? search.sources.length
                    : 0,

            sources:
                Array.isArray(search.sources)
                    ? search.sources.map(
                        source => ({

                            source:
                                source.source ||
                                source.url ||
                                null,

                            externalVerificationClaim:
                                source.externalVerificationClaim === true,

                            verificationStatus:
                                source.verificationStatus ||
                                null,

                            verified:
                                source.verified === true

                        })
                    )
                    : []

        },

        null,

        2

    )
);
