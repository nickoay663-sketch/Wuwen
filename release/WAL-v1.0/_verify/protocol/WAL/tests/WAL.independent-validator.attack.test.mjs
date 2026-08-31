import WALContract from "../validator/WALContract.js";
import WALIndependentValidator from "../validator/WALIndependentValidator.js";

const validator = new WALIndependentValidator();

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

const results = {};

for (const [name, envelope] of Object.entries(attacks)) {
    const validation =
        validator.validateEnvelope(envelope);

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

const expectedBlocked = [
    "unknownToTrue",
    "unknownToFalse",
    "forgedAllow",
    "searchAsEvidence",
    "forgedVerified",
    "forgedSupported",
    "responsibilityExceedsEvidence",
    "runtimeLeak"
];

const failures = expectedBlocked.filter(
    name => results[name].passed !== false
);

if (failures.length > 0) {
    console.error(
        `ATTACK TEST FAILED: ${failures.join(", ")}`
    );
    process.exit(1);
}

console.log(
    "=== WAL INDEPENDENT VALIDATOR ATTACK TEST PASSED ==="
);
process.exit(0);
