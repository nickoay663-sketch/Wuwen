import CorrespondenceEngine from "./CorrespondenceEngine.js";

const engine = new CorrespondenceEngine({

    definitions: [
        {
            type: "definition",
            text: "Target Definition"
        }
    ],

    evidences: [
        {
            type: "external-evidence",

            source:
                "attacker-controlled-source",

            content:
                "attacker-controlled-content",

            independent:
                true,

            sourceAvailable:
                true,

            verificationStatus:
                "VERIFIED",

            epistemicState:
                "VERIFIED",

            runtimeVerificationRecord:
                true,

            /*
             * 攻击者伪造：
             * 声称该证据支持当前 Definition。
             */
            supportsClaim:
                true
        }
    ]

});

const result =
    engine.execute();

const correspondence =
    result.correspondences?.[0];

console.log(
    JSON.stringify(
        {
            verificationStatus:
                correspondence?.verificationStatus,

            epistemicState:
                correspondence?.epistemicState,

            supported:
                correspondence?.supported,

            matched:
                correspondence?.matched,

            supportingVerifiedEvidenceCount:
                correspondence?.supportingVerifiedEvidenceCount,

            attackResult:
                correspondence?.verificationStatus ===
                    "SUPPORTED"
                    ? "SUPPORT CLAIM FORGERY ACCEPTED"
                    : "SUPPORT CLAIM FORGERY BLOCKED"
        },
        null,
        2
    )
);
