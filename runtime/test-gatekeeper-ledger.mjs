import fs from "fs";
import WALContract from "./WALContract.js";
import WALGatekeeper from "./WALGatekeeper.js";
import ResponsibilityEvent from "./ResponsibilityEvent.js";
import ResponsibilityLedger from "./ResponsibilityLedger.js";

const ledgerFile = "./gatekeeper-test-ledger.jsonl";

if (fs.existsSync(ledgerFile)) {
    fs.unlinkSync(ledgerFile);
}

const gatekeeper = new WALGatekeeper();
const ledger = new ResponsibilityLedger(ledgerFile);

function createEnvelope(overrides = {}) {
    return WALContract.createEnvelope({
        eventId: "gatekeeper-test",
        expression: "杩欐槸涓€涓粡杩囬獙璇佺殑璐ｄ换琛ㄨ揪",
        identity: null,
        timestamp: "2026-08-29T00:00:00.000Z",
        verificationState: "SUPPORTED",
        responsibilityState: "ESTABLISHED",
        propagationState: "ALLOW",
        runtimeVersion: "10.8",
        contractVersion: "1.0",
        ...overrides
    });
}

function createPublishableEvent() {

    return new ResponsibilityEvent({
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

}

console.log("=== 1. VALID RESPONSIBILITY ===");

const validEnvelope =
    createEnvelope();

const validEvent =
    createPublishableEvent();

const validResult =
    gatekeeper.intercept(
        validEnvelope,
        validEnvelope.expression,
        undefined,
        validEvent
    );

console.log(JSON.stringify({
    decision: validResult.decision,
    allowed: validResult.allowed,
    status: validResult.status,
    reason: validResult.reason
}, null, 2));

if (validResult.decision !== "ALLOW") {
    throw new Error(
        "Valid responsibility was not allowed."
    );
}

ledger.append(
    {
        id: "gatekeeper-valid-001",
        epistemicState: "SUPPORTED",
        verificationStatus: "SUPPORTED",
        verifiedEvidenceCount: 1,
        canPublish: true,
        claim: validEnvelope.expression
    },
    [
        {
            source: "gatekeeper-test",
            snippet: "validated evidence"
        }
    ]
);

console.log("VALID PATH: ALLOW + LEDGER WRITE");


console.log("\n=== 2. INVALID RESPONSIBILITY ===");

const invalidEnvelope =
    createEnvelope({
        verificationState: "UNKNOWN",
        responsibilityState: "UNESTABLISHED",
        propagationState: "REQUIRE_VERIFICATION"
    });

const invalidResult =
    gatekeeper.intercept(
        invalidEnvelope,
        invalidEnvelope.expression
    );

console.log(JSON.stringify({
    decision: invalidResult.decision,
    allowed: invalidResult.allowed,
    status: invalidResult.status,
    reason: invalidResult.reason
}, null, 2));

if (invalidResult.decision !== "REFUSE") {
    throw new Error(
        "Invalid responsibility was not refused."
    );
}

console.log("INVALID PATH: REFUSE + NO LEDGER WRITE");


console.log("\n=== 3. LEDGER INTEGRITY ===");

const integrity =
    ledger.verifyIntegrity();

console.log(JSON.stringify(
    integrity,
    null,
    2
));

if (integrity.valid !== true) {
    throw new Error(
        "Ledger integrity failed."
    );
}

if (integrity.totalRecords !== 1) {
    throw new Error(
        `Expected exactly 1 ledger record, got ${integrity.totalRecords}.`
    );
}

console.log("\n=== WAL GATEKEEPER + LEDGER ISOLATION TEST PASSED ===");

if (fs.existsSync(ledgerFile)) {
    fs.unlinkSync(ledgerFile);
}
