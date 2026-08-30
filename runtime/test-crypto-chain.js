import ResponsibilityRecord from "./ResponsibilityRecord.js";
import WALContract from "./WALContract.js";

console.log("=== 娴嬭瘯鍕块棶璐ｄ换璁板綍瀵嗙爜瀛﹂摼寮忔函婧?===");

// 閾搁€犵涓€鏉¤褰曪紙鍒涗笘璁板綍锛?
const rec1 = ResponsibilityRecord.mint({
    id: "rec_crypto_001",
    epistemicState: WALContract.RESPONSIBILITY_STATES.ESTABLISHED,
    verificationStatus: WALContract.VERIFICATION_STATES.SUPPORTED,
    verifiedEvidenceCount: 2,
    canPublish: true,
    evidence: [{ source: "doc_a", snippet: "鍕块棶杩芥眰缁濆鐨勮瘹瀹炰笌鍙瘉銆? }]
});

console.log("銆愬垱涓栬褰曞凡閾搁€犮€?);
console.log("  ID:", rec1.id);
console.log("  璇佹嵁鍝堝笇:", rec1.evidenceHash);
console.log("  鍓嶇疆鎸囩汗:", rec1.previousHash);
console.log("  鑷韩鎸囩汗:", rec1.signature);

// 閾搁€犵浜屾潯璁板綍锛岀揣瀵嗗挰鍚堝湪绗竴鏉¤褰曚箣鍚?
const rec2 = ResponsibilityRecord.mint({
    id: "rec_crypto_002",
    epistemicState: WALContract.RESPONSIBILITY_STATES.ESTABLISHED,
    verificationStatus: WALContract.VERIFICATION_STATES.SUPPORTED,
    verifiedEvidenceCount: 1,
    canPublish: true,
    evidence: [{ source: "doc_b", snippet: "浠讳綍杈撳嚭蹇呴』鏈夋嵁鍙煡銆? }]
}, rec1);

console.log("\n銆愮浜屾潯閾惧紡璁板綍宸查摳閫犮€?);
console.log("  ID:", rec2.id);
console.log("  鍓嶇疆鎸囩汗 (鏄惁绛変簬rec1绛惧悕):", rec2.previousHash === rec1.signature ? "鉁?瀹岀編鍜悎" : "鉁?鍜悎澶辫触");
console.log("  鑷韩鎸囩汗:", rec2.signature);
