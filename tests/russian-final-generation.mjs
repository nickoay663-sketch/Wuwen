import HonestRuntime from "../runtime/HonestRuntime.js";

const expression = `Хотя вчера шёл сильный дождь, природа, которая была глубоко любима нами, подарит надежду тем, кто храбр, если завтра она откроет свои тайны. Верь в себя, потому что только люди, перенёсшие шторм, могут поистине понять истинный смысл жизни.`;

const runtime = new HonestRuntime(
    expression,
    {
        languageSystem: "ru-RU",

        evidence: [
            {
                source: "https://example.com/verified-russian-support",
                independent: true,
                verificationStatus: "VERIFIED",
                epistemicState: "VERIFIED",
                verificationBasis: "explicit-verification",
                runtimeVerificationRecord: true,
                sourceAvailable: true,
                supportsClaim: true
            }
        ]
    }
);

const result = await runtime.run();

console.log(
    JSON.stringify(
        {
            runtimeState:
                result?.metadata?.runtimeState,

            language:
                result?.semanticObject?.languageSystem,

            languageConnected:
                result
                    ?.semanticObject
                    ?.languageAdapter
                    ?.connected,

            reconstructionState:
                result
                    ?.reconstruction
                    ?.reconstruction
                    ?.reconstructionState,

            verificationStatus:
                result
                    ?.generator
                    ?.report
                    ?.verificationStatus,

            publishable:
                result
                    ?.generator
                    ?.report
                    ?.publishable,

            publishableText:
                result
                    ?.generator
                    ?.publishableText,

            selfCheck:
                result
                    ?.selfCheck
                    ?.result
                    ?.passed === true,

            responsibilityEventPublishable:
                result
                    ?.responsibilityEventPublishable
        },
        null,
        2
    )
);
