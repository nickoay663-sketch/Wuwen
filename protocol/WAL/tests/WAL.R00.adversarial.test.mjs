import WALContract from "../validator/WALContract.js";
import WALIndependentValidator from "../validator/WALIndependentValidator.js";

const validator = new WALIndependentValidator();

function baseEnvelope() {
    return WALContract.createEnvelope({
        eventId: "r00-adversarial-test",
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
        id: "R00-01",
        description: "Malformed WAL envelope bypasses structural validation",
        mutate: e => {
            delete e.eventId;
        },
        expect: "R00-01"
    },
    {
        id: "R00-06",
        description: "RuntimeClosed is falsely treated as factual verification",
        mutate: e => {
            e.runtimeState = "RuntimeClosed";
            e.verificationState = "VERIFIED";
            e.factualVerification = false;
        },
        expect: "R00-06"
    }
];

let failed = false;

for (const attack of attacks) {
    const envelope = baseEnvelope();
    attack.mutate(envelope);

    const result = validator.validateEnvelope(envelope);
    const failedRuleIds = result.failedRules.map(rule => rule.id);

    const blocked = failedRuleIds.includes(attack.expect);

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
    console.error("\n=== R00 ATTACK COVERAGE TEST FAILED ===");
    process.exit(1);
}

console.log("\n=== R00 ATTACK COVERAGE TEST PASSED ===");
console.log("R00-01 and R00-06: BLOCKED");
