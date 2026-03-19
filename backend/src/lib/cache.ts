const cache = new Map<string, { data: unknown, expiresAt: number }>();

export function getCache<T>(key: string): T | null {
    const entry = cache.get(key);

    if (!entry || entry.expiresAt < Date.now()) {
        cache.delete(key);
        return null;
    }

    return entry.data as T; 
}

export function setCache(key: string, data: unknown, ttlMs = 5000 ) {
    cache.set(key, {data, expiresAt: Date.now() + ttlMs});
}

export function clearCache(){
    cache.clear();
}