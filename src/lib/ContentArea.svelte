<!-- src/lib/ContentArea.svelte -->
    <script lang="ts">
    import { _ } from 'svelte-i18n';
    import Counter from './Counter.svelte';
    import WasmBasis from './WasmBasis.svelte';
    
    export let activeTab: string = 'login';
  </script>
  
  <div class="flex-1 bg-gray-50 pb-24 mb-14 md:ml-64 md:mb-0 md:pb-4">
    <div class="max-w-screen-lg mx-auto pt-4 px-4">
      {#if activeTab === 'login'}
        <div class="bg-white p-6 rounded-b-lg rounded-tr-lg shadow-sm border-t-4 border-blue-600 md:rounded-lg md:border-l-4 md:border-t-0">
          <h2 class="text-2xl font-bold mb-4">{$_('nav.login')}</h2>
          <p>{$_('content.login')}</p>
        </div>
      {:else if activeTab === 'listen'}
        <div class="bg-white p-6 rounded-b-lg rounded-tr-lg shadow-sm border-t-4 border-blue-600 md:rounded-lg md:border-l-4 md:border-t-0">
          <h2 class="text-2xl font-bold mb-4">{$_('nav.listen')}</h2>
          <p>{$_('content.listen')}</p>
        </div>
      {:else if activeTab === 'advertise'}
        <div class="bg-white p-6 rounded-b-lg rounded-tr-lg shadow-sm border-t-4 border-blue-600 md:rounded-lg md:border-l-4 md:border-t-0">
          <h2 class="text-2xl font-bold mb-4">{$_('nav.advertise')}</h2>
          <p>{$_('content.advertise')}</p>
        </div>
      {:else if activeTab === 'settings'}
        <div class="bg-white p-6 rounded-b-lg rounded-tr-lg shadow-sm border-t-4 border-blue-600 md:rounded-lg md:border-l-4 md:border-t-0">
          <h2 class="text-2xl font-bold mb-4">{$_('nav.settings')}</h2>
          <p>{$_('content.settings')}</p>
        </div>
      {:else if activeTab === 'tokenStash'}
        <div class="bg-white p-6 rounded-t-lg rounded-br-lg shadow-sm border-b-4 border-blue-600 md:rounded-lg md:border-l-4 md:border-b-0">
          <h2 class="text-2xl font-bold mb-4">{$_('bottomNav.tokenStash')}</h2>
          <p>{$_('content.tokenStash')}</p>
        </div>
      {:else if activeTab === 'tokenActions'}
        <div class="bg-white p-6 rounded-t-lg rounded-br-lg shadow-sm border-b-4 border-blue-600 md:rounded-lg md:border-l-4 md:border-b-0">
          <h2 class="text-2xl font-bold mb-4">{$_('bottomNav.tokenActions')}</h2>
          <p>{$_('content.tokenActions')}</p>
        </div>
      {:else if activeTab === 'more'}
        <div class="bg-white p-6 rounded-t-lg rounded-br-lg shadow-sm border-b-4 border-blue-600 md:rounded-lg md:border-l-4 md:border-b-0">
          <h2 class="text-2xl font-bold mb-4">{$_('bottomNav.more')}</h2>
          <p class="mb-6">{$_('content.more')}</p>
          
          <!-- Original App.svelte content -->
          <div class="mt-8">
            <h3 class="text-xl font-bold text-center mb-2">Blank Slate</h3>
            <h4 class="text-lg font-medium text-center mb-8">Met WASM integratie</h4>
            
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
          </div>
        </div>
      {/if}
    </div>
  </div>