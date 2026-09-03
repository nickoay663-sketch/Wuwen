# WAL Blind Adversarial Evaluation v1.0

## 1. Status

This document defines the normative procedure for Blind Adversarial Evaluation of the WAL Protocol.

Blind Adversarial Evaluation does not constitute independent security audit.

## 2. Evidence Tiers

The WAL verification evidence hierarchy is:

- Designed Scenario Conformance — IMPLEMENTED
- Independent Cross-Language Conformance — IMPLEMENTED
- Blind Adversarial Evaluation — DEFINED / NEXT
- External Human Adversarial Review — NOT IMPLEMENTED

The absence of External Human Adversarial Review MUST NOT be represented as completed independent security audit.

## 3. Blindness Boundary

Each blind attack evaluation MUST use a brand-new session with no historical conversation context.

The attack executor MUST receive only:

1. the applicable WAL Protocol specification;
2. the applicable JSON Schema;
3. the task description for generating an adversarial input.

The executor MUST NOT receive:

- internal attack scenarios;
- Golden Test Vectors;
- previous attack results;
- internal design reasoning;
- expected failure rules;
- prior WAL development discussion.

Exactly one initial prompt MUST be sent.

After the initial prompt:

- no clarification;
- no correction;
- no hint;
- no leading question;
- no follow-up prompt;
- no answer to executor questions.

If the executor responds with a clarification question or otherwise fails to produce an attack Envelope, the session MUST terminate immediately.

The complete original response MUST be preserved and the session MUST be recorded as:

`ATTACK_NOT_APPLICABLE`

with reason:

`no attack produced`

No additional response or replacement session may be issued to complete the attack.

The session metadata MUST include at minimum:

- model provider;
- model name;
- model version, where available;
- session timestamp;
- protocol version;
- schema version.

Model diversity is OPTIONAL in v1.0 and MUST NOT be represented as a completed requirement.

## 4. Attack Result Classification

Every produced attack MUST first undergo JSON Schema validation.

### ATTACK_INVALID

The attack does not satisfy the applicable JSON Schema.

### ATTACK_NOT_APPLICABLE

The attack satisfies the JSON Schema, but its objective has no applicable WAL protocol obligation or rule predicate within the current 54-rule coverage.

### ATTACK_BLOCKED

The attack satisfies the JSON Schema, targets an applicable WAL obligation, and the independent Validator returns `NON_CONFORM`.

### ATTACK_ESCAPED

The attack satisfies the JSON Schema, targets an applicable WAL obligation, and the independent Validator returns `CONFORM` where the attack objective is expected to be blocked.

`ATTACK_ESCAPED` MUST be recorded as a `CANDIDATE_ESCAPE`.

It MUST NOT be represented as a confirmed security vulnerability without independent adjudication.

## 5. Adjudication Boundary

The Python independent Validator provides mechanical conformance results only:

- `CONFORM`
- `NON_CONFORM`

Validator output MUST NOT by itself be represented as proof that an attack is valid, invalid, applicable, or a confirmed vulnerability.

A `CANDIDATE_ESCAPE` MAY receive a project-owner provisional adjudication:

- `PROVISIONALLY_DISMISSED`
- `PROTOCOL_EVOLUTION_REQUIRED`

Every provisional adjudication MUST include a mandatory textual `reason` explaining the basis for the decision.

The original `ATTACK_ESCAPED` record MUST remain immutable.

A provisional adjudication MUST be explicitly marked:

`pending external review`

Project-owner provisional adjudication MUST NOT be represented as independent external review.

## 6. Immutable Evidence Record

Each evaluation MUST preserve:

- original prompt;
- complete executor output;
- model provider and model version;
- timestamp;
- input Envelope;
- raw Schema validation result;
- raw Validator result;
- protocol version;
- schema version;
- rule inventory version;
- experiment configuration;
- SHA-256 of the preserved record;
- Git Provenance reference.

Original records MUST NOT be overwritten.

Corrections, reclassification, or additional adjudication MUST be appended as new records.

Historical records MUST remain recoverable.

## 7. No Result-Shaping

After an attack has been executed, the executor input, classification criteria, Validator implementation, or expected result MUST NOT be modified for the purpose of changing the result.

Any methodological change MUST create a new explicitly versioned experiment.

A failed or escaped experiment MUST never be repaired by rewriting its historical input or result.

## 8. Known Limitation

Blind Adversarial Evaluation provides stronger evidence than designed scenarios because the attack session is isolated from internal attack design.

However, it does not provide full independence from the project owner where provisional adjudication remains project-owned.

External Human Adversarial Review remains:

`NOT IMPLEMENTED`

until an independent human reviewer performs and records such review.

## 9. Core Principle

WAL MUST NOT claim:

"Nobody can bypass Wuwen."

The supported claim is narrower:

"Under the recorded evaluation procedure, the evaluated independent attack session did not produce a candidate escape."

Verification evidence MUST remain distinguishable from security-audit claims.
