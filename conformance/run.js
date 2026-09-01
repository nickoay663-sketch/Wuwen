import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import WALIndependentValidator from '../packages/core/src/WALIndependentValidator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const validator = new WALIndependentValidator();
const categories = ['conform', 'attack', 'boundary'];

let totalPassed = 0;
let totalFailed = 0;
const results = {};

console.log('=== WAL Protocol Standard Conformance Suite ===\n');

for (const cat of categories) {
    const catDir = path.join(__dirname, 'cases', cat);
    results[cat] = { passed: 0, failed: 0, total: 0 };

    if (!fs.existsSync(catDir)) continue;

    const files = fs.readdirSync(catDir).filter(f => f.endsWith('.json'));
    results[cat].total = files.length;

    for (const file of files) {
        const filePath = path.join(catDir, file);
        const rawContent = fs.readFileSync(filePath, 'utf8').trim();

        if (!rawContent) {
            console.warn('  [WARN] [' + cat.toUpperCase() + '] Skipping empty file: ' + file);
            results[cat].total--;
            continue;
        }

        let testCase;
        try {
            testCase = JSON.parse(rawContent);
        } catch (err) {
            console.error('  [ERROR] [' + cat.toUpperCase() + '] Failed to parse JSON in ' + file + ': ' + err.message);
            totalFailed++;
            continue;
        }

        const validationResult = validator.validateEnvelope(testCase.payload);

        let success = false;
        if (testCase.expect === 'pass') {
            success = validationResult.passed === true;
        } else if (testCase.expect === 'breach') {
            success = validationResult.passed === false;
        }

        if (success) {
            results[cat].passed++;
            totalPassed++;
            console.log('  [PASS] [' + cat.toUpperCase() + '] ' + (testCase.name || file));
        } else {
            results[cat].failed++;
            totalFailed++;
            console.error('  [FAIL] [' + cat.toUpperCase() + '] ' + (testCase.name || file) + ' -> Expected ' + testCase.expect + ', got passed=' + validationResult.passed);
        }
    }
}

console.log('\n=============================================');
console.log('WAL CONFORMANCE REPORT:');
for (const cat of categories) {
    console.log('  - ' + cat.padEnd(10) + ': ' + results[cat].passed + '/' + results[cat].total + ' passed');
}
console.log('=============================================');

if (totalFailed > 0) {
    console.error('\nWAL CONFORMANCE: FAIL (' + totalFailed + ' test cases failed)');
    process.exit(1);
} else {
    console.log('\nWAL CONFORMANCE: PASS (All ' + totalPassed + ' test cases conformed)');
    process.exit(0);
}
