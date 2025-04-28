/* src/lib/WasmAdvancedTest.svelte */
<script lang="ts">
  import { onMount } from 'svelte';
  
  let results: string[] = ["WASM testen worden uitgevoerd..."];
  let selectedMethod = "";

  async function logResult(message: string) {
    results = [...results, message];
    console.log(message);
  }

  async function testMethod1() {
    try {
      logResult("Methode 1: Directe import van specifieke functies");
      
      // Dynamisch importeren om runtime errors te vermijden
      const module = await import('token-engine');
      logResult(`Module structuur: ${JSON.stringify(Object.keys(module))}`);
      
      if (typeof module.add === 'function') {
        const result = module.add(5, 7);
        logResult(`✅ Succes! 5 + 7 = ${result}`);
        selectedMethod = "Methode 1";
        return true;
      } else {
        logResult("❌ Geen 'add' functie gevonden");
      }
    } catch (e) {
      logResult(`❌ Error: ${e.message}`);
    }
    return false;
  }

  async function testMethod2() {
    try {
      logResult("Methode 2: Default import dan initialiseren");
      
      const initWasm = (await import('token-engine')).default;
      logResult(`initWasm type: ${typeof initWasm}`);
      
      if (typeof initWasm === 'function') {
        const instance = await initWasm();
        logResult(`Instance structuur: ${JSON.stringify(Object.keys(instance))}`);
        
        if (typeof instance.add === 'function') {
          const result = instance.add(5, 7);
          logResult(`✅ Succes! 5 + 7 = ${result}`);
          selectedMethod = "Methode 2";
          return true;
        } else {
          logResult("❌ Geen 'add' functie gevonden in de instance");
        }
      } else {
        logResult("❌ Default export is geen functie");
      }
    } catch (e) {
      logResult(`❌ Error: ${e.message}`);
    }
    return false;
  }

  async function testMethod3() {
    try {
      logResult("Methode 3: Directe import van WASM bestand");
      
      // Probeer direct het .wasm bestand te importeren
      const path = './token-engine/pkg/token_engine_bg.wasm';
      logResult(`Proberen te laden vanaf: ${path}`);
      
      const response = await fetch(path);
      if (!response.ok) {
        logResult(`❌ Kon WASM bestand niet laden: ${response.status} ${response.statusText}`);
        return false;
      }
      
      const bytes = await response.arrayBuffer();
      const wasmModule = await WebAssembly.instantiate(bytes);
      
      logResult(`WASM module geladen, exports: ${JSON.stringify(Object.keys(wasmModule.instance.exports))}`);
      
      selectedMethod = "Methode 3";
      return true;
    } catch (e) {
      logResult(`❌ Error: ${e.message}`);
    }
    return false;
  }

  async function testMethod4() {
    try {
      logResult("Methode 4: Import via specifiek pad");
      
      // Probeer de specifieke JavaScript module te importeren
      const module = await import('../../token-engine/pkg/token_engine.js');
      logResult(`Module structuur: ${JSON.stringify(Object.keys(module))}`);
      
      if (typeof module.add === 'function') {
        const result = module.add(5, 7);
        logResult(`✅ Succes! 5 + 7 = ${result}`);
        selectedMethod = "Methode 4";
        return true;
      } else if (typeof module.default === 'function') {
        logResult("Module heeft default export, proberen te initialiseren...");
        const instance = await module.default();
        
        if (instance && typeof instance.add === 'function') {
          const result = instance.add(5, 7);
          logResult(`✅ Succes na initialisatie! 5 + 7 = ${result}`);
          selectedMethod = "Methode 4 (met initialisatie)";
          return true;
        } else {
          logResult("❌ Geen 'add' functie gevonden na initialisatie");
        }
      } else {
        logResult("❌ Geen 'add' functie of bruikbare default export gevonden");
      }
    } catch (e) {
      logResult(`❌ Error: ${e.message}`);
    }
    return false;
  }

  onMount(async () => {
    // Toon beschikbare importpaden
    try {
      const paths = [
        'token-engine',
        './token-engine/pkg/token_engine.js',
        './token-engine/pkg/token_engine_bg.wasm'
      ];
      
      logResult("Controleren van beschikbare importpaden:");
      
      for (const path of paths) {
        try {
          await fetch(path);
          logResult(`✅ Pad bestaat: ${path}`);
        } catch {
          logResult(`❌ Pad niet gevonden: ${path}`);
        }
      }
      
      // Test alle methoden één voor één
      logResult("\n--- WASM importmethoden testen ---");
      
      if (await testMethod1()) return;
      if (await testMethod2()) return;
      if (await testMethod4()) return;
      if (await testMethod3()) return;
      
      logResult("❌ Geen enkele methode werkte");
    } catch (e) {
      logResult(`❌ Algemene error: ${e.message}`);
    }
  });
</script>

<div class="p-4 border rounded-md bg-blue-50">
  <h3 class="text-xl font-bold mb-4">WASM Advanced Test</h3>
  
  {#if selectedMethod}
    <p class="mb-4 font-medium text-green-600">✅ WASM geladen met {selectedMethod}</p>
  {:else}
    <p class="mb-4 font-medium text-orange-600">⏳ WASM laden...</p>
  {/if}
  
  <div class="bg-gray-800 text-green-400 p-4 rounded font-mono text-sm overflow-auto max-h-60">
    {#each results as result}
      <div>{result}</div>
    {/each}
  </div>
</div>