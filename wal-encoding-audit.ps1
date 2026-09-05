$wal = "C:\Users\ABC\Desktop\MoWen\protocol\WAL"
$enc = [System.Text.UTF8Encoding]::new($false, $true)
$results = @(
    Get-ChildItem -Path $wal -Recurse -File | ForEach-Object {
        $b = [System.IO.File]::ReadAllBytes($_.FullName)
        $valid = $true
        $text = ""
        try { $text = $enc.GetString($b) } catch { $valid = $false }
        $ufffd = if ($valid) { ($text.ToCharArray() | Where-Object { $_ -eq [char]0xFFFD }).Count } else { 0 }
        $nonascii = ($b | Where-Object { $_ -ge 128 }).Count
        $bom = ($b.Length -ge 3 -and $b[0] -eq 0xEF -and $b[1] -eq 0xBB -and $b[2] -eq 0xBF)

        [PSCustomObject]@{
            File       = $_.FullName.Substring($wal.Length + 1)
            Bytes      = $b.Length
            UTF8Valid  = $valid
            UFFFD      = $ufffd
            NonASCII   = $nonascii
            BOM        = $bom
        }
    }
)

$invalid = @($results | Where-Object { -not $_.UTF8Valid })
$replacement = @($results | Where-Object { $_.UFFFD -gt 0 })
$bomfiles = @($results | Where-Object { $_.BOM })
$unicode = @($results | Where-Object { $_.NonASCII -gt 0 })

Write-Host ""
Write-Host "========== WAL ENCODING INTEGRITY AUDIT =========="
Write-Host "ROOT : $wal"
Write-Host "FILES: $($results.Count)"
Write-Host ""

Write-Host "--- INVALID UTF-8 ---"
if ($invalid.Count -gt 0) {
    $invalid | Format-Table File,Bytes -AutoSize
} else {
    Write-Host "NONE" -ForegroundColor Green
}

Write-Host ""
Write-Host "--- U+FFFD ---"
if ($replacement.Count -gt 0) {
    $replacement | Format-Table File,UFFFD -AutoSize
} else {
    Write-Host "NONE" -ForegroundColor Green
}

Write-Host ""
Write-Host "--- BOM ---"
if ($bomfiles.Count -gt 0) {
    $bomfiles | Format-Table File,Bytes -AutoSize
} else {
    Write-Host "NONE" -ForegroundColor Green
}

Write-Host ""
Write-Host "--- NON-ASCII ---"
if ($unicode.Count -gt 0) {
    $unicode | Sort-Object NonASCII -Descending | Format-Table File,NonASCII,UTF8Valid -AutoSize
} else {
    Write-Host "NONE" -ForegroundColor Green
}

Write-Host ""
Write-Host "========== RESULT =========="
Write-Host "Total files      : $($results.Count)"
Write-Host "Invalid UTF-8    : $($invalid.Count)"
Write-Host "U+FFFD files     : $($replacement.Count)"
Write-Host "BOM files        : $($bomfiles.Count)"
Write-Host "Non-ASCII files  : $($unicode.Count)"

if ($results.Count -eq 0) {
    Write-Host "RESULT: FAIL - AUDIT DID NOT RUN" -ForegroundColor Red
}
elseif ($invalid.Count -gt 0 -or $replacement.Count -gt 0) {
    Write-Host "RESULT: FAIL - ENCODING CORRUPTION DETECTED" -ForegroundColor Red
}
else {
    Write-Host "RESULT: PASS - ALL WAL FILES ARE VALID UTF-8" -ForegroundColor Green
}
