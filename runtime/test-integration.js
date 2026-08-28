import Schema from "./ResponsibilityRecordSchema.js";
import MWALContract from "./MWALContract.js";

console.log("=== 启动莫问责任记录契约集成测试 ===");

// 1. 测试合法记录
const validRecord = {
    id: "rec_test_001",
    epistemicState: MWALContract.RESPONSIBILITY_STATES.ESTABLISHED,
    verificationStatus: MWALContract.VERIFICATION_STATES.SUPPORTED,
    verifiedEvidenceCount: 3,
    canPublish: true
};

const result1 = Schema.validate(validRecord);
console.log("【测试 1: 合法记录】", result1.valid ? "通过 (PASS)" : `失败: ${result1.error}`);

// 2. 测试违规记录：无证据却尝试发布
const invalidRecord1 = {
    id: "rec_test_002",
    epistemicState: MWALContract.RESPONSIBILITY_STATES.ESTABLISHED,
    verificationStatus: MWALContract.VERIFICATION_STATES.SUPPORTED,
    verifiedEvidenceCount: 0, // 违规：有状态但无验证证据
    canPublish: true
};

const result2 = Schema.validate(invalidRecord1);
console.log("【测试 2: 无证据强行发布】", !result2.valid ? `成功拦截 (PASS) -> ${result2.error}` : "错误：竟然放行了违规记录！");

// 3. 测试违规记录：非法状态越权
const invalidRecord2 = {
    id: "rec_test_003",
    epistemicState: "HACKED_STATE_BY_LLM", // 非法状态
    verificationStatus: MWALContract.VERIFICATION_STATES.SUPPORTED,
    verifiedEvidenceCount: 2,
    canPublish: false
};

const result3 = Schema.validate(invalidRecord2);
console.log("【测试 3: 非法状态越权】", !result3.valid ? `成功拦截 (PASS) -> ${result3.error}` : "错误：竟然放行了非法状态！");

console.log("=== 集成测试执行完毕 ===");
