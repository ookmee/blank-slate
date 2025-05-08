<script lang="ts">
  import { onMount } from "svelte";
  
  // State variables
  let isLoading = $state(true);
  let error = $state("");
  let greeting = $state("");
  let addResult = $state(0);
  let userGreeting = $state("");
  
  onMount(async () => {
    try {
      // Import directly from the file path to avoid any package resolution issues
      const wasmModule = await import('/token-engine/pkg/token_engine.js');
      console.log("WASM module loaded:", wasmModule);
      
      // Initialize the WASM module
      await wasmModule.default();
      
      // Test the greet function
      greeting = wasmModule.greet("WASM World");
      
      // Test the add_numbers function
      addResult = wasmModule.add_numbers(40, 2);
      
      // Test the SimpleUser class
      const user = new wasmModule.SimpleUser("WASM User");
      userGreeting = user.greet();
      
      isLoading = false;
    } catch (err) {
      console.error("Error loading WASM module:", err);
      error = err.message;
      isLoading = false;
    }
  });
</script>

<div class="wasm-test">
  <h3>WASM Test Component</h3>
  
  {#if isLoading}
    <div class="loading">
      <p>Loading WASM module...</p>
    </div>
  {:else if error}
    <div class="error">
      <p>Error: {error}</p>
    </div>
  {:else}
    <div class="results">
      <div class="result-item">
        <strong>Greeting:</strong> {greeting}
      </div>
      <div class="result-item">
        <strong>40 + 2 =</strong> {addResult}
      </div>
      <div class="result-item">
        <strong>User greeting:</strong> {userGreeting}
      </div>
    </div>
  {/if}
</div>

<style>
  .wasm-test {
    padding: 20px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    max-width: 500px;
    margin: 0 auto;
  }
  
  h3 {
    margin-top: 0;
    margin-bottom: 20px;
    color: #2563eb;
  }
  
  .loading, .error {
    padding: 20px;
    text-align: center;
  }
  
  .error {
    color: #dc2626;
    background-color: #fee2e2;
    border-radius: 6px;
  }
  
  .results {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .result-item {
    padding: 10px;
    background-color: #f3f4f6;
    border-radius: 4px;
  }
</style>
