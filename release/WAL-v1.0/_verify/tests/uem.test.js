import UniversalExpression from "../runtime/UniversalExpression.js";

const cases = [
    {
        name: "Chinese",
        expression: "我是医生。",
        language: "zh-CN",
        subject: "我",
        predicate: "是",
        object: "医生"
    },
    {
        name: "English",
        expression: "I am a doctor.",
        language: "en-US",
        subject: "I",
        predicate: "am",
        object: "doctor"
    },
    {
        name: "Spanish",
        expression: "Soy médico.",
        language: "es-ES",
        subject: "Yo",
        predicate: "soy",
        object: "médico"
    },
    {
        name: "French",
        expression: "Je suis médecin.",
        language: "fr-FR",
        subject: "Je",
        predicate: "suis",
        object: "médecin"
    },
    {
        name: "German",
        expression: "Ich bin Arzt.",
        language: "de-DE",
        subject: "Ich",
        predicate: "bin",
        object: "Arzt"
    },
    {
        name: "Italian",
        expression: "Sono medico.",
        language: "it-IT",
        subject: "Io",
        predicate: "sono",
        object: "medico"
    },
    {
        name: "Portuguese",
        expression: "Sou médico.",
        language: "pt-PT",
        subject: "Eu",
        predicate: "sou",
        object: "médico"
    }
];

let passed = 0;

for (const testCase of cases) {

    const expression =
        new UniversalExpression({
            subject: testCase.subject,
            predicate: testCase.predicate,
            object: testCase.object,
            originalExpression: testCase.expression,
            sourceLanguage: testCase.language
        });

    const json = expression.toJSON();

    const ok =
        json.subject === testCase.subject &&
        json.predicate === testCase.predicate &&
        json.object === testCase.object &&
        json.originalExpression === testCase.expression &&
        json.sourceLanguage === testCase.language &&
        expression.hasSubject() &&
        expression.hasPredicate() &&
        expression.hasObject() &&
        expression.hasOriginalExpression() &&
        expression.hasSourceLanguage();

    if (ok) {
        passed++;
    } else {
        console.log("FAIL:", testCase.name, json);
    }
}

const empty =
    UniversalExpression.empty(
        "我在这里。",
        "zh-CN"
    );

if (
    empty.subject !== null ||
    empty.predicate !== null ||
    empty.object !== null
) {
    console.log(
        "FAIL: empty expression invented structure"
    );
    process.exit(1);
}

const missingObject =
    new UniversalExpression({
        subject: "我",
        predicate: "是",
        originalExpression: "我是。",
        sourceLanguage: "zh-CN"
    });

if (missingObject.object !== null) {
    console.log(
        "FAIL: missing object was invented"
    );
    process.exit(1);
}

if (missingObject.isComplete() !== true) {
    console.log(
        "FAIL: incomplete expression boundary"
    );
    process.exit(1);
}

const clone =
    new UniversalExpression({
        subject: "我",
        predicate: "是",
        object: "医生",
        originalExpression: "我是医生。",
        sourceLanguage: "zh-CN"
    }).clone();

if (
    clone.subject !== "我" ||
    clone.predicate !== "是" ||
    clone.object !== "医生" ||
    clone.originalExpression !== "我是医生。" ||
    clone.sourceLanguage !== "zh-CN"
) {
    console.log(
        "FAIL: clone integrity"
    );
    process.exit(1);
}

console.log(
    `UEM v1.0 Test: ${passed}/${cases.length} PASS`
);

if (passed !== cases.length) {
    process.exit(1);
}

console.log(
    "UEM v1.0 Boundary Test: PASS"
);
