import http from 'http';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { RuntimePipeline } from './runtimePipeline.js';

const pipeline = new RuntimePipeline();
const PORT = process.env.PORT || 8089;
const AUDIT_LOG_PATH = path.resolve('./audit.log');

function getLastHash() {
    if (!fs.existsSync(AUDIT_LOG_PATH)) return "0".repeat(64);
    try {
        const lines = fs.readFileSync(AUDIT_LOG_PATH, 'utf8').trim().split('\n');
        if (lines.length === 0 || lines[0] === '') return "0".repeat(64);
        const lastEntry = JSON.parse(lines[lines.length - 1]);
        return lastEntry.hash || "0".repeat(64);
    } catch (err) {
        return "0".repeat(64);
    }
}

function writeAuditLog(result, reqInfo) {
    const prevHash = getLastHash();
    const timestamp = new Date().toISOString();
    
    const entryData = {
        timestamp,
        clientIp: reqInfo.socket.remoteAddress,
        action: result.action,
        message: result.message,
        expression: result.envelope?.expression || null,
        violations: result.violations || [],
        prevHash
    };

    const hash = crypto.createHash('sha256')
        .update(JSON.stringify(entryData) + prevHash)
        .digest('hex');

    const finalEntry = { ...entryData, hash };
    fs.appendFileSync(AUDIT_LOG_PATH, JSON.stringify(finalEntry) + '\n', 'utf8');
}

// 自动清空旧的不兼容日志
if (fs.existsSync(AUDIT_LOG_PATH)) {
    fs.unlinkSync(AUDIT_LOG_PATH);
}

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/evaluate') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const jsonInput = JSON.parse(body);
                const result = pipeline.process(jsonInput);
                writeAuditLog(result, req);

                res.writeHead(result.action === 'ALLOW' ? 200 : 403, { 
                    'Content-Type': 'application/json; charset=utf-8' 
                });
                res.end(JSON.stringify(result, null, 2));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'Not Found. Use POST /evaluate' }));
    }
});

server.listen(PORT, () => {
    console.log(`[WAL Gateway] 哈希链审计网关已就绪，监听端口: ${PORT}`);
});

export default server;
