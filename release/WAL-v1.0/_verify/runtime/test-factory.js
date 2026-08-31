import ResponsibilityRecord from "./ResponsibilityRecord.js";
import WALContract from "./WALContract.js";

console.log("=== 娴嬭瘯 ResponsibilityRecord 宸ュ巶閾搁€?===");

try {
    // 姝ｅ父閾搁€?    const validRec = ResponsibilityRecord.mint({
        id: "rec_factory_001",
        epistemicState: WALContract.RESPONSIBILITY_STATES.ESTABLISHED,
        verificationStatus: WALContract.VERIFICATION_STATES.SUPPORTED,
        verifiedEvidenceCount: 5,
        canPublish: true
    });
    console.log("銆愬伐鍘傞摳閫犳垚鍔熴€?, validRec.id, "鐘舵€佸凡鐗╃悊灏佸嵃 (Frozen:", Object.isFrozen(validRec), ")");
} catch (e) {
    console.error("閾搁€犲け璐?", e.message);
}

try {
    // 杩濊閾搁€狅細搴旇宸ュ巶鐩存帴鎷︽埅鎶ラ敊
    console.log("姝ｅ湪灏濊瘯閾搁€犺繚瑙勮褰?..");
    ResponsibilityRecord.mint({
        id: "rec_factory_002",
        epistemicState: WALContract.RESPONSIBILITY_STATES.ESTABLISHED,
        verificationStatus: WALContract.VERIFICATION_STATES.SUPPORTED,
        verifiedEvidenceCount: 0,
        canPublish: true
    });
} catch (e) {
    console.log("銆愬伐鍘傛嫤鎴垚鍔熴€?, e.message);
}
