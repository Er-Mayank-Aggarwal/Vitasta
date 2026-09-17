/**
 * Vitasta Luxury Caching Service (L1 Memory + L2 Storage Cache)
 * Inspired by Thar Delight high-performance caching patterns
 * Jodhpur, Rajasthan
 */

(function () {
  // L1 In-Memory Cache Store (Fastest, nanosecond lookups)
  const memoryCache = new Map();

  // Metrics
  const metrics = {
    hits: 0,
    misses: 0,
    sets: 0,
    evictions: 0
  };

  const DEFAULT_TTL_MS = 1000 * 60 * 30; // 30 minutes default TTL

  const VitastaCache = {
    /**
     * Get item from Cache (checks L1 memory, falls back to L2 localStorage)
     */
    get(key) {
      const now = Date.now();

      // Check L1 Memory Cache
      if (memoryCache.has(key)) {
        const entry = memoryCache.get(key);
        if (entry.expiresAt > now) {
          metrics.hits++;
          return entry.value;
        } else {
          memoryCache.delete(key);
          metrics.evictions++;
        }
      }

      // Check L2 Persistent Storage Cache
      try {
        const storedStr = localStorage.getItem('vitasta_cache_' + key);
        if (storedStr) {
          const entry = JSON.parse(storedStr);
          if (entry.expiresAt > now) {
            // Promote to L1
            memoryCache.set(key, entry);
            metrics.hits++;
            return entry.value;
          } else {
            localStorage.removeItem('vitasta_cache_' + key);
            metrics.evictions++;
          }
        }
      } catch (e) {
        console.warn('L2 cache read error:', e);
      }

      metrics.misses++;
      return null;
    },

    /**
     * Set item in Cache (L1 and L2) with optional TTL
     */
    set(key, value, ttlMs = DEFAULT_TTL_MS) {
      const entry = {
        value,
        createdAt: Date.now(),
        expiresAt: Date.now() + ttlMs
      };

      // Set L1
      memoryCache.set(key, entry);

      // Set L2
      try {
        localStorage.setItem('vitasta_cache_' + key, JSON.stringify(entry));
      } catch (e) {
        console.warn('L2 cache write error:', e);
      }

      metrics.sets++;
      return value;
    },

    /**
     * Invalidate specific key
     */
    invalidate(key) {
      memoryCache.delete(key);
      try {
        localStorage.removeItem('vitasta_cache_' + key);
      } catch (e) {}
    },

    /**
     * Invalidate all keys matching prefix
     */
    invalidatePrefix(prefix) {
      for (const k of memoryCache.keys()) {
        if (k.startsWith(prefix)) memoryCache.delete(k);
      }
      try {
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const k = localStorage.key(i);
          if (k && k.startsWith('vitasta_cache_' + prefix)) {
            localStorage.removeItem(k);
          }
        }
      } catch (e) {}
    },

    /**
     * Clear all cached data
     */
    clearAll() {
      memoryCache.clear();
      try {
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const k = localStorage.key(i);
          if (k && k.startsWith('vitasta_cache_')) {
            localStorage.removeItem(k);
          }
        }
      } catch (e) {}
      metrics.hits = 0;
      metrics.misses = 0;
    },

    /**
     * Wrap an async or sync function with caching (Stale-While-Revalidate pattern)
     */
    async cachedQuery(key, fetcher, ttlMs = DEFAULT_TTL_MS) {
      const cached = this.get(key);
      if (cached !== null) {
        return cached;
      }
      const fresh = await fetcher();
      this.set(key, fresh, ttlMs);
      return fresh;
    },

    /**
     * Get live telemetry
     */
    getMetrics() {
      const total = metrics.hits + metrics.misses;
      const hitRate = total > 0 ? ((metrics.hits / total) * 100).toFixed(1) : '100.0';
      return {
        ...metrics,
        memoryEntries: memoryCache.size,
        hitRate: hitRate + '%'
      };
    }
  };

  window.VitastaCache = VitastaCache;
})();
