#!/bin/bash
echo "Starting Smart Community Platform Server..."
cd server
npm start &
SERVER_PID=$!
cd ..
sleep 3
echo "Starting Frontend..."
npm run dev

