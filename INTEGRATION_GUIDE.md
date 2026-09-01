# WAL Integration Guide

## 1. Overview

WAL (WAL Protocol) defines a responsibility boundary for systems that
publish epistemic states, evidence claims, and responsibility declarations.

WAL does not restrict expression.

It governs whether a claim may cross the responsibility boundary as an
authoritative statement.

The core integration flow is:

    Application / Runtime
            |
            v
       @wuwen/core
            |
            v
       WAL Gateway
            |
            v
    Validated WAL Envelope
            |
            v
       External System

The governing principle is:

    Expression is free.
    Authority is not.

An integrating system MUST NOT manufacture VERIFIED, SUPPORTED,
ESTABLISHED, or ALLOW states merely by supplying corresponding fields.

Responsibility authority must originate from trusted Runtime provenance
and pass WAL validation before it may propagate.

## 2. Installation

WAL integration is provided as an npm workspace consisting of the Wuwen
Core SDK and protocol adapters.

From the repository root:

    npm install

The Core SDK is exposed as:

    @wuwen/core

The Gateway and Web adapters consume the Core SDK through the same WAL
contract boundary.

After installation, verify the Runtime baseline with:

    npm test

For Gateway conformance and attack tests:

    node --test .\packages\gateway\tests\*.test.mjs

For Web adapter tests:

    node --test .\packages\web\tests\*.test.mjs
## 3. Core SDK

The Core SDK provides the protocol-level primitives required to construct,
validate, and reason about WAL envelopes.

Import the Core SDK:

    import {
      WALContract,
      WALIndependentValidator
    } from "@wuwen/core";

A WAL envelope MUST be validated before it is propagated.

Example:

    const validation =
      WALIndependentValidator.validate(envelope);

    if (!validation.valid) {
      throw new Error("WAL validation failed");
    }

The validator is the protocol boundary.

Applications MUST treat validation failure as a governance failure and
MUST NOT bypass the validator by directly publishing the rejected envelope.

## 4. WAL Gateway

The WAL Gateway provides the enforcement boundary between an application
or Runtime and an external propagation target.

The Gateway performs, at minimum:

1. WAL envelope validation.
2. Responsibility-boundary enforcement.
3. Rejection of forged verification states.
4. Rejection of forged responsibility states.
5. Rejection of runtime-internal data crossing the external boundary.
6. Propagation only when the WAL contract permits it.

A conforming HTTP integration should expose the validated result through
the request/response boundary.

A successful request may expose:

    X-WAL-Governance: CONFORM

A rejected responsibility claim should return:

    422 RESPONSIBILITY_BREACH

and include the failed WAL rules needed to diagnose the rejection.

Gateway rejection MUST be treated as authoritative for propagation:
the application MUST NOT retry the same rejected envelope by bypassing
the Gateway.

The Gateway is an enforcement layer, not a source of responsibility
authority. It validates and constrains authority; it does not manufacture
authority.
## 5. Web Adapter

The Web Adapter provides a browser-oriented session boundary for creating
WAL envelopes without manufacturing responsibility authority.

Import the Web adapter:

    import { BrowserWALSession } from "@wuwen/web";

Create a session with the application identity:

    const session =
      new BrowserWALSession("application-identity");

Append an expression:

    const record =
      session.appendRecord("example content");

The resulting record is projected through the WAL boundary.

The Web Adapter MUST NOT convert caller-supplied epistemic or
responsibility claims into trusted Runtime authority.

For example, an external caller cannot establish responsibility merely
by supplying:

    supported: true
    verificationState: "SUPPORTED"
    responsibilityState: "ESTABLISHED"

Such claims remain subject to WAL validation and provenance rules.

## 6. Responsibility Boundary

The responsibility boundary is the central trust boundary of WAL.

Only responsibility records carrying the explicit trusted Runtime
provenance marker may establish responsibility authority.

The expected provenance is:

    provider: "Wuwen.ResponsibilityEngine"
    version: "1.0"

Record shape alone is insufficient.

A record without trusted provenance MUST NOT be treated as authoritative,
even if it contains fields such as:

    supported: true
    verificationStatus: "SUPPORTED"
    responsibilityBoundary: {
      status: "matched"
    }

The WAL boundary therefore separates:

    Runtime responsibility authority
                |
                v
        trusted WAL projection
                |
                v
        validated WAL envelope
                |
                v
        external propagation

Untrusted event-level metadata MUST NOT override the trusted
responsibility record.

In particular, the following event-level fields are descriptive only:

    event.epistemicState
    event.responsibilityState
    event.propagationState
    event.supported

They MUST NOT be used to manufacture WAL authority.

If no trusted responsibility record is present, the WAL responsibility
state remains unestablished and propagation requiring responsibility
verification MUST NOT be authorized.
## 7. Validation and Failure Handling

Validation MUST occur before propagation.

A conforming integration should treat the validation result as a
mandatory gate:

    const result =
      WALIndependentValidator.validate(envelope);

    if (!result.valid) {
      // Do not publish.
      // Record or surface the failed rules.
    }

Validation failure means that the envelope has not satisfied the WAL
contract. The caller MUST NOT reinterpret a failed validation result as
authorization.

For HTTP integrations, a Gateway rejection should be propagated as a
structured governance error.

A typical rejection contains:

    {
      "status": 422,
      "code": "RESPONSIBILITY_BREACH",
      "failedRules": [...]
    }

The integration MAY log or display the failed rules for diagnosis.

It MUST NOT silently upgrade, rewrite, or bypass the rejected state in
order to force propagation.

## 8. Minimal Integration Example

The following example illustrates the minimum application-side flow:

    import {
      WALContract,
      WALIndependentValidator
    } from "@wuwen/core";

    const envelope =
      WALContract.createEnvelope({
        eventId: "example-event",
        expression: "example content",
        verificationState: "UNKNOWN",
        responsibilityState: "UNESTABLISHED",
        propagationState: "REQUIRE_VERIFICATION"
      });

    const validation =
      WALIndependentValidator.validate(envelope);

    if (!validation.valid) {
      console.error("WAL rejected envelope", validation);
    } else {
      console.log("WAL envelope conforms", envelope);
    }

The important property of this example is not the application-specific
expression. It is the ordering:

    construct
        |
        v
    validate
        |
        +---- invalid ----> reject
        |
        v
    conform
        |
        v
    propagate

An integration MUST NOT replace this flow with:

    construct
        |
        v
    propagate
        |
        v
    validate later

WAL validation is a pre-propagation boundary.
## 9. Security and Trust Model

WAL uses an explicit trust-boundary model.

The integration MUST distinguish between:

- application-provided data;
- Runtime-derived responsibility authority;
- WAL protocol validation;
- externally propagated state.

Application input is untrusted.

Event-level authority claims are untrusted.

Only responsibility records carrying the required Runtime provenance may
establish responsibility authority.

The trust flow is therefore:

    Untrusted Input
          |
          v
    Runtime Processing
          |
          v
    Trusted Responsibility Record
          |
          v
    WAL Projection
          |
          v
    Independent Validation
          |
          v
    External Propagation

The following attacks MUST be rejected:

- forged VERIFIED or SUPPORTED states;
- forged responsibility authorization;
- UNKNOWN promoted to an authoritative positive state;
- evidence claims presented as responsibility authority;
- responsibility exceeding available evidence;
- Runtime-internal implementation state crossing the external boundary.

A conforming implementation MUST preserve this separation even when
integrated with another framework, service, or transport protocol.

## 10. Conformance Testing

A WAL integration SHOULD run both positive conformance tests and negative
attack tests.

From the repository root:

    npm test

Run Gateway tests:

    node --test .\packages\gateway\tests\*.test.mjs

Run Web adapter tests:

    node --test .\packages\web\tests\*.test.mjs

A conforming integration should demonstrate that:

1. valid WAL envelopes are accepted;
2. invalid envelopes are rejected;
3. UNKNOWN cannot be promoted into authoritative truth;
4. forged verification states are rejected;
5. forged responsibility states are rejected;
6. runtime internals cannot cross the WAL boundary;
7. responsibility cannot exceed its evidence boundary;
8. valid envelopes remain valid through the intended propagation path.

The negative tests are security tests, not optional edge cases.

An integration is not considered conformant merely because valid traffic
succeeds. It must also demonstrate that unauthorized authority cannot
cross the responsibility boundary.

The WAL protocol boundary is therefore verified by both:

    Conformance
        +
    Attack Resistance

Together they establish that the integration preserves the WAL
accountability contract.
