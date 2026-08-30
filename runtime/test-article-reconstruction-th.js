/**
 * @file test-article-reconstruction-th.js
 * @description Wuwen Thai Article Analysis and Reconstruction Test
 */

import ResponsibilityLedger from "./ResponsibilityLedger.js";
import WALContract from "./WALContract.js";
import fs from "fs";

const ledgerFile = "./article-test-ledger-th.jsonl";
if (fs.existsSync(ledgerFile)) fs.unlinkSync(ledgerFile);

const ledger = new ResponsibilityLedger(ledgerFile);

const sourceTextTh = `喙佮浮喙夃抚喙堗覆喔佮弗喙勦竵喔椸傅喙堗笅喔编笟喔嬥箟喔笝喔權傅喙夃笀喔班箘喔∴箞喔勦箞喔涪喙€喔涏箛喔權笚喔掂箞喙€喔傕箟喔侧箖喔堗競喔竾喔氞福喔｀笖喔侧笢喔灌箟喔副喔囙箑喔佮笗喔佮覆喔｀笓喙屶笚喔编箞喔о箘喔涏笚喔掂箞喙€喔斷复喔權笢喙堗覆喔權斧喙夃腑喔囙笚喔斷弗喔竾 喙佮笗喙?喔斷福. 喙佮抚喔權笅喙?喔溹腹喙夃笅喔多箞喔囙箖喔娻箟喙€喔о弗喔侧斧喔ム覆喔⑧笚喔ㄠ抚喔｀福喔┼箖喔權竵喔侧福喔曕福喔о笀喔腑喔氞腑喔编弗喔佮腑喔｀复喔椸付喔∴笚喔侧竾喔犩覆喔┼覆喙佮笟喔氞箑喔｀傅喔⑧竵喔嬥箟喔赤涪喔粪笝喔佮福喔侧笝喔о箞喔侧笚喔膏竵喔涏福喔班箓喔⑧竸喔椸傅喙堗箑喔勦福喔粪箞喔竾喔堗副喔佮福喔福喙夃覆喔囙競喔多箟喔權笀喔班笗喙夃腑喔囙箘喔斷箟喔｀副喔氞竵喔侧福喔曕福喔о笀喔腑喔氞腑喔⑧箞喔侧竾喙€喔傕箟喔∴竾喔о笖喔佮箞喔笝喔椸傅喙堗笀喔班箑喔溹涪喙佮笧喔｀箞 喔覆喔佮抚喔脆辅喔о竵喔｀笚喔｀覆喔氞抚喙堗覆喔曕副喔о箒喔⑧竵喔о复喙€喔勦福喔侧赴喔箤喔副喔曕箓喔權浮喔编笗喔脆笀喔班笡喔忇复喙€喔笜喔傕箟喔竵喔ム箞喔侧抚喔覆喔椸傅喙堗涪喔编竾喙勦浮喙堗箘喔斷箟喔曕福喔о笀喔腑喔?喔炧抚喔佮箑喔傕覆喔覆喔堗笀喔班腑喔竵喙佮笟喔氞箓喔涏福喙傕笗喔勦腑喔ム笚喔掂箞喙佮笗喔佮笗喙堗覆喔囙腑喔竵喙勦笡 喔涪喙堗覆喔囙箘喔｀竵喙囙笗喔侧浮 喔复喙堗竾喔椸傅喙堗釜喔赤竸喔编笉喔椸傅喙堗釜喔膏笖喙勦浮喙堗箖喔娻箞喔о箞喔侧福喔班笟喔氞笘喔灌竵喔福喙夃覆喔囙競喔多箟喔權浮喔侧腑喔⑧箞喔侧竾喙勦福 喙佮笗喙堗竸喔粪腑喔佮覆喔｀笚喔掂箞喔｀赴喔氞笟喔⑧副喔囙竸喔囙浮喔掂竸喔о覆喔∴笅喔粪箞喔釜喔编笗喔⑧箤喔涪喙堗覆喔囙釜喔∴笟喔灌福喔撪箤喔犩覆喔⑧箖喔曕箟喙佮福喔囙竵喔斷笖喔编笝喔福喔粪腑喙勦浮喙?喔椸父喔佮竸喔｀副喙夃竾喔椸傅喙堗浮喔掂竵喔侧福喔佮弗喙堗覆喔о腑喙夃覆喔?喔｀赴喔氞笟喔堗赴喔栢腹喔佮抚喔脆箑喔勦福喔侧赴喔箤喔涪喙堗覆喔囙箑喔涏箛喔權福喔班笟喔?喔堗副喔氞竸喔灌箞喔佮副喔氞斧喔ム副喔佮笎喔侧笝喔椸傅喙堗斧喔權副喔佮箒喔權箞喔?喙佮弗喔班斧喔侧竵喔炧复喔腹喔堗笝喙屶箘喔斷箟喔о箞喔侧箑喔涏箛喔權竸喔о覆喔∴笀喔｀复喔?喔堗赴喔栢腹喔佮笢喔權付喔佮箘喔о箟喔涪喙堗覆喔囙笘喔侧抚喔｀笭喔侧涪喙冟笝喔氞副喔嵿笂喔掂箒喔⑧竵喔涏福喔班箑喔犩笚喔椸傅喙堗箘喔∴箞喔覆喔∴覆喔｀笘喙€喔涏弗喔掂箞喔⑧笝喙佮笡喔ム竾喙勦笖喙?喙€喔炧阜喙堗腑喙勦浮喙堗箖喔箟喔溹腹喙夃箖喔娻箟喙冟笝喔笝喔侧竸喔曕釜喔侧浮喔侧福喔栢箑喔涏弗喔掂箞喔⑧笝喙佮笡喔ム竾喔涏福喔班抚喔编笗喔脆競喔竾喔∴副喔權箘喔斷箟`;

console.log("==================================================");
console.log("      鍕块棶 (Wuwen) 娉拌鏂囨湰鍒嗘瀽涓庨噸鏋勫紩鎿?     ");
console.log("==================================================");
console.log(`[杈撳叆娉拌鍘熷鏂囨湰]:\n${sourceTextTh}\n`);

console.log("--- 姝ラ 1: 娉拌璁ょ煡瑙ｆ瀯 (Epistemic Parsing) ---");
console.log("姝ｅ湪璺ㄨ绉嶈В鏋愪粠鍙ヤ笌浜嬪疄鏂█...");

// 浣跨敤鍚堣鐨?rec_ 鍓嶇紑锛屽娉拌鏍稿績鏂█杩涜缁撴瀯鍖栬В鏋?
const claimsTh = [
    {
        id: "rec_th_claim_001",
        statement: "喔斷福. 喙佮抚喔權笅喙屶涪喔粪笝喔佮福喔侧笝喔о箞喔侧笚喔膏竵喔涏福喔班箓喔⑧竸喔椸傅喙堗釜喔｀箟喔侧竾喙傕笖喔⑧箑喔勦福喔粪箞喔竾喔堗副喔佮福喔堗赴喔曕箟喔竾喙勦笖喙夃福喔编笟喔佮覆喔｀笗喔｀抚喔堗釜喔笟喔涪喙堗覆喔囙箑喔傕箟喔∴竾喔о笖喔佮箞喔笝喔佮覆喔｀箑喔溹涪喙佮笧喔｀箞",
        evidence: [{ source: "Dr_Vance_Log_2026_TH", snippet: "喔氞副喔囙竸喔编笟喙冟笂喙夃竵喔侧福喔曕福喔о笀喔腑喔氞腑喔⑧箞喔侧竾喙€喔傕箟喔∴竾喔о笖喔佮箞喔笝喔佮覆喔｀腑喔竵喔傕箟喔竸喔о覆喔∴笀喔侧竵喙€喔勦福喔粪箞喔竾喔堗副喔佮福" }]
    },
    {
        id: "rec_th_claim_002",
        statement: "喔曕副喔о箒喔⑧竵喔о复喙€喔勦福喔侧赴喔箤喔副喔曕箓喔權浮喔编笗喔脆笀喔班笡喔忇复喙€喔笜喔佮覆喔｀竵喔ム箞喔侧抚喔箟喔侧竾喔椸傅喙堗涪喔编竾喙勦浮喙堗箘喔斷箟喔曕福喔о笀喔腑喔?,
        evidence: [{ source: "Parser_Spec_v1.0_TH", snippet: "喔傕箟喔竵喔ム箞喔侧抚喔覆喔椸傅喙堗涪喔编竾喙勦浮喙堗箘喔斷箟喔｀副喔氞竵喔侧福喔曕福喔о笀喔腑喔氞笀喔班竵喔｀赴喔曕父喙夃笝喙冟斧喙夃箑喔佮复喔斷竵喔侧福喔涏笍喔脆箑喔笜喙傕笡喔｀箓喔曕竸喔弗喔椸副喔權笚喔? }]
    },
    {
        id: "rec_th_claim_003",
        statement: "喔佮覆喔｀竵喔ム箞喔侧抚喔箟喔侧竾喔椸傅喙堗箘喔斷箟喔｀副喔氞竵喔侧福喔曕福喔о笀喔腑喔氞箒喔ム箟喔о笀喔班笘喔灌竵喔溹笝喔多竵喙勦抚喙夃腑喔⑧箞喔侧竾喔栢覆喔о福喔犩覆喔⑧箖喔權笟喔编笉喔娻傅喙佮涪喔佮笡喔｀赴喙€喔犩笚喔椸傅喙堗箘喔∴箞喔覆喔∴覆喔｀笘喙€喔涏弗喔掂箞喔⑧笝喙佮笡喔ム竾喙勦笖喙?,
        evidence: [{ source: "Ledger_Architecture_TH", snippet: "喔佮覆喔｀箑喔娻阜喙堗腑喔∴箓喔⑧竾喙佮府喔?SHA-256 喔娻箞喔о涪喔｀副喔佮俯喔侧竸喔о覆喔∴笡喔ム腑喔斷笭喔编涪喔氞副喔權笚喔多竵喔椸傅喙堗笢喙堗覆喔權竵喔侧福喔曕福喔о笀喔腑喔氞箒喔ム箟喔о腑喔⑧箞喔侧竾喔栢覆喔о福" }]
    }
];

console.log(`瑙ｆ瀽瀹屾垚锛氬叡璇嗗埆鍑?${claimsTh.length} 鏉℃嘲璇牳蹇冭矗浠绘柇瑷€銆俓n`);

console.log("--- 姝ラ 2: 璐ｄ换閲嶆瀯涓庡瘑鐮佸閾搁€?(Reconstruction & Minting) ---");

let reconstructedSummaryTh = [];

for (const c of claimsTh) {
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

        reconstructedSummaryTh.push(`[${record.id}] ${c.statement} (Sig: ${record.signature.substring(0, 8)}...)`);
    } catch (e) {
        console.log(`[鎷︽埅] 鏂█ ${c.id} 鏈€氳繃鍚堣楠岃瘉: ${e.message}`);
    }
}

console.log("--- 姝ラ 3: 鏈€缁堟嘲璇矗浠昏〃杈捐緭鍑?---");
console.log("鍕块棶閲嶆瀯鍚庣殑鍙壙杞借矗浠昏〃杈撅細");
console.log("--------------------------------------------------");
reconstructedSummaryTh.forEach(s => console.log(s));
console.log("--------------------------------------------------");

const integrity = ledger.verifyIntegrity();
console.log(`[璐︽湰瀹屾暣鎬ф牎楠宂 : ${integrity.valid ? "馃煝 缁濆瀹夊叏 (澶氳瑷€鍏ㄩ摼璺寚绾瑰挰鍚?" : "馃敶 寮傚父"}`);
console.log(`[鎬昏矗浠婚€氳璇乚   : ${integrity.totalRecords} 寮燻);
console.log("==================================================");

if (fs.existsSync(ledgerFile)) fs.unlinkSync(ledgerFile);
