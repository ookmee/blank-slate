<script lang="ts">
  import { onMount } from 'svelte';
  
  let latitude = $state('');
  let longitude = $state('');
  let s2CellId = $state('');
  let isProcessing = $state(false);
  let error = $state<string | null>(null);
  
  // Base32 alphabet (excluding similar looking characters)
  const BASE32_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  
  // Function to convert number to base32
  function toBase32(num: number, length: number): string {
    let result = '';
    let n = num;
    
    while (n > 0 && result.length < length) {
      result = BASE32_ALPHABET[n % 32] + result;
      n = Math.floor(n / 32);
    }
    
    // Pad with leading zeros if needed
    while (result.length < length) {
      result = BASE32_ALPHABET[0] + result;
    }
    
    return result;
  }
  
  // Function to calculate S2 cell ID
  function calculateS2CellId(lat: number, lng: number, level: number): string {
    // Convert to radians
    const latRad = (lat * Math.PI) / 180;
    const lngRad = (lng * Math.PI) / 180;
    
    // Calculate face (0-5)
    const face = Math.floor((lngRad + Math.PI) / (Math.PI / 2));
    
    // Calculate u and v coordinates
    const u = Math.tan(latRad);
    const v = Math.tan(lngRad - (face * Math.PI / 2));
    
    // Scale to 0-1 range
    const uScaled = (u + 1) / 2;
    const vScaled = (v + 1) / 2;
    
    // Calculate cell coordinates at the specified level
    const cellSize = Math.pow(2, -level);
    const uCell = Math.floor(uScaled / cellSize);
    const vCell = Math.floor(vScaled / cellSize);
    
    // Combine components into a single number
    // Format: face (3 bits) | u (level bits) | v (level bits)
    const combined = (face << (2 * level)) | (uCell << level) | vCell;
    
    // Convert to base32 and take first 6 characters
    const base32Prefix = toBase32(combined, 6);
    
    return base32Prefix;
  }
  
  // Function to get current location
  async function getCurrentLocation() {
    if (!navigator.geolocation) {
      error = "Geolocation wordt niet ondersteund door deze browser.";
      return;
    }
    
    isProcessing = true;
    error = null;
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      
      latitude = position.coords.latitude.toString();
      longitude = position.coords.longitude.toString();
      handleCoordinates();
    } catch (err) {
      error = "Kon locatie niet ophalen. Controleer of locatietoegang is ingeschakeld.";
    } finally {
      isProcessing = false;
    }
  }
  
  // Function to handle coordinate changes
  function handleCoordinates() {
    try {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      
      if (isNaN(lat) || isNaN(lng)) {
        error = "Voer geldige coördinaten in";
        return;
      }
      
      if (lat < -90 || lat > 90) {
        error = "Latitude moet tussen -90 en 90 liggen";
        return;
      }
      
      if (lng < -180 || lng > 180) {
        error = "Longitude moet tussen -180 en 180 liggen";
        return;
      }
      
      // Get S2 cell ID at level 20 (approximately 0.0001km²)
      const cellId = calculateS2CellId(lat, lng, 20);
      s2CellId = cellId;
      error = null;
      
      // Dispatch event with the S2 cell ID
      const event = new CustomEvent('s2CellSelected', {
        detail: { s2CellId: cellId }
      });
      window.dispatchEvent(event);
    } catch (err) {
      error = "Fout bij het berekenen van S2 Cell ID";
      console.error(err);
    }
  }
</script>

<div class="s2-lookup">
  <div class="coordinate-inputs">
    <div class="form-group">
      <label for="latitude">Latitude</label>
      <input
        type="number"
        id="latitude"
        bind:value={latitude}
        placeholder="52.3676"
        step="any"
        on:change={handleCoordinates}
      />
    </div>
    
    <div class="form-group">
      <label for="longitude">Longitude</label>
      <input
        type="number"
        id="longitude"
        bind:value={longitude}
        placeholder="4.9041"
        step="any"
        on:change={handleCoordinates}
      />
    </div>
  </div>
  
  <button
    class="location-button"
    on:click={getCurrentLocation}
    disabled={isProcessing}
  >
    {#if isProcessing}
      <div class="spinner"></div>
      Locatie ophalen...
    {:else}
      Gebruik huidige locatie
    {/if}
  </button>
  
  {#if error}
    <div class="error-message">
      {error}
    </div>
  {/if}
  
  {#if s2CellId}
    <div class="result">
      <label>S2 Cell ID (Level 20):</label>
      <div class="s2-cell-id">{s2CellId}</div>
      <small class="help-text">Dit ID wordt gebruikt om de geografische locatie van de token batch te identificeren (ongeveer 0.0001km²)</small>
    </div>
  {/if}
</div>

<style>
  .s2-lookup {
    background-color: #f9fafb;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
  }
  
  .coordinate-inputs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 16px;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
  }
  
  label {
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 4px;
  }
  
  input {
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
  }
  
  input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
  
  .location-button {
    width: 100%;
    padding: 8px 16px;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
  }
  
  .location-button:hover:not(:disabled) {
    background-color: #2563eb;
  }
  
  .location-button:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
  }
  
  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid #ffffff;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .error-message {
    padding: 8px 12px;
    background-color: #fee2e2;
    color: #dc2626;
    border-radius: 6px;
    font-size: 14px;
    margin-bottom: 16px;
  }
  
  .result {
    background-color: #f0f9ff;
    padding: 12px;
    border-radius: 6px;
    border: 1px solid #bae6fd;
  }
  
  .s2-cell-id {
    font-family: monospace;
    font-size: 16px;
    color: #0369a1;
    margin: 4px 0;
    word-break: break-all;
  }
  
  .help-text {
    font-size: 12px;
    color: #6b7280;
  }
</style> 