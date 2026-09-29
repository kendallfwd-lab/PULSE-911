$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot\..
Write-Host "PULSE 911 FINAL - verificación" -ForegroundColor Cyan
node -v
npm -v
if (!(Test-Path node_modules)) { npm install }
npm run build
Write-Host "Build completado correctamente." -ForegroundColor Green
