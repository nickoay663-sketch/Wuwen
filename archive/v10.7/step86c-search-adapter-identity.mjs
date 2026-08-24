import SearchEngine from "./SearchEngine.js";

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


const semanticObject = {

    originalContent:
        "这是一个需要验证的事实",

    externalSearchAdapter:
        fakeAdapter,

    externalSearchAdapterOptions:
        {}

};


const engine =
    new SearchEngine(
        semanticObject
    );


console.log(
    "\n=== STEP 86C: SEARCH ENGINE ADAPTER IDENTITY ==="
);


console.log(
    JSON.stringify(

        {

            semanticAdapter: {

                exists:
                    !!semanticObject.externalSearchAdapter,

                name:
                    semanticObject.externalSearchAdapter?.name ||
                    null,

                version:
                    semanticObject.externalSearchAdapter?.version ||
                    null,

                searchFunction:
                    typeof semanticObject.externalSearchAdapter?.search ===
                    "function"

            },

            engineSemanticAdapter: {

                exists:
                    !!engine.semanticObject.externalSearchAdapter,

                name:
                    engine.semanticObject.externalSearchAdapter?.name ||
                    null,

                version:
                    engine.semanticObject.externalSearchAdapter?.version ||
                    null,

                searchFunction:
                    typeof engine.semanticObject.externalSearchAdapter?.search ===
                    "function"

            }

        },

        null,

        2

    )
);


const result =
    await engine.execute();


console.log(
    JSON.stringify(

        {

            status:
                result.status,

            capabilityAdmission:
                result.capabilityAdmission,

            capability:
                result.capability,

            sourceCount:
                result.sources?.length || 0,

            questions:
                result.questions || []

        },

        null,

        2

    )
);

