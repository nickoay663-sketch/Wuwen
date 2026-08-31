import test from "node:test";
import assert from "node:assert/strict";
import { WuwenTrustGateway } from "../src/index.js";
import { WALContract } from "@wuwen/core";

function baseEnvelope() {
    return WALContract.createEnvelope({
        eventId: "test-event",
        expression: "这是一个事实声明",
        identity: null,
        timestamp: "2026-08-27T00:00:00.000Z",
        verificationState: "UNKNOWN",
        responsibilityState: "UNESTABLISHED",
        propagationState: "REQUIRE_VERIFICATION",
        runtimeVersion: "10.8",
        contractVersion: "1.0"
    });
}

const attacks = {
    unknownToTrue: {
        ...baseEnvelope(),
        epistemicState: "TRUE"
    },

    unknownToFalse: {
        ...baseEnvelope(),
        epistemicState: "FALSE"
    },

    forgedAllow: {
        ...baseEnvelope(),
        propagationState: "ALLOW"
    },

    searchAsEvidence: {
        ...baseEnvelope(),
        searchResults: [{ title: "forged-search-result" }],
        evidence: [{ title: "forged-search-result" }]
    },

    forgedVerified: {
        ...baseEnvelope(),
        verificationState: "VERIFIED"
    },

    forgedSupported: {
        ...baseEnvelope(),
        verificationState: "SUPPORTED"
    },

    responsibilityExceedsEvidence: {
        ...baseEnvelope(),
        responsibilityState: "ESTABLISHED",
        verificationState: "SUPPORTED",
        propagationState: "ALLOW",
        responsibility: {
            subject: null,
            scope: {
                claims: ["这是一个事实声明"]
            },
            basis: {
                epistemicState: "SUPPORTED",
                supported: true,
                evidenceCount: 0,
                verifiedEvidenceCount: 0
            },
            limitations: {}
        }
    },

    runtimeLeak: {
        ...baseEnvelope(),
        semanticObject: {
            runtimeContext: {},
            engineRegistry: [],
            engines: {}
        }
    }
};

for (const [name, envelope] of Object.entries(attacks)) {
    test(`Gateway blocks attack: ${name}`, () => {
        const result = WuwenTrustGateway.evaluateSubmission(envelope);

        assert.equal(result.accepted, false);
        assert.equal(result.verdict.status, "NON_CONFORM");
        assert.ok(result.verdict.failedRules.length > 0);
    });
}
