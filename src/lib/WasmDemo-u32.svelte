/* src/lib/WasmDemo-u32.svelte */
<script lang="ts">
  import { onMount } from 'svelte';
  
  let wasmAdd: (a: number, b: number) => number;
  let wasmHello: (name: string) => string;
  let result = 0;
  let greeting = '';
  let isWasmLoaded = false;
  let a = 5;
  let b = 7;
  let name = 'Blank Slate';

  onMount(async () => {
    try {
      /* Import de WASM module - Methode 2 */
      const module = await import('token-engine');
      console.log("Geïmporteerde WASM module:", module);
      
      // Initialiseer WASM module
      if (typeof module.default === 'function') {
        const wasmInstance = await module.default();
        console.log("WASM geïnitialiseerd:", wasmInstance);
        
        // Controleer of functies beschikbaar zijn na initialisatie
        if (typeof wasmInstance.add === 'function') {
          wasmAdd = wasmInstance.add;
          console.log("add functie gevonden na initialisatie");
        } else {
          console.error("add functie niet gevonden na initialisatie");
        }
        
        if (typeof wasmInstance.hello === 'function') {
          wasmHello = wasmInstance.hello;
          console.log("hello functie gevonden na initialisatie");
        } else {
          console.error("hello functie niet gevonden na initialisatie");
        }
        
        // Alleen berekenen als de functie beschikbaar is
        if (wasmAdd) {
          calculate();
        } else {
          console.error("Kon de add functie niet vinden, berekening overgeslagen");
        }
        
        if (wasmHello) {
          greet();
        } else {
          console.error("Kon de hello functie niet vinden, begroeting overgeslagen");
        }
        
        isWasmLoaded = true;
      } else {
        console.error("Geen default export functie gevonden in de WASM module");
      }
    } catch (e) {
      console.error("Fout bij laden van WASM:", e);
    }
  });

  function calculate() {
    if (wasmAdd) {
      try {
        result = wasmAdd(a, b);
      } catch (e) {
        console.error("Fout bij berekening:", e);
      }
    }
  }

  function greet() {
    if (wasmHello) {
      try {
        greeting = wasmHello(name);
      } catch (e) {
        console.error("Fout bij begroeting:", e);
      }
    }
  }
</script>

<div class="p-4 border rounded-md bg-gray-50">
  <h3 class="text-xl font-bold mb-4">WASM Demo (u32)</h3>
  
  {#if isWasmLoaded}
    <div class="mb-4">
      <div class="flex items-center gap-2 mb-2">
        <input 
          type="number" 
          bind:value={a} 
          class="border p-2 w-16 rounded" 
          on:input={calculate}
        />
        <span>+</span>
        <input 
          type="number" 
          bind:value={b} 
          class="border p-2 w-16 rounded" 
          on:input={calculate}
        />
        <span>=</span>
        <span class="font-bold">{result}</span>
      </div>
      <p class="text-sm text-gray-500">Dit gebruikt de Rust 'add' functie via WASM (u32)</p>
    </div>

    <div class="mb-4">
      <div class="flex items-center gap-2 mb-2">
        <input 
          type="text" 
          bind:value={name} 
          class="border p-2 rounded" 
          on:input={greet}
        />
        <button 
          class="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
          on:click={greet}
        >
          Groeten
        </button>
      </div>
      <p class="mt-2 font-medium">{greeting}</p>
      <p class="text-sm text-gray-500">Dit gebruikt de Rust 'hello' functie via WASM</p>
    </div>
  {:else}
    <p>WASM module wordt geladen...</p>
  {/if}
</div>