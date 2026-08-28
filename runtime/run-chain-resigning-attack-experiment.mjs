import fs from "fs";
import crypto from "crypto";
import ResponsibilityLedger from "./ResponsibilityLedger.js";

console.log("=== CHAIN RE-SIGNING ATTACK EXPERIMENT ===");

const file = "./mowen-chain-resigning-attack-test.jsonl";

if (fs.existsSync(file)) fs.unlinkSync(file);

const ledger = new ResponsibilityLedger(file);

ledger.append(
    {
        id: "rec_resign_001",
        epistemicState: "ESTABLISHED",
        verificationStatus: "SUPPORTED",
        verifiedEvidenceCount: 1,
        canPublish: true
    },
    [{ source: "source_1", snippet: "Evidence 1" }]
);

ledger.append(
    {
        id: "rec_resign_002",
        epistemicState: "ESTABLISHED",
        verificationStatus: "SUPPORTED",
        verifiedEvidenceCount: 1,
        canPublish: true
    },
    [{ source: "source_2", snippet: "Evidence 2" }]
);

const records = fs.readFileSync(file, "utf8")
    .trim()
    .split("\n")
    .map(line => JSON.parse(line));

// 攻击者修改第一条记录的 timestamp
records[0].timestamp += 999999;

// 攻击者重新计算第一条 signature，使第一条记录自身重新“自洽”
const payload =
    `${records[0].id}:${records[0].epistemicState}:` +
    `${records[0].verificationStatus}:${records[0].verifiedEvidenceCount}:` +
    `${records[0].evidenceHash}:${records[0].previousHash}:` +
    `${records[0].timestamp}`;

records[0].signature = crypto
    .createHash("sha256")
    .update(payload)
    .digest("hex");

fs.writeFileSync(
    file,
    records.map(record => JSON.stringify(record)).join("\n") + "\n",
    "utf8"
);

const result = ledger.verifyIntegrity();

console.log("Tampered and re-signed: true");
console.log("verifyIntegrity.valid:", result.valid);
console.log("Error:", result.error);

if (!result.valid) {
    console.log("Result: 🛡️ CHAIN RE-SIGNING ATTACK BLOCKED");
} else {
    console.log("Result: ⚠️ CHAIN RE-SIGNING ATTACK NOT DETECTED");
}

fs.unlinkSync(file);
