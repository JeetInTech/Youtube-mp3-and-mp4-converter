@echo off
echo Starting StreamRip YouTube Converter...
echo.

echo Starting backend server...
start cmd /k "cd server && npm start"

timeout /t 3 /nobreak >nul

echo Starting frontend...
start cmd /k "npm run dev"

echo.
echo ============================================
echo Application starting...
echo Backend: http://localhost:3000
echo Frontend: http://localhost:5173
echo ============================================
