<script lang="ts">
  import { onMount } from "svelte";
  import { IndexedDBService } from "./services/IndexedDBService";
  import S2CellLookup from "./S2CellLookup.svelte";
  
  // State management
  let batchAmount = $state(100);
  let s2CellId = $state("");
  let referenceId = $state("");
  let batchDenomination = $state(1);
  let batchScenario = $state("default");
  let batchAsset = $state("default");
  let batchExpiry = $state("");
  let isProcessing = $state(false);
  let operationStatus = $state<{ success: boolean; message: string } | null>(null);
  let availableTokens = $state<any[]>([]);
  
  // Token denominations
  const tokenDenominations = [
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 5, label: "5" },
    { value: 10, label: "10" },
    { value: 20, label: "20" },
    { value: 50, label: "50" },
    { value: 100, label: "100" },
    { value: 200, label: "200" },
    { value: 500, label: "500" }
  ];
  
  // Handle S2 cell selection
  function handleS2CellSelected(event: CustomEvent) {
    s2CellId = event.detail.s2CellId;
  }
  
  // Initialize database
  async function initDatabase() {
    const dbService = IndexedDBService.getInstance();
    await dbService.resetDB(); // Reset the database to apply new schema
    await loadAvailableTokens();
  }
  
  // Load available tokens
  async function loadAvailableTokens() {
    const dbService = IndexedDBService.getInstance();
    availableTokens = await dbService.getAvailableTokens(batchDenomination);
  }
  
  // Create token batch
  async function createTokenBatch() {
    if (batchAmount <= 0) {
      operationStatus = {
        success: false,
        message: "Voer een positief aantal tokens in"
      };
      return;
    }

    if (!s2CellId) {
      operationStatus = {
        success: false,
        message: "Selecteer een locatie voor de token batch"
      };
      return;
    }

    if (!referenceId) {
      operationStatus = {
        success: false,
        message: "Voer een referentie ID in"
      };
      return;
    }
    
    isProcessing = true;
    operationStatus = null;
    
    try {
      const dbService = IndexedDBService.getInstance();
      const result = await dbService.createTokenBatch({
        s2CellId,
        referenceId,
        amount: batchAmount,
        denomination: batchDenomination,
        scenario: batchScenario,
        asset: batchAsset,
        expiry: batchExpiry || undefined
      });
      
      if (result) {
        operationStatus = {
          success: true,
          message: `Succesvol ${batchAmount} tokens van ${batchDenomination} aangemaakt!`
        };
        
        // Reset form
        batchAmount = 100;
        s2CellId = "";
        referenceId = "";
        batchScenario = "default";
        batchAsset = "default";
        batchExpiry = "";
        
        // Reload available tokens
        await loadAvailableTokens();
      } else {
        operationStatus = {
          success: false,
          message: "Er is een fout opgetreden bij het aanmaken van de tokens"
        };
      }
    } catch (error) {
      operationStatus = {
        success: false,
        message: "Er is een onverwachte fout opgetreden"
      };
      console.error("Error creating token batch:", error);
    } finally {
      isProcessing = false;
    }
  }
  
  // Handle denomination change
  async function handleDenominationChange() {
    await loadAvailableTokens();
  }
  
  onMount(() => {
    initDatabase();
    window.addEventListener('s2CellSelected', handleS2CellSelected as EventListener);
    
    return () => {
      window.removeEventListener('s2CellSelected', handleS2CellSelected as EventListener);
    };
  });
</script>

<div class="token-batch-manager">
  <div class="batch-form">
    <h3 class="form-title">Token Batch Aanmaken</h3>
    
    <div class="form-section">
      <h4 class="section-title">Locatie</h4>
      <S2CellLookup />
    </div>
    
    <div class="form-section">
      <h4 class="section-title">Token Details</h4>
      
      <div class="form-group">
        <label for="referenceId">Referentie ID</label>
        <input
          type="text"
          id="referenceId"
          bind:value={referenceId}
          placeholder="Voer referentie ID in"
          disabled={isProcessing}
        />
        <small class="input-help">Unieke identifier voor het doel van deze batch</small>
      </div>
      
      <div class="form-group">
        <label for="batchDenomination">Token Waarde</label>
        <select
          id="batchDenomination"
          bind:value={batchDenomination}
          on:change={handleDenominationChange}
          disabled={isProcessing}
        >
          {#each tokenDenominations as denomination}
            <option value={denomination.value}>{denomination.label}</option>
          {/each}
        </select>
      </div>
      
      <div class="form-group">
        <label for="batchAmount">Aantal Tokens</label>
        <input
          type="number"
          id="batchAmount"
          bind:value={batchAmount}
          min="1"
          disabled={isProcessing}
        />
      </div>
    </div>
    
    <div class="form-section">
      <h4 class="section-title">Metadata</h4>
      
      <div class="form-group">
        <label for="batchScenario">Scenario</label>
        <input
          type="text"
          id="batchScenario"
          bind:value={batchScenario}
          placeholder="default"
          disabled={isProcessing}
        />
      </div>
      
      <div class="form-group">
        <label for="batchAsset">Asset</label>
        <input
          type="text"
          id="batchAsset"
          bind:value={batchAsset}
          placeholder="default"
          disabled={isProcessing}
        />
      </div>
      
      <div class="form-group">
        <label for="batchExpiry">Expiry (optioneel)</label>
        <input
          type="datetime-local"
          id="batchExpiry"
          bind:value={batchExpiry}
          disabled={isProcessing}
        />
      </div>
    </div>
    
    {#if operationStatus}
      <div class="status-message" class:success={operationStatus.success} class:error={!operationStatus.success}>
        {operationStatus.message}
      </div>
    {/if}
    
    <button
      class="submit-button"
      on:click={createTokenBatch}
      disabled={isProcessing}
    >
      {#if isProcessing}
        <div class="spinner"></div>
        Tokens aanmaken...
      {:else}
        Token Batch Aanmaken
      {/if}
    </button>
  </div>
  
  <div class="token-stats">
    <h3 class="stats-title">Beschikbare Tokens</h3>
    <div class="stats-grid">
      {#each tokenDenominations as denomination}
        <div class="stat-card">
          <span class="stat-label">Waarde {denomination.label}</span>
          <span class="stat-value">
            {availableTokens.filter(t => t.denomination === denomination.value).length}
          </span>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .token-batch-manager {
    max-width: 800px;
    margin: 0 auto;
    padding: 24px;
  }
  
  .batch-form {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 24px;
    margin-bottom: 24px;
  }
  
  .form-title {
    font-size: 20px;
    font-weight: 700;
    color: #2563eb;
    margin: 0 0 24px 0;
  }
  
  .form-section {
    margin-bottom: 24px;
    padding-bottom: 24px;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .form-section:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
  
  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #374151;
    margin: 0 0 16px 0;
  }
  
  .form-group {
    margin-bottom: 16px;
  }
  
  label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 4px;
  }
  
  select,
  input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    transition: border-color 0.2s;
  }
  
  select:focus,
  input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
  
  .input-help {
    display: block;
    font-size: 12px;
    color: #6b7280;
    margin-top: 4px;
  }
  
  .status-message {
    padding: 12px;
    border-radius: 6px;
    margin-bottom: 16px;
    font-size: 14px;
  }
  
  .status-message.success {
    background-color: #dcfce7;
    color: #16a34a;
  }
  
  .status-message.error {
    background-color: #fee2e2;
    color: #dc2626;
  }
  
  .submit-button {
    width: 100%;
    background-color: #2563eb;
    color: white;
    padding: 12px;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }
  
  .submit-button:hover:not(:disabled) {
    background-color: #1d4ed8;
  }
  
  .submit-button:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
  }
  
  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid #ffffff;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .token-stats {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 24px;
  }
  
  .stats-title {
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 16px 0;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }
  
  .stat-card {
    background-color: #f3f4f6;
    padding: 16px;
    border-radius: 8px;
    text-align: center;
  }
  
  .stat-label {
    display: block;
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 4px;
  }
  
  .stat-value {
    font-size: 24px;
    font-weight: 600;
    color: #2563eb;
  }
</style> 