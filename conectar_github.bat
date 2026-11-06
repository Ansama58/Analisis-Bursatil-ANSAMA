@echo off
title ANSAMA ANALYTICS - Conectar con GitHub
echo ========================================================
echo   ANSAMA ANALYTICS - Vinculando y Subiendo a GitHub
echo ========================================================
echo.
echo Repositorio destino:
echo https://github.com/Ansama58/Analisis-Bursatil-ANSAMA.git
echo.
echo Cuenta: Ansama58
echo Rama: main
echo.
echo Conectando con GitHub...
echo (Si aparece una ventana en Chrome, pulsa 'Authorize' para validar tu sesion).
echo.

".tools\git\cmd\git.exe" push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo  EXITO: Proyecto subido y conectado con GitHub!
    echo  Puedes ver tu repositorio en:
    echo  https://github.com/Ansama58/Analisis-Bursatil-ANSAMA
    echo ========================================================
) else (
    echo ========================================================
    echo  No se pudo completar la subida. Revisa el mensaje arriba.
    echo ========================================================
)
echo.
pause
