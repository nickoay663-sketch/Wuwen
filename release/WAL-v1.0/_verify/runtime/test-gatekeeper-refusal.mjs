import WALGatekeeper from "./WALGatekeeper.js";
import WALContract from "./WALContract.js";

const gatekeeper = new WALGatekeeper();

const envelope = WALContract.createEnvelope({
    eventId: "gatekeeper-test-001",
    expression: "杩欐槸涓€涓湭缁忛獙璇佺殑浜嬪疄",
    identity: null,
    timestamp: "2026-08-29T00:00:00.000Z",
    verificationState: "UNKNOWN",
    responsibilityState: "UNESTABLISHED",
    propagationState: "REQUIRE_VERIFICATION",
    runtimeVersion: "10.8",
    contractVersion: "1.0"
});

const result = gatekeeper.intercept(envelope);

console.log(JSON.stringify({
    decision: result.decision,
    allowed: result.allowed,
    status: result.status,
    reason: result.reason
}, null, 2));

if (result.decision !== "REFUSE") {
    throw new Error("Gatekeeper failed: UNKNOWN envelope was not refused.");
}

console.log("=== WAL GATEKEEPER REFUSAL TEST PASSED ===");
