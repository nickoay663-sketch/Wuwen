import fs from "fs";
import WALContract from "./WALContract.js";

const envelope =
    WALContract.createEnvelope({
        eventId: "reference-test-event",
        expression: "这是一个事实。",
        identity: null,
        timestamp: "2026-08-30T00:00:00.000Z",
        verificationState: "UNKNOWN",
        responsibilityState: "UNESTABLISHED",
        responsibility: null,
        propagationState: "REQUIRE_VERIFICATION",
        evidence: [],
        auditTrail: [],
        signature: null,
        runtimeVersion: "10.8",
        contractVersion: "1.0"
    });

fs.writeFileSync(
    "./reference-test-envelope.json",
    JSON.stringify(envelope, null, 2),
    "utf8"
);
