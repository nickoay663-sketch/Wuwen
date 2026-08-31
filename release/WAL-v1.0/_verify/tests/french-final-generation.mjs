import HonestRuntime from "../runtime/HonestRuntime.js";

const expression = `Bien qu'il ait plu abondamment hier, la nature, qui a été profondément aimée par nous, offrira de l'espoir à ceux qui sont courageux si elle révèle ses secrets demain. Crois en toi-même, car seules les personnes qui ont traversé la tempête peuvent comprendre le vrai sens de la vie.`;

const runtime = new HonestRuntime(
    expression,
    {
        languageSystem: "fr-FR",

        evidence: [
            {
                source: "https://example.com/verified-french-support",
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
                result?.semanticObject
                    ?.languageAdapter
                    ?.connected,

            reconstructionState:
                result?.reconstruction
                    ?.reconstruction
                    ?.reconstructionState,

            verificationStatus:
                result?.generator
                    ?.report
                    ?.verificationStatus,

            publishable:
                result?.generator
                    ?.report
                    ?.publishable,

            publishableText:
                result?.generator
                    ?.publishableText,

            selfCheck:
                result?.selfCheck
                    ?.result
                    ?.passed === true,

            responsibilityEventPublishable:
                result?.responsibilityEventPublishable
        },
        null,
        2
    )
);
