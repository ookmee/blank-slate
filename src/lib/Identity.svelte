<script lang="ts">
  import { onMount } from "svelte";
  import { IndexedDBService } from "./services/IndexedDBService";
  
  // Import WASM module
  import init from "token-engine";
  
  // State management
  let username = $state("");
  let password = $state("");
  let confirmPassword = $state("");
  let isRegistering = $state(false);
  let isProcessing = $state(false);
  let wasmLoaded = $state(false);
  let errorMessage = $state("");
  let successMessage = $state("");
  let debugMessage = $state("");
  
  // Form validation
  let usernameError = $state("");
  let passwordError = $state("");
  let confirmPasswordError = $state("");
  
  // Initialize WASM module
  async function initWasm() {
    try {
      console.log("Starting Identity Management WASM initialization...");
      
      // Initialize the WASM module
      const wasmInstance = await init();
      console.log("WASM initialized for Identity Management");
      
      // Check all available exports
      console.log("Available WASM exports:", Object.keys(wasmInstance));
      
      wasmLoaded = true;
    } catch (error) {
      console.error("Failed to initialize WASM module:", error);
      errorMessage = "Failed to initialize identity system";
    }
  }
  
  // Validate form inputs
  function validateForm(): boolean {
    let isValid = true;
    
    // Reset errors
    usernameError = "";
    passwordError = "";
    confirmPasswordError = "";
    
    // Username validation
    if (!username) {
      usernameError = "Username is required";
      isValid = false;
    } else if (username.length < 3) {
      usernameError = "Username must be at least 3 characters";
      isValid = false;
    }
    
    // Password validation
    if (!password) {
      passwordError = "Password is required";
      isValid = false;
    } else if (password.length < 8) {
      passwordError = "Password must be at least 8 characters";
      isValid = false;
    }
    
    // Confirm password validation (only for registration)
    if (isRegistering) {
      if (!confirmPassword) {
        confirmPasswordError = "Please confirm your password";
        isValid = false;
      } else if (password !== confirmPassword) {
        confirmPasswordError = "Passwords do not match";
        isValid = false;
      }
    }
    
    return isValid;
  }
  
  // Handle form submission
  async function handleSubmit() {
    if (!validateForm()) return;
    
    isProcessing = true;
    errorMessage = "";
    successMessage = "";
    
    try {
      const dbService = IndexedDBService.getInstance();
      
      if (isRegistering) {
        // Registration logic
        const userExists = await dbService.getUser(username);
        if (userExists) {
          errorMessage = "Username already exists";
          return;
        }
        
        // TODO: Add proper password hashing
        const hashedPassword = await hashPassword(password);
        
        const success = await dbService.createUser({
          username,
          password: hashedPassword,
          createdAt: new Date().toISOString()
        });
        
        if (success) {
          successMessage = "Account created successfully! Please log in.";
          isRegistering = false;
          password = "";
          confirmPassword = "";
        } else {
          errorMessage = "Failed to create account";
        }
      } else {
        // Login logic
        const user = await dbService.getUser(username);
        if (!user) {
          errorMessage = "Invalid username or password";
          return;
        }
        
        // TODO: Add proper password verification
        const isValidPassword = await verifyPassword(password, user.password);
        if (!isValidPassword) {
          errorMessage = "Invalid username or password";
          return;
        }
        
        // Set session
        sessionStorage.setItem("currentUser", username);
        
        // Dispatch login event
        const loginEvent = new CustomEvent("login", {
          detail: { username }
        });
        document.dispatchEvent(loginEvent);
        
        successMessage = "Logged in successfully!";
      }
    } catch (error) {
      console.error("Authentication error:", error);
      errorMessage = "An error occurred during authentication";
    } finally {
      isProcessing = false;
    }
  }
  
  // Temporary password hashing (to be replaced with proper crypto)
  async function hashPassword(password: string): Promise<string> {
    // TODO: Implement proper password hashing
    return btoa(password); // Temporary base64 encoding
  }
  
  // Temporary password verification (to be replaced with proper crypto)
  async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    // TODO: Implement proper password verification
    return btoa(password) === hashedPassword;
  }
  
  // Toggle between login and registration
  function toggleMode() {
    isRegistering = !isRegistering;
    errorMessage = "";
    successMessage = "";
    usernameError = "";
    passwordError = "";
    confirmPasswordError = "";
  }
  
  onMount(() => {
    initWasm();
  });
</script>

<div class="identity-manager">
  <div class="auth-card">
    <h3 class="card-title">{isRegistering ? 'Create Account' : 'Login'}</h3>
    
    {#if !wasmLoaded}
      <div class="loading">
        <div class="spinner"></div>
        <p>Loading identity system...</p>
      </div>
    {:else}
      <form on:submit|preventDefault={handleSubmit} class="auth-form">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            type="text"
            id="username"
            bind:value={username}
            placeholder="Enter your username"
            disabled={isProcessing}
          />
          {#if usernameError}
            <span class="error">{usernameError}</span>
          {/if}
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            bind:value={password}
            placeholder="Enter your password"
            disabled={isProcessing}
          />
          {#if passwordError}
            <span class="error">{passwordError}</span>
          {/if}
        </div>
        
        {#if isRegistering}
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              bind:value={confirmPassword}
              placeholder="Confirm your password"
              disabled={isProcessing}
            />
            {#if confirmPasswordError}
              <span class="error">{confirmPasswordError}</span>
            {/if}
          </div>
        {/if}
        
        {#if errorMessage}
          <div class="error-message">{errorMessage}</div>
        {/if}
        
        {#if successMessage}
          <div class="success-message">{successMessage}</div>
        {/if}
        
        <button type="submit" class="submit-button" disabled={isProcessing}>
          {#if isProcessing}
            <div class="button-spinner"></div>
          {:else}
            {isRegistering ? 'Create Account' : 'Login'}
          {/if}
        </button>
        
        <button type="button" class="toggle-button" on:click={toggleMode} disabled={isProcessing}>
          {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
        </button>
      </form>
    {/if}
  </div>
</div>

<style>
  .identity-manager {
    max-width: 400px;
    margin: 0 auto;
  }
  
  .auth-card {
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
    text-align: center;
  }
  
  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px;
  }
  
  .spinner {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 3px solid #e5e7eb;
    border-top-color: #3b82f6;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  label {
    font-size: 14px;
    font-weight: 500;
    color: #374151;
  }
  
  input {
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    transition: border-color 0.2s;
  }
  
  input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
  
  input:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
  }
  
  .error {
    color: #dc2626;
    font-size: 12px;
    margin-top: 2px;
  }
  
  .error-message {
    background-color: #fee2e2;
    color: #dc2626;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 14px;
  }
  
  .success-message {
    background-color: #dcfce7;
    color: #16a34a;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 14px;
  }
  
  .submit-button {
    background-color: #2563eb;
    color: white;
    padding: 10px 16px;
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
  
  .toggle-button {
    background: none;
    border: none;
    color: #2563eb;
    font-size: 14px;
    cursor: pointer;
    padding: 8px;
    transition: color 0.2s;
  }
  
  .toggle-button:hover:not(:disabled) {
    color: #1d4ed8;
    text-decoration: underline;
  }
  
  .toggle-button:disabled {
    color: #93c5fd;
    cursor: not-allowed;
  }
  
  .button-spinner {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid #ffffff;
    border-top-color: transparent;
    animation: spin 1s linear infinite;
  }
</style>
