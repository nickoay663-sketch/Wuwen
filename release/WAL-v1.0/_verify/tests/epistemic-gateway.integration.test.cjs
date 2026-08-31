const EpistemicGateway =
    require("../src/middleware/epistemicGateway.cjs");

const fakeCore = {
    evaluateInbound(record) {
        return record;
    },

    evaluateOutbound(record) {
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
        "这是一个未经验证的事实",
        {}
    );

console.log("=== INBOUND ===");
console.log(JSON.stringify(inbound, null, 2));

const outbound =
    gateway.outbound(
        inbound,
        "这是一个应该被拦截的确定性结论"
    );

console.log("=== OUTBOUND ===");
console.log(JSON.stringify(outbound, null, 2));

if (
    inbound.epistemicState !== "UNKNOWN" ||
    inbound.verificationStatus !== "UNVERIFIED" ||
    inbound.capacity !== "none" ||
    inbound.canPropagate !== false ||
    inbound.canPublish !== false
) {
    throw new Error(
        "Gateway inbound boundary FAILED"
    );
}

if (
    outbound.blocked !== true ||
    outbound.success !== false
) {
    throw new Error(
        "Gateway outbound boundary FAILED"
    );
}

console.log(
    "\n=== EPISTEMIC GATEWAY INTEGRATION TEST PASSED ==="
);
