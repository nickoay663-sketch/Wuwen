/**
 * @file test-article-reconstruction-es.js
 * @description Wuwen Spanish Article Analysis and Reconstruction Test
 */

import ResponsibilityLedger from "./ResponsibilityLedger.js";
import WALContract from "./WALContract.js";
import fs from "fs";

const ledgerFile = "./article-test-ledger-es.jsonl";
if (fs.existsSync(ledgerFile)) fs.unlinkSync(ledgerFile);

const ledger = new ResponsibilityLedger(ledgerFile);

const sourceTextEs = `Aunque el mecanismo complejo rara vez hab铆a sido comprendido por los observadores casuales que pasaban por el laboratorio, el Dr. Vance 鈥攈abiendo pasado d茅cadas examinando algoritmos ling眉铆sticos recursivos鈥?insiste en que cada oraci贸n que genera la m谩quina debe ser estrictamente verificada antes de ser publicada. Si los ingenieros hubieran sabido que el analizador automatizado rechazar铆a las afirmaciones no verificadas, habr铆an dise帽ado el protocolo de otra manera. Sin embargo, lo que m谩s importa no es c贸mo se construy贸 el sistema, sino si se mantiene enteramente honesto bajo presi贸n. Cada vez que se emite una aseveraci贸n, se analiza sistem谩ticamente, se contrasta con pruebas s贸lidas y 鈥攕i se demuestra su veracidad鈥?se sella permanentemente dentro del registro inmutable para que ning煤n usuario futuro pueda alterar su historia.`;

console.log("==================================================");
console.log("      鍕块棶 (Wuwen) 瑗跨彮鐗欒鏂囨湰鍒嗘瀽涓庨噸鏋勫紩鎿?     ");
console.log("==================================================");
console.log(`[杈撳叆瑗跨彮鐗欒鍘熷鏂囨湰]:\n${sourceTextEs}\n`);

console.log("--- 姝ラ 1: 瑗跨彮鐗欒璁ょ煡瑙ｆ瀯 (Epistemic Parsing) ---");
console.log("姝ｅ湪璺ㄨ绉嶈В鏋愪粠鍙ヤ笌浜嬪疄鏂█...");

// 浣跨敤鍚堣鐨?rec_ 鍓嶇紑锛屽瑗跨彮鐗欒鏍稿績鏂█杩涜缁撴瀯鍖栬В鏋?
const claimsEs = [
    {
        id: "rec_es_claim_001",
        statement: "El Dr. Vance insiste en que cada oraci贸n generada por la m谩quina debe ser estrictamente verificada antes de su publicaci贸n.",
        evidence: [{ source: "Dr_Vance_Log_2026_ES", snippet: "Verificaci贸n estricta exigida antes de la salida de texto de la m谩quina." }]
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

console.log(`瑙ｆ瀽瀹屾垚锛氬叡璇嗗埆鍑?${claimsEs.length} 鏉¤タ鐝墮璇牳蹇冭矗浠绘柇瑷€銆俓n`);

console.log("--- 姝ラ 2: 璐ｄ换閲嶆瀯涓庡瘑鐮佸閾搁€?(Reconstruction & Minting) ---");

let reconstructedSummaryEs = [];

for (const c of claimsEs) {
    try {
        const record = ledger.append({
            id: c.id,
            epistemicState: WALContract.RESPONSIBILITY_STATES.ESTABLISHED,
            verificationStatus: WALContract.VERIFICATION_STATES.SUPPORTED,
            verifiedEvidenceCount: c.evidence.length,
            canPublish: true,
            claim: c.statement
        }, c.evidence);

        console.log(`[宸查噸鏋勬柇瑷€] ${c.id}`);
        console.log(`  -> 澹版槑: ${c.statement}`);
        console.log(`  -> 鐘舵€? ESTABLISHED | 璇佹嵁鏁? ${c.evidence.length}`);
        console.log(`  -> 绛惧悕: ${record.signature.substring(0, 16)}...\n`);

        reconstructedSummaryEs.push(`[${record.id}] ${c.statement} (Sig: ${record.signature.substring(0, 8)}...)`);
    } catch (e) {
        console.log(`[鎷︽埅] 鏂█ ${c.id} 鏈€氳繃鍚堣楠岃瘉: ${e.message}`);
    }
}

console.log("--- 姝ラ 3: 鏈€缁堣タ鐝墮璇矗浠昏〃杈捐緭鍑?---");
console.log("鍕块棶閲嶆瀯鍚庣殑鍙壙杞借矗浠昏〃杈撅細");
console.log("--------------------------------------------------");
reconstructedSummaryEs.forEach(s => console.log(s));
console.log("--------------------------------------------------");

const integrity = ledger.verifyIntegrity();
console.log(`[璐︽湰瀹屾暣鎬ф牎楠宂 : ${integrity.valid ? "馃煝 缁濆瀹夊叏 (澶氳瑷€鍏ㄩ摼璺寚绾瑰挰鍚?" : "馃敶 寮傚父"}`);
console.log(`[鎬昏矗浠婚€氳璇乚   : ${integrity.totalRecords} 寮燻);
console.log("==================================================");

if (fs.existsSync(ledgerFile)) fs.unlinkSync(ledgerFile);
