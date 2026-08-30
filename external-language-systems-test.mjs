import WuwenRuntime from "./runtime/index.js";

const cases = [
    {
        name: "Spanish",
        languageSystem: {
            name: "ExternalSpanishLanguageSystem",
            provider: "Internet",
            version: "external-1.0"
        },
        text: "Aunque el camino haya sido difícil, quienes perseveran siempre lo logran."
    },
    {
        name: "German",
        languageSystem: {
            name: "ExternalGermanLanguageSystem",
            provider: "Internet",
            version: "external-1.0"
        },
        text: "Obwohl der Weg schwierig war, werden diejenigen, die durchhalten, ihr Ziel erreichen."
    },
    {
        name: "Thai",
        languageSystem: {
            name: "ExternalThaiLanguageSystem",
            provider: "Internet",
            version: "external-1.0"
        },
        text: "แม้เส้นทางจะยากลำบาก แต่ผู้ที่พยายามต่อไปย่อมประสบความสำเร็จ"
    },
    {
        name: "Chinese",
        languageSystem: {
            name: "ExternalChineseLanguageSystem",
            provider: "Internet",
            version: "external-1.0"
        },
        text: "即使道路很困难，坚持下去的人最终也能够成功。"
    },
    {
        name: "English",
        languageSystem: {
            name: "ExternalEnglishLanguageSystem",
            provider: "Internet",
            version: "external-1.0"
        },
        text: "Although the road was difficult, those who persevere will eventually succeed."
    }
];

for (const item of cases) {

    const result =
        await new WuwenRuntime(
            item.text,
            {
                languageSystem:
                    item.languageSystem
            }
        ).run();

    const carried =
        result.runtimeResult?.semanticObject?.languageSystem;

    console.log({
        language: item.name,
        sameObject:
            result.runtimeResult?.definition?.languageSystem ===
            item.languageSystem,
        carriedName:
            carried?.name,
        reconstruction:
            result.runtimeResult?.reconstruction?.reconstruction?.language ===
            item.languageSystem,
        generator:
            result.runtimeResult?.generator?.report?.language ===
            item.languageSystem,
        selfCheck:
            result.runtimeResult?.selfCheck?.status
    });
}
