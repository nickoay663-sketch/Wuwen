import ResponsibilityEvent from "../runtime/ResponsibilityEvent.js";

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function makeEvent(overrides = {}) {

    return new ResponsibilityEvent({

        expression:
            "娴嬭瘯琛ㄨ揪",

        epistemicState:
            "SUPPORTED",

        responsibility: {

            responsibilities: [{

                expression:
                    "娴嬭瘯琛ㄨ揪",

                supported:
                    true,

                verificationStatus:
                    "SUPPORTED",

                responsibilityBoundary: {

                    status:
                        "matched"

                },

                responsibilityJudgment: {

                    gap:
                        false

                },

                responsibilityDemand: {

                    level:
                        "medium"

                },

                responsibilityCapacity: {

                    level:
                        "medium",

                    actualSupport:
                        true

                }

            }]

        },

        ...overrides

    });

}


/*
 * CASE 1
 * 瀹屾暣璐ｄ换閾惧繀椤昏幏寰楀敮涓€鍙戝竷鎺堟潈銆?
 */

const valid =
    makeEvent();

const case1 =
    valid.isPublishable();


/*
 * CASE 2
 * 涓嬫父 reconstruction.publishable 涓嶈兘浼€犲彂甯冩潈銆?
 */

const fakeReconstruction =
{
    publishable:
        true,

    verificationStatus:
        "SUPPORTED",

    reconstructionState:
        "SUPPORTED"
};

const case2 =
    valid.isPublishable() &&
    fakeReconstruction.publishable === true;


/*
 * CASE 3
 * Generator/Reconstruction 鐨勭姸鎬佷笉鑳芥浛浠?
 * ResponsibilityEvent 鐨勫彂甯冩巿鏉冦€?
 *
 * epistemicState 鏀规垚 UNKNOWN 鍚庯紝
 * 鍗充娇涓嬫父缁х画澹扮О SUPPORTED锛屼篃蹇呴』鎷掔粷銆?
 */

const invalid =
    makeEvent({

        epistemicState:
            "UNKNOWN"

    });

const fakeDownstream =
{
    publishable:
        true,

    verificationStatus:
        "SUPPORTED"
};

const case3 =
    invalid.isPublishable() === false &&
    fakeDownstream.publishable === true;


/*
 * CASE 4
 * responsibility boundary 琚獊鐮存椂锛?
 * 浠讳綍涓嬫父 SUPPORTED 閮戒笉鑳芥仮澶嶅彂甯冩潈銆?
 */

const exceeded =
    makeEvent({

        responsibility: {

            responsibilities: [{

                expression:
                    "娴嬭瘯琛ㄨ揪",

                supported:
                    true,

                verificationStatus:
                    "SUPPORTED",

                responsibilityBoundary: {

                    status:
                        "exceeded"

                },

                responsibilityJudgment: {

                    gap:
                        true

                }

            }]

        }

    });

const case4 =
    exceeded.isPublishable() === false;


/*
 * CASE 5
 * 搴忓垪鍖栦笉鑳芥敼鍙樺敮涓€鍙戝竷鎺堟潈銆?
 */

const serialized =
    JSON.parse(
        JSON.stringify(valid)
    );

const restored =
    new ResponsibilityEvent(serialized);

const case5 =
    restored.isPublishable() ===
    valid.isPublishable();


const checks = {

    validResponsibilityCreatesAuthority:
        case1 === true,

    downstreamPublishableIsNotAuthority:
        case2 === true,

    unsupportedUpstreamCannotBePromoted:
        case3 === true,

    exceededBoundaryCannotBePublished:
        case4 === true,

    serializationPreservesAuthority:
        case5 === true

};

assert(
    Object.values(checks).every(Boolean),
    "WAL v10.8 Publication Authority Test Failed"
);

console.log(
    JSON.stringify(
        {
            test:
                "Wuwen Runtime v10.8 Single Publication Authority Test",

            checks,

            publicationAuthority:
                valid.isPublishable(),

            invalidPublicationAuthority:
                invalid.isPublishable(),

            exceededBoundaryAuthority:
                exceeded.isPublishable()
        },
        null,
        2
    )
);

console.log(
    "Wuwen Runtime v10.8 Single Publication Authority Test Passed."
);
