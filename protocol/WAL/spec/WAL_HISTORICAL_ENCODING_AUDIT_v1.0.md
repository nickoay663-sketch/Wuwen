# WAL Historical Encoding Audit v1.0

## Scope

This audit records encoding contamination discovered in historical WAL Protocol artifacts.

## Finding

The following historical artifacts contain encoding-corrupted text:

- `WAL_STANDARD_CORE_v1.0.md`
- `WAL_RULE_INVENTORY_v1.0.md`

`protocol/WAL/README.md` contains historical byte-level encoding residues but is Git-clean and has no detected replacement-character/mojibake sequence in its decoded current content.

## Historical Determination

The corruption predates the first WAL/MWAL Git commits containing these artifacts.

The earliest MWAL Standard Core artifact was committed in:

`59f92b5c807c4f3a668cf36643421ad63b5c72e4`

The original blob was:

`823ebf167c79b06e2fed568fb31ce3f97fa5a131`

Its raw bytes were UTF-16 LE with BOM and contained literal replacement `?` bytes.

Therefore the corruption is historical source-artifact contamination, not Git history corruption.

## Integrity Rule

Historical artifacts MUST NOT be rewritten in place.

Historical truth and canonical protocol correctness MUST remain separate.

Any corrected canonical protocol artifact MUST receive a new content identity and version.

## Status

HISTORICAL_CONTAMINATION_CONFIRMED
