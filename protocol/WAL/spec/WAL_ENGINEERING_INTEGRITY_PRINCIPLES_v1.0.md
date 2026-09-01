# WAL Engineering Integrity Principles v1.0

## Purpose

These principles define the mandatory engineering discipline for the
WAL Protocol and Wuwen implementations.

Their purpose is to prevent silent corruption, historical contamination,
false provenance, and unverifiable protocol evolution.

The governing principle is:

> Do not trust the artifact. Verify the artifact.

---

## Principle 01 — Historical Immutability

Published WAL history MUST NOT be rewritten.

The following operations MUST NOT be used to alter published protocol
history:

- rebase of published history
- history filtering
- commit rewriting
- force-push intended to replace published protocol history
- replacement of historical Git objects

Historical Git objects are evidence.

If historical content is incorrect, corrupted, incomplete, or obsolete,
it MUST remain identifiable as historical evidence.

A corrected artifact MUST be introduced as a new artifact with a new
content identity.

---

## Principle 02 — Validate Before Commit

No protocol artifact MUST be committed before passing integrity
validation.

At minimum, protocol artifacts MUST be checked for:

- valid UTF-8 encoding
- unexpected Unicode replacement characters (`U+FFFD`)
- unexpected literal question-mark substitution
- unexpected BOM
- structural integrity
- schema consistency
- validator consistency
- conformance consistency

The required order is:

    Author
      ↓
    Validate
      ↓
    Hash
      ↓
    Commit
      ↓
    Verify

Never:

    Author
      ↓
    Commit
      ↓
    Discover corruption

---

## Principle 03 — Cryptographic Content Identity

Every canonical WAL protocol artifact MUST have a cryptographic content
identity.

The canonical identity MUST be derived from the exact artifact bytes.

At release boundaries, the following SHOULD be recorded:

- artifact path
- artifact version
- byte length
- SHA-256 digest
- Git object identity
- release commit
- release tree identity

A changed byte MUST produce a changed content identity.

No artifact MAY claim an unchanged identity after its bytes have changed.

---

## Principle 04 — Explicit Protocol Manifest

Every released WAL protocol version MUST have a Protocol Manifest.

The manifest MUST identify the exact artifacts constituting that protocol
version.

At minimum, the manifest SHOULD identify:

- protocol name
- protocol version
- release identifier
- Git commit
- Git tree
- specification hash
- rule inventory hash
- conformance map hash
- JSON Schema hash
- independent validator hash
- conformance test identity
- aggregate protocol root

The manifest itself MUST be independently verifiable.

The manifest MUST NOT rely solely on filenames or directory structure
to establish identity.

---

## Principle 05 — Historical Truth Is Not Canonical Correctness

WAL MUST distinguish between:

    Historical Truth
    = what was actually committed

and:

    Canonical Correctness
    = what the protocol currently defines as valid

A historical artifact MAY be corrupted, incomplete, obsolete, or
semantically incorrect while remaining historically authentic.

Cryptographic provenance proves:

    "These are the exact bytes that existed."

It does NOT by itself prove:

    "These bytes express the correct protocol semantics."

Therefore every recovery or correction process MUST preserve the
distinction between provenance and correctness.

A corrected artifact MUST receive a new identity.

---

## Principle 06 — Independent Verification

Protocol correctness MUST NOT depend exclusively on the implementation
that produced the artifact.

WAL Protocol defines a contract.

An implementation claims conformance to that contract.

An independent verifier determines whether the claim is true.

The architecture is therefore:

    WAL Protocol Specification
              ↓
        Conformance Claim
              ↓
    Independent Verification
              ↓
          VALID / BLOCK

Multiple independent implementations MUST be able to conform to the
same WAL protocol without requiring trust in Wuwen's runtime.

The independent verifier MUST NOT silently inherit authority from the
implementation being verified.

---

## Principle 07 — Integrity Is a Release Gate

Integrity validation is a mandatory release gate.

A WAL protocol artifact or release MUST NOT be published when integrity
verification fails.

Release verification MUST cover, as applicable:

- encoding integrity
- byte integrity
- schema integrity
- validator integrity
- conformance integrity
- provenance integrity
- version identity
- manifest integrity
- protocol root integrity
- historical anchor integrity

The required release decision is:

    ALL REQUIRED CHECKS PASS
              ↓
           RELEASE

    ANY REQUIRED CHECK FAILS
              ↓
            BLOCK

No warning-level integrity failure MAY be silently converted into a
successful protocol release.

---

## Zero-Contamination Rule

The seven principles above are governed by one higher-order rule:

> No protocol artifact may silently change identity, content, meaning,
> or provenance.

Any detected discrepancy MUST be surfaced explicitly.

Any correction MUST create a new identity.

Any historical artifact MUST remain historically identifiable.

Any release claim MUST be independently verifiable.

---

## Engineering Model

The complete integrity model is:

    Source Artifact
          │
          ▼
      Validation
          │
          ▼
     Canonical Bytes
          │
          ▼
       SHA-256
          │
          ▼
      Git Commit
          │
          ▼
   Protocol Manifest
          │
          ▼
    Protocol Root
          │
          ▼
 Independent Verify
          │
      ┌───┴───┐
      ▼       ▼
    PASS     BLOCK

This model exists so that Wuwen does not require trust in the artifact
producer, the runtime, or the release process.

The artifact must be able to prove itself.

---

## Status

This document defines the WAL Engineering Integrity Principles v1.0.

These principles are normative engineering requirements for future WAL
protocol releases and Wuwen protocol implementations.
