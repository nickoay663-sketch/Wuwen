import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import HonestRuntime from "./HonestRuntime.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.resolve(
    __dirname,
    "../tests/real-input-20260823-politics.txt"
);

const expression = fs.readFileSync(inputPath, "utf8");

const runtime = new HonestRuntime(expression, {
    language: "zh-CN"
});

const result = await runtime.run();

const checks = {
    realInputLoaded:
        expression.length > 0,

    runtimeVersion:
        result.runtimeVersion === "10.8",

    runtimeClosed:
        result.runtimeState === "RuntimeClosed",

    selfCheckPassed:
        result.selfCheck?.passed === true,

    registryComplete:
        result.selfCheck?.registryReport?.passed === true,

    pipelineIntegrity:
        result.selfCheck?.integrityReport?.passed === true,

    boundaryPassed:
        result.selfCheck?.boundaryReport?.passed === true,

    publicationBoundaryPassed:
        result.selfCheck?.publicationBoundaryReport?.passed === true,

    epistemicBoundaryPassed:
        result.selfCheck?.epistemicReport?.passed === true,

    finalStateUnknown:
        result.epistemicState === "UNKNOWN",

    verificationNotClaimed:
        result.verificationStatus === "UNKNOWN",

    notSupported:
        result.supported === false,

    notPublishable:
        result.responsibilityEventPublishable === false,

    noForbiddenPromotion:
        result.selfCheck?.epistemicReport?.forbiddenPromotion === false,

    noUnsupportedPromotion:
        result.selfCheck?.epistemicReport?.unsupportedPromotion === false,

    noDiscoveredPromotion:
        result.selfCheck?.epistemicReport?.discoveredPromotion === false,

    responsibilityBoundaryValid:
        result.selfCheck?.publicationBoundaryReport
            ?.responsibilityBoundaryValid === true
};

const failed = Object.entries(checks)
    .filter(([, passed]) => passed !== true);

console.log("=== Wuwen REAL INPUT REGRESSION ===");
console.log("Input:", inputPath);
console.log("Bytes:", Buffer.byteLength(expression, "utf8"));
console.log("Characters:", expression.length);

console.log("\n=== CHECKS ===");

for (const [name, passed] of Object.entries(checks)) {
    console.log(`${passed ? "PASS" : "FAIL"}  ${name}`);
}

console.log("\n=== FINAL STATE ===");
console.log("runtimeState:", result.runtimeState);
console.log("epistemicState:", result.epistemicState);
console.log("verificationStatus:", result.verificationStatus);
console.log("supported:", result.supported);
console.log(
    "responsibilityEventPublishable:",
    result.responsibilityEventPublishable
);

if (failed.length > 0) {
    console.error(
        `\nREAL INPUT REGRESSION FAILED: ${failed.length} check(s)`
    );
    process.exitCode = 1;
}

else {
    console.log("\nREAL INPUT REGRESSION PASSED");
}
