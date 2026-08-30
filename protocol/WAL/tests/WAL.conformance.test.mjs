import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import WALIndependentValidator from "../validator/WALIndependentValidator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envelopePath = path.resolve(
    __dirname,
    "../examples/conform/valid-envelope.json"
);

const envelope = JSON.parse(
    fs.readFileSync(envelopePath, "utf8")
);

const validator = new WALIndependentValidator();
const validation = validator.validateEnvelope(envelope);

console.log(
    JSON.stringify(
        {
            status: validation.status,
            passed: validation.passed,
            totalRulesChecked: validation.totalRulesChecked,
            passedRules: validation.passedRules,
            failedRules: validation.failedRules
        },
        null,
        2
    )
);

if (
    validation.status !== "CONFORM" ||
    validation.passed !== true ||
    validation.totalRulesChecked !== 54 ||
    validation.passedRules !== 54 ||
    validation.failedRules.length !== 0
) {
    console.error("Conformance test failed!");
    process.exit(1);
} else {
    console.log("Conformance test passed successfully (54/54).");
}
