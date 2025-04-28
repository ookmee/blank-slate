<!-- src/lib/TopNav.svelte -->
<script lang="ts">
    import { _ } from 'svelte-i18n';
    
    export let activeTab: string = 'login';
    export let username: string = '';
    
    // Function to handle tab change
    function setActive(tab: string) {
      activeTab = tab;
      dispatch('tabChange', tab);
    }
    
    // Create a dispatch function for events
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
  </script>
  
  <nav class="w-full bg-white border-b border-gray-200 z-50">
    <div class="mx-auto flex max-w-screen-lg justify-center">
      <div class="grid grid-cols-4 w-full max-w-xs">
        <!-- Login Button -->
        <button 
          class="flex items-center justify-center py-3 px-2 relative {activeTab === 'login' ? 'text-blue-600' : 'text-gray-500 border-b border-gray-200'}"
          on:click={() => setActive('login')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span class="text-xs truncate max-w-full whitespace-nowrap">
            {#if username}
              {username}
            {:else}
              {$_('nav.login')}
            {/if}
          </span>
          
          <!-- Visual connection to content when active -->
          {#if activeTab === 'login'}
            <div class="absolute bottom-0 left-0 w-full h-1 bg-blue-600"></div>
            <div class="absolute -bottom-1 left-0 w-full h-2 bg-gray-50"></div>
          {/if}
        </button>
        
        <!-- Listen Button -->
        <button 
          class="flex items-center justify-center py-3 px-2 relative {activeTab === 'listen' ? 'text-blue-600' : 'text-gray-500 border-b border-gray-200'}"
          on:click={() => setActive('listen')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          <span class="text-xs whitespace-nowrap">{$_('nav.listen')}</span>
          
          <!-- Visual connection to content when active -->
          {#if activeTab === 'listen'}
            <div class="absolute bottom-0 left-0 w-full h-1 bg-blue-600"></div>
            <div class="absolute -bottom-1 left-0 w-full h-2 bg-gray-50"></div>
          {/if}
        </button>
        
        <!-- Advertise Button -->
        <button 
          class="flex items-center justify-center py-3 px-2 relative {activeTab === 'advertise' ? 'text-blue-600' : 'text-gray-500 border-b border-gray-200'}"
          on:click={() => setActive('advertise')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
          <span class="text-xs whitespace-nowrap">{$_('nav.advertise')}</span>
          
          <!-- Visual connection to content when active -->
          {#if activeTab === 'advertise'}
            <div class="absolute bottom-0 left-0 w-full h-1 bg-blue-600"></div>
            <div class="absolute -bottom-1 left-0 w-full h-2 bg-gray-50"></div>
          {/if}
        </button>
        
        <!-- Settings Button -->
        <button 
          class="flex items-center justify-center py-3 px-2 relative {activeTab === 'settings' ? 'text-blue-600' : 'text-gray-500 border-b border-gray-200'}"
          on:click={() => setActive('settings')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span class="text-xs whitespace-nowrap">{$_('nav.settings')}</span>
          
          <!-- Visual connection to content when active -->
          {#if activeTab === 'settings'}
            <div class="absolute bottom-0 left-0 w-full h-1 bg-blue-600"></div>
            <div class="absolute -bottom-1 left-0 w-full h-2 bg-gray-50"></div>
          {/if}
        </button>
      </div>
    </div>
  </nav>