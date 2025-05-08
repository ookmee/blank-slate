<!-- src/lib/TopNav.svelte -->
<script lang="ts">
    import { _ } from 'svelte-i18n';
    import { onMount, createEventDispatcher } from 'svelte';
    
    // Use correct $props rune syntax
    const { activeTab = 'login', username = '' } = $props();
    
    // State for local changes to the props
    let currentActiveTab = $state(activeTab);
    let currentUsername = $state(username);
    
    // Create a dispatch function for events
    const dispatch = createEventDispatcher();
    
    // Function to handle tab change
    function setActive(tab: string) {
      currentActiveTab = tab;
      dispatch('tabChange', tab);
    }
    
    // Navigation items array
    $effect(() => {
      // This effect runs when username changes
      navItems[0].label = currentUsername || $_('nav.login');
    });
    
    let navItems = $state([
      { id: 'login', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', label: currentUsername || $_('nav.login') },
      { id: 'listen', icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3', label: $_('nav.listen') },
      { id: 'advertise', icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z', label: $_('nav.advertise') },
      { id: 'settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', label: $_('nav.settings') }
    ]);
    
    // Add login event handling
    onMount(() => {
      // Check if user is already logged in
      const savedUsername = sessionStorage.getItem("currentUser");
      if (savedUsername) {
        currentUsername = savedUsername;
      }
      
      // Listen for login events
      const handleLogin = (event: CustomEvent) => {
        currentUsername = event.detail.username;
      };
      
      document.addEventListener('login', handleLogin as EventListener);
      
      // Cleanup on unmount
      return () => {
        document.removeEventListener('login', handleLogin as EventListener);
      };
    });
</script>

<nav class="top-nav">
  <div class="nav-container">
    <div class="nav-items">
      {#each navItems as item}
        <button 
          class="nav-item {currentActiveTab === item.id ? 'active' : ''}"
          on:click={() => setActive(item.id)}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="icon {currentActiveTab === item.id ? 'active-icon' : ''}" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={item.icon} />
          </svg>
          <span class="label">{item.label}</span>
          
          {#if currentActiveTab === item.id}
            <div class="active-indicator"></div>
          {/if}
        </button>
      {/each}
    </div>
  </div>
</nav>

<style>
  .top-nav {
    width: 100%;
    background-color: white;
    border-bottom: 1px solid #e5e7eb;
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
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #2563eb;
  }
</style>
