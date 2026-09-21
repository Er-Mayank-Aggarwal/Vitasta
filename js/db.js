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

  // Default Coupons Seed
  const DEFAULT_COUPONS = [
    { id: 'cpn_1', code: 'ROYAL10', discountType: 'PERCENTAGE', discountValue: 10, minOrder: 15000, maxDiscount: 3000, isActive: true, usageCount: 42, expiry: '2026-12-31' },
    { id: 'cpn_2', code: 'JODHPUR5', discountType: 'PERCENTAGE', discountValue: 5, minOrder: 10000, maxDiscount: 1500, isActive: true, usageCount: 68, expiry: '2026-12-31' },
    { id: 'cpn_3', code: 'ATELIER2000', discountType: 'FLAT', discountValue: 2000, minOrder: 25000, maxDiscount: 2000, isActive: true, usageCount: 19, expiry: '2026-12-31' }
  ];

  // Default Messages Seed
  const DEFAULT_MESSAGES = [
    { id: 'msg_1', name: 'Princess Rohini', phone: '+91 98290 11223', email: 'rohini@udaipurpalace.in', category: 'Banarasi Virasat', message: 'Inquiring for a bespoke crimson red kadhwa georgette for an October royal banquet. Can we add custom Gaji silk blouse embroidery?', status: 'READ', createdAt: '2026-09-15T14:30:00Z' },
    { id: 'msg_2', name: 'Meenakshi Sundaram', phone: '+91 94440 55667', email: 'meenakshi.s@gmail.com', category: 'Riwaayat-e-Chiffon', message: 'Looking for sunset ombre chiffon with heavy cutdana tassels for my daughter’s sangeet in Chennai.', status: 'UNREAD', createdAt: '2026-09-18T09:15:00Z' }
  ];

  // Initialize DB Tables from seed data if not present
  function initDB() {
    const rawData = window.VITASTA_DATA || {};
    
    if (!localStorage.getItem(DB_PREFIX + 'products') && rawData.products) {
      setTable('products', rawData.products);
    }
    if (!localStorage.getItem(DB_PREFIX + 'categories') && rawData.categories) {
      setTable('categories', rawData.categories);
    }
    if (!localStorage.getItem(DB_PREFIX + 'reviews') && rawData.reviews) {
      setTable('reviews', rawData.reviews);
    }
    if (!localStorage.getItem(DB_PREFIX + 'coupons')) {
      setTable('coupons', DEFAULT_COUPONS);
    }
    if (!localStorage.getItem(DB_PREFIX + 'messages')) {
      setTable('messages', DEFAULT_MESSAGES);
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
    review: createEntityModel('reviews'),
    coupon: createEntityModel('coupons'),
    message: createEntityModel('messages'),
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
        reviews: getTable('reviews'),
        coupons: getTable('coupons'),
        messages: getTable('messages'),
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
      setTable('reviews', rawData.reviews || []);
      setTable('coupons', DEFAULT_COUPONS);
      setTable('messages', DEFAULT_MESSAGES);
      setTable('brand', rawData.brand || {});
      if (Cache) Cache.clearAll();
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    initDB();
  });

  window.VitastaDB = VitastaDB;
})();
