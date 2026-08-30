import HonestRuntime from "./HonestRuntime.js";
import TestimonyValidator from "./TestimonyValidator.js";

(async () => {
    try {
        console.log("=== 1. RUNNING HONEST RUNTIME ===");
        const rawOutput = await new HonestRuntime("勿问运行时客观可验证性推演").run();

        console.log("\n=== 2. PROOF SERIALIZATION ===");
        const serializedProof = JSON.stringify(rawOutput);
        const proofBytes = Buffer.byteLength(serializedProof, "utf8");
        console.log(`[PASS] Proof successfully serialized into pure JSON!`);
        console.log(`[DATA] Total Proof Size: ${proofBytes} bytes`);

        console.log("\n=== 3. INDEPENDENT TESTIMONY AUDIT ===");
        const validator = new TestimonyValidator(serializedProof);
        const auditResult = validator.validateAll();

        console.log(JSON.stringify(auditResult, null, 2));

        if (auditResult.valid) {
            console.log("\n=============================================");
            console.log(" FINAL INTEGRITY AUDIT: PASS");
            console.log(" Wuwen Runtime v11.0 Objectively Verifiable!");
            console.log("=============================================");
        } else {
            console.log("\n[FAIL] Audit failed during verification.");
        }
    } catch (err) {
        console.error("\n[ERROR] Audit Execution Exception:", err);
    }
})();
