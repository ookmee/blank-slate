<script lang="ts">
  import { onMount } from 'svelte';
  import { locale, _ } from 'svelte-i18n';
  import TopNav from './lib/TopNav.svelte';
  import BottomNav from './lib/BottomNav.svelte';
  import ContentArea from './lib/ContentArea.svelte';
  import DesktopNavigation from './lib/DesktopNavigation.svelte';
  import './i18n'; // Initialize i18n
  
  // State management
  let activeTab = $state('login'); // Default active tab
  let username = $state(''); // User will be logged out by default
  let i18nLoaded = $state(false);
  let isMobile = $state(true);
  
  // Handle tab changes from both navs
  function handleTabChange(event: CustomEvent<string>) {
    activeTab = event.detail;
  }
  
  // Detect screen size for responsive layout
  function checkScreenSize() {
    isMobile = window.innerWidth < 768;
  }
  
  // Set up locale and listeners
  onMount(() => {
    // Check screen size initially and on resize
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    // Ensure i18n is initialized
    try {
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
    
    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
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

{#if i18nLoaded}
  <div class="app-container">
    <!-- Language Toggle (Fixed at top-right) -->
    <div class="language-toggle">
      <button on:click={toggleLanguage}>
        Toggle Language
      </button>
    </div>
    
    {#if !isMobile}
      <!-- DESKTOP LAYOUT -->
      <div class="desktop-layout">
        <DesktopNavigation 
          activeTab={activeTab}
          username={username}
          on:tabChange={handleTabChange}
        />
        
        <div class="desktop-content">
          <ContentArea activeTab={activeTab} />
        </div>
      </div>
    {:else}
      <!-- MOBILE LAYOUT -->
      <div class="mobile-layout">
        <div class="mobile-top-nav">
          <TopNav 
            activeTab={activeTab} 
            username={username}
            on:tabChange={handleTabChange} 
          />
        </div>
        
        <div class="mobile-content">
          <ContentArea activeTab={activeTab} />
        </div>
        
        <div class="mobile-bottom-nav">
          <BottomNav 
            activeTab={activeTab}
            on:tabChange={handleTabChange} 
          />
        </div>
      </div>
    {/if}
  </div>
{:else}
  <!-- Loading Screen -->
  <div class="loading-screen">
    <div class="loading-spinner"></div>
  </div>
{/if}

<style>
  /* Reset styles */
  :global(body) {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    background-color: #f9fafb;
  }
  
  /* App container */
  .app-container {
    min-height: 100vh;
    position: relative;
  }
  
  /* Language toggle */
  .language-toggle {
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 1000;
  }
  
  .language-toggle button {
    background-color: #3b82f6;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    border: none;
    cursor: pointer;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  }
  
  /* Desktop layout */
  .desktop-layout {
    display: flex;
    min-height: 100vh;
  }
  
  .desktop-content {
    margin-left: 256px; /* 64*4px = 256px sidebar width */
    padding: 16px;
    width: calc(100% - 256px);
  }
  
  /* Mobile layout */
  .mobile-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  .mobile-top-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .mobile-content {
    flex: 1;
    padding: 16px;
    margin-top: 80px; /* Height of TopNav */
    margin-bottom: 80px; /* Height of BottomNav */
  }
  
  .mobile-bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 40;
    background-color: white;
    box-shadow: 0 -2px 4px rgba(0,0,0,0.1);
  }
  
  /* Loading screen */
  .loading-screen {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f9fafb;
  }
  
  .loading-spinner {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 2px solid transparent;
    border-top-color: #3b82f6;
    border-bottom-color: #3b82f6;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  /* Media queries for safety */
  @media (min-width: 768px) {
    .desktop-layout {
      display: flex;
    }
    
    .mobile-layout {
      display: none;
    }
  }
  
  @media (max-width: 767px) {
    .desktop-layout {
      display: none;
    }
    
    .mobile-layout {
      display: flex;
    }
  }
</style>