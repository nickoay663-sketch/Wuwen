import fs from "fs";
import ResponsibilityLedger from "./ResponsibilityLedger.js";
import ResponsibilityRecord from "./ResponsibilityRecord.js";
import WALContract from "./WALContract.js";

const file = "./test-tamper-ledger.jsonl";
if (fs.existsSync(file)) fs.unlinkSync(file);

const ledger = new ResponsibilityLedger(file);

ledger.append({
    id: "rec_tamper_001",
    epistemicState: WALContract.RESPONSIBILITY_STATES.ESTABLISHED,
    verificationStatus: WALContract.VERIFICATION_STATES.SUPPORTED,
    verifiedEvidenceCount: 1,
    canPublish: true
}, [
    { source: "test", snippet: "original evidence" }
]);

ledger.append({
    id: "rec_tamper_002",
    epistemicState: WALContract.RESPONSIBILITY_STATES.ESTABLISHED,
    verificationStatus: WALContract.VERIFICATION_STATES.SUPPORTED,
    verifiedEvidenceCount: 1,
    canPublish: true
}, [
    { source: "test", snippet: "second evidence" }
]);

const lines = fs.readFileSync(file, "utf8")
    .trim()
    .split("\n")
    .map(JSON.parse);

// 绡℃敼绗竴鏉¤褰曞唴瀹癸紝浣嗕繚鎸佸師 signature
lines[0].verifiedEvidenceCount = 999;

fs.writeFileSync(
    file,
    lines.map(x => JSON.stringify(x)).join("\n") + "\n",
    "utf8"
);

const result = ledger.verifyIntegrity();

console.log("=== SIGNATURE TAMPER EXPERIMENT ===");
console.log("Tampered: true");
console.log("verifyIntegrity.valid:", result.valid);
console.log("Result:", result.valid
    ? "鈿狅笍 TAMPERING NOT DETECTED"
    : "馃洝锔?TAMPERING BLOCKED"
);

fs.unlinkSync(file);
