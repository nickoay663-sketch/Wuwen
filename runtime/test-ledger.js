import ResponsibilityLedger from "./ResponsibilityLedger.js";
import WALContract from "./WALContract.js";
import fs from "fs";

const ledgerFile = "./test-Wuwen-ledger.jsonl";
if (fs.existsSync(ledgerFile)) fs.unlinkSync(ledgerFile); // 娓呯悊鏃ф祴璇曟枃浠?

console.log("=== 娴嬭瘯鍕块棶璐ｄ换涓嶅彲鍙樿处鏈?(Ledger) ===");
const ledger = new ResponsibilityLedger(ledgerFile);

// 1. 鍐欏叆绗竴鏉¤褰?
const r1 = ledger.append({
    id: "rec_ledger_001",
    epistemicState: WALContract.RESPONSIBILITY_STATES.ESTABLISHED,
    verificationStatus: WALContract.VERIFICATION_STATES.SUPPORTED,
    verifiedEvidenceCount: 3,
    canPublish: true
}, [{ source: "doc_1", snippet: "鍕块棶璐︽湰鍒濆鍖栨祴璇曘€? }]);

console.log("銆愬啓鍏ョ涓€鏉°€?, r1.id, "绛惧悕:", r1.signature.substring(0, 16) + "...");

// 2. 鍐欏叆绗簩鏉¤褰?
const r2 = ledger.append({
    id: "rec_ledger_002",
    epistemicState: WALContract.RESPONSIBILITY_STATES.ESTABLISHED,
    verificationStatus: WALContract.VERIFICATION_STATES.SUPPORTED,
    verifiedEvidenceCount: 1,
    canPublish: true
}, [{ source: "doc_2", snippet: "鍕块棶璐︽湰杩炵画杩藉姞娴嬭瘯銆? }]);

console.log("銆愬啓鍏ョ浜屾潯銆?, r2.id, "鍓嶇疆鎸囩汗鍖归厤:", r2.previousHash === r1.signature ? "鉁? : "鉁?);

// 3. 鏍￠獙璐︽湰鏁翠綋瀹屾暣鎬?
const integrity = ledger.verifyIntegrity();
console.log("銆愯处鏈畬鏁存€ф牎楠屻€?, integrity.valid ? `閫氳繃 (鎬昏褰曟暟: ${integrity.totalRecords})` : `澶辫触: ${integrity.error}`);

// 娓呯悊娴嬭瘯鏂囦欢
if (fs.existsSync(ledgerFile)) fs.unlinkSync(ledgerFile);

// 妯℃嫙绡℃敼绗竴鏉¤褰曠殑璐熻浇
ledger.records[0].payload = { hacked: true };
console.log('=== 绡℃敼鍚庣殑瀹屾暣鎬ф牎楠?===');
console.log('鏍￠獙缁撴灉:', ledger.verifyIntegrity());
