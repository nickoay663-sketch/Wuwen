# WAL Gateway Adapter Contract v1.0

## 1. Status

This is the v1.0 draft of the WAL Gateway Adapter Contract. It defines
the rules that any framework adapter (Express, Fastify, NestJS, Koa,
etc.) must follow when connecting WAL governance capability to an HTTP
gateway layer.

## 2. Scope

This contract applies to any framework adapter that connects WAL
(Wuwen Accountability Layer) governance to a concrete HTTP framework
at the gateway layer. It does not govern the internal WAL Runtime
engines (Recognition / Definition / Correspondence / Evidence /
Reasoning / Responsibility / Reconstruction), nor the internal rule
logic of the WAL Independent Validator itself, which is governed
separately by WAL_INDEPENDENT_VALIDATOR_CONTRACT_v1.0.md.

## 3. Terminology

- **Adapter**: the glue code that connects a specific HTTP framework's
  request/response lifecycle to the WAL Validator and the Gateway
  Audit Ledger.
- **WAL Validator**: the independent validator that checks an
  envelope's structure and governance rules (current implementation:
  WALIndependentValidator).
- **Gateway Audit Event**: the governance decision record (ALLOW /
  BLOCK plus governance fields) produced for a single request.
- **Gateway Audit Ledger**: the append-only, chain-signed audit ledger
  responsible for persisting Audit Events and providing integrity
  verification (verifyIntegrity).
- **Fail-Closed**: when audit persistence or integrity verification
  fails, the system must reject the current and all subsequent
  requests rather than allow them through.

## 4. Adapter Responsibility Boundary

An adapter's responsibility is limited to:
1. Extracting the envelope (payload) from the framework's native
   request object;
2. Calling the WAL Validator to obtain a governance result;
3. Constructing a Gateway Audit Event from that result;
4. Writing the Audit Event to the Gateway Audit Ledger;
5. Verifying Ledger integrity;
6. Translating the resulting governance decision into that
   framework's HTTP response (status code, body, headers).

Adapters do not perform rule interpretation, evidence judgment, or
identity inference — those belong to the WAL Validator or Runtime.

## 5. MUST

Adapters MUST:
- Call the WAL Validator for every request entering a protected
  route, without skipping it;
- Produce and persist a Gateway Audit Event for every decision,
  whether ALLOW or BLOCK;
- Complete Ledger integrity verification before returning a business
  response;
- Only let an ALLOW decision's response reach the caller after
  integrity verification has passed;
- Map the Audit Event's governance fields (decision,
  responsibilityState, verificationState, propagationState,
  failedRules, requestId, timestamp) faithfully, without omission or
  substitution.

## 6. MUST NOT

Adapters MUST NOT:
- Interpret or reimplement WAL rule logic themselves (e.g. deciding
  inside the Adapter whether some field counts as "verified");
- Bypass the WAL Validator and make governance decisions directly
  from request body fields;
- Treat the Audit Ledger as a source of Evidence or as governance
  justification;
- Allow (ALLOW) the current request after an audit write failure;
- Set or predetermine responsibilityState / verificationState /
  propagationState before the Runtime has produced a governance
  result.

## 7. Decision Flow

1. Receive request → parse payload;
2. If payload is structurally invalid (not an object, an array, or
   fails to parse) → record a REJECTED_MALFORMED audit event → verify
   integrity → return 400;
3. If payload is valid → call `validator.validateEnvelope(payload)`;
4. Construct decision (ALLOW / BLOCK) and the Gateway Audit Event
   based on validationResult.passed;
5. Write to the Ledger (`ledger.append(event)`);
6. Verify integrity (`ledger.verifyIntegrity()`);
7. If integrity verification fails → enter "audit integrity failure
   lock" (see Section 9) → return 500, and return 503 for all
   subsequent requests;
8. If integrity verification passes → return 200 (ALLOW) or 422
   (BLOCK) based on decision.

## 8. Audit Persistence Failure

When `ledger.append(event)` throws (disk write failure, permission
issue, etc.):
- The adapter MUST catch the exception;
- The adapter MUST NOT silently ignore it and continue to allow the
  request;
- The adapter MUST return a response that clearly identifies an audit
  persistence failure (recommended: 503,
  reason: AUDIT_PERSISTENCE_FAILURE);
- The request's own governance decision (ALLOW/BLOCK) MUST NOT take
  effect externally, since its audit record could not be confirmed as
  persisted.

## 9. Audit Integrity Failure

When `ledger.verifyIntegrity()` returns `valid: false`:
- The adapter MUST immediately enter a "locked" state;
- The current request MUST return 500, with a response body
  containing `reason: AUDIT_LEDGER_INTEGRITY_FAILURE` and
  `locked: true`;
- While locked, all subsequent requests MUST return 503 immediately,
  without re-running the Validator or writing to the Ledger (to avoid
  appending further untrusted records to an already-compromised
  ledger);
- Unlocking MUST be an explicit operational action (e.g. restarting
  the service or an operator-invoked reset), and MUST NOT auto-recover
  after a timeout.

## 10. WAL Validator Boundary

- Adapters may only call `validator.validateEnvelope(envelope, ...)`
  as the single entry point; they MUST NOT call the Validator's
  internal rule functions or helper functions directly;
- The Validator's returned `passed` / `failedRules` / `status` are
  the sole trustworthy source of governance results; adapters MUST
  NOT make any determination based on fields the payload itself
  claims (e.g. a payload-supplied `decision`, `validatorStatus`, or
  `verificationStatus`) — such fields, even if present, must be
  treated as untrusted input, recorded verbatim where applicable, but
  never accepted as a governance conclusion.

## 11. Evidence Boundary

- The Gateway Audit Ledger records the history of governance
  decisions; it is not Evidence;
- Adapters MUST NOT use records in the Ledger as inputs to
  WAL-R02-series evidence rules;
- Any future use of audit records for evidentiary purposes must go
  through a separately defined, versioned protocol extension, not be
  implicitly implemented in Adapter code.

## 12. Framework Adapter Requirements

Any concrete framework adapter (Express, Fastify, NestJS, Koa, etc.)
MUST:
- Reuse the same WAL Core (WALIndependentValidator) and the same
  GatewayAuditLedger implementation, rather than implementing separate
  rule or ledger logic per framework;
- Provide a processing chain behaviorally equivalent to the Decision
  Flow in Section 7;
- Provide independent Conformance tests (see Section 13) covering the
  boundary scenarios defined in Sections 8/9/10/11.

## 13. Conformance Requirements

Before a framework adapter is considered compliant with this
contract, it must pass tests for the following scenarios:

1. A compliant request returns ALLOW (200), with the audit record
   persisted and integrity valid;
2. A rule-violating request returns BLOCK (422), with the audit
   record persisted and integrity valid;
3. A malformed request returns 400 (REJECTED_MALFORMED) without
   entering the protected route logic;
4. Behavior on audit persistence failure conforms to Section 8;
5. Behavior on audit integrity failure conforms to Section 9,
   including the lock state persisting across subsequent requests;
6. Forged governance fields (a payload's own claimed decision /
   verificationStatus / etc.) cannot cause the adapter to directly
   accept an ALLOW conclusion — and even when the final verdict is
   still BLOCK, the test must confirm that BLOCK's actual triggering
   rule matches the test's stated intent, rather than being
   incidentally triggered by an unrelated rule (e.g. contract
   structural validation).

### 13.1 Test Validity Checklist

Before any Conformance scenario 5 or 6 test can be counted as
validated, confirm each of the following:

1. **Trigger-path confirmation**: does the pass/fail assertion
   actually traverse the full intended path, rather than being
   short-circuited by some earlier condition?
2. **Minimal-variable principle**: does each attack test change only
   one variable, avoiding multiple issues bundled into a single
   payload that can't be distinguished?
3. **Remove-the-tamper self-check**: does removing the "tampering" or
   "forgery" part of the test cause it to flip to the expected
   opposite result, rather than passing or failing regardless?
4. **Per-item verification in parameterized tests**: for a single test
   function covering multiple fields/scenarios, has every item
   actually been verified individually, rather than being masked by
   array structure or assertion style?
5. **Assertion precision**: do error-matching assertions use precise
   regex or field comparisons, avoiding an OR fallback across multiple
   possible causes that would prevent confirming which specific rule
   or layer actually fired?
6. **Data integrity before protection logic**: for scenarios involving
   enum values or required fields, is the test data itself confirmed
   valid before evaluating whether the protection logic works —
   avoiding an unrelated structural-validation rule being triggered
   incidentally because the test data itself was invalid?

## 14. Security / Fail-Closed Invariants

- Fail-Closed has no business exceptions: an audit write failure or
  integrity verification failure must always block; adapters must
  never catch the exception and fall through to ALLOW;
- Any future need for "audit unavailable but business continues" must
  be proposed as a separately defined, versioned Protocol Mode /
  Policy, not implemented as a private exception in Adapter code;
- The Integrity Failure Lock must remain in effect for the lifetime of
  the process, and must not auto-clear based on request count or
  elapsed time.

## 15. Design Principles

The following principles were distilled from two real postmortems
(the Ledger field-mapping bug, and the Ledger forged-record test false
positive):

1. Pass rate is not evidence — a passing test may still not be testing
   what it claims to test;
2. Watch for silent failures, not just explicit errors — fields being
   silently dropped or conditions being unexpectedly short-circuited
   often produce no exception at all;
3. Parameterized tests must verify semantic equivalence item by item,
   not assume every item is correctly covered just because the array
   structure looks tidy;
4. Each attack test isolates exactly one variable — bundling multiple
   variables makes it impossible to know what actually triggered the
   result;
5. Apply the "remove the change and see if it still fails" self-check
   as the most direct way to catch false positives;
6. Every claim in project documentation should be traceable to a
   specific test or artifact, not left in a "settled in discussion"
   state — the creation of this very document is itself a case in
   point: an earlier claim that "Contract v1.0 is finalized" existed
   for some time without ever corresponding to an actual file on
   disk.

## 16. Versioning

- This document's version: v1.0 (English working draft; a Chinese
  authoritative version is planned once the structure stabilizes);
- Any change to MUST / MUST NOT / Fail-Closed invariants requires a
  major version bump;
- Adding a new Conformance scenario or Design Principle counts as a
  minor version update;
- The history of this document's creation and changes should be
  traceable through Git commits, not dependent on external discussion
  records.
