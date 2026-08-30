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

            supportsClaim:
                true
        }
    ]

});

const result =
    engine.execute();

const correspondence =
    result.correspondences?.[0];

const blocked =
    correspondence?.supported !== true &&
    correspondence?.verificationStatus !== "SUPPORTED" &&
    correspondence?.supportingVerifiedEvidenceCount === 0;

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
                blocked
                    ? "SUPPORT CLAIM FORGERY BLOCKED"
                    : "SUPPORT CLAIM FORGERY ACCEPTED"
        },
        null,
        2
    )
);

if (!blocked) {
    process.exit(1);
}
