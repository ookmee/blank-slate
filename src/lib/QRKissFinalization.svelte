<!-- src/lib/QRKissFinalization.svelte -->
<script lang="ts">
    import { _ } from 'svelte-i18n';
    
    // State management
    let isModalOpen = $state(false);
    
    // Expose een functie om de QR Kiss interface te openen
    export function openQRKissModal() {
      isModalOpen = true;
    }
    
    // Functie om de modal te sluiten
    function closeModal() {
      isModalOpen = false;
    }
  </script>
  
  {#if isModalOpen}
    <div class="qrkiss-modal">
      <div class="modal-overlay">
        <div class="modal-content">
          <button class="close-button" on:click={closeModal}>
            <svg xmlns="http://www.w3.org/2000/svg" class="close-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
          
          <div class="modal-body">
            <h2 class="modal-title">QR Kiss Finalization</h2>
            <p class="modal-subtitle">Implementatie komt binnenkort</p>
          </div>
        </div>
      </div>
    </div>
  {/if}
  
  <style>
    .qrkiss-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 100;
    }
    
    .modal-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.75);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .modal-content {
      position: relative;
      width: 100%;
      height: 100%;
      background-color: white;
      display: flex;
      flex-direction: column;
    }
    
    .close-button {
      position: absolute;
      top: 16px;
      right: 16px;
      background: none;
      border: none;
      cursor: pointer;
      z-index: 10;
      padding: 8px;
    }
    
    .close-icon {
      width: 24px;
      height: 24px;
      color: white;
    }
    
    .modal-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 24px;
    }
    
    .modal-title {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 16px;
      color: #111827;
      text-align: center;
    }
    
    .modal-subtitle {
      font-size: 16px;
      color: #6b7280;
      text-align: center;
    }
  </style>