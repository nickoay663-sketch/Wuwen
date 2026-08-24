import HonestRuntime from "./HonestRuntime.js";
import CapabilityContract from "./CapabilityContract.js";

const adapter = {

    name: "TestCapabilityProvider",
    version: "1.0",

    async search(keyword) {

        return {

            status: "completed",

            sources: [

                {
                    id: "test-source-001",
                    title: "Capability Test Source",
                    url: "https://example.com/test-source",
                    independent: true
                }

            ],

            capability:
                CapabilityContract.createResponse({

                    capability:
                        "external-information-discovery",

                    provider:
                        "TestCapabilityProvider",

                    providerVersion:
                        "1.0",

                    output:
                        {
                            keyword
                        },

                    sources: [

                        {
                            id: "test-source-001",
                            title: "Capability Test Source",
                            url: "https://example.com/test-source",
                            independent: true
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
                        false

                })

        };

    }

};


const result =
    await new HonestRuntime(

        "测试外部 Capability",

        {
            externalSearchAdapter:
                adapter
        }

    ).run();


function inspect(name, value) {

    console.log(
        `\n=== ${name} ===`
    );

    console.log(
        "type:",
        typeof value
    );

    if (
        value &&
        typeof value === "object"
    ) {

        console.log(
            "keys:",
            Object.keys(value)
        );

        for (
            const key of Object.keys(value)
        ) {

            const item =
                value[key];

            if (
                item === null
            ) {

                console.log(
                    `${key}: null`
                );

            } else if (
                Array.isArray(item)
            ) {

                console.log(
                    `${key}: Array(${item.length})`
                );

            } else if (
                typeof item === "object"
            ) {

                console.log(
                    `${key}: Object`,
                    Object.keys(item).slice(0, 30)
                );

            } else {

                console.log(
                    `${key}:`,
                    item
                );

            }

        }

    }

}


inspect(
    "result.search",
    result.search
);

inspect(
    "result.evidence",
    result.evidence
);

inspect(
    "result.reasoning",
    result.reasoning
);

inspect(
    "result.selfCheck",
    result.selfCheck
);

inspect(
    "result.semanticObject",
    result.semanticObject
);
