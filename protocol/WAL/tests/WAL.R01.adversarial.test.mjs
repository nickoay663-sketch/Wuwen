import WALContract from "../validator/WALContract.js";
import WALIndependentValidator from "../validator/WALIndependentValidator.js";

const validator = new WALIndependentValidator();

const ORIGINAL = "R01 original expression";

function baseEnvelope() {
    return WALContract.createEnvelope({
        eventId: "r01-attack-test",
        expression: ORIGINAL,
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
    "R01-01_expression-substitution": () => ({
        envelope: {
            ...baseEnvelope(),
            expression: "ATTACKED expression"
        },
        originalExpression: ORIGINAL
    }),

    "R01-02_testimony-substitution": () => ({
        envelope: baseEnvelope(),
        originalExpression: ORIGINAL,
        testimony: {
            originalInput: {
                originalExpression: "ATTACKED testimony expression"
            }
        }
    }),

    "R01-03_responsibility-substitution": () => ({
        envelope: baseEnvelope(),
        originalExpression: ORIGINAL,
        responsibilityEvent: {
            expression: "ATTACKED responsibility expression"
        }
    }),

    "R01-04_synthetic-definition": () => ({
        envelope: {
            ...baseEnvelope(),
            definition: {
                syntheticMeaning: true
            }
        }
    }),

    "R01-05_runtime-owned-language": () => ({
        envelope: {
            ...baseEnvelope(),
            languageSystem: {
                runtimeOwned: true
            }
        }
    }),

    "R01-06_runtime-created-language": () => ({
        envelope: {
            ...baseEnvelope(),
            languageSystem: {
                runtimeCreated: true
            }
        }
    }),

    "R01-07_forced-undefined-object": () => ({
        envelope: {
            ...baseEnvelope(),
            undefinedObjectsIntroduced: true
        }
    }),

    "R01-08_language-identification-as-verification": () => ({
        envelope: {
            ...baseEnvelope(),
            languageIdentification: true,
            verificationState: "VERIFIED",
            verificationBasis: "LANGUAGE_IDENTIFICATION"
        }
    }),

    "R01-09_semantic-analysis-as-evidence": () => ({
        envelope: {
            ...baseEnvelope(),
            semanticAnalysisUsedAsEvidence: true
        }
    }),

    "R01-10_claim-changing-restatement": () => ({
        envelope: {
            ...baseEnvelope(),
            restatedExpression: "ATTACKED restatement",
            restatedExpressionPreservesClaim: false
        },
        originalExpression: ORIGINAL
    })
};

const results = {};

for (const [name, build] of Object.entries(attacks)) {
    const {
        envelope,
        originalExpression,
        testimony,
        responsibilityEvent
    } = build();

    const validation = validator.validateEnvelope(
        envelope,
        originalExpression,
        testimony,
        responsibilityEvent
    );

    results[name] = {
        status: validation.status,
        passed: validation.passed,
        failedRules: validation.failedRules.map(
            rule => rule.rule
        )
    };
}

console.log(JSON.stringify(results, null, 2));

const expectedRules = {
    "R01-01_expression-substitution": "WAL-R01-01",
    "R01-02_testimony-substitution": "WAL-R01-02",
    "R01-03_responsibility-substitution": "WAL-R01-03",
    "R01-04_synthetic-definition": "WAL-R01-04",
    "R01-05_runtime-owned-language": "WAL-R01-05",
    "R01-06_runtime-created-language": "WAL-R01-06",
    "R01-07_forced-undefined-object": "WAL-R01-07",
    "R01-08_language-identification-as-verification": "WAL-R01-08",
    "R01-09_semantic-analysis-as-evidence": "WAL-R01-09",
    "R01-10_claim-changing-restatement": "WAL-R01-10"
};

const failures = [];

for (const [attack, expectedRule] of Object.entries(expectedRules)) {
    const result = results[attack];

    if (result.passed !== false) {
        failures.push(`${attack}: validator accepted attack`);
        continue;
    }

    if (!result.failedRules.includes(expectedRule)) {
        failures.push(
            `${attack}: expected ${expectedRule}, got ${result.failedRules.join(", ")}`
        );
    }
}

if (failures.length > 0) {
    console.error("");
    console.error("=== R01 ATTACK TEST FAILED ===");
    for (const failure of failures) {
        console.error(failure);
    }
    process.exit(1);
}

console.log("");
console.log("=== R01 ATTACK COVERAGE TEST PASSED ===");
console.log("R01-01 through R01-10: 10/10 BLOCKED");
process.exit(0);
