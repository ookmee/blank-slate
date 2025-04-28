<!-- src/lib/DesktopNavigation.svelte -->
<script lang="ts">
    import { _ } from 'svelte-i18n';
    
    export let activeTab: string;
    export let username: string = '';
    
    // Create a dispatch function for events
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    
    // Function to handle tab change
    function setActive(tab: string) {
      activeTab = tab;
      dispatch('tabChange', tab);
    }
    
    // Navigation items arrays for organization
    const topNavItems = [
      { id: 'login', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', label: username || $_('nav.login') },
      { id: 'listen', icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3', label: $_('nav.listen') },
      { id: 'advertise', icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z', label: $_('nav.advertise') },
      { id: 'settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', label: $_('nav.settings') }
    ];
    
    const bottomNavItems = [
      { id: 'tokenStash', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', label: $_('bottomNav.tokenStash') },
      { id: 'tokenActions', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z', label: $_('bottomNav.tokenActions') },
      { id: 'more', icon: 'M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z', label: $_('bottomNav.more') }
    ];
  </script>
  
  <div class="desktop-nav">
    <!-- App Logo/Brand -->
    <div class="brand">
      <div class="logo">Ɉuice App</div>
    </div>
    
    <!-- Top Navigation Section -->
    <div class="nav-section">
      <h3 class="section-title">Main Menu</h3>
      
      <div class="nav-items">
        {#each topNavItems as item}
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
            <span>{item.label}</span>
            
            {#if activeTab === item.id}
              <div class="active-indicator"></div>
            {/if}
          </button>
        {/each}
      </div>
    </div>
    
    <!-- Divider -->
    <div class="divider"></div>
    
    <!-- Bottom Navigation Section -->
    <div class="nav-section">
      <h3 class="section-title">Token Management</h3>
      
      <div class="nav-items">
        {#each bottomNavItems as item}
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
            <span>{item.label}</span>
            
            {#if activeTab === item.id}
              <div class="active-indicator"></div>
            {/if}
          </button>
        {/each}
      </div>
    </div>
    
    <!-- Version info at bottom -->
    <div class="version-info">
      <p>v0.1.0 - WASM Enabled</p>
    </div>
  </div>
  
  <style>
    .desktop-nav {
      position: fixed;
      left: 0;
      top: 0;
      width: 256px;
      height: 100%;
      background-color: white;
      border-right: 1px solid #e5e7eb;
      box-shadow: 4px 0 8px rgba(0, 0, 0, 0.05);
      display: flex;
      flex-direction: column;
      padding: 16px 0;
      z-index: 100;
      overflow-y: auto;
    }
    
    .brand {
      padding: 0 24px;
      margin-bottom: 32px;
    }
    
    .logo {
      font-size: 20px;
      font-weight: 700;
      color: #2563eb;
    }
    
    .nav-section {
      padding: 0 16px;
      margin-bottom: 16px;
    }
    
    .section-title {
      text-transform: uppercase;
      font-size: 12px;
      font-weight: 600;
      color: #6b7280;
      letter-spacing: 0.05em;
      margin-bottom: 12px;
      padding: 0 8px;
    }
    
    .nav-items {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .nav-item {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 8px;
      border-radius: 6px;
      font-size: 14px;
      color: #4b5563;
      background: none;
      border: none;
      cursor: pointer;
      text-align: left;
      transition: background-color 0.2s, color 0.2s;
      position: relative;
    }
    
    .nav-item:hover {
      background-color: #f3f4f6;
      color: #1f2937;
    }
    
    .nav-item.active {
      background-color: #eff6ff;
      color: #2563eb;
      font-weight: 500;
    }
    
    .icon {
      height: 20px;
      width: 20px;
      margin-right: 12px;
      color: #6b7280;
      flex-shrink: 0;
    }
    
    .active-icon {
      color: #3b82f6;
    }
    
    .active-indicator {
      position: absolute;
      right: 8px;
      width: 4px;
      height: 20px;
      background-color: #2563eb;
      border-radius: 999px;
    }
    
    .divider {
      height: 1px;
      background-color: #e5e7eb;
      margin: 24px 16px;
    }
    
    .version-info {
      margin-top: auto;
      padding: 8px 16px;
      font-size: 12px;
      color: #9ca3af;
    }
  </style>