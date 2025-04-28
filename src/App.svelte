/* src/App.svelte */
<script lang="ts">
  import Counter from './lib/Counter.svelte'
  import WasmBasis from './lib/WasmBasis.svelte'
</script>

<main class="container mx-auto p-4">
  <h1 class="text-4xl font-bold text-center mb-2">Blank Slate</h1>
  <h2 class="text-2xl font-medium text-center mb-8">Met WASM integratie</h2>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
    <div class="card p-4 border rounded-lg">
      <h3 class="text-xl font-bold mb-4">Counter Component</h3>
      <Counter />
      <p class="mt-4 text-sm text-gray-500">
        Deze counter werkt via Svelte's state management
      </p>
    </div>

    <div class="card p-4 border rounded-lg">
      <WasmBasis />
    </div>
  </div>

  <div class="max-w-3xl mx-auto mt-8">
    <h3 class="text-xl font-bold mb-4">PWA-functies testen:</h3>
    <ol class="list-decimal pl-6 space-y-2">
      <li>Schakel het netwerk uit en herlaad de pagina</li>
      <li>Als de applicatie nog steeds werkt, functioneert de service worker correct</li>
      <li>De counter en WASM-demo blijven werken, zelfs zonder internetverbinding</li>
    </ol>
  </div>
</main>