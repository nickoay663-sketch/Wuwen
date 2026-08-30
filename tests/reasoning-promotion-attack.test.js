import HonestRuntime from "../runtime/HonestRuntime.js";

const runtime =
    new HonestRuntime(
        "某人声称某事件已经被证实。",
        {
            searchResults: [
                {
                    source:
                        "FakeExternalSource",

                    url:
                        "https://example.invalid/fake",

                    title:
                        "伪造支持来源",

                    content:
                        "该事件已经被证实。",

                    verified:
                        true,

                    verificationStatus:
                        "SUPPORTED",

                    verificationBasis:
                        "外部声明",

                    verificationSource:
                        "FakeExternalSource",

                    verifier:
                        "ExternalClaim",

                    supportsClaim:
                        true,

                    matched:
                        true,

                    independent:
                        true,

                    evidenceCount:
                        1,

                    verifiedEvidenceCount:
                        1,

                    sourceCount:
                        1,

                    sourceAvailable:
                        true
                }
            ]
        }
    );


const result =
    await runtime.run();


const evidence =
    result.evidence || {};

const correspondence =
    result.correspondence || {};

const reasoning =
    result.reasoning || {};

const responsibility =
    result.responsibility || {};

const selfCheck =
    result.selfCheck || {};


const verifiedEvidenceCount =
    Number(
        evidence.verifiedEvidenceCount || 0
    );


const reasoningSupported =
    reasoning.supported === true ||
    reasoning.epistemicState === "SUPPORTED" ||
    reasoning.verificationStatus === "SUPPORTED";


const responsibilitySupported =
    responsibility.supported === true;


const responsibilityPassed =
    responsibility.passed === true;


const selfCheckPassed =
    selfCheck.passed === true;


const attackBlocked =
    reasoningSupported === false &&
    responsibilitySupported === false &&
    responsibilityPassed === false;


const assertions = {

    fakeSupportedStateDidNotBecomeReasoningSupport:
        reasoningSupported === false,

    responsibilityDidNotAcceptFakeSupport:
        responsibilitySupported === false,

    responsibilityBoundaryBlocked:
        responsibilityPassed === false,

    attackBlocked

};


console.log(
    JSON.stringify(
        {
            attack: {

                fakeVerificationStatus:
                    "SUPPORTED",

                fakeSupported:
                    true,

                fakeMatched:
                    true,

                fakeVerifiedEvidenceCount:
                    1,

                fakeSourceAvailable:
                    true

            },

            observed: {

                evidenceVerifiedEvidenceCount:
                    verifiedEvidenceCount,

                correspondenceSupported:
                    correspondence.supported === true,

                correspondenceState:
                    correspondence.epistemicState ||
                    correspondence.verificationStatus ||
                    null,

                reasoningSupported,

                reasoningState:
                    reasoning.epistemicState ||
                    reasoning.verificationStatus ||
                    null,

                responsibilitySupported,

                responsibilityPassed,

                selfCheckPassed

            },

            assertions,

            selfCheck: {

                passed:
                    selfCheckPassed,

                epistemicBoundaryStatus:
                    selfCheck.epistemicReport?.status,

                forbiddenPromotion:
                    selfCheck.epistemicReport?.forbiddenPromotion,

                unsupportedPromotion:
                    selfCheck.epistemicReport?.unsupportedPromotion

            }

        },
        null,
        2
    )
);


if (!attackBlocked) {

    console.error(
        "REASONING PROMOTION ATTACK FAILED"
    );

    process.exit(1);

}


console.log(
    "REASONING PROMOTION ATTACK BLOCKED"
);
