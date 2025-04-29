<!-- src/lib/Finalize.svelte -->
<script lang="ts">
    import { _ } from 'svelte-i18n';
    import QRKissFinalization from './QRKissFinalization.svelte';
    
    // State management
    let selectedMethod = $state('');
    let qrKissComponent: QRKissFinalization;
    
    // Beschikbare synchronisatie methodes
    const syncMethods = [
      {
        id: 'web',
        icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9',
        label: $_('finalize.web'),
        available: false
      },
      {
        id: 'nfc',
        icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
        label: $_('finalize.nfc'),
        available: false
      },
      {
        id: 'bluetooth',
        icon: 'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0',
        label: $_('finalize.bluetooth'),
        available: false
      },
      {
        id: 'qrkiss',
        icon: 'M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z',
        label: $_('finalize.qrkiss'),
        available: true,
        description: $_('finalize.qrkissDescription')
      }
    ];
    
    // Functie om een synchronisatie methode te selecteren
    function selectMethod(methodId: string) {
      selectedMethod = methodId;
      
      // Als QR Kiss geselecteerd is, open de QR Kiss interface
      if (methodId === 'qrkiss') {
        setTimeout(() => {
          qrKissComponent?.openQRKissModal();
        }, 100);
      }
    }
  </script>
  
  <div class="finalize-container">
    <div class="intro-section">
      <h3 class="section-title">{$_('finalize.title')}</h3>
      <p class="section-description">{$_('finalize.description')}</p>
    </div>
    
    <div class="method-selection">
      <h4 class="selection-title">{$_('finalize.selectMethod')}</h4>
      
      <div class="methods-grid">
        {#each syncMethods as method}
          <button 
            class="method-card {!method.available ? 'disabled' : ''}" 
            on:click={() => method.available && selectMethod(method.id)}
            disabled={!method.available}
          >
            <div class="method-icon-container">
              <svg xmlns="http://www.w3.org/2000/svg" class="method-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={method.icon} />
              </svg>
              {#if !method.available}
                <div class="coming-soon-badge">Binnenkort</div>
              {/if}
            </div>
            
            <h5 class="method-title">{method.label}</h5>
            {#if method.description}
              <p class="method-description">{method.description}</p>
            {/if}
          </button>
        {/each}
      </div>
    </div>
    
    <!-- QR Kiss Finalization Component (verborgen tenzij geactiveerd) -->
    <QRKissFinalization bind:this={qrKissComponent} />
  </div>
  
  <style>
    .finalize-container {
      max-width: 768px;
      margin: 0 auto;
    }
    
    .intro-section {
      margin-bottom: 32px;
    }
    
    .section-title {
      font-size: 20px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 12px;
    }
    
    .section-description {
      color: #4b5563;
      font-size: 16px;
      line-height: 1.5;
    }
    
    .method-selection {
      background-color: #f9fafb;
      border-radius: 12px;
      padding: 24px;
      border: 1px solid #e5e7eb;
    }
    
    .selection-title {
      font-size: 18px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 16px;
    }
    
    .methods-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
    }
    
    @media (min-width: 640px) {
      .methods-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    @media (min-width: 768px) {
      .methods-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    .method-card {
      background-color: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .method-card:hover:not(.disabled) {
      border-color: #2563eb;
      box-shadow: 0 2px 4px rgba(37, 99, 235, 0.1);
      transform: translateY(-2px);
    }
    
    .method-card.disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .method-icon-container {
      position: relative;
      width: 64px;
      height: 64px;
      background-color: #eff6ff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }
    
    .method-icon {
      width: 32px;
      height: 32px;
      color: #2563eb;
    }
    
    .coming-soon-badge {
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #6b7280;
      color: white;
      font-size: 10px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 999px;
      white-space: nowrap;
    }
    
    .method-title {
      font-size: 16px;
      font-weight: 600;
      color: #111827;
      margin-bottom: 8px;
    }
    
    .method-description {
      font-size: 14px;
      color: #6b7280;
      line-height: 1.4;
    }
  </style>