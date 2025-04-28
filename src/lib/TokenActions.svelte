<!-- src/lib/TokenActions.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { IndexedDBService } from './services/IndexedDBService';
    
    // State management
    let tokenAmount = $state(10);
    let tokenType = $state('default');
    let isProcessing = $state(false);
    let dbInitialized = $state(false);
    let operationStatus = $state<{ success: boolean; message: string } | null>(null);
    let showSuccessTimeout: number | null = null;
    
    // Beschikbare token types
    const tokenTypes = [
      { id: 'default', label: 'Standaard Token' },
      { id: 'premium', label: 'Premium Token' },
      { id: 'reward', label: 'Belonings Token' }
    ];
    
    // Initialiseer IndexedDB bij component mount
    async function initDatabase() {
      const dbService = IndexedDBService.getInstance();
      dbInitialized = await dbService.initDB();
    }
    
    // Tokens toevoegen aan saldo
    async function addTokensToStash() {
      if (tokenAmount <= 0) {
        operationStatus = {
          success: false,
          message: 'Voer een positief aantal tokens in'
        };
        return;
      }
      
      isProcessing = true;
      operationStatus = null;
      
      try {
        const dbService = IndexedDBService.getInstance();
        const result = await dbService.addTokens(tokenAmount, tokenType);
        
        if (result) {
          operationStatus = {
            success: true,
            message: `${tokenAmount} tokens succesvol toegevoegd aan je saldo!`
          };
          
          // Reset amount
          tokenAmount = 10;
        } else {
          operationStatus = {
            success: false,
            message: 'Er is een fout opgetreden bij het toevoegen van tokens'
          };
        }
      } catch (error) {
        operationStatus = {
          success: false,
          message: 'Er is een onverwachte fout opgetreden'
        };
        console.error('Error adding tokens:', error);
      } finally {
        isProcessing = false;
        
        // Verberg succesbericht na 5 seconden
        if (operationStatus?.success) {
          if (showSuccessTimeout) {
            clearTimeout(showSuccessTimeout);
          }
          
          showSuccessTimeout = setTimeout(() => {
            if (operationStatus?.success) {
              operationStatus = null;
            }
          }, 5000);
        }
      }
    }
    
    onMount(() => {
      initDatabase();
      return () => {
        if (showSuccessTimeout) {
          clearTimeout(showSuccessTimeout);
        }
      };
    });
  </script>
  
  <div class="token-actions">
    <div class="action-card">
      <h3 class="card-title">Tokens Toevoegen</h3>
      
      {#if !dbInitialized}
        <div class="error-message">
          <svg xmlns="http://www.w3.org/2000/svg" class="error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p>Kon geen verbinding maken met de database. Probeer de app opnieuw te laden.</p>
        </div>
      {:else}
        <div class="form-container">
          {#if operationStatus}
            <div class="status-message {operationStatus.success ? 'success' : 'error'}">
              <svg xmlns="http://www.w3.org/2000/svg" class="status-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {#if operationStatus.success}
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                {:else}
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                {/if}
              </svg>
              <p>{operationStatus.message}</p>
            </div>
          {/if}
          
          <div class="form-group">
            <label for="tokenAmount" class="form-label">Aantal tokens</label>
            <div class="amount-input-container">
              <button 
                class="amount-button" 
                on:click={() => tokenAmount = Math.max(1, tokenAmount - 10)}
                disabled={isProcessing}
              >-10</button>
              
              <input 
                type="number" 
                id="tokenAmount" 
                class="amount-input" 
                bind:value={tokenAmount} 
                min="1" 
                max="1000" 
                disabled={isProcessing}
              />
              
              <button 
                class="amount-button" 
                on:click={() => tokenAmount = Math.min(1000, tokenAmount + 10)}
                disabled={isProcessing}
              >+10</button>
            </div>
          </div>
          
          <div class="form-group">
            <label for="tokenType" class="form-label">Type token</label>
            <select 
              id="tokenType" 
              class="type-select" 
              bind:value={tokenType}
              disabled={isProcessing}
            >
              {#each tokenTypes as type}
                <option value={type.id}>{type.label}</option>
              {/each}
            </select>
          </div>
          
          <button 
            class="add-button" 
            on:click={addTokensToStash} 
            disabled={isProcessing || tokenAmount <= 0}
          >
            {#if isProcessing}
              <div class="button-spinner"></div>
              Verwerken...
            {:else}
              <svg xmlns="http://www.w3.org/2000/svg" class="button-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Tokens Toevoegen
            {/if}
          </button>
        </div>
        
        <div class="token-preview">
          <div class="preview-header">Voorbeeld Token</div>
          <div class="token-card">
            <div class="token-card-header">
              <div class="token-symbol">Ɉ</div>
              <div class="token-detail">
                <div class="token-name">{tokenTypes.find(t => t.id === tokenType)?.label}</div>
                <div class="token-count">×{tokenAmount}</div>
              </div>
            </div>
            <div class="token-card-footer">
              <div class="token-card-id">ID: {Date.now().toString().slice(-8)}</div>
              <div class="token-card-value">{tokenAmount} Ɉ</div>
            </div>
          </div>
        </div>
        
        <div class="action-info">
          <h4 class="info-title">Hoe werkt het?</h4>
          <ol class="info-steps">
            <li>Kies het aantal tokens dat je wilt toevoegen aan je saldo</li>
            <li>Selecteer het type token</li>
            <li>Klik op de "Tokens Toevoegen" knop</li>
            <li>Bekijk je bijgewerkte saldo in het "Token Stash" tabblad</li>
          </ol>
          <p class="info-note">Alle token gegevens worden lokaal opgeslagen in je browser via IndexedDB, een krachtige PWA-functie voor offlinegebruik.</p>
        </div>
      {/if}
    </div>
  </div>
  
  <style>
    .token-actions {
      max-width: 600px;
      margin: 0 auto;
    }
    
    .action-card {
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      padding: 24px;
    }
    
    .card-title {
      font-size: 20px;
      font-weight: 700;
      color: #2563eb;
      margin: 0 0 24px 0;
    }
    
    .error-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px;
      background-color: #fee2e2;
      border-radius: 8px;
      color: #b91c1c;
      text-align: center;
    }
    
    .error-icon {
      width: 32px;
      height: 32px;
      margin-bottom: 12px;
    }
    
    .form-container {
      margin-bottom: 24px;
    }
    
    .status-message {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 16px;
    }
    
    .status-message.success {
      background-color: #d1fae5;
      color: #065f46;
    }
    
    .status-message.error {
      background-color: #fee2e2;
      color: #b91c1c;
    }
    
    .status-icon {
      width: 20px;
      height: 20px;
      margin-right: 12px;
      flex-shrink: 0;
    }
    
    .form-group {
      margin-bottom: 16px;
    }
    
    .form-label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: #374151;
      margin-bottom: 8px;
    }
    
    .amount-input-container {
      display: flex;
      align-items: center;
    }
    
    .amount-button {
      background-color: #e5e7eb;
      border: none;
      border-radius: 4px;
      color: #374151;
      font-weight: 600;
      padding: 8px 12px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .amount-button:hover:not(:disabled) {
      background-color: #d1d5db;
    }
    
    .amount-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .amount-input {
      width: 100%;
      text-align: center;
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      margin: 0 8px;
      font-size: 16px;
    }
    
    .type-select {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      font-size: 16px;
      background-color: white;
    }
    
    .add-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 12px;
      background-color: #2563eb;
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.2s;
      margin-top: 8px;
    }
    
    .add-button:hover:not(:disabled) {
      background-color: #1d4ed8;
    }
    
    .add-button:disabled {
      background-color: #93c5fd;
      cursor: not-allowed;
    }
    
    .button-icon {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }
    
    .button-spinner {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      animation: spin 1s linear infinite;
      margin-right: 8px;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .token-preview {
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
    }
    
    .preview-header {
      font-size: 16px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 16px;
    }
    
    .token-card {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      border-radius: 12px;
      padding: 20px;
      color: white;
      box-shadow: 0 4px 6px rgba(37, 99, 235, 0.3);
    }
    
    .token-card-header {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
    }
    
    .token-symbol {
      font-size: 24px;
      font-weight: 700;
      background-color: rgba(255, 255, 255, 0.2);
      width: 48px;
      height: 48px;
      border-radius: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 16px;
    }
    
    .token-detail {
      flex: 1;
    }
    
    .token-name {
      font-weight: 600;
      margin-bottom: 4px;
    }
    
    .token-count {
      font-size: 14px;
      opacity: 0.8;
    }
    
    .token-card-footer {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      margin-top: 8px;
    }
    
    .token-card-id {
      opacity: 0.7;
    }
    
    .token-card-value {
      font-weight: 600;
    }
    
    .action-info {
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
    }
    
    .info-title {
      font-size: 16px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 16px;
    }
    
    .info-steps {
      padding-left: 24px;
      margin-bottom: 16px;
    }
    
    .info-steps li {
      margin-bottom: 8px;
      color: #4b5563;
    }
    
    .info-note {
      background-color: #eff6ff;
      padding: 12px 16px;
      border-radius: 6px;
      color: #1e40af;
      font-size: 14px;
    }
  </style>