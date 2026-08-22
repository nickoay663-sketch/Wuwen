import HonestRuntime from "../runtime/HonestRuntime.js";

const expression = `
¡Hola a todos! Hoy os hablo para que sepáis que aprender español es una aventura increíble.
Ayer pensaba en lo mucho que he cambiado desde que empecé.
Si me hubierais dicho hace un año que yo estaría aquí hablando frente a vosotros, no os habría creído.
Aunque el camino haya sido difícil, se dice que quienes perseveran siempre lo logran.
Mañana continuaré aprendiendo porque creo que todavía puedo mejorar.
`.trim();

const evidence = [
    {
        source:
            "runtime://test/spanish-final-generation",

        independent:
            true,

        verificationStatus:
            "VERIFIED",

        epistemicState:
            "VERIFIED",

        verificationBasis:
            "runtime-test-verification",

        runtimeVerificationRecord:
            true,

        sourceAvailable:
            true,

        supportsClaim:
            true
    }
];

const runtime =
    new HonestRuntime(
        expression,
        {
            languageSystem: "es-ES",
            evidence
        }
    );

const result =
    await runtime.run();

console.log(
    JSON.stringify(
        {
            runtimeState:
                result.metadata?.runtimeState,

            language:
                result.semanticObject?.languageSystem,

            languageConnected:
                result.semanticObject
                    ?.languageAdapter
                    ?.connected,

            reconstructionState:
                result.reconstruction
                    ?.reconstruction
                    ?.reconstructionState,

            verificationStatus:
                result.generator
                    ?.report
                    ?.verificationStatus,

            publishable:
                result.generator
                    ?.report
                    ?.publishable,

            publishableText:
                result.generator
                    ?.publishableText,

            selfCheck:
                result.selfCheck
                    ?.result
                    ?.passed,

            responsibilityEventPublishable:
                result.responsibilityEventPublishable

        },
        null,
        2
    )
);
