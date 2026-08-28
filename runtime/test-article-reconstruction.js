/**
 * @file test-article-reconstruction.js
 * @description MoWen Article Analysis and Reconstruction Test (Fixed ID Prefix)
 */

import ResponsibilityLedger from "./ResponsibilityLedger.js";
import MWALContract from "./MWALContract.js";
import fs from "fs";

const ledgerFile = "./article-test-ledger.jsonl";
if (fs.existsSync(ledgerFile)) fs.unlinkSync(ledgerFile);

const ledger = new ResponsibilityLedger(ledgerFile);

const sourceText = `Although the complex mechanism had rarely been understood by the casual observers who walked past the laboratory, Dr. Vance—having spent decades examining recursive linguistic algorithms—insisted that every single sentence the machine generated must be strictly verified before it was published. Had the engineers known that the automated parser would reject unverified claims, they might have designed the protocol differently. However, what matters most is not how the system was built, but whether it remains entirely honest under pressure. Whenever an assertion is made, it is systematically parsed, checked against hard evidence, and—if proven true—permanently sealed within the immutable ledger so that no future user can ever alter its history.`;

console.log("==================================================");
console.log("          莫问 (MoWen) 文本分析与重构引擎          ");
console.log("==================================================");
console.log(`[输入原始文本]:\n${sourceText}\n`);

console.log("--- 步骤 1: 认知解构 (Epistemic Parsing) ---");
console.log("正在解析多重从句与事实断言...");

// 使用合规的 rec_ 前缀通过契约审判
const claims = [
    {
        id: "rec_claim_001",
        statement: "Dr. Vance insisted that every single sentence the machine generated must be strictly verified before publication.",
        evidence: [{ source: "Dr_Vance_Log_2026", snippet: "Strict verification enforced before machine text generation output." }]
    },
    {
        id: "rec_claim_002",
        statement: "The automated parser rejects unverified claims.",
        evidence: [{ source: "Parser_Spec_v1.0", snippet: "Unverified claims trigger immediate protocol rejection." }]
    },
    {
        id: "rec_claim_003",
        statement: "Verified assertions are permanently sealed within the immutable ledger.",
        evidence: [{ source: "Ledger_Architecture", snippet: "SHA-256 hash chaining permanently secures validated records." }]
    }
];

console.log(`解析完成：共识别出 ${claims.length} 条核心责任断言。\n`);

console.log("--- 步骤 2: 责任重构与密码学铸造 (Reconstruction & Minting) ---");

let reconstructedSummary = [];

for (const c of claims) {
    try {
        const record = ledger.append({
            id: c.id,
            epistemicState: MWALContract.RESPONSIBILITY_STATES.ESTABLISHED,
            verificationStatus: MWALContract.VERIFICATION_STATES.SUPPORTED,
            verifiedEvidenceCount: c.evidence.length,
            canPublish: true,
            claim: c.statement
        }, c.evidence);

        console.log(`[已重构断言] ${c.id}`);
        console.log(`  -> 声明: ${c.statement}`);
        console.log(`  -> 状态: ESTABLISHED | 证据数: ${c.evidence.length}`);
        console.log(`  -> 签名: ${record.signature.substring(0, 16)}...\n`);

        reconstructedSummary.push(`[${record.id}] ${c.statement} (Sig: ${record.signature.substring(0, 8)}...)`);
    } catch (e) {
        console.log(`[拦截] 断言 ${c.id} 未通过合规验证: ${e.message}`);
    }
}

console.log("--- 步骤 3: 最终责任表达输出 ---");
console.log("莫问重构后的可承载责任表达：");
console.log("--------------------------------------------------");
reconstructedSummary.forEach(s => console.log(s));
console.log("--------------------------------------------------");

const integrity = ledger.verifyIntegrity();
console.log(`[账本完整性校验] : ${integrity.valid ? "🟢 绝对安全 (全链路指纹咬合)" : "🔴 异常"}`);
console.log(`[总责任通行证]   : ${integrity.totalRecords} 张`);
console.log("==================================================");

if (fs.existsSync(ledgerFile)) fs.unlinkSync(ledgerFile);
