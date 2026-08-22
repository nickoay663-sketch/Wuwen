import HonestRuntime from "../runtime/HonestRuntime.js";

const languages = [
    {
        code: "es-ES",
        text: "La naturaleza ofrece esperanza a quienes son valientes."
    },
    {
        code: "ru-RU",
        text: "Природа дарит надежду тем, кто храбр."
    },
    {
        code: "it-IT",
        text: "La natura offre speranza a coloro che sono coraggiosi."
    },
    {
        code: "de-DE",
        text: "Die Natur schenkt denjenigen Hoffnung, die mutig sind."
    },
    {
        code: "fr-FR",
        text: "La nature offre de l'espoir à ceux qui sont courageux."
    }
];

const evidenceCases = [
    {
        name: "SUPPORTED",
        evidence: {
            source: "https://example.com/verified-support",
            independent: true,
            verificationStatus: "VERIFIED",
            epistemicState: "VERIFIED",
            verificationBasis: "explicit-verification",
            runtimeVerificationRecord: true,
            sourceAvailable: true,
            supportsClaim: true
        },
        expected: {
            verificationStatus: "SUPPORTED",
            reconstructionState: "SUPPORTED",
            publishable: true
        }
    },

    {
        name: "VERIFIED_BUT_NOT_LINKED",
        evidence: {
            source: "https://example.com/verified-not-linked",
            independent: true,
            verificationStatus: "VERIFIED",
            epistemicState: "VERIFIED",
            verificationBasis: "explicit-verification",
            runtimeVerificationRecord: true,
            sourceAvailable: true,
            supportsClaim: false
        },
        expected: {
            verificationStatus: "VERIFIED_BUT_NOT_LINKED",
            reconstructionState: "VERIFIED_BUT_NOT_LINKED",
            publishable: false
        }
    },

    {
        name: "UNVERIFIED",
        evidence: {
            source: "https://example.com/unverified",
            independent: true,
            verificationStatus: "UNVERIFIED",
            epistemicState: "DISCOVERED",
            verificationBasis: "discovery-only",
            runtimeVerificationRecord: false,
            sourceAvailable: true,
            supportsClaim: false
        },
        expected: {
            verificationStatus: "UNVERIFIED",
            reconstructionState: "UNVERIFIED",
            publishable: false
        }
    }
];

const results = [];

for (const language of languages) {

    for (const testCase of evidenceCases) {

        const runtime =
            new HonestRuntime(
                language.text,
                {
                    languageSystem:
                        language.code,

                    evidence: [
                        testCase.evidence
                    ]
                }
            );

        const result =
            await runtime.run();

        const rr =
            result;

        const languageBoundary =
            rr?.selfCheck
                ?.languageBoundaryReport ||
            rr?.selfCheck
                ?.result
                ?.languageBoundaryReport ||
            null;

        const verificationStatus =
            rr?.generator
                ?.report
                ?.verificationStatus;

        const reconstructionState =
            rr?.reconstruction
                ?.reconstruction
                ?.reconstructionState;

        const publishable =
            rr?.generator
                ?.report
                ?.publishable;

        const checks = {

            runtimeClosed:
                rr?.metadata?.runtimeState ===
                "RuntimeClosed",

            languageMatches:
                rr?.semanticObject?.languageSystem ===
                language.code,

            languageConnected:
                rr?.semanticObject
                    ?.languageAdapter
                    ?.connected === true,

            identityPreserved:
                languageBoundary
                    ?.identityPreserved === true,

            runtimeDoesNotOwnLanguage:
                languageBoundary
                    ?.runtimeOwnsLanguage === false,

            runtimeDoesNotCreateLanguage:
                languageBoundary
                    ?.runtimeCreatesLanguage === false,

            runtimeDoesNotInterpretLanguage:
                languageBoundary
                    ?.runtimeInterpretsLanguage === false,

            verificationMatches:
                verificationStatus ===
                testCase.expected.verificationStatus,

            reconstructionMatches:
                reconstructionState ===
                testCase.expected.reconstructionState,

            publishabilityMatches:
                publishable ===
                testCase.expected.publishable,

            selfCheckPassed:
                rr?.selfCheck
                    ?.result
                    ?.passed === true,

            responsibilityEventConsistent:
                rr?.responsibilityEventPublishable ===
                testCase.expected.publishable
        };

        const passed =
            Object.values(checks)
                .every(Boolean);

        results.push({

            language:
                language.code,

            case:
                testCase.name,

            passed,

            checks,

            runtimeState:
                rr?.metadata?.runtimeState,

            verificationStatus,

            reconstructionState,

            publishable,

            publishableText:
                rr?.generator?.publishableText

        });
    }
}

const languageCount =
    languages.length;

const caseCount =
    evidenceCases.length;

const total =
    results.length;

const passedCount =
    results.filter(
        item =>
            item.passed === true
    ).length;

const failedCount =
    total -
    passedCount;

const passed =
    failedCount === 0;

console.log(
    JSON.stringify(
        {
            test:
                "MoWen Multi-Language Epistemic Regression",

            languageCount,

            languages:
                languages.map(
                    item =>
                        item.code
                ),

            evidenceCaseCount:
                caseCount,

            evidenceCases:
                evidenceCases.map(
                    item =>
                        item.name
                ),

            totalRuns:
                total,

            passedRuns:
                passedCount,

            failedRuns:
                failedCount,

            passed,

            results
        },
        null,
        2
    )
);

if (!passed) {

    console.error(
        "\nMoWen Multi-Language Epistemic Regression FAILED."
    );

    process.exit(1);
}

console.log(
    "\nMoWen Multi-Language Epistemic Regression Passed."
);
