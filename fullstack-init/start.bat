@echo off
chcp 65001 >nul
title LJR Fullstack 8526
echo Starting backend at http://localhost:8526 ...
cd /d %~dp0backend
call npm run dev
pause
