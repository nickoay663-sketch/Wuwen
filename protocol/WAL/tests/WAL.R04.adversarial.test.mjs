import WALContract from "../validator/WALContract.js";
import WALIndependentValidator from "../validator/WALIndependentValidator.js";

const validator = new WALIndependentValidator();

function baseEnvelope() {
    return WALContract.createEnvelope({
        eventId: "r04-attack-test",
        expression: "R04 original expression",
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
    "R04-01_punishment-reconstruction": () => ({
        ...baseEnvelope(),
        reconstructionPurpose: "PUNISHMENT"
    }),

    "R04-02_required-but-not-preserved": () => ({
        ...baseEnvelope(),
        reconstructionIntentRequired: true,
        reconstructionPreservesIntent: false
    }),

    "R04-03_exceeded-responsibility": () => ({
        ...baseEnvelope(),
        reconstructionExceededResponsibility: true
    }),

    "R04-04_increased-certainty": () => ({
        ...baseEnvelope(),
        reconstructionIncreasedCertainty: true
    }),

    "R04-05_erased-unknown-portions": () => ({
        ...baseEnvelope(),
        unknownPortionsPresent: true,
        unknownPortionsPreserved: false
    }),

    "R04-06_manufactured-evidence": () => ({
        ...baseEnvelope(),
        reconstructionManufacturedEvidence: true
    }),

    "R04-07_manufactured-knowledge": () => ({
        ...baseEnvelope(),
        reconstructionManufacturedKnowledge: true
    }),

    "R04-08_generator-increased-certainty": () => ({
        ...baseEnvelope(),
        generatorIncreasedCertainty: true
    }),

    "R04-09_generator-manufactured-facts": () => ({
        ...baseEnvelope(),
        generatorManufacturedFacts: true
    }),

    "R04-10_automatic-reconstruction-changed-boundary": () => ({
        ...baseEnvelope(),
        automaticReconstruction: true,
        reconstructionChangedResponsibilityObject: true
    }),

    "R04-11_unsafe-reconstruction-false-resolution": () => ({
        ...baseEnvelope(),
        automaticReconstructionUnsafe: true,
        verificationState: "VERIFIED",
        resolutionState: "RESOLVED"
    }),

    "R04-12_publication-justifies-boundary-violation": () => ({
        ...baseEnvelope(),
        publicationJustifiesBoundaryViolation: true
    })
};

const results = {};
let failures = 0;

for (const [name, makeEnvelope] of Object.entries(attacks)) {
    const envelope = makeEnvelope();
    const validation = validator.validateEnvelope(envelope);

    const failedRuleIds = validation.failedRules.map(rule => rule.id);
    const targetRule = name.match(/R04-\d+/)[0];

    results[name] = {
        status: validation.status,
        passed: validation.passed,
        failedRules: validation.failedRules
    };

    if (validation.passed || !failedRuleIds.includes(targetRule)) {
        failures++;
    }
}

console.log(JSON.stringify(results, null, 2));

if (failures > 0) {
    console.error(`\n=== R04 ATTACK COVERAGE TEST FAILED: ${failures}/12 ===`);
    process.exit(1);
}

console.log("\n=== R04 ATTACK COVERAGE TEST PASSED ===");
console.log("R04-01 through R04-12: 12/12 BLOCKED");
