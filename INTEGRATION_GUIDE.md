# Wuwen Accountability Layer (WAL)

## Integration Guide

WAL is the accountability boundary between a runtime and an external system.

Basic flow:

Runtime
→ WALResponsibilityInterface
→ WAL Envelope
→ WAL Validation
→ Allow / Block

## 1. Core Components

### WALContract

Defines the WAL contract and envelope invariants.

### WALResponsibilityInterface

Translates explicitly established runtime responsibility records into WAL envelopes.

### WALIndependentValidator

Independently validates WAL envelopes against the protocol rules.

## 2. Standard Integration Flow

Runtime
→ Responsibility Interface
→ WAL Envelope
→ Independent Validator
→ Allow / Block

Validation must happen before propagation.

## 3. Important Rules

WAL does not invent responsibility.

WAL does not infer identity.

WAL does not manufacture evidence.

WAL does not manufacture verification.

Unknown must remain UNKNOWN.

Unestablished must remain UNESTABLISHED.

Validation comes before propagation.

## 4. Minimal Example

The repository contains a runnable gateway example:

examples/basic-gateway-node/index.js

Run:

node examples/basic-gateway-node/index.js

The example demonstrates both conforming and non-conforming envelopes.

### Conforming

Validation Status: CONFORM

Passed: true

Total Rules Checked: 54

Failed Rules Count: 0

### Attack

Validation Status: NON_CONFORM

Passed: false

Total Rules Checked: 54

Failed Rules Count: 5

The attack is intercepted by the WAL validation boundary.

## 5. Independent Verification

WAL can be independently verified without trusting runtime-internal authority claims.

Independent validation assets are located under:

protocol/WAL/validator/

protocol/WAL/tests/

protocol/WAL/bin/

## 6. Protocol

WAL — Wuwen Accountability Layer

Protocol Version: 1.0

Core Contract Version: 1.0

Responsibility Interface Version: 2.2
