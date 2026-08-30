import fs from "fs";
import ResponsibilityLedger from "./ResponsibilityLedger.js";

console.log("=== PREVIOUS HASH TAMPER EXPERIMENT ===");

const file = "./Wuwen-previous-hash-tamper-test.jsonl";

if (fs.existsSync(file)) {
    fs.unlinkSync(file);
}

const ledger = new ResponsibilityLedger(file);

ledger.append(
    {
        id: "rec_prev_tamper_001",
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

ledger.append(
    {
        id: "rec_prev_tamper_002",
        epistemicState: "ESTABLISHED",
        verificationStatus: "SUPPORTED",
        verifiedEvidenceCount: 1,
        canPublish: true
    },
    [
        {
            source: "trusted-source",
            snippet: "Second evidence"
        }
    ]
);

const records = fs.readFileSync(file, "utf8")
    .trim()
    .split("\n")
    .map(line => JSON.parse(line));

// 篡改第二条记录的 previousHash
records[1].previousHash = "FORGED_PREVIOUS_HASH";

fs.writeFileSync(
    file,
    records.map(record => JSON.stringify(record)).join("\n") + "\n",
    "utf8"
);

const result = ledger.verifyIntegrity();

console.log("Tampered: true");
console.log("verifyIntegrity.valid:", result.valid);

if (!result.valid) {
    console.log("Result: 🛡️ PREVIOUS HASH TAMPERING BLOCKED");
} else {
    console.log("Result: ⚠️ PREVIOUS HASH TAMPERING NOT DETECTED");
}

fs.unlinkSync(file);
