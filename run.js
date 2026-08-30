import fs from "node:fs/promises";
import path from "node:path";

import HonestRuntime from "./runtime/HonestRuntime.js";
import ReportFormatter from "./runtime/ReportFormatter.js";

const rawInput =
    process.argv
        .slice(2)
        .join(" ")
        .trim();

let input =
    rawInput ||
    "请输入需要检查的表达。";

if (rawInput) {

    const candidatePath =
        path.resolve(
            process.cwd(),
            rawInput
        );

    try {

        const fileStat =
            await fs.stat(
                candidatePath
            );

        if (fileStat.isFile()) {

            input =
                await fs.readFile(
                    candidatePath,
                    "utf8"
                );

        }

    } catch {

        // 非文件路径时保持原有直接文本输入行为。

    }

}

const runtime =
    new HonestRuntime(
        input
    );

const result =
    await runtime.run();

const report =
    new ReportFormatter(
        result
    ).run();

console.log(
    JSON.stringify(
        report,
        null,
        2
    )
);
