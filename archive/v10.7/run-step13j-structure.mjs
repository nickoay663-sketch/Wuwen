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

console.log("\n=== TOP LEVEL KEYS ===");
console.log(Object.keys(result));

console.log("\n=== TOP LEVEL TYPES ===");

for (const key of Object.keys(result)) {

    const value = result[key];

    console.log(
        key,
        "=>",
        Array.isArray(value)
            ? "ARRAY"
            : value === null
                ? "NULL"
                : typeof value
    );
}

function inspectObject(name, value) {

    console.log(`\n=== ${name} ===`);

    if (
        !value ||
        typeof value !== "object"
    ) {
        console.log("VALUE:", value);
        return;
    }

    console.log(
        "KEYS:",
        Object.keys(value)
    );

    for (const key of Object.keys(value)) {

        const item = value[key];

        if (
            item === null ||
            typeof item !== "object"
        ) {

            console.log(
                `${key}:`,
                item
            );

        } else if (
            Array.isArray(item)
        ) {

            console.log(
                `${key}: ARRAY length=${item.length}`
            );

        } else {

            console.log(
                `${key}: OBJECT keys=`,
                Object.keys(item)
            );
        }
    }
}

inspectObject(
    "result.evidence",
    result.evidence
);

inspectObject(
    "result.correspondence",
    result.correspondence
);

inspectObject(
    "result.reasoning",
    result.reasoning
);

inspectObject(
    "result.responsibility",
    result.responsibility
);

inspectObject(
    "result.reconstruction",
    result.reconstruction
);

inspectObject(
    "result.generator",
    result.generator
);

inspectObject(
    "result.selfCheck",
    result.selfCheck
);

console.log("\n=== RESPONSIBILITY OBJECT DIRECT ===");

console.dir(
    result.responsibility,
    {
        depth: 4
    }
);

console.log("\n=== CORRESPONDENCE OBJECT DIRECT ===");

console.dir(
    result.correspondence,
    {
        depth: 4
    }
);
