<!-- src/lib/BottomNav.svelte -->
<script lang="ts">
  import { _ } from 'svelte-i18n';
  
  export let activeTab: string = '';
  
  // Function to handle tab change
  function setActive(tab: string) {
    activeTab = tab;
    dispatch('tabChange', tab);
  }
  
  // Create a dispatch function for events
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  
  // Navigation items array - aangepast met nieuwe finalize knop
  const navItems = [
    { id: 'tokenStash', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', label: $_('bottomNav.tokenStash') },
    { id: 'tokenActions', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z', label: $_('bottomNav.tokenActions') },
    { id: 'tokenBatch', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', label: 'Token Batch' },
    { id: 'finalize', icon: 'M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11', label: $_('bottomNav.finalize') },
    { id: 'more', icon: 'M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z', label: $_('bottomNav.more') }
  ];
</script>

<nav class="bottom-nav">
<div class="nav-container">
  <div class="nav-items">
    {#each navItems as item}
      <button 
        class="nav-item {activeTab === item.id ? 'active' : ''}"
        on:click={() => setActive(item.id)}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          class="icon {activeTab === item.id ? 'active-icon' : ''}" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={item.icon} />
        </svg>
        <span class="label">{item.label}</span>
        
        {#if activeTab === item.id}
          <div class="active-indicator"></div>
        {/if}
      </button>
    {/each}
  </div>
</div>
</nav>

<style>
.bottom-nav {
  width: 100%;
  background-color: white;
  border-top: 1px solid #e5e7eb;
}

.nav-container {
  max-width: 400px;
  margin: 0 auto;
}

.nav-items {
  display: flex;
  justify-content: space-between;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  background: none;
  border: none;
  position: relative;
  color: #6b7280;
  cursor: pointer;
  transition: color 0.2s;
}

.nav-item:hover {
  color: #4b5563;
}

.nav-item.active {
  color: #2563eb;
}

.icon {
  height: 20px;
  width: 20px;
  margin-bottom: 4px;
}

.active-icon {
  color: #3b82f6;
}

.label {
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.active-indicator {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #2563eb;
}
</style>