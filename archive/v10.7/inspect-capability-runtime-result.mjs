import HonestRuntime from "./HonestRuntime.js";
import CapabilityContract from "./CapabilityContract.js";

const adapter = {

    name:
        "TestCapabilityProvider",

    version:
        "1.0",

    async search(keyword) {

        const capability =
            CapabilityContract.createResponse({

                capability:
                    "external-information-discovery",

                provider:
                    "TestCapabilityProvider",

                providerVersion:
                    "1.0",

                status:
                    "completed",

                output:
                    {
                        keyword,
                        message:
                            "这是外部能力提供的发现结果，不是验证结论。"
                    },

                sources: [
                    {
                        id:
                            "test-source-001",

                        title:
                            "Capability Test Source",

                        url:
                            "https://example.com/test-source",

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
                "completed",

            sources:
                capability.sources,

            capability

        };

    }

};

const runtime =
    new HonestRuntime(

        "测试一个外部 Capability 是否能够进入勿问 Runtime",

        {
            externalSearchAdapter:
                adapter
        }

    );

const result =
    await runtime.run();


const inspect =
    value => {

        if (
            value === null ||
            value === undefined
        ) {

            return null;

        }

        if (
            Array.isArray(value)
        ) {

            return {
                type:
                    "array",

                length:
                    value.length
            };

        }

        if (
            typeof value === "object"
        ) {

            return {
                type:
                    "object",

                keys:
                    Object.keys(value)
            };

        }

        return {

            type:
                typeof value,

            value

        };

    };


console.log(
    JSON.stringify(

        {

            resultType:
                typeof result,

            resultKeys:
                result &&
                typeof result === "object"
                    ? Object.keys(result)
                    : [],

            status:
                inspect(result?.status),

            semanticObject:
                inspect(result?.semanticObject),

            engines:
                inspect(result?.engines),

            pipeline:
                inspect(result?.pipeline),

            runtimeTrace:
                inspect(result?.runtimeTrace),

            runtimeContext:
                inspect(result?.runtimeContext),

            runtimeResult:
                inspect(result?.runtimeResult)

        },

        null,

        2

    )
);
