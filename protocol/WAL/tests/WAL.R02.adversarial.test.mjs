import WALContract from "../validator/WALContract.js";
import WALIndependentValidator from "../validator/WALIndependentValidator.js";

const validator = new WALIndependentValidator();

function baseEnvelope() {
    return WALContract.createEnvelope({
        eventId: "r02-adversarial-test",
        expression: "test claim",
        identity: null,
        timestamp: new Date().toISOString(),
        verificationState: "UNKNOWN",
        responsibilityState: "UNESTABLISHED",
        propagationState: "REQUIRE_VERIFICATION",
        runtimeVersion: "10.8",
        contractVersion: "1.0"
    });
}

const attacks = [
    {
        id: "R02-02 / R02-10",
        description: "DISCOVERED is silently promoted to VERIFIED",
        mutate: e => {
            e.discoveryState = "DISCOVERED";
            e.verificationState = "VERIFIED";
        },
        expect: ["R02-02", "R02-10"]
    },
    {
        id: "R02-03",
        description: "Source existence is treated as evidence",
        mutate: e => {
            e.sourceExists = true;
            e.evidenceDerivedFromExistence = true;
        },
        expect: ["R02-03"]
    },
    {
        id: "R02-04",
        description: "Source existence alone establishes correspondence",
        mutate: e => {
            e.sourceExists = true;
            e.correspondence = true;
            e.correspondenceBasis = "SOURCE_EXISTS";
        },
        expect: ["R02-04"]
    },
    {
        id: "R02-11",
        description: "UNVERIFIED is silently promoted to VERIFIED",
        mutate: e => {
            e.previousVerificationState = "UNVERIFIED";
            e.verificationState = "VERIFIED";
        },
        expect: ["R02-11"]
    },
    {
        id: "R02-13",
        description: "VERIFIED_BUT_NOT_LINKED is silently promoted to SUPPORTED",
        mutate: e => {
            e.epistemicState = "VERIFIED_BUT_NOT_LINKED";
            e.verificationState = "SUPPORTED";
        },
        expect: ["R02-13"]
    }
];

let failed = false;

for (const attack of attacks) {
    const envelope = baseEnvelope();
    attack.mutate(envelope);

    const result = validator.validateEnvelope(envelope);
    const failedRuleIds = result.failedRules.map(rule => rule.id);

    const blocked = attack.expect.every(id =>
        failedRuleIds.includes(id)
    );

    console.log(
        `${attack.id} | ${blocked ? "BLOCKED" : "NOT BLOCKED"}`
    );
    console.log(`  ${attack.description}`);
    console.log(`  failedRules: ${failedRuleIds.join(", ")}`);

    if (!blocked) {
        failed = true;
    }
}

if (failed) {
    console.error("\n=== R02 ATTACK COVERAGE TEST FAILED ===");
    process.exit(1);
}

console.log("\n=== R02 ATTACK COVERAGE TEST PASSED ===");
console.log("R02-02, R02-03, R02-04, R02-10, R02-11, R02-13: BLOCKED");
