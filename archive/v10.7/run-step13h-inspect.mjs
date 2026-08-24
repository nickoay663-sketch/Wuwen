import HonestRuntime from "./HonestRuntime.js";

const runtime = new HonestRuntime(
    "这是一个已经被验证，但尚未建立有效对应关系的事实",
    {
        evidence: [
            {
                type: "external",
                source: "https://example.com/verified-but-not-linked",
                content: "这是一个已经被验证，但尚未建立有效对应关系的事实",
                origin: "step-13-test",
                independent: true,
                supportsClaim: true,

                runtimeVerification: true,
                runtimeVerificationRecord: true,

                verificationBasis:
                    "step-13-runtime-verification",

                correspondenceLinked: false,
                linkedToClaim: false
            }
        ]
    }
);

const result = await runtime.run();

console.log(
    JSON.stringify(
        {
            evidence:
                result.evidence,

            correspondence:
                result.correspondence,

            reasoning:
                result.reasoning,

            responsibility:
                result.responsibility,

            reconstruction:
                result.reconstruction,

            generator:
                result.generator,

            selfCheck:
                result.selfCheck?.result
        },
        null,
        2
    )
);
