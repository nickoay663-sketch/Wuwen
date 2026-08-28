import MWALGatekeeper from "./MWALGatekeeper.js";
import MWALContract from "./MWALContract.js";

const gatekeeper = new MWALGatekeeper();

const envelope = MWALContract.createEnvelope({
    eventId: "gatekeeper-test-001",
    expression: "这是一个未经验证的事实",
    identity: null,
    timestamp: "2026-08-29T00:00:00.000Z",
    verificationState: "UNKNOWN",
    responsibilityState: "UNESTABLISHED",
    propagationState: "REQUIRE_VERIFICATION",
    runtimeVersion: "10.7",
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

console.log("=== MWAL GATEKEEPER REFUSAL TEST PASSED ===");
