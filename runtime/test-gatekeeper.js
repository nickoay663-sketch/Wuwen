import WALGatekeeper from './WALGatekeeper.js';

console.log('==================================================');
console.log('       鍕块棶 (Wuwen) Gatekeeper 鑱斿悎鎷︽埅娴嬭瘯       ');
console.log('==================================================');

const taintedEnvelope = {
    epistemicState: 'ESTABLISHED',
    evidence: [],
    claim: 'Attempting to bypass evidence requirement.'
};

const verdict1 = WALGatekeeper.inspect(taintedEnvelope);
console.log('\n[娴嬭瘯 1] 杩濊淇″皝鎷︽埅娴嬭瘯: 鍑嗗叆鐘舵€?= ' + verdict1.admitted);
if (!verdict1.admitted) {
    console.log('  -> 鎷︽埅鍘熷洜: ' + verdict1.reason);
    verdict1.violations.forEach(v => console.log('     * 杩濊瑙勫垯 [' + v.rule + ']: ' + v.reason));
}

const pristineEnvelope = {
    epistemicState: 'ESTABLISHED',
    evidence: [{ source: 'Verified_Store', snippet: 'Fully grounded data payload.' }],
    claim: 'Legitimate grounded assertion.'
};

const verdict2 = WALGatekeeper.inspect(pristineEnvelope);
console.log('\n[娴嬭瘯 2] 鍚堟硶淇″皝鏀捐娴嬭瘯: 鍑嗗叆鐘舵€?= ' + verdict2.admitted);
console.log('  -> 鏀捐鍙嶉: ' + verdict2.reason);
console.log('==================================================');
