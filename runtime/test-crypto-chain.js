import ResponsibilityRecord from "./ResponsibilityRecord.js";
import MWALContract from "./MWALContract.js";

console.log("=== 测试莫问责任记录密码学链式溯源 ===");

// 铸造第一条记录（创世记录）
const rec1 = ResponsibilityRecord.mint({
    id: "rec_crypto_001",
    epistemicState: MWALContract.RESPONSIBILITY_STATES.ESTABLISHED,
    verificationStatus: MWALContract.VERIFICATION_STATES.SUPPORTED,
    verifiedEvidenceCount: 2,
    canPublish: true,
    evidence: [{ source: "doc_a", snippet: "莫问追求绝对的诚实与可证。" }]
});

console.log("【创世记录已铸造】");
console.log("  ID:", rec1.id);
console.log("  证据哈希:", rec1.evidenceHash);
console.log("  前置指纹:", rec1.previousHash);
console.log("  自身指纹:", rec1.signature);

// 铸造第二条记录，紧密咬合在第一条记录之后
const rec2 = ResponsibilityRecord.mint({
    id: "rec_crypto_002",
    epistemicState: MWALContract.RESPONSIBILITY_STATES.ESTABLISHED,
    verificationStatus: MWALContract.VERIFICATION_STATES.SUPPORTED,
    verifiedEvidenceCount: 1,
    canPublish: true,
    evidence: [{ source: "doc_b", snippet: "任何输出必须有据可查。" }]
}, rec1);

console.log("\n【第二条链式记录已铸造】");
console.log("  ID:", rec2.id);
console.log("  前置指纹 (是否等于rec1签名):", rec2.previousHash === rec1.signature ? "✔ 完美咬合" : "✖ 咬合失败");
console.log("  自身指纹:", rec2.signature);
