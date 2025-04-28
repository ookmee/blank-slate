<script lang="ts">
    import TopNav from './TopNav.svelte';
    import BottomNav from './BottomNav.svelte'; // Updated import
    
    export let activeTab: string;
    export let username: string = '';
    
    // Bubble up the tab change events
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    
    function handleTabChange(event: CustomEvent<string>) {
      dispatch('tabChange', event.detail);
    }
  </script>
  
  <!-- Container is alleen zichtbaar op grotere schermen -->
  <div class="hidden md:flex md:fixed md:left-0 md:top-0 md:h-screen md:w-64 md:flex-col md:bg-white md:border-r md:border-gray-200 md:shadow-lg md:z-40">
    <!-- TopNav in verticale layout -->
    <div class="md:w-full">
      <TopNav 
        activeTab={activeTab} 
        username={username}
        on:tabChange={handleTabChange}
      />
    </div>
    
    <!-- Divider tussen TopNav en BottomNav -->
    <div class="my-4 border-b border-gray-200 w-full"></div>
    
    <!-- BottomNav in verticale layout -->
    <div class="md:w-full md:flex-grow">
      <BottomNav 
        activeTab={activeTab}
        on:tabChange={handleTabChange}
      />
    </div>
  </div>