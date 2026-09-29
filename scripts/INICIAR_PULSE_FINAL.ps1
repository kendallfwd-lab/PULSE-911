$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot\..
Write-Host "PULSE 911 FINAL - entorno de demostración" -ForegroundColor Cyan
if (!(Test-Path package.json)) { throw "No se encontró package.json." }
if (!(Test-Path node_modules)) {
  Write-Host "Instalando dependencias..." -ForegroundColor Yellow
  npm install
}
Write-Host "Verificando build..." -ForegroundColor Yellow
if (Test-Path dist) { Remove-Item dist -Recurse -Force }
npm run build
Write-Host "Iniciando en http://127.0.0.1:5175" -ForegroundColor Green
npm run start:demo
