@echo off
echo Killing all Node processes...
taskkill /F /IM node.exe /T 2>nul
taskkill /F /IM npm.exe /T 2>nul
timeout /t 2 >nul

echo Starting Vite dev server...
cd C:\xampp\htdocs\Portofolio\frontend
npm run dev