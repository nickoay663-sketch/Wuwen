/**
 * @file test-article-reconstruction-th.js
 * @description MoWen Thai Article Analysis and Reconstruction Test
 */

import ResponsibilityLedger from "./ResponsibilityLedger.js";
import MWALContract from "./MWALContract.js";
import fs from "fs";

const ledgerFile = "./article-test-ledger-th.jsonl";
if (fs.existsSync(ledgerFile)) fs.unlinkSync(ledgerFile);

const ledger = new ResponsibilityLedger(ledgerFile);

const sourceTextTh = `แม้ว่ากลไกที่ซับซ้อนนี้จะไม่ค่อยเป็นที่เข้าใจของบรรดาผู้สังเกตการณ์ทั่วไปที่เดินผ่านห้องทดลอง แต่ ดร. แวนซ์ ผู้ซึ่งใช้เวลาหลายทศวรรษในการตรวจสอบอัลกอริทึมทางภาษาแบบเรียกซ้ำยืนกรานว่าทุกประโยคที่เครื่องจักรสร้างขึ้นจะต้องได้รับการตรวจสอบอย่างเข้มงวดก่อนที่จะเผยแพร่ หากวิศวกรทราบว่าตัวแยกวิเคราะห์อัตโนมัติจะปฏิเสธข้อกล่าวหาที่ยังไม่ได้ตรวจสอบ พวกเขาอาจจะออกแบบโปรโตคอลที่แตกต่างออกไป อย่างไรก็ตาม สิ่งที่สำคัญที่สุดไม่ใช่ว่าระบบถูกสร้างขึ้นมาอย่างไร แต่คือการที่ระบบยังคงมีความซื่อสัตย์อย่างสมบูรณ์ภายใต้แรงกดดันหรือไม่ ทุกครั้งที่มีการกล่าวอ้าง ระบบจะถูกวิเคราะห์อย่างเป็นระบบ จับคู่กับหลักฐานที่หนักแน่น และหากพิสูจน์ได้ว่าเป็นความจริง จะถูกผนึกไว้อย่างถาวรภายในบัญชีแยกประเภทที่ไม่สามารถเปลี่ยนแปลงได้ เพื่อไม่ให้ผู้ใช้ในอนาคตสามารถเปลี่ยนแปลงประวัติของมันได้`;

console.log("==================================================");
console.log("      莫问 (MoWen) 泰语文本分析与重构引擎      ");
console.log("==================================================");
console.log(`[输入泰语原始文本]:\n${sourceTextTh}\n`);

console.log("--- 步骤 1: 泰语认知解构 (Epistemic Parsing) ---");
console.log("正在跨语种解析从句与事实断言...");

// 使用合规的 rec_ 前缀，对泰语核心断言进行结构化解构
const claimsTh = [
    {
        id: "rec_th_claim_001",
        statement: "ดร. แวนซ์ยืนกรานว่าทุกประโยคที่สร้างโดยเครื่องจักรจะต้องได้รับการตรวจสอบอย่างเข้มงวดก่อนการเผยแพร่",
        evidence: [{ source: "Dr_Vance_Log_2026_TH", snippet: "บังคับใช้การตรวจสอบอย่างเข้มงวดก่อนการออกข้อความจากเครื่องจักร" }]
    },
    {
        id: "rec_th_claim_002",
        statement: "ตัวแยกวิเคราะห์อัตโนมัติจะปฏิเสธการกล่าวอ้างที่ยังไม่ได้ตรวจสอบ",
        evidence: [{ source: "Parser_Spec_v1.0_TH", snippet: "ข้อกล่าวหาที่ยังไม่ได้รับการตรวจสอบจะกระตุ้นให้เกิดการปฏิเสธโปรโตคอลทันที" }]
    },
    {
        id: "rec_th_claim_003",
        statement: "การกล่าวอ้างที่ได้รับการตรวจสอบแล้วจะถูกผนึกไว้อย่างถาวรภายในบัญชีแยกประเภทที่ไม่สามารถเปลี่ยนแปลงได้",
        evidence: [{ source: "Ledger_Architecture_TH", snippet: "การเชื่อมโยงแฮช SHA-256 ช่วยรักษาความปลอดภัยบันทึกที่ผ่านการตรวจสอบแล้วอย่างถาวร" }]
    }
];

console.log(`解析完成：共识别出 ${claimsTh.length} 条泰语核心责任断言。\n`);

console.log("--- 步骤 2: 责任重构与密码学铸造 (Reconstruction & Minting) ---");

let reconstructedSummaryTh = [];

for (const c of claimsTh) {
    try {
        const record = ledger.append({
            id: c.id,
            epistemicState: MWALContract.RESPONSIBILITY_STATES.ESTABLISHED,
            verificationStatus: MWALContract.VERIFICATION_STATES.SUPPORTED,
            verifiedEvidenceCount: c.evidence.length,
            canPublish: true,
            claim: c.statement
        }, c.evidence);

        console.log(`[已重构断言] ${c.id}`);
        console.log(`  -> 声明: ${c.statement}`);
        console.log(`  -> 状态: ESTABLISHED | 证据数: ${c.evidence.length}`);
        console.log(`  -> 签名: ${record.signature.substring(0, 16)}...\n`);

        reconstructedSummaryTh.push(`[${record.id}] ${c.statement} (Sig: ${record.signature.substring(0, 8)}...)`);
    } catch (e) {
        console.log(`[拦截] 断言 ${c.id} 未通过合规验证: ${e.message}`);
    }
}

console.log("--- 步骤 3: 最终泰语责任表达输出 ---");
console.log("莫问重构后的可承载责任表达：");
console.log("--------------------------------------------------");
reconstructedSummaryTh.forEach(s => console.log(s));
console.log("--------------------------------------------------");

const integrity = ledger.verifyIntegrity();
console.log(`[账本完整性校验] : ${integrity.valid ? "🟢 绝对安全 (多语言全链路指纹咬合)" : "🔴 异常"}`);
console.log(`[总责任通行证]   : ${integrity.totalRecords} 张`);
console.log("==================================================");

if (fs.existsSync(ledgerFile)) fs.unlinkSync(ledgerFile);
