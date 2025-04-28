/* src/lib/WasmBasis.svelte */
<script lang="ts">
  import { onMount } from 'svelte';
  
  let wasmAdd: (a: number, b: number) => number;
  let wasmHello: (name: string) => string;
  let wasmStatus = "Initialiseren...";
  let addResult = "";
  let greeting = "";
  let isWasmLoaded = false;

  onMount(async () => {
    try {
      wasmStatus = "WASM module laden...";
      
      // WASM module importeren
      const module = await import('token-engine');
      
      wasmStatus = "WASM module initialiseren...";
      
      // Initialiseer de WASM module
      const wasmInstance = await module.default();
      
      // Controleer beschikbare functies
      const hasAdd = typeof wasmInstance.add === 'function';
      const hasHello = typeof wasmInstance.hello === 'function';
      
      if (hasAdd && hasHello) {
        wasmAdd = wasmInstance.add;
        wasmHello = wasmInstance.hello;
        
        // Test de functies met standaardwaarden
        addResult = `5 + 7 = ${wasmAdd(5, 7)}`;
        greeting = wasmHello("WASM");
        
        wasmStatus = "✅ WASM module succesvol geladen";
        isWasmLoaded = true;
      } else {
        wasmStatus = "⚠️ WASM module geladen, maar niet alle functies zijn beschikbaar";
        if (hasAdd) {
          wasmAdd = wasmInstance.add;
          addResult = `5 + 7 = ${wasmAdd(5, 7)}`;
        }
        if (hasHello) {
          wasmHello = wasmInstance.hello;
          greeting = wasmHello("WASM");
        }
      }
    } catch (e) {
      wasmStatus = `❌ Fout bij laden van WASM: ${e.message}`;
      console.error("WASM fout:", e);
    }
  });
</script>

<div class="p-4 border rounded-md bg-gray-50">
  <h3 class="text-xl font-bold mb-4">WebAssembly Basis</h3>
  
  <div class="mb-4">
    <p class="font-medium {isWasmLoaded ? 'text-green-600' : 'text-orange-500'}">{wasmStatus}</p>
  </div>
  
  {#if isWasmLoaded}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="border p-4 rounded-md bg-white">
        <h4 class="font-bold mb-2">Rust add functie</h4>
        <p class="font-mono">{addResult}</p>
        <p class="text-sm text-gray-500 mt-2">
          Eenvoudige rekenkundige operatie vanuit Rust
        </p>
      </div>
      
      <div class="border p-4 rounded-md bg-white">
        <h4 class="font-bold mb-2">Rust hello functie</h4>
        <p class="font-mono">{greeting}</p>
        <p class="text-sm text-gray-500 mt-2">
          String manipulatie vanuit Rust
        </p>
      </div>
    </div>
    
    <div class="mt-6 bg-blue-50 p-4 rounded-md">
      <h4 class="font-bold mb-2">Volgende stappen:</h4>
      <ol class="list-decimal pl-6 space-y-1">
        <li>Voeg meer complexe Rust functies toe</li>
        <li>Implementeer de token-engine functionaliteit</li>
        <li>Bouw gebruikersinterfaces voor token-manipulatie</li>
      </ol>
    </div>
  {:else}
    <div class="animate-pulse">
      <div class="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div class="h-8 bg-gray-200 rounded w-1/2"></div>
    </div>
  {/if}
</div>