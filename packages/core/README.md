# @wuwen/core

The foundational protocol and runtime core for Liability-Anchored Expressions (WAL Protocol).

## Three-Tier Integrity Architecture

1. **Runtime Integrity**: Internal cryptographic hash chaining (prevHash -> hash) ensuring post-publication tamper detection.
2. **Distribution Integrity**: Checksum and signature verification for immutable package delivery.
3. **Independent Verification**: Decoupled external verification logic that never trusts the core implementation itself.

## Usage

\\\javascript
import { ResponsibilityLedger, WALIndependentValidator } from '@wuwen/core';
\\\

## License
MIT
