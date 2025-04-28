// src/lib/services/IndexedDBService.ts
export class IndexedDBService {
    private dbName: string = 'juiceTokenDB';
    private dbVersion: number = 1;
    private database: IDBDatabase | null = null;
  
    // Singleton patroon
    private static instance: IndexedDBService;
    
    public static getInstance(): IndexedDBService {
      if (!IndexedDBService.instance) {
        IndexedDBService.instance = new IndexedDBService();
      }
      return IndexedDBService.instance;
    }
  
    private constructor() {}
  
    /**
     * Initialiseer de database
     */
    public async initDB(): Promise<boolean> {
      return new Promise((resolve, reject) => {
        // Check of IndexedDB beschikbaar is
        if (!window.indexedDB) {
          console.error('IndexedDB wordt niet ondersteund door deze browser.');
          resolve(false);
          return;
        }
  
        const request = window.indexedDB.open(this.dbName, this.dbVersion);
  
        request.onerror = (event) => {
          console.error('Fout bij openen IndexedDB:', event);
          resolve(false);
        };
  
        request.onsuccess = (event) => {
          this.database = (event.target as IDBOpenDBRequest).result;
          console.log('IndexedDB succesvol geopend');
          resolve(true);
        };
  
        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
  
          // Maak een object store voor tokens als deze nog niet bestaat
          if (!db.objectStoreNames.contains('tokens')) {
            const tokenStore = db.createObjectStore('tokens', { keyPath: 'id', autoIncrement: true });
            
            // Indices voor snellere queries
            tokenStore.createIndex('type', 'type', { unique: false });
            tokenStore.createIndex('amount', 'amount', { unique: false });
            tokenStore.createIndex('timestamp', 'timestamp', { unique: false });
            
            // Hulp index voor transaction id
            tokenStore.createIndex('transactionId', 'transactionId', { unique: false });
          }
  
          // Maak een object store voor saldo
          if (!db.objectStoreNames.contains('balance')) {
            const balanceStore = db.createObjectStore('balance', { keyPath: 'id' });
          }
  
          console.log('Database schema bijgewerkt');
        };
      });
    }
  
    /**
     * Voeg tokens toe aan het saldo
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
          
          // Maak transactie record
          const tokenStore = transaction.objectStore('tokens');
          const newTransaction = {
            type: type,
            amount: amount,
            timestamp: new Date().toISOString(),
            transactionId: `${Date.now()}-${Math.floor(Math.random() * 1000)}`
          };
          
          const addTokenRequest = tokenStore.add(newTransaction);
  
          // Update het saldo
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
              console.log(`Saldo bijgewerkt naar ${newBalance} tokens`);
            };
          };
  
          transaction.oncomplete = () => {
            console.log(`${amount} tokens toegevoegd`);
            resolve(true);
          };
  
          transaction.onerror = (event) => {
            console.error('Fout bij het toevoegen van tokens:', event);
            resolve(false);
          };
        } catch (error) {
          console.error('Fout bij het verwerken van de token transactie:', error);
          resolve(false);
        }
      });
    }
  
    /**
     * Haal het huidige token saldo op
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
              // Geen saldo gevonden, return 0
              resolve({
                amount: 0,
                lastUpdated: new Date().toISOString()
              });
            }
          };
  
          request.onerror = (event) => {
            console.error('Fout bij het ophalen van saldo:', event);
            resolve(null);
          };
        } catch (error) {
          console.error('Fout bij het verwerken van saldo ophalen:', error);
          resolve(null);
        }
      });
    }
  
    /**
     * Haal recente transacties op
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
          
          // Open een cursor in omgekeerde volgorde (nieuwste eerst)
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
            console.error('Fout bij het ophalen van transacties:', event);
            resolve([]);
          };
        } catch (error) {
          console.error('Fout bij het verwerken van transacties ophalen:', error);
          resolve([]);
        }
      });
    }
  }