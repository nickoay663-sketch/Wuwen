import ResponsibilityLedger from "./ResponsibilityLedger.js";
import MWALContract from "./MWALContract.js";
import fs from "fs";

const ledgerFile = "./test-mowen-ledger.jsonl";
if (fs.existsSync(ledgerFile)) fs.unlinkSync(ledgerFile); // 清理旧测试文件

console.log("=== 测试莫问责任不可变账本 (Ledger) ===");
const ledger = new ResponsibilityLedger(ledgerFile);

// 1. 写入第一条记录
const r1 = ledger.append({
    id: "rec_ledger_001",
    epistemicState: MWALContract.RESPONSIBILITY_STATES.ESTABLISHED,
    verificationStatus: MWALContract.VERIFICATION_STATES.SUPPORTED,
    verifiedEvidenceCount: 3,
    canPublish: true
}, [{ source: "doc_1", snippet: "莫问账本初始化测试。" }]);

console.log("【写入第一条】", r1.id, "签名:", r1.signature.substring(0, 16) + "...");

// 2. 写入第二条记录
const r2 = ledger.append({
    id: "rec_ledger_002",
    epistemicState: MWALContract.RESPONSIBILITY_STATES.ESTABLISHED,
    verificationStatus: MWALContract.VERIFICATION_STATES.SUPPORTED,
    verifiedEvidenceCount: 1,
    canPublish: true
}, [{ source: "doc_2", snippet: "莫问账本连续追加测试。" }]);

console.log("【写入第二条】", r2.id, "前置指纹匹配:", r2.previousHash === r1.signature ? "✔" : "✖");

// 3. 校验账本整体完整性
const integrity = ledger.verifyIntegrity();
console.log("【账本完整性校验】", integrity.valid ? `通过 (总记录数: ${integrity.totalRecords})` : `失败: ${integrity.error}`);

// 清理测试文件
if (fs.existsSync(ledgerFile)) fs.unlinkSync(ledgerFile);

// 模拟篡改第一条记录的负载
ledger.records[0].payload = { hacked: true };
console.log('=== 篡改后的完整性校验 ===');
console.log('校验结果:', ledger.verifyIntegrity());
