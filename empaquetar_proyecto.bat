@echo off
title ANSAMA ANALYTICS - Empaquetador de Proyecto para GitHub
echo ========================================================
echo   ANSAMA ANALYTICS - Empaquetando Proyecto (Etapa 4)
echo ========================================================
echo.
echo Generando archivo ZIP limpio (sin node_modules) listo para GitHub...
powershell -NoProfile -Command "$ProgressPreference = 'SilentlyContinue'; $items = Get-ChildItem -Path . -Exclude 'node_modules', '.git', 'dist', 'ANSAMA_ANALYTICS_GITHUB.zip'; Compress-Archive -Path $items.FullName -DestinationPath 'ANSAMA_ANALYTICS_GITHUB.zip' -Force; Write-Host 'Exito: Archivo creado correctamente.'"
echo.
echo ========================================================
echo  Archivo generado: ANSAMA_ANALYTICS_GITHUB.zip
echo ========================================================
pause
