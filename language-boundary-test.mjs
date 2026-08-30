import WuwenRuntime from "./runtime/index.js";

const externalLanguageSystem = {
    name: "ExternalThaiLanguageSystem",
    provider: "Internet",
    version: "external-1.0",
    capabilities: [
        "expression",
        "syntax",
        "language"
    ]
};

const text = `ท่านผู้มีเกียรติครับ, โปรดฟังผม!
การตัดสินใจที่ดีที่สุดได้ถูกทีมของเราเลือกแล้ว`;

const r =
    await new WuwenRuntime(
        text,
        {
            languageSystem:
                externalLanguageSystem
        }
    ).run();

const carried =
    r.runtimeResult?.semanticObject?.languageSystem;

console.log("same-object=",
    carried === externalLanguageSystem
);

console.log("name=",
    carried?.name
);

console.log("provider=",
    carried?.provider
);

console.log("version=",
    carried?.version
);

console.log("definition=",
    r.runtimeResult?.definition?.languageSystem ===
    externalLanguageSystem
);

console.log("reconstruction=",
    r.runtimeResult?.reconstruction?.reconstruction?.language ===
    externalLanguageSystem
);

console.log("generator=",
    r.runtimeResult?.generator?.report?.language ===
    externalLanguageSystem
);

console.log("selfCheck=",
    r.runtimeResult?.selfCheck?.status
);
