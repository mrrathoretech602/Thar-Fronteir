@echo off
title THAR FRONTIER: A SOLDIER'S PROMISE · 1971
set EXE_PATH=%~dp0dist\TharFrontier1971-win32-x64\TharFrontier1971.exe

if exist "%EXE_PATH%" (
    echo Starting THAR FRONTIER 1971 Standalone PC Game App...
    start "" "%EXE_PATH%"
) else (
    echo Launching Desktop App...
    npm run desktop
)

