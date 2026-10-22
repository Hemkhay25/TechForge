@echo off
setlocal
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\open-techforge.ps1"
if errorlevel 1 pause
