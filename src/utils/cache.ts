import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = '@ProductsCache_';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface CachedData<T> {
  data: T;
  timestamp: number;
}

export const cacheData = async <T>(key: string, data: T): Promise<void> => {
  try {
    const cacheItem: CachedData<T> = {
      data,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(
      `${CACHE_PREFIX}${key}`,
      JSON.stringify(cacheItem),
    );
  } catch (error) {
    console.error('Error caching data:', error);
  }
};

export const getCachedData = async <T>(key: string): Promise<T | null> => {
  try {
    const cachedItem = await AsyncStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!cachedItem) return null;

    const {data, timestamp}: CachedData<T> = JSON.parse(cachedItem);
    const isExpired = Date.now() - timestamp > CACHE_EXPIRY;

    return isExpired ? null : data;
  } catch (error) {
    console.error('Error getting cached data:', error);
    return null;
  }
};

export const clearExpiredCache = async (): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
    
    const now = Date.now();
    const itemsToRemove: string[] = [];

    for (const key of cacheKeys) {
      const item = await AsyncStorage.getItem(key);
      if (item) {
        try {
          const {timestamp} = JSON.parse(item) as CachedData<unknown>;
          if (now - timestamp > CACHE_EXPIRY) {
            itemsToRemove.push(key);
          }
        } catch (e) {
          // If we can't parse the item, remove it
          itemsToRemove.push(key);
        }
      }
    }

    if (itemsToRemove.length > 0) {
      await AsyncStorage.multiRemove(itemsToRemove);
    }
  } catch (error) {
    console.error('Error clearing expired cache:', error);
  }
};

// Clear expired cache on app start
clearExpiredCache().catch(console.error);
