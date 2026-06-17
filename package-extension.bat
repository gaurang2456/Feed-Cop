@echo off
echo Creating clean extension package...

:: Create a temporary directory for clean files
if exist "temp_extension" rmdir /s /q "temp_extension"
mkdir "temp_extension"

:: Copy only necessary files
xcopy "images" "temp_extension\images\" /E /I
xcopy "pages" "temp_extension\pages\" /E /I  
xcopy "scripts" "temp_extension\scripts\" /E /I
copy "manifest.json" "temp_extension\"

:: Create zip file
if exist "feedcop-extension.zip" del "feedcop-extension.zip"
powershell "Compress-Archive -Path 'temp_extension\*' -DestinationPath 'feedcop-extension.zip'"

:: Clean up
rmdir /s /q "temp_extension"

echo Extension packaged as feedcop-extension.zip
echo You can now install this clean version in Firefox!
pause