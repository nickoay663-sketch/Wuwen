import test from "node:test";
import assert from "node:assert/strict";
import { WuwenTrustGateway } from "../src/index.js";
import { WALContract } from "@wuwen/core";

function validEnvelope() {
    return {
        eventId: "evt_test_001",
        expression: { action: "INIT", actor: "system" },
        identity: "node_runtime_identity_sig",
        timestamp: Date.now(),
        verificationState: WALContract.VERIFICATION_STATES.VERIFIED,
        responsibilityState: WALContract.RESPONSIBILITY_STATES.ESTABLISHED,
        propagationState: WALContract.PROPAGATION_STATES.ALLOW,
        runtimeVersion: "10.8",
        contractVersion: WALContract.VERSION,
        evidence: [{ id: "ev_1", type: "SYSTEM_BOOT" }],
        signature: "mock_valid_signature_sha256",
        correspondence: false,
        nonCorrespondence: false,
        responsibility: null
    };
}

test("WAL Gateway accepts a fully conformant envelope", () => {
    const result = WuwenTrustGateway.evaluateSubmission(validEnvelope());

    assert.equal(result.accepted, true);
    assert.equal(result.verdict.status, "CONFORM");
    assert.equal(result.verdict.passedRules, 54);
    assert.equal(result.verdict.totalRulesChecked, 54);
    assert.equal(result.verdict.failedRules.length, 0);
});

test("WAL Gateway rejects an envelope missing eventId", () => {
    const envelope = validEnvelope();
    delete envelope.eventId;

    const result = WuwenTrustGateway.evaluateSubmission(envelope);

    assert.equal(result.accepted, false);
    assert.equal(result.verdict.status, "NON_CONFORM");
});

test("WAL Gateway rejects UNKNOWN promoted to TRUE", () => {
    const envelope = validEnvelope();
    envelope.verificationState = "UNKNOWN";
    envelope.epistemicState = "TRUE";

    const result = WuwenTrustGateway.evaluateSubmission(envelope);

    assert.equal(result.accepted, false);
    assert.equal(result.verdict.status, "NON_CONFORM");
});

test("WAL Gateway rejects runtime internals crossing the WAL boundary", () => {
    const envelope = validEnvelope();
    envelope.semanticObject = {
        runtimeContext: {},
        engineRegistry: [],
        engines: {}
    };

    const result = WuwenTrustGateway.evaluateSubmission(envelope);

    assert.equal(result.accepted, false);
    assert.equal(result.verdict.status, "NON_CONFORM");
});

