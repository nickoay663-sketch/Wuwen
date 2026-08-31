import HonestRuntime from "../runtime/HonestRuntime.js";

const runtime =
    new HonestRuntime("这是一个事实");

const result =
    await runtime.run();

const responsibility =
    result?.responsibilityEvent?.responsibility;

console.log(
    JSON.stringify(
        {
            topLevelKeys:
                Object.keys(responsibility || {}),

            semanticObjectKeys:
                responsibility?.semanticObject &&
                typeof responsibility.semanticObject === "object"
                    ? Object.keys(responsibility.semanticObject)
                    : [],

            resultKeys:
                responsibility?.result &&
                typeof responsibility.result === "object"
                    ? Object.keys(responsibility.result)
                    : [],

            responsibilityRecord:
                Array.isArray(
                    responsibility?.responsibilities
                )
                    ? responsibility.responsibilities
                    : []
        },
        null,
        2
    )
);
