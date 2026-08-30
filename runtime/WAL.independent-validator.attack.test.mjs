import WALContract from "./WALContract.js";
import WALIndependentValidator from "./WALIndependentValidator.js";

const validator =
    new WALIndependentValidator();

function baseEnvelope() {
    return WALContract.createEnvelope({
        eventId: "test-event",
        expression: "杩欐槸涓€涓簨瀹?,
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
                claims: ["杩欐槸涓€涓簨瀹?]
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
    "\n=== WAL INDEPENDENT VALIDATOR ATTACK TEST PASSED ==="
);
