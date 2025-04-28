/* src/lib/WasmTest.svelte */
<script lang="ts">
  import { onMount } from 'svelte';
  
  let message = "WASM laden...";

  onMount(async () => {
    try {
      /* Probeer de WASM module rechtstreeks te importeren */
      const wasmModule = await import('../../token-engine/pkg/token_engine.js');
      
      console.log("WASM module direct geladen:", wasmModule);
      
      // Test de add functie als die bestaat
      if (typeof wasmModule.add === 'function') {
        const result = wasmModule.add(5, 7);
        message = `WASM add functie werkt! 5 + 7 = ${result}`;
      } else {
        message = "WASM add functie niet gevonden";
        console.error("Geen add functie in de module:", wasmModule);
      }
    } catch (e) {
      message = "Fout bij het laden van WASM";
      console.error("WASM laad error:", e);
    }
  });
</script>

<div class="p-4 border rounded-md bg-yellow-50">
  <h3 class="text-xl font-bold mb-4">WASM Test Component</h3>
  <p>{message}</p>
</div>