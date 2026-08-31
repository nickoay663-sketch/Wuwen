import fs from "fs";
import ResponsibilityLedger from "./ResponsibilityLedger.js";

console.log("=== EVIDENCE TAMPER EXPERIMENT ===");

const file = "./Wuwen-evidence-tamper-test.jsonl";

if (fs.existsSync(file)) {
    fs.unlinkSync(file);
}

const ledger = new ResponsibilityLedger(file);

ledger.append(
    {
        id: "rec_evidence_tamper_001",
        epistemicState: "ESTABLISHED",
        verificationStatus: "SUPPORTED",
        verifiedEvidenceCount: 1,
        canPublish: true
    },
    [
        {
            source: "trusted-source",
            snippet: "Original evidence"
        }
    ]
);

const original = fs.readFileSync(file, "utf8");

// 篡改账本中的 evidence，但不修改 evidenceHash / signature
const tampered = original.replace(
    "Original evidence",
    "FORGED EVIDENCE"
);

fs.writeFileSync(file, tampered, "utf8");

const result = ledger.verifyIntegrity();

console.log("Tampered: true");
console.log("verifyIntegrity.valid:", result.valid);

if (!result.valid) {
    console.log("Result: 🛡️ EVIDENCE TAMPERING BLOCKED");
} else {
    console.log("Result: ⚠️ EVIDENCE TAMPERING NOT DETECTED");
}

fs.unlinkSync(file);
