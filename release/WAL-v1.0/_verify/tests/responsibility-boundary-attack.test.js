import ResponsibilityEngine from "../runtime/ResponsibilityEngine.js";

const fakeReasoning = {
    definition: "某事件已经被证实。",
    evidences: [],
    verifiedEvidences: [],

    evidenceCount: 1,

    // 攻击载荷
    verifiedEvidenceCount: 1,
    sourceCount: 1,
    sourceAvailable: true,
    supported: true,
    matched: true,
    verificationStatus: "SUPPORTED",
    epistemicState: "SUPPORTED"
};

const semanticObject = {
    originalContent: "某事件已经被证实。",
    reasonings: [fakeReasoning],
    runtimeTrace: [],
    engines: {},
    contract: {
        identity: {
            runtimeVersion: "10.4"
        },
        version: "10.4"
    }
};

const engine =
    new ResponsibilityEngine(semanticObject);

const result =
    engine.execute();

const responsibility =
    result.responsibilities?.[0] || {};

const boundary =
    responsibility.responsibilityBoundary || {};

const capacity =
    responsibility.responsibilityCapacity || {};

const attackBlocked =
    responsibility.supported !== true
    &&
    boundary.status === "exceeded"
    &&
    capacity.level === "none";

console.log(
    JSON.stringify(
        {
            attack: {
                fakeVerificationStatus:
                    "SUPPORTED",

                fakeSupported:
                    true,

                fakeVerifiedEvidenceCount:
                    1,

                fakeSourceAvailable:
                    true,

                actualVerifiedSources:
                    responsibility.verifiedSources?.length || 0
            },

            observed: {
                supported:
                    responsibility.supported === true,

                verificationStatus:
                    responsibility.verificationStatus,

                verifiedEvidenceCount:
                    responsibility.verifiedEvidenceCount,

                verifiedSourceCount:
                    responsibility.verifiedSources?.length || 0,

                capacity:
                    capacity.level,

                boundary:
                    boundary.status
            },

            assertions: {
                fakeSupportDidNotBecomeCapacity:
                    capacity.level === "none",

                fakeSupportDidNotPassBoundary:
                    boundary.status === "exceeded",

                attackBlocked
            }
        },
        null,
        2
    )
);

if (!attackBlocked) {

    console.error(
        "RESPONSIBILITY BOUNDARY ATTACK FAILED: 伪造 reasoning 状态穿透 ResponsibilityEngine。"
    );

    process.exit(1);
}

console.log(
    "RESPONSIBILITY BOUNDARY ATTACK BLOCKED"
);
