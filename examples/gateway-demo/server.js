import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

import WALIndependentValidator from '../../packages/core/src/WALIndependentValidator.js';
import GatewayAuditEvent from '../../packages/core/src/GatewayAuditEvent.js';
import GatewayAuditLedger from '../../packages/core/src/GatewayAuditLedger.js';

export const ledgerPath = path.resolve(
  './examples/gateway-demo/audit.ledger'
);

export const auditLedger = new GatewayAuditLedger(ledgerPath);
const validator = new WALIndependentValidator();

const sockets = new Set();

export const server = http.createServer((req, res) => {
  if (req.url !== '/api/action' || req.method !== 'POST') {
    res.writeHead(404, {
      'Content-Type': 'application/json'
    });

    res.end(JSON.stringify({
      error: 'Not Found'
    }));

    return;
  }

  let body = '';

  req.on('data', chunk => {
    body += chunk;
  });

  req.on('end', () => {
    let payload;

    try {
      payload = JSON.parse(body);
    } catch {
      res.writeHead(400, {
        'Content-Type': 'application/json'
      });

      res.end(JSON.stringify({
        status: 'REJECTED',
        reason: 'MALFORMED_ENVELOPE'
      }));

      return;
    }

    const validationResult = validator.validateEnvelope(payload);

    const passed = validationResult.passed;
    const decision = passed ? 'ALLOW' : 'BLOCK';

    const auditEvent = GatewayAuditEvent.create({
      id: `audit_${payload.eventId || Date.now()}`,
      eventType: passed
        ? 'RESPONSIBILITY_CONFORM'
        : 'RESPONSIBILITY_BREACH',
      source: 'wuwen-gateway-demo',
      decision,
      responsibilityState:
        payload.responsibilityState || 'UNKNOWN',
      verificationState:
        payload.verificationState || 'UNKNOWN',
      failedRules: validationResult.failedRules.map(rule => rule.id),
      requestId:
        req.headers['x-request-id'] ||
        `req-${Date.now()}`,
      timestamp: new Date().toISOString()
    });

    try {
      auditLedger.append(auditEvent);
    } catch {
      res.writeHead(503, {
        'Content-Type': 'application/json'
      });

      res.end(JSON.stringify({
        status: 'AUDIT_FAILURE',
        reason: 'AUDIT_PERSISTENCE_FAILURE'
      }));

      return;
    }

    const integrity = auditLedger.verifyIntegrity();

    if (!integrity.valid) {
      res.writeHead(500, {
        'Content-Type': 'application/json'
      });

      res.end(JSON.stringify({
        status: 'AUDIT_FAILURE',
        reason: 'AUDIT_LEDGER_INTEGRITY_FAILURE'
      }));

      return;
    }

    res.writeHead(
      passed ? 200 : 422,
      {
        'Content-Type': 'application/json',
        'X-WAL-Governance': passed
          ? 'CONFORM'
          : 'NON_CONFORM'
      }
    );

    res.end(JSON.stringify({
      decision,
      validatorStatus: validationResult.status,
      failedRules: validationResult.failedRules,
      auditRecorded: true,
      ledgerHeight: integrity.totalRecords
    }));
  });
});

server.on('connection', socket => {
  sockets.add(socket);
  socket.on('close', () => sockets.delete(socket));
});

export function startServer(port = 0) {
  return new Promise((resolve, reject) => {
    server.once('error', reject);

    server.listen(port, '127.0.0.1', () => {
      const address = server.address();

      console.log(
        `[Gateway] Wuwen WAL audit gateway running on port ${address.port}`
      );

      resolve(address.port);
    });
  });
}

export function stopServer() {
  return new Promise(resolve => {
    for (const socket of sockets) {
      socket.destroy();
    }

    if (!server.listening) {
      resolve();
      return;
    }

    server.close(() => resolve());
  });
}

export function cleanupLedger() {
  if (fs.existsSync(ledgerPath)) {
    fs.unlinkSync(ledgerPath);
  }
}
