import fs from "fs";
import ResponsibilityLedger from "./ResponsibilityLedger.js";
import ResponsibilityRecord from "./ResponsibilityRecord.js";
import MWALContract from "./MWALContract.js";

const file = "./test-tamper-ledger.jsonl";
if (fs.existsSync(file)) fs.unlinkSync(file);

const ledger = new ResponsibilityLedger(file);

ledger.append({
    id: "rec_tamper_001",
    epistemicState: MWALContract.RESPONSIBILITY_STATES.ESTABLISHED,
    verificationStatus: MWALContract.VERIFICATION_STATES.SUPPORTED,
    verifiedEvidenceCount: 1,
    canPublish: true
}, [
    { source: "test", snippet: "original evidence" }
]);

ledger.append({
    id: "rec_tamper_002",
    epistemicState: MWALContract.RESPONSIBILITY_STATES.ESTABLISHED,
    verificationStatus: MWALContract.VERIFICATION_STATES.SUPPORTED,
    verifiedEvidenceCount: 1,
    canPublish: true
}, [
    { source: "test", snippet: "second evidence" }
]);

const lines = fs.readFileSync(file, "utf8")
    .trim()
    .split("\n")
    .map(JSON.parse);

// 篡改第一条记录内容，但保持原 signature
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
    ? "⚠️ TAMPERING NOT DETECTED"
    : "🛡️ TAMPERING BLOCKED"
);

fs.unlinkSync(file);
