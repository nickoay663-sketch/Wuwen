import fs from "fs";
import WALIndependentValidator from "./WALIndependentValidator.js";

const inputPath = process.argv[2];

if (!inputPath) {
    console.error(
        "Usage: node WALReferenceValidator.mjs <wal-envelope.json>"
    );
    process.exit(2);
}

let envelope;

try {
    envelope = JSON.parse(
        fs.readFileSync(inputPath, "utf8")
    );
} catch (error) {
    console.error(`Error parsing envelope JSON: ${error.message}`);
    process.exit(2);
}

const validation =
    WALIndependentValidator.validate(envelope);

console.log(
    JSON.stringify(
        validation,
        null,
        2
    )
);

process.exit(
    validation.passed ? 0 : 1
);
