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
            type: "runtime-evidence",

            source:
                "runtime-verified-source",

            content:
                "runtime-verified-content",

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

const result = engine.execute();
const correspondence = result.correspondences?.[0];

const passed =
    correspondence?.verificationStatus === "VERIFIED_BUT_NOT_LINKED" &&
    correspondence?.epistemicState === "VERIFIED_BUT_NOT_LINKED" &&
    correspondence?.supported === false &&
    correspondence?.matched === false &&
    correspondence?.supportingVerifiedEvidenceCount === 0;

console.log(JSON.stringify({
    verificationStatus: correspondence?.verificationStatus,
    epistemicState: correspondence?.epistemicState,
    supported: correspondence?.supported,
    matched: correspondence?.matched,
    supportingVerifiedEvidenceCount:
        correspondence?.supportingVerifiedEvidenceCount,
    result:
        passed
            ? "POSITIVE CONTROL PASSED"
            : "POSITIVE CONTROL FAILED"
}, null, 2));

if (!passed) process.exit(1);
