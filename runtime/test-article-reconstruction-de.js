/**
 * @file test-article-reconstruction-de.js
 * @description MoWen German Article Analysis and Reconstruction Test
 */

import ResponsibilityLedger from "./ResponsibilityLedger.js";
import MWALContract from "./MWALContract.js";
import fs from "fs";

const ledgerFile = "./article-test-ledger-de.jsonl";
if (fs.existsSync(ledgerFile)) fs.unlinkSync(ledgerFile);

const ledger = new ResponsibilityLedger(ledgerFile);

const sourceTextDe = `Obwohl der komplexe Mechanismus von den zufälligen Beobachtern, die am Labor vorbeigingen, selten verstanden worden war, bestand Dr. Vance — der jahrzehntelang recursive sprachliche Algorithmen untersucht hatte — darauf, dass jeder einzelne von der Maschine generierte Satz vor seiner Veröffentlichung strikt überprüft werden musste. Hätten die Ingenieure gewusst, dass der automatisierte Parser unüberprüfte Behauptungen zurückweisen würde, hätten sie das Protokoll möglicherweise anders entworfen. Was jedoch am meisten zählt, ist nicht, wie das System gebaut wurde, sondern ob es unter Druck völlig ehrlich bleibt. Jedes Mal, wenn eine Behauptung aufgestellt wird, wird sie systematisch analysiert, mit harten Beweisen abgeglichen und — sofern ihre Richtigkeit bewiesen ist — dauerhaft im unveränderlichen Ledger versiegelt, sodass kein zukünftiger Benutzer jemals ihre Geschichte verändern kann.`;

console.log("==================================================");
console.log("      莫问 (MoWen) 德语文本分析与重构引擎      ");
console.log("==================================================");
console.log(`[输入德语原始文本]:\n${sourceTextDe}\n`);

console.log("--- 步骤 1: 德语认知解构 (Epistemic Parsing) ---");
console.log("正在跨语种解析从句与事实断言...");

// 使用合规的 rec_ 前缀，对德语核心断言进行结构化解构
const claimsDe = [
    {
        id: "rec_de_claim_001",
        statement: "Dr. Vance bestand darauf, dass jeder von der Maschine generierte Satz vor der Veröffentlichung strikt überprüft werden muss.",
        evidence: [{ source: "Dr_Vance_Log_2026_DE", snippet: "Strikte Verifizierung vor Textausgabe der Maschine vorgeschrieben." }]
    },
    {
        id: "rec_de_claim_002",
        statement: "Der automatisierte Parser weist unüberprüfte Behauptungen zurück.",
        evidence: [{ source: "Parser_Spec_v1.0_DE", snippet: "Unverifizierte Behauptungen lösen sofortige Protokollablehnung aus." }]
    },
    {
        id: "rec_de_claim_003",
        statement: "Verifizierte Behauptungen werden dauerhaft im unveränderlichen Ledger versiegelt.",
        evidence: [{ source: "Ledger_Architecture_DE", snippet: "SHA-256-Hash-Verkettung sichert validierte Datensätze dauerhaft ab." }]
    }
];

console.log(`解析完成：共识别出 ${claimsDe.length} 条德语核心责任断言。\n`);

console.log("--- 步骤 2: 责任重构与密码学铸造 (Reconstruction & Minting) ---");

let reconstructedSummaryDe = [];

for (const c of claimsDe) {
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

        reconstructedSummaryDe.push(`[${record.id}] ${c.statement} (Sig: ${record.signature.substring(0, 8)}...)`);
    } catch (e) {
        console.log(`[拦截] 断言 ${c.id} 未通过合规验证: ${e.message}`);
    }
}

console.log("--- 步骤 3: 最终德语责任表达输出 ---");
console.log("莫问重构后的可承载责任表达：");
console.log("--------------------------------------------------");
reconstructedSummaryDe.forEach(s => console.log(s));
console.log("--------------------------------------------------");

const integrity = ledger.verifyIntegrity();
console.log(`[账本完整性校验] : ${integrity.valid ? "🟢 绝对安全 (多语言全链路指纹咬合)" : "🔴 异常"}`);
console.log(`[总责任通行证]   : ${integrity.totalRecords} 张`);
console.log("==================================================");

if (fs.existsSync(ledgerFile)) fs.unlinkSync(ledgerFile);
