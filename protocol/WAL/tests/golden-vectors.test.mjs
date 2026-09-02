import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import WALIndependentValidator from "../validator/WALIndependentValidator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const manifest = JSON.parse(
    fs.readFileSync(path.join(root, "golden-vectors", "manifest.json"), "utf8")
);

const validator = new WALIndependentValidator();

for (const vector of manifest) {
    const envelope = JSON.parse(
        fs.readFileSync(
            path.join(root, "golden-vectors", vector.input),
            "utf8"
        )
    );

    const result = validator.validateEnvelope(envelope);

    const statusOk = result.status === vector.expectedStatus;
    const passedOk = result.passed === vector.expectedPassed;
    const failureOk =
        !vector.expectedFailure ||
        result.failedRules.some(
            rule => rule.rule === vector.expectedFailure
        );

    console.log(
        `${vector.id}: ${
            statusOk && passedOk && failureOk ? "PASS" : "FAIL"
        }`
    );

    if (!(statusOk && passedOk && failureOk)) {
        console.log(JSON.stringify(result, null, 2));
        process.exit(1);
    }
}

console.log("GOLDEN VECTOR JS VALIDATION: PASS");
