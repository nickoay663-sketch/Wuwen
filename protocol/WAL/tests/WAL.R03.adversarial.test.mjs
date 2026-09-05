import assert from "node:assert/strict";
import WALContract from "../validator/WALContract.js";
import WALIndependentValidator from "../validator/WALIndependentValidator.js";

function baseEnvelope() {
    return WALContract.createEnvelope({
        eventId: "r03-attack-test",
        expression: "R03 original expression",
        identity: null,
        timestamp: "2026-08-27T00:00:00.000Z",
        verificationState: "UNKNOWN",
        responsibilityState: "UNESTABLISHED",
        propagationState: "REQUIRE_VERIFICATION",
        runtimeVersion: "10.8",
        contractVersion: "1.0"
    });
}

const attacks = [
    {
        name: "R03-01 responsibility exceeds evidence",
        target: "R03-01",
        mutate: envelope => {
            envelope.evidenceCount = 1;
            envelope.responsibility = {
                evidenceCount: 2
            };
        }
    },
    {
        name: "R03-02 reasoning exceeds evidence",
        target: "R03-02",
        mutate: envelope => {
            envelope.evidenceCount = 1;
            envelope.reasoningEvidenceCount = 2;
            envelope.reasoning = {
                type: "forged-reasoning"
            };
        }
    },
    {
        name: "R03-03 responsibility exceeds reasoning support",
        target: "R03-03",
        mutate: envelope => {
            envelope.reasoningSupportCount = 1;
            envelope.responsibilitySupportCount = 2;
        }
    },
    {
        name: "R03-04 later stage introduces certainty",
        target: "R03-04",
        mutate: envelope => {
            envelope.laterStageIntroducedCertainty = true;
        }
    },
    {
        name: "R03-04 generator increases certainty",
        target: "R03-04",
        mutate: envelope => {
            envelope.generatorIncreasedCertainty = true;
        }
    },
    {
        name: "R03-04 reconstruction increases certainty",
        target: "R03-04",
        mutate: envelope => {
            envelope.reconstructionIncreasedCertainty = true;
        }
    },
    {
        name: "R03-04 UNKNOWN silently becomes VERIFIED",
        target: "R03-04",
        mutate: envelope => {
            envelope.previousVerificationState = "UNKNOWN";
            envelope.verificationState = "VERIFIED";
            envelope.explicitVerificationTransition = false;
        }
    },
    {
        name: "R03-05 UNKNOWN with ALLOW",
        target: "R03-05",
        mutate: envelope => {
            envelope.verificationState = "UNKNOWN";
            envelope.propagationState = "ALLOW";
        }
    },
    {
        name: "R03-06 UNKNOWN with ALLOW",
        target: "R03-06",
        mutate: envelope => {
            envelope.verificationState = "UNKNOWN";
            envelope.propagationState = "ALLOW";
        }
    },
    {
        name: "R03-07 known and unknown collapse",
        target: "R03-07",
        mutate: envelope => {
            envelope.knownState = "UNKNOWN";
            envelope.unknownState = "UNKNOWN";
        }
    },
    {
        name: "R03-08 correspondence collapse",
        target: "R03-08",
        mutate: envelope => {
            envelope.correspondence = true;
            envelope.nonCorrespondence = true;
        }
    },
    {
        name: "R03-09 responsibility boundary corruption",
        target: "R03-09",
        mutate: envelope => {
            envelope.responsibility = "forged-responsibility";
        }
    }
];

const validator = new WALIndependentValidator();

let failures = 0;

for (const attack of attacks) {
    const envelope = baseEnvelope();
    attack.mutate(envelope);

    const validation = validator.validateEnvelope(envelope);
    const failedRuleIds = validation.failedRules.map(rule => rule.id);

    console.log(`${attack.name}:`);
    console.log(`  status: ${validation.status}`);
    console.log(`  passed: ${validation.passed}`);
    console.log(`  failedRules: ${failedRuleIds.join(", ")}`);

    if (validation.passed || !failedRuleIds.includes(attack.target)) {
        failures++;
        console.error(`  EXPECTED BLOCK: ${attack.target}`);
    } else {
        console.log(`  BLOCKED: ${attack.target}`);
    }

    console.log("");
}

assert.equal(failures, 0);

console.log("=== R03 ATTACK COVERAGE TEST PASSED ===");
console.log("R03-01 through R03-09: direct attack paths BLOCKED");
console.log(`attacks: ${attacks.length}`);
