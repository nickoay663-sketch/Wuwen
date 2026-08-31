import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import WALIndependentValidator from "../validator/WALIndependentValidator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const walRoot = path.resolve(__dirname, "..");

const validPath = path.join(walRoot, "examples", "conform", "valid-envelope.json");
const attackPath = path.join(walRoot, "examples", "attack", "leaked-envelope.json");

function readJson(filePath) {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

const validator = new WALIndependentValidator();

const validResult = validator.validateEnvelope(readJson(validPath));
assert(
    validResult.passed === true && validResult.status === "CONFORM",
    "Valid WAL envelope must be CONFORM."
);

const attackResult = validator.validateEnvelope(readJson(attackPath));
assert(
    attackResult.passed === false && attackResult.status === "NON_CONFORM",
    "Leaked WAL envelope must be NON_CONFORM."
);
assert(
    attackResult.failedRules.some(rule => rule.id === "R04-01"),
    "Attack envelope must trigger R04-01 failure."
);

console.log("Clean-room conformance suite passed successfully.");
