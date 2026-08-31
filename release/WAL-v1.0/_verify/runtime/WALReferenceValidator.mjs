import fs from "fs";
import WALIndependentValidator from "./WALIndependentValidator.js";

const inputPath = process.argv[2];

if (!inputPath) {
    throw new Error(
        "Usage: node WALReferenceValidator.mjs <wal-envelope.json>"
    );
}

const envelope =
    JSON.parse(
        fs.readFileSync(inputPath, "utf8")
    );

const validator =
    new WALIndependentValidator();

const validation =
    validator.validateEnvelope(envelope);

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
