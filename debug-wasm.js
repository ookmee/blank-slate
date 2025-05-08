// debug-wasm.js
const fs = require('fs');
const path = require('path');

// Load the WASM module wrapper
const wasmModulePath = path.join(__dirname, 'token-engine/pkg/token_engine.js');
console.log('Reading WASM module from:', wasmModulePath);

try {
  const wasmModuleContent = fs.readFileSync(wasmModulePath, 'utf8');
  console.log('Module content length:', wasmModuleContent.length);
  
  // Look for export names
  const exportMatches = wasmModuleContent.match(/export (?:function|class|const|let|var) (\w+)/g);
  if (exportMatches) {
    console.log('Detected exports:');
    exportMatches.forEach(match => {
      console.log('  -', match);
    });
  } else {
    console.log('No exports found using regex');
  }
  
  // Check if Identity is mentioned at all
  const identityMatches = wasmModuleContent.match(/Identity/g);
  if (identityMatches) {
    console.log('Number of "Identity" mentions:', identityMatches.length);
  } else {
    console.log('No mentions of "Identity" found');
  }
  
} catch (error) {
  console.error('Error reading WASM module:', error);
}
