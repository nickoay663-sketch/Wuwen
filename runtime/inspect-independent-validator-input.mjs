import HonestRuntime from "./HonestRuntime.js";

const runtime = new HonestRuntime("杩欐槸涓€涓簨瀹?);
const result = await runtime.run();

console.log("=== RESULT KEYS ===");
console.log(Object.keys(result || {}));

console.log("=== RESPONSIBILITY EVENT KEYS ===");
console.log(
    Object.keys(
        result?.responsibilityEvent || {}
    )
);

console.log("=== RESULT WAL KEYS ===");
console.log(
    result?.WALEnvelope
        ? Object.keys(result.WALEnvelope)
        : "NO result.WALEnvelope"
);
