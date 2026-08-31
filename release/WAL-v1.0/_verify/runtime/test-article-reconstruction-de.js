/**
 * @file test-article-reconstruction-de.js
 * @description Wuwen German Article Analysis and Reconstruction Test
 */

import ResponsibilityLedger from "./ResponsibilityLedger.js";
import WALContract from "./WALContract.js";
import fs from "fs";

const ledgerFile = "./article-test-ledger-de.jsonl";
if (fs.existsSync(ledgerFile)) fs.unlinkSync(ledgerFile);

const ledger = new ResponsibilityLedger(ledgerFile);

const sourceTextDe = `Obwohl der komplexe Mechanismus von den zuf盲lligen Beobachtern, die am Labor vorbeigingen, selten verstanden worden war, bestand Dr. Vance 鈥?der jahrzehntelang recursive sprachliche Algorithmen untersucht hatte 鈥?darauf, dass jeder einzelne von der Maschine generierte Satz vor seiner Ver枚ffentlichung strikt 眉berpr眉ft werden musste. H盲tten die Ingenieure gewusst, dass der automatisierte Parser un眉berpr眉fte Behauptungen zur眉ckweisen w眉rde, h盲tten sie das Protokoll m枚glicherweise anders entworfen. Was jedoch am meisten z盲hlt, ist nicht, wie das System gebaut wurde, sondern ob es unter Druck v枚llig ehrlich bleibt. Jedes Mal, wenn eine Behauptung aufgestellt wird, wird sie systematisch analysiert, mit harten Beweisen abgeglichen und 鈥?sofern ihre Richtigkeit bewiesen ist 鈥?dauerhaft im unver盲nderlichen Ledger versiegelt, sodass kein zuk眉nftiger Benutzer jemals ihre Geschichte ver盲ndern kann.`;

console.log("==================================================");
console.log("      鍕块棶 (Wuwen) 寰疯鏂囨湰鍒嗘瀽涓庨噸鏋勫紩鎿?     ");
console.log("==================================================");
console.log(`[杈撳叆寰疯鍘熷鏂囨湰]:\n${sourceTextDe}\n`);

console.log("--- 姝ラ 1: 寰疯璁ょ煡瑙ｆ瀯 (Epistemic Parsing) ---");
console.log("姝ｅ湪璺ㄨ绉嶈В鏋愪粠鍙ヤ笌浜嬪疄鏂█...");

// 浣跨敤鍚堣鐨?rec_ 鍓嶇紑锛屽寰疯鏍稿績鏂█杩涜缁撴瀯鍖栬В鏋?
const claimsDe = [
    {
        id: "rec_de_claim_001",
        statement: "Dr. Vance bestand darauf, dass jeder von der Maschine generierte Satz vor der Ver枚ffentlichung strikt 眉berpr眉ft werden muss.",
        evidence: [{ source: "Dr_Vance_Log_2026_DE", snippet: "Strikte Verifizierung vor Textausgabe der Maschine vorgeschrieben." }]
    },
    {
        id: "rec_de_claim_002",
        statement: "Der automatisierte Parser weist un眉berpr眉fte Behauptungen zur眉ck.",
        evidence: [{ source: "Parser_Spec_v1.0_DE", snippet: "Unverifizierte Behauptungen l枚sen sofortige Protokollablehnung aus." }]
    },
    {
        id: "rec_de_claim_003",
        statement: "Verifizierte Behauptungen werden dauerhaft im unver盲nderlichen Ledger versiegelt.",
        evidence: [{ source: "Ledger_Architecture_DE", snippet: "SHA-256-Hash-Verkettung sichert validierte Datens盲tze dauerhaft ab." }]
    }
];

console.log(`瑙ｆ瀽瀹屾垚锛氬叡璇嗗埆鍑?${claimsDe.length} 鏉″痉璇牳蹇冭矗浠绘柇瑷€銆俓n`);

console.log("--- 姝ラ 2: 璐ｄ换閲嶆瀯涓庡瘑鐮佸閾搁€?(Reconstruction & Minting) ---");

let reconstructedSummaryDe = [];

for (const c of claimsDe) {
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

        reconstructedSummaryDe.push(`[${record.id}] ${c.statement} (Sig: ${record.signature.substring(0, 8)}...)`);
    } catch (e) {
        console.log(`[鎷︽埅] 鏂█ ${c.id} 鏈€氳繃鍚堣楠岃瘉: ${e.message}`);
    }
}

console.log("--- 姝ラ 3: 鏈€缁堝痉璇矗浠昏〃杈捐緭鍑?---");
console.log("鍕块棶閲嶆瀯鍚庣殑鍙壙杞借矗浠昏〃杈撅細");
console.log("--------------------------------------------------");
reconstructedSummaryDe.forEach(s => console.log(s));
console.log("--------------------------------------------------");

const integrity = ledger.verifyIntegrity();
console.log(`[璐︽湰瀹屾暣鎬ф牎楠宂 : ${integrity.valid ? "馃煝 缁濆瀹夊叏 (澶氳瑷€鍏ㄩ摼璺寚绾瑰挰鍚?" : "馃敶 寮傚父"}`);
console.log(`[鎬昏矗浠婚€氳璇乚   : ${integrity.totalRecords} 寮燻);
console.log("==================================================");

if (fs.existsSync(ledgerFile)) fs.unlinkSync(ledgerFile);
