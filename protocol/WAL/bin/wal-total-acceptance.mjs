import { execFileSync } from "node:child_process";

const cwd = process.cwd();

const commands = [
    ["node", ["--test", ".\\tests\\*.test.mjs"]]
];

for (const [command, args] of commands) {
    execFileSync(command, args, {
        cwd,
        stdio: "inherit",
        shell: true
    });
}

console.log("");
console.log("========================================");
console.log("WAL TOTAL ACCEPTANCE GATE: PASS");
console.log("========================================");
