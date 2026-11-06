@echo off
title ANSAMA ANALYTICS - Terminal Financiero IA
echo ========================================================
echo          ANSAMA ANALYTICS - Terminal Financiero IA
echo ========================================================
echo.
echo Comprobando actualizaciones desde GitHub...
if exist ".tools\git\cmd\git.exe" (
    ".tools\git\cmd\git.exe" pull origin main --quiet
    echo Repositorio sincronizado con GitHub.
) else (
    echo Omitiendo sincronizacion (Git local no encontrado).
)
echo.
echo Abriendo navegador en http://localhost:3000...
start http://localhost:3000
echo.
echo Iniciando servidor financiero...
echo Pulsa Ctrl + C para detener el terminal cuando desees cerrar.
echo.
call npm.cmd run dev
pause
