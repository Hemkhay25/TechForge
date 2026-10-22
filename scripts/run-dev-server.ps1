$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $projectRoot

Write-Host "Starting TechForge at http://localhost:3000"
Write-Host "Keep this window open while you use the site."
& npm.cmd run dev

if ($LASTEXITCODE -ne 0) {
    Write-Host "TechForge stopped with exit code $LASTEXITCODE." -ForegroundColor Red
    Write-Host "Read the error above, then run Open-TechForge.cmd again."
}
