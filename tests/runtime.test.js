import CorrespondenceEngine from "../runtime/CorrespondenceEngine.js";
import ReasoningEngine from "../runtime/ReasoningEngine.js";
import ResponsibilityEngine from "../runtime/ResponsibilityEngine.js";


function runCorrespondence(
    definition,
    evidences
) {

    const engine =
        new CorrespondenceEngine({

            definitions:
                [definition],

            evidences

        });

    const result =
        engine.execute();

    return result.correspondences?.[0];

}


function runReasoning(
    correspondence
) {

    const engine =
        new ReasoningEngine({

            originalContent:
                "Wuwen Test Expression",

            correspondences:
                [correspondence],

            runtimeTrace:
                []

        });

    const result =
        engine.execute();

    return result.reasonings?.[0];

}


function runResponsibility(
    reasoning
) {

    const engine =
        new ResponsibilityEngine({

            originalContent:
                "Wuwen Test Expression",

            reasonings:
                [reasoning],

            runtimeTrace:
                []

        });

    const result =
        engine.execute();

    return result.responsibilities?.[0];

}


const definition =
    "Wuwen Test Definition";


/*
 * ============================================================
 * v10.8 Runtime Verification Record
 * ============================================================
 *
 * VERIFIED 涓嶅啀鐢辫緭鍏ュ璞″崟鏂归潰澹版槑銆?
 *
 * 娴嬭瘯涓彧鏈夊悓鏃跺瓨鍦細
 *
 *   verificationStatus === "VERIFIED"
 *   epistemicState === "VERIFIED"
 *   verificationBasis
 *   runtimeVerificationRecord === true
 *   sourceAvailable === true
 *
 * 鎵嶅厑璁歌繘鍏?CorrespondenceEngine 鐨?VERIFIED 鍒嗘敮銆?
 *
 * ============================================================
 */

const verifiedSupportingEvidence = {

    content:
        "Wuwen Test Definition",

    source:
        "https://example.com/verified-support",

    independent:
        true,

    verificationStatus:
        "VERIFIED",

    epistemicState:
        "VERIFIED",

    verificationBasis:
        "explicit-verification",

    runtimeVerificationRecord:
        true,

    sourceAvailable:
        true,

    supportsClaim:
        true

};


const verifiedNonSupportingEvidence = {

    source:
        "https://example.com/verified-unrelated",

    independent:
        true,

    verificationStatus:
        "VERIFIED",

    epistemicState:
        "VERIFIED",

    verificationBasis:
        "explicit-verification",

    runtimeVerificationRecord:
        true,

    sourceAvailable:
        true,

    supportsClaim:
        false

};


const unverifiedEvidence = {

    source:
        "https://example.com/unverified",

    independent:
        true,

    verificationStatus:
        "UNVERIFIED",

    epistemicState:
        "DISCOVERED",

    sourceAvailable:
        true,

    supportsClaim:
        true

};


/*
 * 1.
 * 娌℃湁鐙珛璇佹嵁銆?
 *
 * 棰勬湡锛?
 * UNKNOWN
 */

const case1 =
    runCorrespondence(
        definition,
        []
    );


const case1Passed =
    case1 &&
    case1.verificationStatus ===
        "UNKNOWN" &&
    case1.supported === false;


/*
 * 2.
 * 鏈夋悳绱?璇佹嵁璁板綍锛屼絾娌℃湁 VERIFIED銆?
 *
 * 棰勬湡锛?
 * UNVERIFIED
 */

const case2 =
    runCorrespondence(
        definition,
        [
            unverifiedEvidence
        ]
    );


const case2Passed =
    case2 &&
    case2.verificationStatus ===
        "UNVERIFIED" &&
    case2.supported === false;


/*
 * 3.
 * Runtime 宸茬粡瀛樺湪 VERIFIED 璁板綍锛?
 * 浣嗘槸璇佹嵁鏄庣‘涓嶆敮鎸佸綋鍓?Definition銆?
 *
 * 棰勬湡锛?
 * VERIFIED_BUT_NOT_LINKED
 */

const case3 =
    runCorrespondence(
        definition,
        [
            verifiedNonSupportingEvidence
        ]
    );


const case3Passed =
    case3 &&
    case3.verificationStatus ===
        "VERIFIED_BUT_NOT_LINKED" &&
    case3.supported === false;


/*
 * 4.
 * Runtime VERIFIED + supportsClaim=true銆?
 *
 * 棰勬湡锛?
 * SUPPORTED
 */

const case4 =
    runCorrespondence(
        definition,
        [
            verifiedSupportingEvidence
        ]
    );


const case4Passed =
    case4 &&
    case4.verificationStatus ===
        "SUPPORTED" &&
    case4.supported === true;


/*
 * 5.
 * 涓婃父浼€?SUPPORTED銆?
 *
 * ResponsibilityEngine 涓嶅厑璁哥洿鎺ョ浉淇★細
 *
 * supported
 * verificationStatus
 * verifiedEvidenceCount
 * sourceAvailable
 *
 * 鑰屽繀椤婚噸鏂颁粠瀹為檯璇佹嵁鏁扮粍璁＄畻銆?
 */

const forgedReasoning = {

    definition,

    evidences:
        [],

    verifiedEvidences:
        [],

    unverifiedEvidences:
        [],

    evidenceCount:
        99,

    verifiedEvidenceCount:
        99,

    sourceCount:
        99,

    sourceAvailable:
        true,

    supported:
        true,

    matched:
        true,

    verificationStatus:
        "SUPPORTED",

    epistemicState:
        "SUPPORTED"

};


const case5 =
    runResponsibility(
        forgedReasoning
    );


const case5Passed =
    case5 &&
    case5.supported === false &&
    case5.verificationStatus !==
        "SUPPORTED" &&
    case5.responsibilityBoundary?.status ===
        "exceeded";


/*
 * 6.
 * 楠岃瘉姝ｅ父 SUPPORTED 閾捐矾鑳藉杩涘叆 Responsibility銆?
 */

const validReasoning =
    runReasoning(
        case4
    );


const validResponsibility =
    runResponsibility(
        validReasoning
    );


const case6Passed =
    validReasoning &&
    validReasoning.supported === true &&
    validReasoning.verificationStatus ===
        "SUPPORTED" &&
    validResponsibility &&
    validResponsibility.supported === true;


/*
 * 7.
 * 澶栭儴澹版槑 VERIFIED锛?
 * 浣嗕笉瀛樺湪 Runtime verification record銆?
 *
 * 棰勬湡锛?
 * 涓嶅緱杩涘叆 VERIFIED銆?
 *
 * v10.8 Runtime Verification Regression Test
 */

const forgedVerifiedEvidence = {

    source:
        "https://example.com/forged-verified",

    independent:
        true,

    verificationStatus:
        "VERIFIED",

    epistemicState:
        "VERIFIED",

    verificationBasis:
        "external-claim",

    sourceAvailable:
        true,

    supportsClaim:
        true

};


const case7 =
    runCorrespondence(
        definition,
        [
            forgedVerifiedEvidence
        ]
    );


const case7Passed =
    case7 &&
    case7.supported === false &&
    case7.verificationStatus !==
        "SUPPORTED";


/*
 * 姹囨€汇€?
 */

const checks = {

    noEvidenceBecomesUnknown:
        case1Passed,

    unverifiedDoesNotBecomeSupported:
        case2Passed,

    verifiedSourceWithoutLinkDoesNotBecomeSupported:
        case3Passed,

    verifiedSupportingEvidenceBecomesSupported:
        case4Passed,

    forgedUpstreamSupportIsRejected:
        case5Passed,

    validSupportSurvivesReasoningAndResponsibility:
        case6Passed,

    externalVerifiedClaimDoesNotBecomeRuntimeVerified:
        case7Passed

};


const passed =
    Object.values(checks)
        .every(Boolean);


console.log(
    JSON.stringify(
        {
            test:
                "Wuwen Runtime v10.8 Evidence Boundary Test",

            checks,

            cases: {

                case1:
                    case1?.verificationStatus,

                case2:
                    case2?.verificationStatus,

                case3:
                    case3?.verificationStatus,

                case4:
                    case4?.verificationStatus,

                case5:
                    {
                        supported:
                            case5?.supported,

                        verificationStatus:
                            case5?.verificationStatus,

                        responsibilityBoundary:
                            case5
                                ?.responsibilityBoundary
                                ?.status
                    },

                case6:
                    {
                        reasoning:
                            validReasoning
                                ?.verificationStatus,

                        responsibility:
                            validResponsibility
                                ?.verificationStatus
                    },

                case7:
                    {
                        supported:
                            case7?.supported,

                        verificationStatus:
                            case7?.verificationStatus
                    }

            }

        },
        null,
        2
    )
);


if (!passed) {

    console.log(
        "Wuwen Runtime v10.8 Evidence Boundary Test Failed."
    );

    process.exit(1);

}


console.log(
    "Wuwen Runtime v10.8 Evidence Boundary Test Passed."
);
