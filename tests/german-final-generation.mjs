import HonestRuntime from "../runtime/HonestRuntime.js";

const expression = `Obwohl es gestern stark geregnet hat, wird die Natur, die von uns tief geliebt worden ist, denjenigen Hoffnung schenken, die tapfer sind, wenn sie morgen ihre Geheimnisse offenbart. Glaube an dich selbst, denn nur Menschen, die den Sturm überstanden haben, können die wahre Bedeutung des Lebens verstehen.`;

const runtime = new HonestRuntime(
    expression,
    {
        languageSystem: "de-DE",

        evidence: [
            {
                source: "https://example.com/verified-german-support",
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
