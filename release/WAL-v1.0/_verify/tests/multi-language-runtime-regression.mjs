import HonestRuntime from "../runtime/HonestRuntime.js";

const cases = [

    {
        name: "Spanish",
        language: "es-ES",
        expression:
            "¡Hola a todos! Hoy os hablo para que sepáis que aprender español es una aventura increíble. Ayer pensaba en lo mucho que he cambiado desde que empecé. Si me hubierais dicho hace un año que yo estaría aquí hablando frente a vosotros, no os habría creído. Aunque el camino haya sido difícil, se dice que quienes perseveran siempre lo logran. Mañana continuaré aprendiendo porque creo que todavía puedo mejorar."
    },

    {
        name: "Russian",
        language: "ru-RU",
        expression:
            "Хотя вчера шёл сильный дождь, природа, которая была глубоко любима нами, подарит надежду тем, кто храбр, если завтра она откроет свои тайны. Верь в себя, потому что только люди, перенёсшие шторм, могут поистине понять истинный смысл жизни."
    },

    {
        name: "Italian",
        language: "it-IT",
        expression:
            "Sebbene ieri abbia piovuto fortemente, la natura, che è stata profondamente amata da noi, offrirà speranza a coloro che sono coraggiosi se domani rivelerà i suoi segreti. Credi in te stesso, perché solo le persone che hanno sopportato la tempesta possono capire il vero significato della vita."
    },

    {
        name: "German",
        language: "de-DE",
        expression:
            "Obwohl es gestern stark geregnet hat, wird die Natur, die von uns tief geliebt worden ist, denjenigen Hoffnung schenken, die tapfer sind, wenn sie morgen ihre Geheimnisse offenbart. Glaube an dich selbst, denn nur Menschen, die den Sturm überstanden haben, können die wahre Bedeutung des Lebens verstehen."
    },

    {
        name: "French",
        language: "fr-FR",
        expression:
            "Bien qu'il ait plu abondamment hier, la nature, qui a été profondément aimée par nous, offrira de l'espoir à ceux qui sont courageux si elle révèle ses secrets demain. Crois en toi-même, car seules les personnes qui ont traversé la tempête peuvent comprendre le vrai sens de la vie."
    }

];

const results = [];

for (const testCase of cases) {

    const runtime =
        new HonestRuntime(
            testCase.expression,
            {
                languageSystem:
                    testCase.language,

                evidence: [
                    {
                        source:
                            `https://example.com/verified-${testCase.language}`,

                        independent:
                            true,

                        verificationStatus:
                            "VERIFIED",

                        epistemicState:
                            "VERIFIED",

                        verificationBasis:
                            "explicit-verification",

                        runtimeVerificationRecord:
                            true,

                        sourceAvailable:
                            true,

                        supportsClaim:
                            true
                    }
                ]
            }
        );

    const result =
        await runtime.run();

    const rr =
        result;

    const languageBoundary =
        rr?.selfCheck
            ?.languageBoundaryReport ??
        rr?.selfCheck
            ?.result
            ?.languageBoundaryReport ??
        null;

    const report =
        rr?.generator?.report ??
        {};

    const checks = {

        runtimeClosed:
            rr?.metadata?.runtimeState ===
            "RuntimeClosed",

        languageMatches:
            rr?.semanticObject?.languageSystem ===
            testCase.language,

        languageConnected:
            rr?.semanticObject
                ?.languageAdapter
                ?.connected === true,

        externalLanguageBoundaryPassed:
            languageBoundary?.passed === true,

        identityPreserved:
            languageBoundary?.identityPreserved === true,

        runtimeDoesNotOwnLanguage:
            languageBoundary?.runtimeOwnsLanguage === false,

        runtimeDoesNotCreateLanguage:
            languageBoundary?.runtimeCreatesLanguage === false,

        runtimeDoesNotInterpretLanguage:
            languageBoundary?.runtimeInterpretsLanguage === false,

        reconstructionSupported:
            rr?.reconstruction
                ?.reconstruction
                ?.reconstructionState ===
            "SUPPORTED",

        verificationSupported:
            report?.verificationStatus ===
            "SUPPORTED",

        publishable:
            report?.publishable === true,

        publishableTextPresent:
            typeof rr?.generator?.publishableText ===
                "string" &&
            rr.generator.publishableText.length > 0,

        selfCheckPassed:
            rr?.selfCheck?.result?.passed === true,

        responsibilityEventPublishable:
            rr?.responsibilityEventPublishable === true

    };

    const passed =
        Object.values(checks)
            .every(Boolean);

    results.push({

        language:
            testCase.language,

        passed,

        checks,

        runtimeState:
            rr?.metadata?.runtimeState,

        reconstructionState:
            rr?.reconstruction
                ?.reconstruction
                ?.reconstructionState,

        verificationStatus:
            report?.verificationStatus,

        publishable:
            report?.publishable,

        identityPreserved:
            languageBoundary?.identityPreserved,

        publishableText:
            rr?.generator?.publishableText

    });

    if (!passed) {

        console.log(
            JSON.stringify(
                {
                    test:
                        "Wuwen Multi-Language Runtime Regression",

                    failedLanguage:
                        testCase.language,

                    results
                },
                null,
                2
            )
        );

        process.exit(1);

    }

}

const passed =
    results.length === cases.length &&
    results.every(
        item =>
            item.passed === true
    );

console.log(
    JSON.stringify(
        {
            test:
                "Wuwen Multi-Language Runtime Regression",

            languageCount:
                cases.length,

            languages:
                cases.map(
                    item =>
                        item.language
                ),

            passed,

            results
        },
        null,
        2
    )
);

if (!passed) {

    console.log(
        "Wuwen Multi-Language Runtime Regression Failed."
    );

    process.exit(1);

}

console.log(
    "Wuwen Multi-Language Runtime Regression Passed."
);
