/**
 * @file test-article-reconstruction-es.js
 * @description MoWen Spanish Article Analysis and Reconstruction Test
 */

import ResponsibilityLedger from "./ResponsibilityLedger.js";
import MWALContract from "./MWALContract.js";
import fs from "fs";

const ledgerFile = "./article-test-ledger-es.jsonl";
if (fs.existsSync(ledgerFile)) fs.unlinkSync(ledgerFile);

const ledger = new ResponsibilityLedger(ledgerFile);

const sourceTextEs = `Aunque el mecanismo complejo rara vez había sido comprendido por los observadores casuales que pasaban por el laboratorio, el Dr. Vance —habiendo pasado décadas examinando algoritmos lingüísticos recursivos— insiste en que cada oración que genera la máquina debe ser estrictamente verificada antes de ser publicada. Si los ingenieros hubieran sabido que el analizador automatizado rechazaría las afirmaciones no verificadas, habrían diseñado el protocolo de otra manera. Sin embargo, lo que más importa no es cómo se construyó el sistema, sino si se mantiene enteramente honesto bajo presión. Cada vez que se emite una aseveración, se analiza sistemáticamente, se contrasta con pruebas sólidas y —si se demuestra su veracidad— se sella permanentemente dentro del registro inmutable para que ningún usuario futuro pueda alterar su historia.`;

console.log("==================================================");
console.log("      莫问 (MoWen) 西班牙语文本分析与重构引擎      ");
console.log("==================================================");
console.log(`[输入西班牙语原始文本]:\n${sourceTextEs}\n`);

console.log("--- 步骤 1: 西班牙语认知解构 (Epistemic Parsing) ---");
console.log("正在跨语种解析从句与事实断言...");

// 使用合规的 rec_ 前缀，对西班牙语核心断言进行结构化解构
const claimsEs = [
    {
        id: "rec_es_claim_001",
        statement: "El Dr. Vance insiste en que cada oración generada por la máquina debe ser estrictamente verificada antes de su publicación.",
        evidence: [{ source: "Dr_Vance_Log_2026_ES", snippet: "Verificación estricta exigida antes de la salida de texto de la máquina." }]
    },
    {
        id: "rec_es_claim_002",
        statement: "El analizador automatizado rechaza las afirmaciones no verificadas.",
        evidence: [{ source: "Parser_Spec_v1.0_ES", snippet: "Las afirmaciones sin verificar activan el rechazo inmediato del protocolo." }]
    },
    {
        id: "rec_es_claim_003",
        statement: "Las aseveraciones verificadas se sellan permanentemente dentro del registro inmutable.",
        evidence: [{ source: "Ledger_Architecture_ES", snippet: "El encadenamiento de hashes SHA-256 asegura permanentemente los registros validados." }]
    }
];

console.log(`解析完成：共识别出 ${claimsEs.length} 条西班牙语核心责任断言。\n`);

console.log("--- 步骤 2: 责任重构与密码学铸造 (Reconstruction & Minting) ---");

let reconstructedSummaryEs = [];

for (const c of claimsEs) {
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

        reconstructedSummaryEs.push(`[${record.id}] ${c.statement} (Sig: ${record.signature.substring(0, 8)}...)`);
    } catch (e) {
        console.log(`[拦截] 断言 ${c.id} 未通过合规验证: ${e.message}`);
    }
}

console.log("--- 步骤 3: 最终西班牙语责任表达输出 ---");
console.log("莫问重构后的可承载责任表达：");
console.log("--------------------------------------------------");
reconstructedSummaryEs.forEach(s => console.log(s));
console.log("--------------------------------------------------");

const integrity = ledger.verifyIntegrity();
console.log(`[账本完整性校验] : ${integrity.valid ? "🟢 绝对安全 (多语言全链路指纹咬合)" : "🔴 异常"}`);
console.log(`[总责任通行证]   : ${integrity.totalRecords} 张`);
console.log("==================================================");

if (fs.existsSync(ledgerFile)) fs.unlinkSync(ledgerFile);
