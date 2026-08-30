import HonestRuntime from "../runtime/HonestRuntime.js";

const expression = `Sebbene ieri abbia piovuto fortemente, la natura, che è stata profondamente amata da noi, offrirà speranza a coloro che sono coraggiosi se domani rivelerà i suoi segreti. Credi in te stesso, perché solo le persone che hanno sopportato la tempesta possono capire il vero significato della vita.`;

const runtime = new HonestRuntime(
    expression,
    {
        languageSystem: "it-IT",

        evidence: [
            {
                source: "https://example.com/verified-italian-support",
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
