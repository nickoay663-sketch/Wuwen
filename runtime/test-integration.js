import Schema from "./ResponsibilityRecordSchema.js";
import WALContract from "./WALContract.js";

console.log("=== 鍚姩鍕块棶璐ｄ换璁板綍濂戠害闆嗘垚娴嬭瘯 ===");

// 1. 娴嬭瘯鍚堟硶璁板綍
const validRecord = {
    id: "rec_test_001",
    epistemicState: WALContract.RESPONSIBILITY_STATES.ESTABLISHED,
    verificationStatus: WALContract.VERIFICATION_STATES.SUPPORTED,
    verifiedEvidenceCount: 3,
    canPublish: true
};

const result1 = Schema.validate(validRecord);
console.log("銆愭祴璇?1: 鍚堟硶璁板綍銆?, result1.valid ? "閫氳繃 (PASS)" : `澶辫触: ${result1.error}`);

// 2. 娴嬭瘯杩濊璁板綍锛氭棤璇佹嵁鍗村皾璇曞彂甯?
const invalidRecord1 = {
    id: "rec_test_002",
    epistemicState: WALContract.RESPONSIBILITY_STATES.ESTABLISHED,
    verificationStatus: WALContract.VERIFICATION_STATES.SUPPORTED,
    verifiedEvidenceCount: 0, // 杩濊锛氭湁鐘舵€佷絾鏃犻獙璇佽瘉鎹?
    canPublish: true
};

const result2 = Schema.validate(invalidRecord1);
console.log("銆愭祴璇?2: 鏃犺瘉鎹己琛屽彂甯冦€?, !result2.valid ? `鎴愬姛鎷︽埅 (PASS) -> ${result2.error}` : "閿欒锛氱珶鐒舵斁琛屼簡杩濊璁板綍锛?);

// 3. 娴嬭瘯杩濊璁板綍锛氶潪娉曠姸鎬佽秺鏉?
const invalidRecord2 = {
    id: "rec_test_003",
    epistemicState: "HACKED_STATE_BY_LLM", // 闈炴硶鐘舵€?
    verificationStatus: WALContract.VERIFICATION_STATES.SUPPORTED,
    verifiedEvidenceCount: 2,
    canPublish: false
};

const result3 = Schema.validate(invalidRecord2);
console.log("銆愭祴璇?3: 闈炴硶鐘舵€佽秺鏉冦€?, !result3.valid ? `鎴愬姛鎷︽埅 (PASS) -> ${result3.error}` : "閿欒锛氱珶鐒舵斁琛屼簡闈炴硶鐘舵€侊紒");

console.log("=== 闆嗘垚娴嬭瘯鎵ц瀹屾瘯 ===");
