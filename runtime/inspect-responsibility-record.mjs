import HonestRuntime from "./HonestRuntime.js";

const runtime = new HonestRuntime("这是一个事实");
const result = await runtime.run();

const event = result?.responsibilityEvent;
const records = event?.responsibilityRecords;

console.log("=== RECORD COUNT ===");
console.log(
    Array.isArray(records)
        ? records.length
        : "NOT_ARRAY"
);

console.log("=== RECORD 0 ===");
console.log(
    JSON.stringify(
        records?.[0] ?? null,
        null,
        2
    )
);
