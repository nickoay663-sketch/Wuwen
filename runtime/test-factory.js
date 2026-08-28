import ResponsibilityRecord from "./ResponsibilityRecord.js";
import MWALContract from "./MWALContract.js";

console.log("=== 测试 ResponsibilityRecord 工厂铸造 ===");

try {
    // 正常铸造
    const validRec = ResponsibilityRecord.mint({
        id: "rec_factory_001",
        epistemicState: MWALContract.RESPONSIBILITY_STATES.ESTABLISHED,
        verificationStatus: MWALContract.VERIFICATION_STATES.SUPPORTED,
        verifiedEvidenceCount: 5,
        canPublish: true
    });
    console.log("【工厂铸造成功】", validRec.id, "状态已物理封印 (Frozen:", Object.isFrozen(validRec), ")");
} catch (e) {
    console.error("铸造失败:", e.message);
}

try {
    // 违规铸造：应被工厂直接拦截报错
    console.log("正在尝试铸造违规记录...");
    ResponsibilityRecord.mint({
        id: "rec_factory_002",
        epistemicState: MWALContract.RESPONSIBILITY_STATES.ESTABLISHED,
        verificationStatus: MWALContract.VERIFICATION_STATES.SUPPORTED,
        verifiedEvidenceCount: 0,
        canPublish: true
    });
} catch (e) {
    console.log("【工厂拦截成功】", e.message);
}
