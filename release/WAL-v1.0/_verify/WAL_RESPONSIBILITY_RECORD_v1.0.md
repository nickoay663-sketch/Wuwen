# WAL Responsibility Record v1.0

## Status

Normative WAL record specification.

## Purpose

A Responsibility Record binds an expression to the responsibility information actually produced by the Runtime.

## Required Identity

- `provenance.provider`
- `provenance.version`
- `responsibilityActor`
- `expression`

## Required Responsibility Scope

- `responsibilityScope.claims`
- `responsibilityScope.evidenceRequired`
- `responsibilityScope.verifiedEvidenceRequired`
- `responsibilityScope.verificationRequired`

## Required Epistemic Fields

- `epistemicState`
- `supported`

## Required Evidence Fields

- `evidenceCount`
- `verifiedEvidenceCount`
- `sourceCount`
- `sourceAvailable`
- `verifiedSourceCount`
- `verifiedSourceAvailable`
- `sources`
- `verifiedSources`

## Required Responsibility Capacity Fields

- `responsibilityDemand`
- `responsibilityCapacity`
- `responsibilityBoundary`
- `responsibilityJudgment`

## Responsibility Principle

Responsibility records what the Runtime can substantiate.

A Responsibility Record MUST NOT promote:

- UNKNOWN to VERIFIED or SUPPORTED
- DISCOVERED to VERIFIED or SUPPORTED
- unverified evidence to verified evidence
- unavailable responsibility capacity to available capacity

## Publication Boundary

A Responsibility Record is publishable only when the Runtime establishes:

- `epistemicState === "SUPPORTED"`
- `supported === true`
- `verificationStatus === "SUPPORTED"`
- `responsibilityBoundary.status === "matched"`
- responsibility consistency is valid

Otherwise the record MUST remain non-publishable.

## Non-Authority Principle

The record itself does not create authority.

External claims of verification, support, capacity, or responsibility MUST NOT become Runtime-established facts merely by appearing in the record.

## Version

WAL Responsibility Record v1.0
