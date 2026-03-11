@echo off
echo Starting Smart Community Platform Server...
cd server
start cmd /k "npm start"
timeout /t 3
cd ..
echo Starting Frontend...
npm run dev

