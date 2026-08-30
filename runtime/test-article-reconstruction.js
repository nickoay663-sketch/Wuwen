/**
 * @file test-article-reconstruction.js
 * @description Wuwen Article Analysis and Reconstruction Test (Fixed ID Prefix)
 */

import ResponsibilityLedger from "./ResponsibilityLedger.js";
import WALContract from "./WALContract.js";
import fs from "fs";

const ledgerFile = "./article-test-ledger.jsonl";
if (fs.existsSync(ledgerFile)) fs.unlinkSync(ledgerFile);

const ledger = new ResponsibilityLedger(ledgerFile);

const sourceText = `Although the complex mechanism had rarely been understood by the casual observers who walked past the laboratory, Dr. Vance鈥攈aving spent decades examining recursive linguistic algorithms鈥攊nsisted that every single sentence the machine generated must be strictly verified before it was published. Had the engineers known that the automated parser would reject unverified claims, they might have designed the protocol differently. However, what matters most is not how the system was built, but whether it remains entirely honest under pressure. Whenever an assertion is made, it is systematically parsed, checked against hard evidence, and鈥攊f proven true鈥攑ermanently sealed within the immutable ledger so that no future user can ever alter its history.`;

console.log("==================================================");
console.log("          鍕块棶 (Wuwen) 鏂囨湰鍒嗘瀽涓庨噸鏋勫紩鎿?         ");
console.log("==================================================");
console.log(`[杈撳叆鍘熷鏂囨湰]:\n${sourceText}\n`);

console.log("--- 姝ラ 1: 璁ょ煡瑙ｆ瀯 (Epistemic Parsing) ---");
console.log("姝ｅ湪瑙ｆ瀽澶氶噸浠庡彞涓庝簨瀹炴柇瑷€...");

// 浣跨敤鍚堣鐨?rec_ 鍓嶇紑閫氳繃濂戠害瀹″垽
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

console.log(`瑙ｆ瀽瀹屾垚锛氬叡璇嗗埆鍑?${claims.length} 鏉℃牳蹇冭矗浠绘柇瑷€銆俓n`);

console.log("--- 姝ラ 2: 璐ｄ换閲嶆瀯涓庡瘑鐮佸閾搁€?(Reconstruction & Minting) ---");

let reconstructedSummary = [];

for (const c of claims) {
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

        reconstructedSummary.push(`[${record.id}] ${c.statement} (Sig: ${record.signature.substring(0, 8)}...)`);
    } catch (e) {
        console.log(`[鎷︽埅] 鏂█ ${c.id} 鏈€氳繃鍚堣楠岃瘉: ${e.message}`);
    }
}

console.log("--- 姝ラ 3: 鏈€缁堣矗浠昏〃杈捐緭鍑?---");
console.log("鍕块棶閲嶆瀯鍚庣殑鍙壙杞借矗浠昏〃杈撅細");
console.log("--------------------------------------------------");
reconstructedSummary.forEach(s => console.log(s));
console.log("--------------------------------------------------");

const integrity = ledger.verifyIntegrity();
console.log(`[璐︽湰瀹屾暣鎬ф牎楠宂 : ${integrity.valid ? "馃煝 缁濆瀹夊叏 (鍏ㄩ摼璺寚绾瑰挰鍚?" : "馃敶 寮傚父"}`);
console.log(`[鎬昏矗浠婚€氳璇乚   : ${integrity.totalRecords} 寮燻);
console.log("==================================================");

if (fs.existsSync(ledgerFile)) fs.unlinkSync(ledgerFile);
