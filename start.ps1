#!/usr/bin/env pwsh
# Quick Start Script for Math Learning Center

Write-Host "`n" -NoNewline
Write-Host "================================" -ForegroundColor Cyan
Write-Host "  Math Learning Center Setup" -ForegroundColor White
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Starting development server..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "The app will open at: http://localhost:3000" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Available Apps:" -ForegroundColor Green
    Write-Host "  🎮 Multiplication Master" -ForegroundColor White
    Write-Host "  ➕ Addition Trainer" -ForegroundColor White
    Write-Host "  🧮 Math Quiz" -ForegroundColor White
    Write-Host "  🃏 Math Flashcards" -ForegroundColor White
    Write-Host ""
    
    npm run dev
} else {
    Write-Host "❌ Installation failed!" -ForegroundColor Red
    exit 1
}
