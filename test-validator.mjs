import { WuwenValidator } from './src/validator.mjs';

console.log('=== Starting Wuwen v10.8 Validator Tests ===');

const validator = new WuwenValidator({ strictMode: true });

// 测试 1：空负载测试
const test1 = validator.verify(null);
console.log('Test 1 (Null payload):', test1.valid === false ? 'PASS' : 'FAIL');

// 测试 2：严格模式下缺少必要字段
const test2 = validator.verify({ actor: 'system-alpha' });
console.log('Test 2 (Missing action):', test2.valid === false ? 'PASS' : 'FAIL');

// 测试 3：合法上下文验证
const test3 = validator.verify({ actor: 'system-alpha', action: 'runtime-audit' });
console.log('Test 3 (Valid context):', test3.valid === true ? 'PASS' : 'FAIL');

console.log('Audit trail count:', validator.auditTrail.length);
console.log('=== All Tests Completed ===');
