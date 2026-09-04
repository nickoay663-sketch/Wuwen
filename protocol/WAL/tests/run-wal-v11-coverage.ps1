$tests = @(
    ".\protocol\WAL\tests\WAL.independent-validator.attack.test.mjs",
    ".\protocol\WAL\tests\WAL.R00.adversarial.test.mjs",
    ".\protocol\WAL\tests\WAL.R01.adversarial.test.mjs",
    ".\protocol\WAL\tests\WAL.R02.adversarial.test.mjs",
    ".\protocol\WAL\tests\WAL.R03.adversarial.test.mjs",
    ".\protocol\WAL\tests\WAL.R04.adversarial.test.mjs"
)

$allOutput = @()

foreach ($test in $tests) {
    Write-Host "`n=== RUN: $test ===" -ForegroundColor Cyan

    $output = node $test 2>&1
    $output | ForEach-Object { Write-Host $_ }
    $allOutput += $output
}

$indexRaw = Get-Content `
    .\protocol\WAL\golden-vectors\rule-index.json `
    -Raw

$indexedRules = @(
    [regex]::Matches($indexRaw, 'R\d{2}-\d{2}') |
    ForEach-Object { $_.Value }
) | Sort-Object -Unique

$validatorSource = Get-Content `
    .\protocol\WAL\validator\WALIndependentValidator.js `
    -Raw

$validatorHits = @(
    [regex]::Matches($validatorSource, 'R\d{2}-\d{2}') |
    ForEach-Object { $_.Value }
) | Sort-Object -Unique

$attackHits = @(
    [regex]::Matches(
        ($allOutput -join "`n"),
        'R\d{2}-\d{2}'
    ) |
    ForEach-Object { $_.Value }
) | Sort-Object -Unique

$attackCovered = @(
    $attackHits | Where-Object {
        $_ -in $indexedRules
    }
) | Sort-Object

$notCovered = @(
    $indexedRules | Where-Object {
        $_ -notin $attackCovered
    }
) | Sort-Object

Write-Host "`n========================================" -ForegroundColor Yellow
Write-Host "WAL v1.1 ATTACK COVERAGE SUMMARY" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow

Write-Host "Indexed rules:          $($indexedRules.Count)"
Write-Host "Validator rule hits:   $($validatorHits.Count)"
Write-Host "Attack-covered rules:  $($attackCovered.Count)"
Write-Host "Not attack-covered:    $($notCovered.Count)"

$coverage = [math]::Round(
    ($attackCovered.Count / $indexedRules.Count) * 100,
    2
)

Write-Host "Attack coverage:        $coverage%"

Write-Host "`n--- NOT YET ATTACK-COVERED ---"

if ($notCovered.Count -eq 0) {
    Write-Host "  NONE"
}
else {
    $notCovered | ForEach-Object {
        Write-Host "  $_"
    }
}
