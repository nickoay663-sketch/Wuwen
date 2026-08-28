import MWALContract from "./MWALContract.js";
import MWALIndependentValidator from "./MWALIndependentValidator.js";

const validator =
    new MWALIndependentValidator();

function baseEnvelope() {
    return MWALContract.createEnvelope({
        eventId: "test-event",
        expression: "这是一个事实",
        identity: null,
        timestamp: "2026-08-27T00:00:00.000Z",
        verificationState: "UNKNOWN",
        responsibilityState: "UNESTABLISHED",
        propagationState: "REQUIRE_VERIFICATION",
        runtimeVersion: "10.7",
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
        searchResults: [
            { title: "forged-search-result" }
        ],
        evidence: [
            { title: "forged-search-result" }
        ]
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
                claims: ["这是一个事实"]
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

const results = {};

for (const [name, envelope] of Object.entries(attacks)) {

    const validation =
        validator.validateEnvelope(
            envelope
        );

    results[name] = {
        status: validation.status,
        passed: validation.passed,
        failedRules:
            validation.failedRules.map(
                rule => rule.rule
            )
    };
}

console.log(
    JSON.stringify(
        results,
        null,
        2
    )
);

const failedAttacks =
    Object.entries(results)
        .filter(
            ([, result]) =>
                result.status !== "NON_CONFORM"
        );

if (failedAttacks.length > 0) {

    throw new Error(
        `Independent Validator attack test failed: ${failedAttacks
            .map(([name]) => name)
            .join(", ")}`
    );

}

console.log(
    "\n=== MWAL INDEPENDENT VALIDATOR ATTACK TEST PASSED ==="
);
