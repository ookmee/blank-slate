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
  </script>
  
  <!-- Bottom Navigation (mobile) en Left Navigation Bottom Section (desktop) -->
  <div class="w-full bg-white shadow-lg border-t border-gray-200 md:shadow-none md:border-t-0 md:h-auto">
    <div class="mx-auto flex max-w-screen-lg justify-center md:flex-col md:max-w-none md:items-start md:px-4 md:py-0">
      <div class="grid grid-cols-3 w-full max-w-sm md:grid-cols-1 md:max-w-none md:gap-6">
        <!-- Token Stash Button -->
        <button 
          class="flex items-center justify-center py-3 px-2 relative md:justify-start md:py-2 md:w-full {activeTab === 'tokenStash' ? 'text-blue-600' : 'text-gray-500 border-t border-gray-200 md:border-t-0'}"
          on:click={() => setActive('tokenStash')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-xs whitespace-nowrap md:text-sm">{$_('bottomNav.tokenStash')}</span>
          
          <!-- Visual connection to content when active (only on mobile) -->
          {#if activeTab === 'tokenStash'}
            <div class="absolute top-0 left-0 w-full h-1 bg-blue-600 md:hidden"></div>
            <div class="absolute -top-1 left-0 w-full h-2 bg-gray-50 md:hidden"></div>
            <!-- Visual indicator on desktop -->
            <div class="hidden md:block md:absolute md:left-0 md:top-0 md:bottom-0 md:w-1 md:h-full md:bg-blue-600 {activeTab === 'tokenStash' ? 'md:opacity-100' : 'md:opacity-0'}"></div>
          {/if}
        </button>
        
        <!-- Token Actions Button -->
        <button 
          class="flex items-center justify-center py-3 px-2 relative md:justify-start md:py-2 md:w-full {activeTab === 'tokenActions' ? 'text-blue-600' : 'text-gray-500 border-t border-gray-200 md:border-t-0'}"
          on:click={() => setActive('tokenActions')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <span class="text-xs whitespace-nowrap md:text-sm">{$_('bottomNav.tokenActions')}</span>
          
          <!-- Visual connection to content when active (only on mobile) -->
          {#if activeTab === 'tokenActions'}
            <div class="absolute top-0 left-0 w-full h-1 bg-blue-600 md:hidden"></div>
            <div class="absolute -top-1 left-0 w-full h-2 bg-gray-50 md:hidden"></div>
            <!-- Visual indicator on desktop -->
            <div class="hidden md:block md:absolute md:left-0 md:top-0 md:bottom-0 md:w-1 md:h-full md:bg-blue-600 {activeTab === 'tokenActions' ? 'md:opacity-100' : 'md:opacity-0'}"></div>
          {/if}
        </button>
        
        <!-- More Button -->
        <button 
          class="flex items-center justify-center py-3 px-2 relative md:justify-start md:py-2 md:w-full {activeTab === 'more' ? 'text-blue-600' : 'text-gray-500 border-t border-gray-200 md:border-t-0'}"
          on:click={() => setActive('more')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
          <span class="text-xs whitespace-nowrap md:text-sm">{$_('bottomNav.more')}</span>
          
          <!-- Visual connection to content when active (only on mobile) -->
          {#if activeTab === 'more'}
            <div class="absolute top-0 left-0 w-full h-1 bg-blue-600 md:hidden"></div>
            <div class="absolute -top-1 left-0 w-full h-2 bg-gray-50 md:hidden"></div>
            <!-- Visual indicator on desktop -->
            <div class="hidden md:block md:absolute md:left-0 md:top-0 md:bottom-0 md:w-1 md:h-full md:bg-blue-600 {activeTab === 'more' ? 'md:opacity-100' : 'md:opacity-0'}"></div>
          {/if}
        </button>
      </div>
    </div>
  </div>