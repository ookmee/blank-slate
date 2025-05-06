#!/bin/bash

# Build the WASM module
echo "Building WASM module..."
cd token-engine
wasm-pack build --target web
cd ..

# Copy the WASM files to the debug panel directory
echo "Copying WASM files to debug panel..."
mkdir -p debug-panel/token-engine/pkg
cp -r token-engine/pkg/* debug-panel/token-engine/pkg/

# Serve the main app and debug panel
echo "Starting development servers..."
echo "Main app: https://localhost:5173"
echo "Debug panel: https://localhost:8000/"

# Start the main app server in the background
npx vite &
MAIN_PID=$!

# Start a server for the debug panel
cd debug-panel
npx http-server -p 8000 -S -C ../localhost.pem -K ../localhost-key.pem &
DEBUG_PID=$!

cd ..
echo "Press Ctrl+C to stop both servers"

# Wait for user interrupt
trap "kill $MAIN_PID $DEBUG_PID; exit 0" INT
wait
