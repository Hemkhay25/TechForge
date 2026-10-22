$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$serverScript = Join-Path $PSScriptRoot "run-dev-server.ps1"
$siteUri = "http://localhost:3000"
$healthUri = "$siteUri/api/health"

function Test-TechForgeReady {
    try {
        $health = Invoke-RestMethod -Uri $healthUri -TimeoutSec 3
        if ($health.status -ne "ok") {
            return $false
        }

        $homePage = Invoke-WebRequest -Uri $siteUri -UseBasicParsing -TimeoutSec 5
        return $homePage.StatusCode -eq 200 -and $homePage.Content.Contains("TechForge")
    } catch {
        return $false
    }
}

if (Test-TechForgeReady) {
    Start-Process $siteUri
    exit 0
}

$listener = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue |
    Select-Object -First 1

if ($listener) {
    throw "Port 3000 is already in use, but it is not serving TechForge. Close the application using port 3000, then run this launcher again."
}

$arguments = "-NoExit -NoProfile -ExecutionPolicy Bypass -File `"$serverScript`""
Start-Process -FilePath (Join-Path $PSHOME "powershell.exe") `
    -ArgumentList $arguments `
    -WorkingDirectory $projectRoot `
    -WindowStyle Normal

$deadline = (Get-Date).AddSeconds(90)
while ((Get-Date) -lt $deadline) {
    Start-Sleep -Seconds 2
    if (Test-TechForgeReady) {
        Start-Process $siteUri
        exit 0
    }
}

throw "TechForge did not become ready within 90 seconds. Check the TechForge server window for an error. Keep that window open while using the site."
