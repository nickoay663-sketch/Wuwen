import fs from "fs";
import WALIndependentValidator from "../validator/WALIndependentValidator.js";

const envelope = JSON.parse(
    fs.readFileSync(
        "./protocol/WAL/examples/conform/valid-envelope.json",
        "utf8"
    )
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
