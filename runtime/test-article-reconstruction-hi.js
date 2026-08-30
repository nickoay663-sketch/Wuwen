/**
 * @file test-article-reconstruction-hi.js
 * @description Wuwen Hindi Article Analysis and Reconstruction Test
 */

import ResponsibilityLedger from "./ResponsibilityLedger.js";
import WALContract from "./WALContract.js";
import fs from "fs";

const ledgerFile = "./article-test-ledger-hi.jsonl";
if (fs.existsSync(ledgerFile)) fs.unlinkSync(ledgerFile);

const ledger = new ResponsibilityLedger(ledgerFile);

const sourceTextHi = `啶灌ぞ啶侧ぞ啶傕啶?啶啶班く啷嬥啶多ぞ啶侧ぞ 啶曕 啶ぞ啶?啶膏 啶椸啶溹ぐ啶ㄠ 啶掂ぞ啶侧 啶嗋啶膏啶た啶?啶ㄠた啶班啶曕啶粪啷嬥 啶︵啶掂ぞ啶班ぞ 啶囙じ 啶溹啶苦げ 啶む啶む啶?啶曕 啶多ぞ啶う 啶灌 啶曕き啷€ 啶膏ぎ啶澿ぞ 啶椸く啶?啶ムぞ, 啶侧啶曕た啶?啶∴. 啶掂啶傕じ 啶ㄠ 鈥?啶溹た啶ㄠ啶灌啶傕え啷?啶啶ㄠぐ啶距さ啶班啶む 啶ぞ啶粪ぞ啶?啶忇げ啷嵿啷嬥ぐ啶苦う啶?啶曕ぞ 啶呧ぇ啷嵿く啶え 啶曕ぐ啶ㄠ 啶啶?啶︵ざ啶曕啶?啶た啶むぞ啶?啶ム 鈥?啶囙じ 啶ぞ啶?啶ぐ 啶溹啶?啶︵た啶ぞ 啶曕た 啶ざ啷€啶?啶︵啶掂ぞ啶班ぞ 啶夃い啷嵿お啶ㄠ啶?啶啶班い啷嵿く啷囙 啶掂ぞ啶曕啶?啶曕 啶啶班啶距ざ啶苦い 啶灌啶ㄠ 啶膏 啶す啶侧 啶曕ぁ啶监ぞ啶?啶膏 啶膏い啷嵿く啶距お啶苦い 啶曕た啶ぞ 啶溹ぞ啶ㄠぞ 啶氞ぞ啶灌た啶忇イ 啶う啶?啶囙啶溹啶ㄠた啶ぐ啷嬥 啶曕 啶い啶?啶灌啶むぞ 啶曕た 啶膏啶掂啶距げ啶苦い 啶ぞ啶班啶膏ぐ 啶呧じ啶む啶ぞ啶た啶?啶︵ぞ啶掂啶?啶曕 啶栢ぞ啶班た啶?啶曕ぐ 啶︵啶椸ぞ, 啶む 啶掂 啶啶班啶熰啶曕啶?啶曕 啶呧げ啶?啶むぐ啶?啶膏 啶∴た啶溹ぞ啶囙え 啶曕ぐ 啶膏啶む 啶ム啷?啶灌ぞ啶侧ぞ啶傕啶? 啶膏が啶膏 啶溹啶ぞ啶︵ぞ 啶ぞ啶え啷?啶す 啶ㄠす啷€啶?啶班啶むぞ 啶曕た 啶啶班ぃ啶距げ啷€ 啶曕啶膏 啶え啶距 啶椸 啶ム, 啶げ啷嵿啶?啶す 啶ぞ啶え啷?啶班啶むぞ 啶灌 啶曕た 啶曕啶ぞ 啶す 啶︵が啶距さ 啶曕 啶むす啶?啶啶班 啶むぐ啶?啶膏 啶堗ぎ啶距え啶︵ぞ啶?啶え啷€ 啶班す啶む 啶灌啷?啶溹が 啶 啶曕啶?啶︵ぞ啶掂ぞ 啶曕た啶ぞ 啶溹ぞ啶むぞ 啶灌, 啶む 啶夃じ啶曕ぞ 啶掂啶さ啶膏啶ムた啶?啶班啶?啶膏 啶掂た啶多啶侧啶粪ぃ 啶曕た啶ぞ 啶溹ぞ啶むぞ 啶灌, 啶犩啶?啶膏ぞ啶曕啶粪啶啶?啶膏 啶た啶侧ぞ啶?啶曕た啶ぞ 啶溹ぞ啶むぞ 啶灌 啶斷ぐ 鈥?啶う啶?啶膏い啷嵿く 啶膏ぞ啶た啶?啶灌啶むぞ 啶灌 鈥?啶む 啶夃じ啷?啶呧お啶班た啶掂ぐ啷嵿い啶ㄠ啶?啶す啷€啶栢ぞ啶む (Ledger) 啶啶?啶膏啶ムぞ啶 啶班啶?啶膏 啶膏啶?啶曕ぐ 啶︵た啶ぞ 啶溹ぞ啶むぞ 啶灌 啶むぞ啶曕た 啶曕啶?啶 啶さ啶苦し啷嵿く 啶曕ぞ 啶夃お啶啶椸啶班啶むぞ 啶囙じ啶曕 啶囙い啶苦す啶距じ 啶曕 啶う啶?啶?啶膏啷囙イ`;

console.log("==================================================");
console.log("      鍕块棶 (Wuwen) 鍗板湴璇枃鏈垎鏋愪笌閲嶆瀯寮曟搸      ");
console.log("==================================================");
console.log(`[杈撳叆鍗板湴璇師濮嬫枃鏈琞:\n${sourceTextHi}\n`);

console.log("--- 姝ラ 1: 鍗板湴璇鐭ヨВ鏋?(Epistemic Parsing) ---");
console.log("姝ｅ湪璺ㄨ绉嶈В鏋愪粠鍙ヤ笌浜嬪疄鏂█...");

// 浣跨敤鍚堣鐨?rec_ 鍓嶇紑锛屽鍗板湴璇牳蹇冩柇瑷€杩涜缁撴瀯鍖栬В鏋?
const claimsHi = [
    {
        id: "rec_hi_claim_001",
        statement: "啶∴. 啶掂啶傕じ 啶ㄠ 啶溹啶?啶︵た啶ぞ 啶曕た 啶ざ啷€啶?啶︵啶掂ぞ啶班ぞ 啶夃い啷嵿お啶ㄠ啶?啶啶班い啷嵿く啷囙 啶掂ぞ啶曕啶?啶曕 啶啶班啶距ざ啶?啶膏 啶す啶侧 啶曕ぁ啶监ぞ啶?啶膏 啶膏い啷嵿く啶距お啶苦い 啶曕た啶ぞ 啶溹ぞ啶ㄠぞ 啶氞ぞ啶灌た啶忇イ",
        evidence: [{ source: "Dr_Vance_Log_2026_HI", snippet: "啶ざ啷€啶?啶熰啶曕啶膏啶?啶嗋啶熰お啷佮 啶膏 啶す啶侧 啶膏啷嵿い 啶膏い啷嵿く啶距お啶?啶呧え啶苦さ啶距ぐ啷嵿く啷? }]
    },
    {
        id: "rec_hi_claim_002",
        statement: "啶膏啶掂啶距げ啶苦い 啶ぞ啶班啶膏ぐ 啶呧じ啶む啶ぞ啶た啶?啶︵ぞ啶掂啶?啶曕 啶栢ぞ啶班た啶?啶曕ぐ 啶︵啶むぞ 啶灌啷?,
        evidence: [{ source: "Parser_Spec_v1.0_HI", snippet: "啶呧お啷佮し啷嵿 啶︵ぞ啶掂 啶むい啷嵿啶距げ 啶啶班啶熰啶曕啶?啶呧じ啷嵿さ啷€啶曕啶むた 啶曕 啶熰啶班た啶椸ぐ 啶曕ぐ啶む 啶灌啶傕イ" }]
    },
    {
        id: "rec_hi_claim_003",
        statement: "啶膏い啷嵿く啶距お啶苦い 啶︵ぞ啶掂啶?啶曕 啶呧お啶班た啶掂ぐ啷嵿い啶ㄠ啶?啶す啷€啶栢ぞ啶む 啶啶?啶膏啶ムぞ啶 啶班啶?啶膏 啶膏啶?啶曕ぐ 啶︵た啶ぞ 啶溹ぞ啶むぞ 啶灌啷?,
        evidence: [{ source: "Ledger_Architecture_HI", snippet: "SHA-256 啶灌啶?啶氞啶ㄠた啶傕 啶ぞ啶ㄠ啶?啶班た啶曕啶班啶?啶曕 啶膏啶ムぞ啶 啶班啶?啶膏 啶膏啶班啷嵿し啶苦い 啶曕ぐ啶む 啶灌啷? }]
    }
];

console.log(`瑙ｆ瀽瀹屾垚锛氬叡璇嗗埆鍑?${claimsHi.length} 鏉″嵃鍦拌鏍稿績璐ｄ换鏂█銆俓n`);

console.log("--- 姝ラ 2: 璐ｄ换閲嶆瀯涓庡瘑鐮佸閾搁€?(Reconstruction & Minting) ---");

let reconstructedSummaryHi = [];

for (const c of claimsHi) {
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

        reconstructedSummaryHi.push(`[${record.id}] ${c.statement} (Sig: ${record.signature.substring(0, 8)}...)`);
    } catch (e) {
        console.log(`[鎷︽埅] 鏂█ ${c.id} 鏈€氳繃鍚堣楠岃瘉: ${e.message}`);
    }
}

console.log("--- 姝ラ 3: 鏈€缁堝嵃鍦拌璐ｄ换琛ㄨ揪杈撳嚭 ---");
console.log("鍕块棶閲嶆瀯鍚庣殑鍙壙杞借矗浠昏〃杈撅細");
console.log("--------------------------------------------------");
reconstructedSummaryHi.forEach(s => console.log(s));
console.log("--------------------------------------------------");

const integrity = ledger.verifyIntegrity();
console.log(`[璐︽湰瀹屾暣鎬ф牎楠宂 : ${integrity.valid ? "馃煝 缁濆瀹夊叏 (澶氳瑷€鍏ㄩ摼璺寚绾瑰挰鍚?" : "馃敶 寮傚父"}`);
console.log(`[鎬昏矗浠婚€氳璇乚   : ${integrity.totalRecords} 寮燻);
console.log("==================================================");

if (fs.existsSync(ledgerFile)) fs.unlinkSync(ledgerFile);
