import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import WALIndependentValidator from "../validator/WALIndependentValidator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const walRoot = path.resolve(__dirname, "..");

const validPath = path.join(
    walRoot,
    "examples",
    "conform",
    "valid-envelope.json"
);

const attackPath = path.join(
    walRoot,
    "examples",
    "attack",
    "leaked-envelope.json"
);

const missingEventIdPath = path.join(
    walRoot,
    "examples",
    "non-conform",
    "missing-eventId.json"
);

function readJson(filePath) {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

const validResult = WALIndependentValidator.validate(
    readJson(validPath)
);

assert(
    validResult.passed === true &&
    validResult.status === "CONFORM",
    "Valid WAL envelope must be CONFORM."
);

const attackResult = WALIndependentValidator.validate(
    readJson(attackPath)
);

assert(
    attackResult.passed === false &&
    attackResult.status === "NON_CONFORM",
    "Leaked WAL envelope must be NON_CONFORM."
);

assert(
    attackResult.failedRules.some(rule => rule.id === "R04-01"),
    "Leaked WAL envelope must fail R04-01."
);

const schema = readJson(
    path.join(walRoot, "schema", "wal-envelope.schema.json")
);

const missingEventId = readJson(missingEventIdPath);

assert(
    Array.isArray(schema.required) &&
    schema.required.includes("eventId"),
    "WAL Schema must require eventId."
);

assert(
    !Object.prototype.hasOwnProperty.call(missingEventId, "eventId"),
    "Missing-eventId fixture must omit eventId."
);

console.log("WAL CLEAN-ROOM CONFORMANCE: PASS");
console.log("Valid Envelope: CONFORM");
console.log("Leaked Envelope: NON_CONFORM / R04-01");
console.log("Schema Required Contract: PASS");
console.log("External Fixture: missing-eventId / EXPECTED NON_CONFORM");