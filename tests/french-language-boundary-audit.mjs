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
const rr = result;

const selfCheck =
    rr?.selfCheck || {};

const selfCheckResult =
    selfCheck?.result || {};

console.log(
    JSON.stringify(
        {
            runtimeState:
                rr?.metadata?.runtimeState,

            expectedLanguage:
                "fr-FR",

            rootLanguage:
                rr?.semanticObject?.languageSystem,

            languageConnected:
                rr?.semanticObject
                    ?.languageAdapter
                    ?.connected,

            selfCheckPassed:
                selfCheckResult?.passed === true,

            languageBoundaryReport:
                selfCheck?.languageBoundaryReport ??
                selfCheckResult?.languageBoundaryReport ??
                null,

            checks:
                selfCheck?.checks ??
                selfCheckResult?.checks ??
                null,

            auditTrail:
                selfCheck?.auditTrail ??
                selfCheckResult?.auditTrail ??
                null,

            failureExplanation:
                selfCheck?.failureExplanation ??
                selfCheckResult?.failureExplanation ??
                null
        },
        null,
        2
    )
);
