<!-- src/lib/ContentArea.svelte -->
<script lang="ts">
  import { _, locale } from 'svelte-i18n';
  import Counter from './Counter.svelte';
  import WasmBasis from './WasmBasis.svelte';
  import TokenStash from './TokenStash.svelte';
  import TokenActions from './TokenActions.svelte';
  import Finalize from './Finalize.svelte';
  
  export let activeTab: string = 'login';
  
  // Function to toggle language
  function toggleLanguage() {
    try {
      locale.update(currentLocale => {
        const newLocale = currentLocale === 'en' ? 'nl' : 'en';
        console.log(`Switching locale from ${currentLocale} to ${newLocale}`);
        return newLocale;
      });
    } catch (error) {
      console.error('Error toggling language:', error);
      // Fallback to direct setting
      try {
        const newLocale = locale.get() === 'en' ? 'nl' : 'en';
        locale.set(newLocale);
      } catch (fallbackError) {
        console.error('Fallback language toggle failed:', fallbackError);
      }
    }
  }
</script>

<div class="content-area">
  <div class="content-card">
    {#if activeTab === 'login'}
      <h2 class="content-title">{$_('nav.login')}</h2>
      <p>{$_('content.login')}</p>
    
    {:else if activeTab === 'listen'}
      <h2 class="content-title">{$_('nav.listen')}</h2>
      <p>{$_('content.listen')}</p>
    
    {:else if activeTab === 'advertise'}
      <h2 class="content-title">{$_('nav.advertise')}</h2>
      <p>{$_('content.advertise')}</p>
    
    {:else if activeTab === 'settings'}
      <h2 class="content-title">{$_('nav.settings')}</h2>
      <p>{$_('content.settings')}</p>
      
      <!-- Taal wissel sectie -->
      <div class="settings-section">
        <h3 class="settings-section-title">Taalinstellingen</h3>
        <div class="settings-option">
          <span class="settings-label">Huidige taal</span>
          <button class="language-button" on:click={toggleLanguage}>
            <svg xmlns="http://www.w3.org/2000/svg" class="language-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            Nederlands / English
          </button>
        </div>
      </div>
    
    {:else if activeTab === 'tokenStash'}
      <h2 class="content-title">{$_('bottomNav.tokenStash')}</h2>
      <TokenStash />
    
    {:else if activeTab === 'tokenActions'}
      <h2 class="content-title">{$_('bottomNav.tokenActions')}</h2>
      <TokenActions />
      
    {:else if activeTab === 'finalize'}
      <h2 class="content-title">{$_('bottomNav.finalize')}</h2>
      <Finalize />
    
    {:else if activeTab === 'more'}
      <h2 class="content-title">{$_('bottomNav.more')}</h2>
      <p class="mb-24">{$_('content.more')}</p>
      
      <!-- Original App.svelte content -->
      <div class="demo-section">
        <h3 class="demo-title">Blank Slate</h3>
        <h4 class="demo-subtitle">Met WASM integratie</h4>
        
        <div class="demo-grid">
          <div class="demo-card">
            <h3 class="demo-card-title">Counter Component</h3>
            <Counter />
            <p class="demo-card-description">
              Deze counter werkt via Svelte's state management
            </p>
          </div>

          <div class="demo-card">
            <WasmBasis />
          </div>
        </div>

        <div class="pwa-section">
          <h3 class="demo-card-title">PWA-functies testen:</h3>
          <ol class="pwa-list">
            <li>Schakel het netwerk uit en herlaad de pagina</li>
            <li>Als de applicatie nog steeds werkt, functioneert de service worker correct</li>
            <li>De counter en WASM-demo blijven werken, zelfs zonder internetverbinding</li>
            <li>Ook de token functionaliteit blijft volledig werken zonder internet!</li>
          </ol>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .content-area {
    max-width: 1024px;
    margin: 0 auto;
  }
  
  .content-card {
    background-color: white;
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border-left: 4px solid #2563eb;
  }
  
  .content-title {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 16px;
    color: #111827;
  }
  
  /* Settings styling */
  .settings-section {
    margin-top: 32px;
    padding-top: 16px;
    border-top: 1px solid #e5e7eb;
  }
  
  .settings-section-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #374151;
  }
  
  .settings-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0;
  }
  
  .settings-label {
    font-size: 16px;
    color: #4b5563;
  }
  
  .language-button {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    background-color: #f3f4f6;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    color: #374151;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .language-button:hover {
    background-color: #e5e7eb;
  }
  
  .language-icon {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
  
  /* Demo section styling */
  .demo-section {
    margin-top: 32px;
  }
  
  .demo-title {
    font-size: 20px;
    font-weight: 700;
    text-align: center;
    margin-bottom: 8px;
    color: #111827;
  }
  
  .demo-subtitle {
    font-size: 18px;
    font-weight: 500;
    text-align: center;
    margin-bottom: 32px;
    color: #4b5563;
  }
  
  .demo-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
    max-width: 768px;
    margin: 0 auto;
  }
  
  @media (min-width: 768px) {
    .demo-grid {
      grid-template-columns: 1fr 1fr;
    }
  }
  
  .demo-card {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 16px;
  }
  
  .demo-card-title {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 16px;
    color: #111827;
  }
  
  .demo-card-description {
    margin-top: 16px;
    font-size: 14px;
    color: #6b7280;
  }
  
  .pwa-section {
    max-width: 768px;
    margin: 32px auto 0;
  }
  
  .pwa-list {
    list-style-type: decimal;
    padding-left: 24px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  /* Mobile specific adjustments */
  @media (max-width: 767px) {
    .content-card {
      border-radius: 8px;
    }
  }
  
  /* Extra margin util class */
  .mb-24 {
    margin-bottom: 24px;
  }
</style>