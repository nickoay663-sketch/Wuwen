# Wuwen Accountability Layer (WAL)

# API Reference

## 1. @wuwen/core

Package: @wuwen/core
Version: 1.0.0
Entry point: packages/core/src/index.js

## 2. Exports

- ResponsibilityLedger
- ResponsibilityRecord
- ResponsibilityRecordSchema
- WALContract
- WALIndependentValidator
- WALResponsibilityInterface
- WALValidatorR00Core


## 3. WALContract

Protocol contract version: 1.0

### createEnvelope(data)

Creates a WAL envelope.

### validate(envelope)

Validates a WAL envelope against the WAL contract.

### requiresVerification(envelope)

Determines whether verification is required.

### canPropagate(envelope)

Determines whether the envelope may propagate.

### invariants()

Returns the WAL contract invariants.


## 4. WALIndependentValidator
Creates an independent validation boundary.
Method: validateEnvelope(envelope)
Returns CONFORM for a conforming envelope and NON_CONFORM for a rejected envelope.

## 5. WALResponsibilityInterface
Version: 2.2
Purpose: translate explicitly established runtime responsibility into WAL accountability representation.
Methods: isTrustedResponsibilityRecord, extractResponsibilityRecords, projectResponsibility, fromResponsibilityEvent
Methods: buildValidatedEnvelope, validate, canPropagate, requiresVerification
Protocol Version: 1.0
Core Contract Version: 1.0
