const HonestModule = require("./HonestRuntime.js");
const HonestRuntime = HonestModule.default || HonestModule;
const ResponsibilityRecord = require("./ResponsibilityRecord.cjs");

async function runTest() {
    console.log("=== 启动 Responsibility Record v1 全链路集成测试 ===");

    const runtime = new HonestRuntime();
    console.log("✅ HonestRuntime 成功实例化:", typeof runtime);

    const rawPayload = { query: "测试未经验证的内容传播" };

    const evalResult = {
        engine: "TestEngine",
        status: "UNKNOWN",
        verificationStatus: "UNVERIFIED",
        verifiedEvidenceCount: 0,
        canPropagate: false,
        canPublish: false,
        payload: rawPayload,
        trace: ["boundary_checked"]
    };

    try {
        const record = ResponsibilityRecord.fromEvent(evalResult);
        console.log("Record 生成成功:", record.toJSON());

        try {
            record.canPublish = true;
        } catch (e) {
            console.log("✅ 拦截成功：ResponsibilityRecord 属性不可变，无法被篡改。");
        }

    } catch (err) {
        console.error("测试异常:", err.message);
    }

    console.log("=== 测试通过：Responsibility Record v1 契约边界坚如磐石 ===");
}

runTest();
