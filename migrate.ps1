# 勿问/Wuwen 统一替换与重命名脚本
Get-ChildItem -Recurse -Include *.js,*.json,*.jsonl,*.md,*.txt,*.html,*.css -Exclude "node_modules",".git" | ForEach-Object {
    $filePath = $_.FullName
    try {
        $content = Get-Content -Path $filePath -Raw -Encoding UTF8 -ErrorAction Stop
        $modified = $false

        if ($content -match "Wuwen|Wuwen|勿问") {
            $content = $content -replace "Wuwen", "Wuwen"
            $content = $content -replace "Wuwen", "Wuwen"
            $content = $content -replace "勿问", "勿问"
            $modified = $true
        }

        if ($modified) {
            Set-Content -Path $filePath -Value $content -Encoding UTF8
            Write-Host "已更新内容: $filePath" -ForegroundColor Green
        }
    } catch {}
}

# 批量重命名文件和目录
Get-ChildItem -Recurse -Exclude "node_modules", ".git" | Sort-Object FullName -Descending | ForEach-Object {
    $oldName = $_.Name
    $newName = $oldName -replace "Wuwen", "Wuwen" -replace "Wuwen", "Wuwen" -replace "勿问", "勿问"
    if ($oldName -ne $newName) {
        Rename-Item -LiteralPath $_.FullName -NewName $newName
        Write-Host "已重命名: $oldName -> $newName" -ForegroundColor Yellow
    }
}
Write-Host "所有迁移和替换已完成！" -ForegroundColor Cyan
