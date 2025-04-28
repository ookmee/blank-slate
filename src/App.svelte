<script lang="ts">
  import { onMount } from 'svelte';
  import { locale, _ } from 'svelte-i18n';
  import TopNav from './lib/TopNav.svelte';
  import BottomNav from './lib/BottomNav.svelte';
  import ContentArea from './lib/ContentArea.svelte';
  import LeftNavContainer from './lib/LeftNavContainer.svelte';
  import './i18n'; // Initialize i18n
  
  // State management
  let activeTab = $state('login'); // Default active tab
  let username = $state(''); // User will be logged out by default
  let i18nLoaded = $state(false);
  
  // Handle tab changes from both navs
  function handleTabChange(event: CustomEvent<string>) {
    activeTab = event.detail;
  }
  
  // Set up locale
  onMount(() => {
    // Ensure i18n is initialized
    try {
      // We'll mark i18n as loaded after a short delay to ensure it's ready
      setTimeout(() => {
        i18nLoaded = true;
      }, 100);
      
      // For demo purposes - simulate user login after 3 seconds
      setTimeout(() => {
        username = 'JuiceUser';
      }, 3000);
    } catch (error) {
      console.error('Error in onMount:', error);
    }
  });
  
  // Function to toggle language with error handling
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

<div class="flex flex-col min-h-screen bg-gray-50">
  <!-- Language toggle (for demo purposes) -->
  <div class="fixed top-2 right-2 z-50">
    <button 
      on:click={toggleLanguage}
      class="bg-blue-500 text-white px-2 py-1 rounded text-xs"
    >
      Toggle Language
    </button>
  </div>
  
  {#if i18nLoaded}
    <!-- Mobile Layout: TopNav at top, BottomNav at bottom -->
    <!-- Desktop Layout: Both in left sidebar -->
    <div class="md:hidden">
      <div class="fixed top-0 left-0 right-0 z-50">
        <TopNav 
          activeTab={activeTab} 
          username={username}
          on:tabChange={handleTabChange} 
        />
      </div>
      
      <div style="position: fixed; bottom: 0; left: 0; right: 0; z-index: 9999;">
        <BottomNav 
          activeTab={activeTab}
          on:tabChange={handleTabChange} 
        />
      </div>
    </div>
    
    <!-- Left Navigation Container (desktop only) -->
    <LeftNavContainer 
      activeTab={activeTab}
      username={username}
      on:tabChange={handleTabChange}
    />
    
    <!-- Content Area - adjusted for all layouts -->
    <div class="pt-16 md:pt-0">
      <ContentArea activeTab={activeTab} />
    </div>
  {:else}
    <!-- Loading indicator -->
    <div class="flex items-center justify-center h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  {/if}
</div>

<style lang="css">
  :global(body) {
    /* Allow for the fixed bottom navigation */
    padding-bottom: 60px;
    margin: 0;
    overflow-x: hidden;
  }
  
  @media (min-width: 768px) {
    :global(body) {
      padding-bottom: 0;  /* Remove bottom padding on larger screens */
    }
  }
</style>