import WALContract from "./WALContract.js";
import WALGatekeeper from "./WALGatekeeper.js";
import ResponsibilityEvent from "./ResponsibilityEvent.js";

const gatekeeper = new WALGatekeeper();

const envelope = WALContract.createEnvelope({
    eventId: "gatekeeper-debug",
    expression: "杩欐槸涓€涓粡杩囬獙璇佺殑璐ｄ换琛ㄨ揪",
    identity: null,
    timestamp: "2026-08-29T00:00:00.000Z",
    verificationState: "SUPPORTED",
    responsibilityState: "ESTABLISHED",
    propagationState: "ALLOW",
    runtimeVersion: "10.8",
    contractVersion: "1.0"
});

const event = new ResponsibilityEvent({
    epistemicState: "SUPPORTED",
    supported: true,
    verificationStatus: "SUPPORTED",
    responsibilityBoundary: {
        status: "matched"
    },
    responsibilityDemand: 1,
    responsibilityCapacity: 1,
    responsibilityJudgment: "matched"
});

const result = gatekeeper.intercept(
    envelope,
    envelope.expression,
    undefined,
    event
);

console.log(JSON.stringify({
    decision: result.decision,
    reason: result.reason,
    failedRules: result.validation?.failedRules || [],
    validation: result.validation
}, null, 2));
