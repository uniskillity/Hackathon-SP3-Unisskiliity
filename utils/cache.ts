const CACHE_PREFIX = 'mlms-cache-';

export const setCache = <T>(key: string, data: T): void => {
  try {
    const cacheKey = `${CACHE_PREFIX}${key}`;
    const item = {
      data,
      // timestamp can be used for TTL (Time To Live) logic in the future
      timestamp: new Date().getTime(),
    };
    localStorage.setItem(cacheKey, JSON.stringify(item));
  } catch (error) {
    console.error('Error saving to cache', error);
  }
};

export const getCache = <T>(key: string): T | null => {
  try {
    const cacheKey = `${CACHE_PREFIX}${key}`;
    const itemStr = localStorage.getItem(cacheKey);
    if (!itemStr) {
      return null;
    }
    const item = JSON.parse(itemStr);
    return item.data as T;
  } catch (error) {
    console.error('Error reading from cache', error);
    return null;
  }
};

export const removeCache = (key: string): void => {
    try {
        const cacheKey = `${CACHE_PREFIX}${key}`;
        localStorage.removeItem(cacheKey);
    } catch (error) {
        console.error('Error removing from cache', error);
    }
};
