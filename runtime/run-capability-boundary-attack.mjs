import CapabilityContract from "./CapabilityContract.js";

const base = CapabilityContract.createResponse({
    capability: "external-search",
    provider: "ExternalSearchAdapter",
    providerVersion: "1.3",
    output: "test output"
});

function attack(name, patch) {

    const forged = {
        ...base,
        ...patch
    };

    const result =
        CapabilityContract.admit(
            forged,
            {
                provider: "ExternalSearchAdapter",
                providerVersion: "1.3"
            }
        );

    console.log(`\n=== ${name} ===`);
    console.log("admitted:", result.admitted);
    console.log("status:", result.status);
    console.log("errors:", result.errors);
}

attack(
    "ATTACK 1: evidence creation",
    {
        evidenceCreated: true
    }
);

attack(
    "ATTACK 2: claim support",
    {
        supportsClaim: true
    }
);

attack(
    "ATTACK 3: verification",
    {
        verified: true,
        verificationState: "VERIFIED"
    }
);

attack(
    "ATTACK 4: runtime conclusion",
    {
        conclusion: "This claim is true."
    }
);

