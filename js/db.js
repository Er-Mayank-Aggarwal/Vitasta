/**
 * Vitasta Database Client Engine (Prisma-like ORM with Multi-Tier Caching)
 * Inspired by Thar Delight DB Architecture & Query Layer
 * Jodhpur, Rajasthan
 */

(function () {
  const DB_PREFIX = 'vitasta_db_';
  const Cache = window.VitastaCache;

  // Helper to read table
  function getTable(name, fallback = []) {
    try {
      const raw = localStorage.getItem(DB_PREFIX + name);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return fallback;
  }

  // Helper to write table & invalidate caches
  function setTable(name, data) {
    try {
      localStorage.setItem(DB_PREFIX + name, JSON.stringify(data));
      if (Cache) {
        Cache.invalidatePrefix(`db_${name}`);
      }
    } catch (e) {
      console.error(`DB Write Error [${name}]:`, e);
    }
  }

  // Initialize DB Tables from seed data if not present
  function initDB() {
    const rawData = window.VITASTA_DATA || {};
    
    if (!localStorage.getItem(DB_PREFIX + 'products') && rawData.products) {
      setTable('products', rawData.products);
    }
    if (!localStorage.getItem(DB_PREFIX + 'categories') && rawData.categories) {
      setTable('categories', rawData.categories);
    }
    if (!localStorage.getItem(DB_PREFIX + 'brand') && rawData.brand) {
      setTable('brand', rawData.brand);
    }
  }

  // Generic Entity Query Builder
  function createEntityModel(tableName) {
    return {
      async findMany(options = {}) {
        const cacheKey = `db_${tableName}_findMany_${JSON.stringify(options)}`;
        
        if (Cache) {
          const cached = Cache.get(cacheKey);
          if (cached) return cached;
        }

        let items = getTable(tableName, []);

        // Filter: where
        if (options.where) {
          items = items.filter(item => {
            for (const [key, val] of Object.entries(options.where)) {
              if (typeof val === 'object' && val !== null) {
                if (val.in && Array.isArray(val.in) && !val.in.includes(item[key])) return false;
                if (val.contains && typeof item[key] === 'string' && !item[key].toLowerCase().includes(val.contains.toLowerCase())) return false;
              } else if (item[key] !== val) {
                return false;
              }
            }
            return true;
          });
        }

        // OrderBy
        if (options.orderBy) {
          const [field, direction] = Object.entries(options.orderBy)[0];
          const dir = (direction || 'asc').toLowerCase();
          items.sort((a, b) => {
            if (a[field] < b[field]) return dir === 'asc' ? -1 : 1;
            if (a[field] > b[field]) return dir === 'asc' ? 1 : -1;
            return 0;
          });
        }

        // Pagination: take & skip
        if (options.skip) {
          items = items.slice(options.skip);
        }
        if (options.take) {
          items = items.slice(0, options.take);
        }

        if (Cache) {
          Cache.set(cacheKey, items, 1000 * 60 * 15);
        }

        return items;
      },

      async findUnique(options = {}) {
        const cacheKey = `db_${tableName}_findUnique_${JSON.stringify(options)}`;
        if (Cache) {
          const cached = Cache.get(cacheKey);
          if (cached) return cached;
        }

        const items = getTable(tableName, []);
        let found = null;
        if (options.where) {
          found = items.find(item => {
            for (const [key, val] of Object.entries(options.where)) {
              if (item[key] !== val) return false;
            }
            return true;
          }) || null;
        }

        if (Cache && found) {
          Cache.set(cacheKey, found, 1000 * 60 * 15);
        }

        return found;
      },

      async create(data) {
        const items = getTable(tableName, []);
        const newItem = {
          id: data.id || (typeof items[0]?.id === 'number' ? Date.now() : 'rec_' + Date.now()),
          ...data,
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        items.unshift(newItem);
        setTable(tableName, items);
        return newItem;
      },

      async update(options = {}) {
        const items = getTable(tableName, []);
        let updated = null;
        const index = items.findIndex(item => {
          for (const [key, val] of Object.entries(options.where || {})) {
            if (item[key] !== val) return false;
          }
          return true;
        });

        if (index > -1) {
          items[index] = {
            ...items[index],
            ...options.data,
            updatedAt: new Date().toISOString()
          };
          updated = items[index];
          setTable(tableName, items);
        }

        return updated;
      },

      async delete(options = {}) {
        let items = getTable(tableName, []);
        const index = items.findIndex(item => {
          for (const [key, val] of Object.entries(options.where || {})) {
            if (item[key] !== val) return false;
          }
          return true;
        });

        let deleted = null;
        if (index > -1) {
          deleted = items.splice(index, 1)[0];
          setTable(tableName, items);
        }
        return deleted;
      },

      async count(options = {}) {
        const items = await this.findMany(options);
        return items.length;
      }
    };
  }

  // Database Client Instance
  const VitastaDB = {
    init: initDB,
    product: createEntityModel('products'),
    category: createEntityModel('categories'),
    order: createEntityModel('orders'),
    user: createEntityModel('users'),
    address: createEntityModel('addresses'),
    brand: createEntityModel('brand'),

    /**
     * Backup whole DB snapshot
     */
    exportBackup() {
      return {
        timestamp: new Date().toISOString(),
        products: getTable('products'),
        categories: getTable('categories'),
        orders: getTable('orders'),
        users: getTable('users'),
        addresses: getTable('addresses'),
        brand: getTable('brand')
      };
    },

    /**
     * Reset to original chat-extracted data
     */
    resetToFactory() {
      const rawData = window.VITASTA_DATA || {};
      setTable('products', rawData.products || []);
      setTable('categories', rawData.categories || []);
      setTable('brand', rawData.brand || {});
      if (Cache) Cache.clearAll();
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    initDB();
  });

  window.VitastaDB = VitastaDB;
})();
