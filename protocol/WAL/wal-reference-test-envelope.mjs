import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import WALContract from "./validator/WALContract.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envelope =
    WALContract.createEnvelope({
        eventId: "wal-reference-conformance",
        expression: "This is a test expression.",
        identity: null,
        timestamp: "2026-08-30T00:00:00.000Z",
        verificationState: "UNKNOWN",
        responsibilityState: "UNESTABLISHED",
        responsibility: null,
        propagationState: "REQUIRE_VERIFICATION",
        auditTrail: [],
        signature: null,
        runtimeVersion: "10.8",
        contractVersion: "1.0"
    });

fs.writeFileSync(
    path.join(__dirname, "wal-reference-test-envelope.json"),
    JSON.stringify(envelope, null, 2),
    "utf8"
);
