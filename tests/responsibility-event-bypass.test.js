import assert from "node:assert/strict";
import ResponsibilityEvent from "../runtime/ResponsibilityEvent.js";

function baseRecord(overrides = {}) {

    return {

        verificationStatus:
            "SUPPORTED",

        supported:
            true,

        responsibilityBoundary: {

            status:
                "matched"

        },

        responsibilityCapacity: {

            level:
                "verified"

        },

        responsibilityDemand: {

            level:
                "medium"

        },

        responsibilityJudgment: {

            demand:
                "medium",

            capacity:
                "verified",

            gap:
                false

        },

        ...overrides

    };

}

function createEvent({

    epistemicState =
        "SUPPORTED",

    responsibility,

    ...rest

} = {}) {

    return new ResponsibilityEvent({

        expression:
            "杩欐槸涓€涓簨瀹?,

        epistemicState,

        responsibility,

        runtimeVersion:
            "10.4",

        contractVersion:
            "10.4",

        ...rest

    });

}

function assertRejected(event, name) {

    const validation =
        event.validate();

    const publishable =
        event.isPublishable();

    assert.equal(
        validation.passed,
        true,
        `${name}: structurally valid event must remain valid`
    );

    assert.equal(
        publishable,
        false,
        `${name}: conflicting responsibility layers must not become publishable`
    );

    return publishable;

}

function assertAccepted(event, name) {

    const validation =
        event.validate();

    const publishable =
        event.isPublishable();

    assert.equal(
        validation.passed,
        true,
        `${name}: valid event must pass validation`
    );

    assert.equal(
        publishable,
        true,
        `${name}: coherent responsibility record must be publishable`
    );

    return publishable;

}


/*
 * =========================================================
 * CASE 1
 *
 * Outer result says supported=true
 * responsibilities[0] says supported=false
 *
 * Cannot select the favorable layer.
 * =========================================================
 */

const case1 =
    createEvent({

        responsibility: {

            supported:
                true,

            verificationStatus:
                "SUPPORTED",

            responsibilityBoundary: {

                status:
                    "matched"

            },

            responsibilities: [

                baseRecord({

                    supported:
                        false

                })

            ]

        }

    });

const result1 =
    assertRejected(
        case1,
        "case1"
    );


/*
 * =========================================================
 * CASE 2
 *
 * Outer verificationStatus=SUPPORTED
 * responsibilities[0].verificationStatus=UNKNOWN
 *
 * Cannot use the favorable verification layer.
 * =========================================================
 */

const case2 =
    createEvent({

        responsibility: {

            supported:
                true,

            verificationStatus:
                "SUPPORTED",

            responsibilityBoundary: {

                status:
                    "matched"

            },

            responsibilities: [

                baseRecord({

                    verificationStatus:
                        "UNKNOWN"

                })

            ]

        }

    });

const result2 =
    assertRejected(
        case2,
        "case2"
    );


/*
 * =========================================================
 * CASE 3
 *
 * Outer boundary=matched
 * responsibilities[0].boundary=exceeded
 *
 * Cannot use the favorable boundary layer.
 * =========================================================
 */

const case3 =
    createEvent({

        responsibility: {

            supported:
                true,

            verificationStatus:
                "SUPPORTED",

            responsibilityBoundary: {

                status:
                    "matched"

            },

            responsibilities: [

                baseRecord({

                    responsibilityBoundary: {

                        status:
                            "exceeded"

                    }

                })

            ]

        }

    });

const result3 =
    assertRejected(
        case3,
        "case3"
    );


/*
 * =========================================================
 * CASE 4
 *
 * result says SUPPORTED
 * result.responsibilities[0] says unsupported.
 *
 * No cross-level promotion.
 * =========================================================
 */

const case4 =
    createEvent({

        responsibility: {

            result: {

                supported:
                    true,

                verificationStatus:
                    "SUPPORTED",

                responsibilityBoundary: {

                    status:
                        "matched"

                },

                responsibilities: [

                    baseRecord({

                        supported:
                            false

                    })

                ]

            }

        }

    });

const result4 =
    assertRejected(
        case4,
        "case4"
    );


/*
 * =========================================================
 * CASE 5
 *
 * result.responsibilities[0] contains favorable state,
 * while result-level state is contradictory.
 *
 * Favorable nested state must not bypass contradiction.
 * =========================================================
 */

const case5 =
    createEvent({

        responsibility: {

            result: {

                supported:
                    false,

                verificationStatus:
                    "UNKNOWN",

                responsibilityBoundary: {

                    status:
                        "exceeded"

                },

                responsibilities: [

                    baseRecord({

                        supported:
                            true

                    })

                ]

            }

        }

    });

const result5 =
    assertRejected(
        case5,
        "case5"
    );


/*
 * =========================================================
 * CASE 6
 *
 * Different required fields are deliberately distributed
 * across different responsibility layers.
 *
 * The event must not assemble:
 *
 * supported=true
 * verificationStatus=SUPPORTED
 * boundary=matched
 *
 * from different records.
 * =========================================================
 */

const case6 =
    createEvent({

        responsibility: {

            supported:
                true,

            responsibilities: [

                baseRecord({

                    supported:
                        false,

                    verificationStatus:
                        "SUPPORTED",

                    responsibilityBoundary: {

                        status:
                            "exceeded"

                    }

                })

            ],

            result: {

                verificationStatus:
                    "SUPPORTED",

                responsibilityBoundary: {

                    status:
                        "matched"

                }

            }

        }

    });

const result6 =
    assertRejected(
        case6,
        "case6"
    );


/*
 * =========================================================
 * CASE 7
 *
 * Single coherent responsibility record.
 *
 * Must remain publishable.
 * =========================================================
 */

const case7 =
    createEvent({

        responsibility: {

            responsibilities: [

                baseRecord()

            ]

        }

    });

const result7 =
    assertAccepted(
        case7,
        "case7"
    );


/*
 * =========================================================
 * CASE 8
 *
 * Serialization must preserve the rejected state.
 * =========================================================
 */

const serializedCase3 =
    JSON.stringify(
        case3
    );

const parsedCase3 =
    JSON.parse(
        serializedCase3
    );

assert.equal(
    parsedCase3.supported,
    true,
    "serialized event preserves extracted outer state"
);

assert.equal(
    parsedCase3.responsibilityBoundary.status,
    "exceeded",
    "serialized event preserves extracted normalized responsibility boundary"
);

assert.equal(
    case3.isPublishable(),
    false,
    "serialization must not create publication authority"
);


/*
 * =========================================================
 * RESULT
 * =========================================================
 */

const report = {

    test:
        "WAL ResponsibilityEvent Nested Responsibility Bypass Test v2",

    checks: {

        outerSupportConflictsWithNested:
            result1 === false,

        outerVerificationConflictsWithNested:
            result2 === false,

        outerBoundaryConflictsWithNested:
            result3 === false,

        resultLayerConflictsWithNested:
            result4 === false,

        nestedFavorableStateCannotOverrideContradiction:
            result5 === false,

        crossLayerStateAssemblyRejected:
            result6 === false,

        coherentResponsibilityAccepted:
            result7 === true,

        serializationPreservesPublicationDecision:
            case3.isPublishable() === false

    },

    cases: {

        case1: {

            supported:
                case1.supported,

            verificationStatus:
                case1.verificationStatus,

            responsibilityBoundary:
                case1.responsibilityBoundary,

            publishable:
                case1.isPublishable()

        },

        case2: {

            supported:
                case2.supported,

            verificationStatus:
                case2.verificationStatus,

            responsibilityBoundary:
                case2.responsibilityBoundary,

            publishable:
                case2.isPublishable()

        },

        case3: {

            supported:
                case3.supported,

            verificationStatus:
                case3.verificationStatus,

            responsibilityBoundary:
                case3.responsibilityBoundary,

            publishable:
                case3.isPublishable()

        },

        case4: {

            supported:
                case4.supported,

            verificationStatus:
                case4.verificationStatus,

            responsibilityBoundary:
                case4.responsibilityBoundary,

            publishable:
                case4.isPublishable()

        },

        case5: {

            supported:
                case5.supported,

            verificationStatus:
                case5.verificationStatus,

            responsibilityBoundary:
                case5.responsibilityBoundary,

            publishable:
                case5.isPublishable()

        },

        case6: {

            supported:
                case6.supported,

            verificationStatus:
                case6.verificationStatus,

            responsibilityBoundary:
                case6.responsibilityBoundary,

            publishable:
                case6.isPublishable()

        },

        case7: {

            supported:
                case7.supported,

            verificationStatus:
                case7.verificationStatus,

            responsibilityBoundary:
                case7.responsibilityBoundary,

            publishable:
                case7.isPublishable()

        }

    }

};

console.log(
    JSON.stringify(
        report,
        null,
        2
    )
);

console.log(
    "WAL ResponsibilityEvent Nested Responsibility Bypass Test v2 Passed."
);
