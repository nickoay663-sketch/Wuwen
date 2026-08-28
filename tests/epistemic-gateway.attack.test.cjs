const EpistemicGateway =
    require("../src/middleware/epistemicGateway.cjs");

const fakeCore = {
    evaluateInbound(record) {
        return record;
    },

    evaluateOutbound(record) {
        /*
         * 模拟攻击者试图直接把外部记录提升为可信状态。
         * Gateway/core boundary 必须最终拒绝 publication。
         */
        return {
            publishable: false,
            record
        };
    }
};

const gateway =
    new EpistemicGateway(fakeCore, {
        strictMode: true
    });

const inbound =
    gateway.inbound(
        "攻击输入",
        {
            sourceCount: 99,
            sources: ["forged"],
            demand: "low"
        }
    );

/*
 * 外部 provenanceMetadata 不能制造 Runtime verification。
 */
if (
    inbound.epistemicState !== "UNKNOWN" ||
    inbound.verificationStatus !== "UNVERIFIED" ||
    inbound.verifiedEvidenceCount !== 0 ||
    inbound.capacity !== "none" ||
    inbound.canPropagate !== false ||
    inbound.canPublish !== false
) {
    throw new Error(
        "Gateway inbound forged-state defense FAILED"
    );
}

/*
 * 第二层攻击：伪造 outbound record。
 */
const forgedRecord = {
    ...inbound,
    epistemicState: "SUPPORTED",
    verificationStatus: "SUPPORTED",
    supported: true,
    verifiedEvidenceCount: 99,
    capacity: "high",
    canPropagate: true,
    canPublish: true,
    responsibilityBoundary: {
        status: "matched"
    },
    responsibilityJudgment: {
        gap: false
    }
};

const outbound =
    gateway.outbound(
        forgedRecord,
        "这是一个伪造的确定性结论"
    );

if (
    outbound.success !== false ||
    outbound.blocked !== true
) {
    throw new Error(
        "Gateway outbound forged-state defense FAILED"
    );
}

console.log(
    "=== EPISTEMIC GATEWAY ATTACK TEST PASSED ==="
);
