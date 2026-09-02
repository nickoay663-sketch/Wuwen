#!/usr/bin/env node
/**
 * WAL Protocol CLI Validator
 * Standalone command-line verification tool for WAL Envelopes.
 */

import fs from "fs";
import path from "path";
import WALIndependentValidator from "../validator/WALIndependentValidator.js";

const args = process.argv.slice(2);

if (args.length === 0) {
    console.error(
        "Usage: node bin/wal-verify.js <path-to-envelope.json>"
    );
    process.exit(1);
}

const targetPath = path.resolve(process.cwd(), args[0]);

if (!fs.existsSync(targetPath)) {
    console.error(
        `Error: Envelope file not found at ${targetPath}`
    );
    process.exit(1);
}

try {
    const rawData = fs.readFileSync(targetPath, "utf8");
    const envelope = JSON.parse(rawData);

    const validator = new WALIndependentValidator();
    const result = validator.validateEnvelope(envelope);

    console.log(
        JSON.stringify(result, null, 2)
    );

    process.exit(result.passed ? 0 : 2);
} catch (err) {
    console.error(
        "Error parsing envelope JSON:",
        err.message
    );
    process.exit(1);
}
