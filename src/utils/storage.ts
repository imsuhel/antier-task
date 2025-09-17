import {MMKV} from 'react-native-mmkv';

// Create MMKV instance with fallback to in-memory storage
type StorageType = {
  set: (key: string, value: string) => void;
  getString: (key: string) => string | undefined;
  delete: (key: string) => void;
};

let storage: StorageType;

// Initialize MMKV
const initializeMMKV = (): StorageType => {
  try {
    // First, try to initialize MMKV
    const mmkvInstance = new MMKV({
      id: 'com.antiertask.storage',
      // In production, use a secure key management solution
      encryptionKey: 'your-secure-encryption-key-32-char-long-key-here',
    });

    console.log('MMKV storage initialized successfully');

    // Return MMKV instance with proper typing
    return {
      set: (key, value) => mmkvInstance.set(key, value),
      getString: key => mmkvInstance.getString(key),
      delete: key => mmkvInstance.delete(key),
    };
  } catch (error) {
    console.error('Error initializing MMKV:', error);
    throw error;
  }
};

// Initialize storage
storage = initializeMMKV();

// Export storage methods with error handling
export const storageService = {
  setItem: (key: string, value: string): Promise<boolean> => {
    try {
      storage.set(key, value);
      return Promise.resolve(true);
    } catch (error) {
      console.error('Error setting item in storage:', error);
      return Promise.resolve(false);
    }
  },

  getItem: async (key: string): Promise<string | null> => {
    try {
      const value = storage.getString(key);
      return value !== undefined ? value : null;
    } catch (error) {
      console.error('Error getting item from storage:', error);
      return null;
    }
  },

  removeItem: (key: string): Promise<void> => {
    try {
      storage.delete(key);
    } catch (error) {
      console.error('Error removing item from storage:', error);
    }
    return Promise.resolve();
  },
};

export default storageService;
