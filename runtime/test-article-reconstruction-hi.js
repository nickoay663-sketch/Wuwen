/**
 * @file test-article-reconstruction-hi.js
 * @description MoWen Hindi Article Analysis and Reconstruction Test
 */

import ResponsibilityLedger from "./ResponsibilityLedger.js";
import MWALContract from "./MWALContract.js";
import fs from "fs";

const ledgerFile = "./article-test-ledger-hi.jsonl";
if (fs.existsSync(ledgerFile)) fs.unlinkSync(ledgerFile);

const ledger = new ResponsibilityLedger(ledgerFile);

const sourceTextHi = `हालांकि प्रयोगशाला के पास से गुजरने वाले आकस्मिक निरीक्षकों द्वारा इस जटिल तंत्र को शायद ही कभी समझा गया था, लेकिन डॉ. वेंस ने — जिन्होंने पुनरावर्ती भाषाई एल्गोरिदम का अध्ययन करने में दशकों बिताए थे — इस बात पर जोर दिया कि मशीन द्वारा उत्पन्न प्रत्येक वाक्य को प्रकाशित होने से पहले कड़ाई से सत्यापित किया जाना चाहिए। यदि इंजीनियरों को पता होता कि स्वचालित पार्सर असत्यापित दावों को खारिज कर देगा, तो वे प्रोटोकॉल को अलग तरह से डिजाइन कर सकते थे। हालांकि, सबसे ज्यादा मायने यह नहीं रखता कि प्रणाली कैसे बनाई गई थी, बल्कि यह मायने रखता है कि क्या यह दबाव के तहत पूरी तरह से ईमानदार बनी रहती है। जब भी कोई दावा किया जाता है, तो उसका व्यवस्थित रूप से विश्लेषण किया जाता है, ठोस साक्ष्यों से मिलान किया जाता है और — यदि सत्य साबित होता है — तो उसे अपरिवर्तनीय बहीखाते (Ledger) में स्थायी रूप से सील कर दिया जाता है ताकि कोई भी भविष्य का उपयोगकर्ता इसके इतिहास को बदल न सके।`;

console.log("==================================================");
console.log("      莫问 (MoWen) 印地语文本分析与重构引擎      ");
console.log("==================================================");
console.log(`[输入印地语原始文本]:\n${sourceTextHi}\n`);

console.log("--- 步骤 1: 印地语认知解构 (Epistemic Parsing) ---");
console.log("正在跨语种解析从句与事实断言...");

// 使用合规的 rec_ 前缀，对印地语核心断言进行结构化解构
const claimsHi = [
    {
        id: "rec_hi_claim_001",
        statement: "डॉ. वेंस ने जोर दिया कि मशीन द्वारा उत्पन्न प्रत्येक वाक्य को प्रकाशन से पहले कड़ाई से सत्यापित किया जाना चाहिए।",
        evidence: [{ source: "Dr_Vance_Log_2026_HI", snippet: "मशीन टेक्स्ट आउटपुट से पहले सख्त सत्यापन अनिवार्य।" }]
    },
    {
        id: "rec_hi_claim_002",
        statement: "स्वचालित पार्सर असत्यापित दावों को खारिज कर देता है।",
        evidence: [{ source: "Parser_Spec_v1.0_HI", snippet: "अपुष्ट दावे तत्काल प्रोटोकॉल अस्वीकृति को ट्रिगर करते हैं।" }]
    },
    {
        id: "rec_hi_claim_003",
        statement: "सत्यापित दावों को अपरिवर्तनीय बहीखाते में स्थायी रूप से सील कर दिया जाता है।",
        evidence: [{ source: "Ledger_Architecture_HI", snippet: "SHA-256 हैश चेनिंग मान्य रिकॉर्ड को स्थायी रूप से सुरक्षित करती है।" }]
    }
];

console.log(`解析完成：共识别出 ${claimsHi.length} 条印地语核心责任断言。\n`);

console.log("--- 步骤 2: 责任重构与密码学铸造 (Reconstruction & Minting) ---");

let reconstructedSummaryHi = [];

for (const c of claimsHi) {
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

        reconstructedSummaryHi.push(`[${record.id}] ${c.statement} (Sig: ${record.signature.substring(0, 8)}...)`);
    } catch (e) {
        console.log(`[拦截] 断言 ${c.id} 未通过合规验证: ${e.message}`);
    }
}

console.log("--- 步骤 3: 最终印地语责任表达输出 ---");
console.log("莫问重构后的可承载责任表达：");
console.log("--------------------------------------------------");
reconstructedSummaryHi.forEach(s => console.log(s));
console.log("--------------------------------------------------");

const integrity = ledger.verifyIntegrity();
console.log(`[账本完整性校验] : ${integrity.valid ? "🟢 绝对安全 (多语言全链路指纹咬合)" : "🔴 异常"}`);
console.log(`[总责任通行证]   : ${integrity.totalRecords} 张`);
console.log("==================================================");

if (fs.existsSync(ledgerFile)) fs.unlinkSync(ledgerFile);
