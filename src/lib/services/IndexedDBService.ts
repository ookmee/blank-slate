// src/lib/services/IndexedDBService.ts
export class IndexedDBService {
    private dbName: string = 'juiceTokenDB';
    private dbVersion: number = 4;
    private database: IDBDatabase | null = null;
  
    // Singleton pattern
    private static instance: IndexedDBService;
    
    public static getInstance(): IndexedDBService {
      if (!IndexedDBService.instance) {
        IndexedDBService.instance = new IndexedDBService();
      }
      return IndexedDBService.instance;
    }
  
    private constructor() {}
  
    private async deleteDB(): Promise<void> {
      return new Promise((resolve, reject) => {
        const request = indexedDB.deleteDatabase(this.dbName);
        
        request.onerror = () => {
          console.error("Error deleting database");
          reject(request.error);
        };
        
        request.onsuccess = () => {
          console.log("Database deleted successfully");
          this.database = null;
          resolve();
        };
      });
    }
  
    /**
     * Initialize the database with necessary object stores
     */
    private async initDB(): Promise<boolean> {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, this.dbVersion);
  
        request.onerror = () => {
          console.error("Error opening database");
          reject(request.error);
        };
  
        request.onsuccess = () => {
          this.database = request.result;
          resolve(true);
        };
  
        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
  
          // Create tokenBatches store
          if (!db.objectStoreNames.contains('tokenBatches')) {
            const batchStore = db.createObjectStore('tokenBatches', { keyPath: 'id' });
            batchStore.createIndex('prefix', 'prefix', { unique: true });
          }
  
          // Create tokens store
          if (!db.objectStoreNames.contains('tokens')) {
            const tokenStore = db.createObjectStore('tokens', { keyPath: 'id' });
            tokenStore.createIndex('batchId', 'batchId', { unique: false });
            tokenStore.createIndex('denomination', 'denomination', { unique: false });
            tokenStore.createIndex('lastTransaction', 'time.lastTransaction', { unique: false });
            tokenStore.createIndex('currentOwner', 'telomere.currentOwner', { unique: false });
          }
  
          // Create transactions store
          if (!db.objectStoreNames.contains('transactions')) {
            const transactionStore = db.createObjectStore('transactions', { keyPath: 'id', autoIncrement: true });
            transactionStore.createIndex('tokenId', 'tokenId', { unique: false });
            transactionStore.createIndex('timestamp', 'timestamp', { unique: false });
          }
  
          // Create balances store
          if (!db.objectStoreNames.contains('balances')) {
            const balanceStore = db.createObjectStore('balances', { keyPath: 'id' });
            balanceStore.createIndex('userId', 'userId', { unique: true });
          }
        };
      });
    }
  
    /**
     * Reset the database by deleting and reinitializing it
     */
    public async resetDB(): Promise<boolean> {
      try {
        await this.deleteDB();
        return await this.initDB();
      } catch (error) {
        console.error('Error resetting database:', error);
        return false;
      }
    }
  
    /**
     * Add tokens to the balance
     */
    public async addTokens(amount: number, type: string = 'default'): Promise<boolean> {
      return new Promise(async (resolve, reject) => {
        if (!this.database) {
          const initialized = await this.initDB();
          if (!initialized) {
            resolve(false);
            return;
          }
        }
  
        try {
          const transaction = this.database!.transaction(['tokens', 'balance'], 'readwrite');
          
          // Create transaction record
          const tokenStore = transaction.objectStore('tokens');
          const newTransaction = {
            type: type,
            amount: amount,
            timestamp: new Date().toISOString(),
            transactionId: `${Date.now()}-${Math.floor(Math.random() * 1000)}`
          };
          
          const addTokenRequest = tokenStore.add(newTransaction);
  
          // Update the balance
          const balanceStore = transaction.objectStore('balance');
          const getBalanceRequest = balanceStore.get('main');
          
          getBalanceRequest.onsuccess = () => {
            const currentBalanceData = getBalanceRequest.result || { id: 'main', amount: 0 };
            const newBalance = (currentBalanceData.amount || 0) + amount;
            
            const updateBalanceRequest = balanceStore.put({ 
              id: 'main', 
              amount: newBalance,
              lastUpdated: new Date().toISOString()
            });
            
            updateBalanceRequest.onsuccess = () => {
              console.log(`Balance updated to ${newBalance} tokens`);
            };
          };
  
          transaction.oncomplete = () => {
            console.log(`${amount} tokens added`);
            resolve(true);
          };
  
          transaction.onerror = (event) => {
            console.error('Error adding tokens:', event);
            resolve(false);
          };
        } catch (error) {
          console.error('Error processing token transaction:', error);
          resolve(false);
        }
      });
    }
  
    /**
     * Get the current token balance
     */
    public async getBalance(): Promise<{ amount: number, lastUpdated: string } | null> {
      return new Promise(async (resolve, reject) => {
        if (!this.database) {
          const initialized = await this.initDB();
          if (!initialized) {
            resolve(null);
            return;
          }
        }
  
        try {
          const transaction = this.database!.transaction(['balance'], 'readonly');
          const balanceStore = transaction.objectStore('balance');
          const request = balanceStore.get('main');
  
          request.onsuccess = () => {
            if (request.result) {
              resolve({
                amount: request.result.amount || 0,
                lastUpdated: request.result.lastUpdated || new Date().toISOString()
              });
            } else {
              // No balance found, return 0
              resolve({
                amount: 0,
                lastUpdated: new Date().toISOString()
              });
            }
          };
  
          request.onerror = (event) => {
            console.error('Error retrieving balance:', event);
            resolve(null);
          };
        } catch (error) {
          console.error('Error processing balance retrieval:', error);
          resolve(null);
        }
      });
    }
  
    /**
     * Get recent transactions
     */
    public async getRecentTransactions(limit: number = 10): Promise<any[]> {
      return new Promise(async (resolve, reject) => {
        if (!this.database) {
          const initialized = await this.initDB();
          if (!initialized) {
            resolve([]);
            return;
          }
        }
  
        try {
          const transaction = this.database!.transaction(['tokens'], 'readonly');
          const tokenStore = transaction.objectStore('tokens');
          const index = tokenStore.index('timestamp');
          
          // Open a cursor in reverse order (newest first)
          const request = index.openCursor(null, 'prev');
          
          const transactions: any[] = [];
          
          request.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest).result;
            
            if (cursor && transactions.length < limit) {
              transactions.push({
                id: cursor.value.id,
                type: cursor.value.type,
                amount: cursor.value.amount,
                timestamp: cursor.value.timestamp,
                transactionId: cursor.value.transactionId
              });
              cursor.continue();
            } else {
              resolve(transactions);
            }
          };
  
          request.onerror = (event) => {
            console.error('Error retrieving transactions:', event);
            resolve([]);
          };
        } catch (error) {
          console.error('Error processing transaction retrieval:', error);
          resolve([]);
        }
      });
    }

    /**
     * Save a user to the database
     */
    public async saveUser(userData: any): Promise<boolean> {
      return new Promise(async (resolve, reject) => {
        if (!this.database) {
          const initialized = await this.initDB();
          if (!initialized) {
            resolve(false);
            return;
          }
        }

        try {
          // Create a transaction and get the users store
          const transaction = this.database!.transaction(['users'], 'readwrite');
          const userStore = transaction.objectStore('users');
          
          // Add the user data
          const request = userStore.put(userData);
          
          request.onsuccess = () => {
            console.log(`User ${userData.username} saved successfully`);
            resolve(true);
          };
          
          request.onerror = (event) => {
            console.error('Error saving user:', event);
            resolve(false);
          };
        } catch (error) {
          console.error('Error in saveUser transaction:', error);
          resolve(false);
        }
      });
    }

    /**
     * Get a user by username
     */
    public async getUser(username: string): Promise<any | null> {
      return new Promise(async (resolve, reject) => {
        if (!this.database) {
          const initialized = await this.initDB();
          if (!initialized) {
            resolve(null);
            return;
          }
        }

        try {
          const transaction = this.database!.transaction(['users'], 'readonly');
          const userStore = transaction.objectStore('users');
          const request = userStore.get(username);

          request.onsuccess = () => {
            resolve(request.result || null);
          };

          request.onerror = (event) => {
            console.error('Error retrieving user:', event);
            resolve(null);
          };
        } catch (error) {
          console.error('Error processing user retrieval:', error);
          resolve(null);
        }
      });
    }

    /**
     * Create a new user
     */
    public async createUser(userData: {
      username: string;
      password: string;
      createdAt: string;
    }): Promise<boolean> {
      return new Promise(async (resolve, reject) => {
        if (!this.database) {
          const initialized = await this.initDB();
          if (!initialized) {
            resolve(false);
            return;
          }
        }

        try {
          // First check if user exists in a separate transaction
          const user = await this.getUser(userData.username);
          if (user) {
            resolve(false);
            return;
          }

          // Create a new transaction for adding the user
          const transaction = this.database!.transaction(['users'], 'readwrite');
          const userStore = transaction.objectStore('users');

          // Add the new user
          const request = userStore.add(userData);

          request.onsuccess = () => {
            console.log(`User ${userData.username} created successfully`);
            resolve(true);
          };

          request.onerror = (event) => {
            console.error('Error creating user:', event);
            resolve(false);
          };

          // Handle transaction completion
          transaction.oncomplete = () => {
            console.log('User creation transaction completed');
          };

          transaction.onerror = (event) => {
            console.error('Transaction error:', event);
            resolve(false);
          };
        } catch (error) {
          console.error('Error processing user creation:', error);
          resolve(false);
        }
      });
    }

    /**
     * Create a new token batch
     */
    public async createTokenBatch(batchData: {
      s2CellId: string;  // S2 geolocation cell ID
      referenceId: string;  // Unique identifier for the issuance purpose
      amount: number;
      denomination: number;  // Changed to number for 1,2,5,10,20,50,100,200,500
      scenario?: string;
      asset?: string;
      expiry?: string;
    }): Promise<boolean> {
      return new Promise(async (resolve, reject) => {
        if (!this.database) {
          const initialized = await this.initDB();
          if (!initialized) {
            resolve(false);
            return;
          }
        }

        try {
          const transaction = this.database!.transaction(['tokenBatches', 'tokens'], 'readwrite');
          const batchStore = transaction.objectStore('tokenBatches');
          const tokenStore = transaction.objectStore('tokens');

          // Create the batch record with S2 cell ID and reference ID
          const batch = {
            id: `${batchData.s2CellId}-${batchData.referenceId}`,
            s2CellId: batchData.s2CellId,
            referenceId: batchData.referenceId,
            createdAt: new Date().toISOString()
          };

          const batchRequest = batchStore.add(batch);

          batchRequest.onsuccess = (event) => {
            // Create individual tokens
            for (let i = 0; i < batchData.amount; i++) {
              const token = {
                id: `${batchData.s2CellId}-${batchData.referenceId}-${batchData.denomination}-${i + 1}`,
                batchId: `${batchData.s2CellId}-${batchData.referenceId}`,
                denomination: batchData.denomination,
                meta: {
                  scenario: batchData.scenario || 'default',
                  asset: batchData.asset || 'default',
                  expiry: batchData.expiry || null
                },
                time: {
                  lastTransaction: new Date().toISOString()
                },
                telomere: {
                  currentOwner: 'system',
                  hashPreviousOwner: null,
                  hashHistory: []
                }
              };
              tokenStore.add(token);
            }
          };

          transaction.oncomplete = () => {
            console.log(`Created token batch of ${batchData.amount} ${batchData.denomination} tokens`);
            resolve(true);
          };

          transaction.onerror = (event) => {
            console.error('Error creating token batch:', event);
            resolve(false);
          };
        } catch (error) {
          console.error('Error processing token batch creation:', error);
          resolve(false);
        }
      });
    }

    /**
     * Get available tokens of a specific denomination
     */
    public async getAvailableTokens(denomination: number): Promise<any[]> {
      if (!this.database) {
        const initialized = await this.initDB();
        if (!initialized) {
          return [];
        }
      }

      return new Promise((resolve, reject) => {
        if (!this.database) {
          reject(new Error("Database not initialized"));
          return;
        }

        const transaction = this.database!.transaction(['tokens'], 'readonly');
        const store = transaction.objectStore('tokens');
        const index = store.index('denomination');
        const request = index.getAll(denomination);

        request.onsuccess = () => {
          const tokens = request.result;
          resolve(tokens);
        };

        request.onerror = () => {
          console.error("Error processing token retrieval:", request.error);
          reject(request.error);
        };
      });
    }
  }
