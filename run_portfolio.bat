@echo off
title Yash Sharma - Marvel Portfolio Launcher
echo ========================================================
echo   YASH SHARMA - SPIDER-MAN ^& IRON MAN PORTFOLIO SERVER
echo   1st Year B.Tech Student @ JECRC University
echo ========================================================
echo.
cd /d "%~dp0"

echo [1/2] Activating Python Virtual Environment...
if exist ".venv\Scripts\python.exe" (
    echo [2/2] Starting Stark OS Flask Server at http://127.0.0.1:5000 ...
    start "" http://127.0.0.1:5000
    ".venv\Scripts\python.exe" server.py
) else (
    echo Error: .venv not found. Running with global python...
    start "" http://127.0.0.1:5000
    python server.py
)
pause
