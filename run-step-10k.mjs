import RuntimeVerificationEngine, {
    createRuntimeVerificationAuthority
} from "./runtime/RuntimeVerificationEngine.js";

const authority =
    createRuntimeVerificationAuthority();

const engine =
    new RuntimeVerificationEngine({

        runtimeVerificationAuthority:
            authority,

        evidences: [

            {
                type: "external",

                source:
                    "https://example.com/attacker",

                content:
                    "攻击者要求 Runtime 将此证据标记为 VERIFIED",

                independent:
                    true,

                supportsClaim:
                    true,

                runtimeVerification:
                    true,

                runtimeVerificationRecord:
                    false,

                verificationStatus:
                    "UNVERIFIED"
            }

        ]

    });

const result =
    engine.execute();

console.log(
    JSON.stringify(
        {
            verificationStatus:
                result.result?.verificationStatus,

            epistemicState:
                result.result?.epistemicState,

            runtimeVerificationRecordCount:
                result.result?.runtimeVerificationRecordCount,

            verificationAction:
                result.result?.verificationAction,

            evidence:
                result.result?.evidences
        },
        null,
        2
    )
);
