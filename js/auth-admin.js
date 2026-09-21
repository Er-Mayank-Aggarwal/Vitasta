/**
 * Vitasta by Smita Saraswat — Authentication, User Account & Royal Admin Panel System
 * Inspired by Thar Delight UI & Account Architecture
 * Jodhpur, Rajasthan
 */

(function () {
  // ==========================================
  // INITIAL SEED DATA & STORAGE INITIALIZATION
  // ==========================================
  
  const DEFAULT_USERS = [
    {
      id: 'usr_admin_01',
      name: 'Smita Saraswat',
      email: 'admin@vitasta.com',
      password: 'password123',
      phone: '+91 88240 17443',
      role: 'ADMIN',
      avatar: 'https://res.cloudinary.com/sjl1rfvu/image/upload/v1789675005/vitasta/brand/vitasta_logo_banner.jpg',
      createdAt: '2026-01-10T10:30:00Z',
      membershipTier: 'Founder & Head Designer'
    },
    {
      id: 'usr_client_01',
      name: 'Maharani Gayatri Devi',
      email: 'client@vitasta.com',
      password: 'password123',
      phone: '+91 98765 43210',
      role: 'CLIENT',
      avatar: '',
      createdAt: '2026-02-15T14:20:00Z',
      membershipTier: 'Royal Patron'
    }
  ];

  const DEFAULT_ORDERS = [
    {
      id: 'VIT-ORD-8821',
      userId: 'usr_client_01',
      userName: 'Maharani Gayatri Devi',
      userEmail: 'client@vitasta.com',
      userPhone: '+91 98765 43210',
      createdAt: '2026-09-08T11:45:00Z',
      orderStatus: 'IN_PRODUCTION', // PENDING, CONFIRMED, IN_PRODUCTION, VIDEO_VERIFIED, SHIPPED, DELIVERED, CANCELLED
      statusLabel: 'Artisan Crafting (Adda Handwork)',
      trackingNumber: 'DTDC-JODH-992144',
      preDispatchVideoUrl: 'https://youtube.com/watch?v=sample_vitasta_saree_dispatch',
      estimatedDispatch: '2026-09-25',
      shippingAddress: {
        fullName: 'Maharani Gayatri Devi',
        phone: '+91 98765 43210',
        street: 'Palace Road, Near Umaid Bhawan',
        city: 'Jodhpur',
        state: 'Rajasthan',
        pinCode: '342006'
      },
      items: [
        {
          productId: 1,
          title: 'Royal Rose Pure Chiffon Saree with Intricate Adda Handwork',
          category: 'Riwaayat-e-Chiffon',
          price: 18500,
          priceFormatted: '₹18,500',
          image: 'https://res.cloudinary.com/sjl1rfvu/image/upload/v1789675057/vitasta/products/sunset-ombre-chiffon-cutdana-moti-sequin-saree/xztu76kgnn59tlhoc8zo.jpg',
          fabric: 'Pure Chiffon',
          color: 'Sunset Ombré / Tangerine',
          quantity: 1
        },
        {
          productId: 4,
          title: 'Ivory Off-White Chiffon Gota Patti Pitta Sequin Saree',
          category: 'Riwaayat-e-Chiffon',
          price: 22000,
          priceFormatted: '₹22,000',
          image: 'https://res.cloudinary.com/sjl1rfvu/image/upload/v1789675034/vitasta/products/ivory-off-white-chiffon-gota-patti-pitta-sequin-saree/rpziy0rqmrqhup9objis.jpg',
          fabric: 'Pure Chiffon',
          color: 'Ivory Off-White',
          quantity: 1
        }
      ],
      subtotal: 40500,
      finishingCharges: 0,
      total: 40500,
      timeline: [
        { title: 'Order & Custom Inquiry Booked', time: '08 Sep 2026, 11:45 AM', completed: true },
        { title: 'Pure Fabric Selection & Dyeing', time: '10 Sep 2026, 03:30 PM', completed: true },
        { title: 'Artisan Adda Hand Embroidery (In Progress)', time: '12 Sep 2026, 09:00 AM', completed: true },
        { title: 'Quality Check & Video Recording', time: 'Estimated 22 Sep 2026', completed: false },
        { title: 'Pre-Dispatch Video Verification', time: 'Estimated 23 Sep 2026', completed: false },
        { title: 'Dispatched via Express Courier', time: 'Estimated 25 Sep 2026', completed: false }
      ]
    },
    {
      id: 'VIT-ORD-8794',
      userId: 'usr_client_01',
      userName: 'Maharani Gayatri Devi',
      userEmail: 'client@vitasta.com',
      userPhone: '+91 98765 43210',
      createdAt: '2026-08-20T16:15:00Z',
      orderStatus: 'DELIVERED',
      statusLabel: 'Delivered to Palace Address',
      trackingNumber: 'BLUEDART-8829103',
      preDispatchVideoUrl: 'https://youtube.com/watch?v=sample_vitasta_verified',
      estimatedDispatch: '2026-09-05',
      shippingAddress: {
        fullName: 'Maharani Gayatri Devi',
        phone: '+91 98765 43210',
        street: 'Palace Road, Near Umaid Bhawan',
        city: 'Jodhpur',
        state: 'Rajasthan',
        pinCode: '342006'
      },
      items: [
        {
          productId: 18,
          title: 'Royal Blue Banarasi Khaddi Georgette Handcrafted Saree',
          category: 'Banarasi Virasat',
          price: 25500,
          priceFormatted: '₹25,500',
          image: 'https://res.cloudinary.com/sjl1rfvu/image/upload/v1789675055/vitasta/products/royal-blue-banarasi-khaddi-georgette-lace-cutwork-saree/j3u6zeguqc77gecozmq8.jpg',
          fabric: 'Banarasi Khaddi Georgette',
          color: 'Heritage Royal Blue',
          quantity: 1
        }
      ],
      subtotal: 25500,
      finishingCharges: 0,
      total: 25500,
      timeline: [
        { title: 'Order Booked', time: '20 Aug 2026, 04:15 PM', completed: true },
        { title: 'Adda Crafting & Zari Weaving', time: '22 Aug 2026, 11:00 AM', completed: true },
        { title: 'Pre-Dispatch Video Sent on WhatsApp', time: '02 Sep 2026, 05:20 PM', completed: true },
        { title: 'Dispatched from Jodhpur Atelier', time: '03 Sep 2026, 10:00 AM', completed: true },
        { title: 'Successfully Delivered', time: '06 Sep 2026, 02:40 PM', completed: true }
      ]
    }
  ];

  const DEFAULT_ADDRESSES = [
    {
      id: 'addr_01',
      userId: 'usr_client_01',
      fullName: 'Maharani Gayatri Devi',
      phone: '+91 98765 43210',
      street: 'Palace Road, Near Umaid Bhawan',
      city: 'Jodhpur',
      state: 'Rajasthan',
      pinCode: '342006',
      isDefault: true
    }
  ];

  const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli",
    "Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
  ];

  // ==========================================
  // STORAGE HELPERS
  // ==========================================
  
  function getStored(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function setStored(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.error('Storage write error:', e);
    }
  }

  // Initialize DB tables in localStorage if absent
  if (!localStorage.getItem('vitasta_users')) setStored('vitasta_users', DEFAULT_USERS);
  if (!localStorage.getItem('vitasta_orders')) setStored('vitasta_orders', DEFAULT_ORDERS);
  if (!localStorage.getItem('vitasta_addresses')) setStored('vitasta_addresses', DEFAULT_ADDRESSES);

  // Current session user
  let currentUser = getStored('vitasta_current_user', null);

  // Toast Notification helper
  function notify(msg) {
    const toast = document.getElementById('site-toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
  }

  // ==========================================
  // AUTHENTICATION CONTROLLER
  // ==========================================
  
  const Auth = {
    getCurrentUser() {
      return currentUser;
    },

    isAdmin() {
      return currentUser && currentUser.role === 'ADMIN';
    },

    login(email, password) {
      const users = getStored('vitasta_users', DEFAULT_USERS);
      const cleanEmail = (email || '').trim().toLowerCase();
      const cleanPass = (password || '').trim();

      // Check against stored users or master demo credentials
      let user = users.find(u => u.email.toLowerCase() === cleanEmail && (u.password === cleanPass || (cleanEmail === 'admin@vitasta.com' && (cleanPass === 'vitasta@admin' || cleanPass === 'password123' || cleanPass === 'admin')) || ((cleanEmail === 'client@vitasta.com' || cleanEmail === 'patron@vitasta.luxury') && (cleanPass === 'vitasta@patron' || cleanPass === 'password123' || cleanPass === 'patron'))));

      if (!user && cleanEmail === 'admin@vitasta.com' && (cleanPass === 'vitasta@admin' || cleanPass === 'password123' || cleanPass === 'admin')) {
        user = DEFAULT_USERS[0];
      } else if (!user && (cleanEmail === 'patron@vitasta.luxury' || cleanEmail === 'client@vitasta.com') && (cleanPass === 'vitasta@patron' || cleanPass === 'password123')) {
        user = DEFAULT_USERS[1];
      }

      if (!user) {
        throw new Error('Invalid email or password. Please check your credentials and try again.');
      }
      currentUser = user;
      setStored('vitasta_current_user', user);
      updateHeaderAuthUI();
      notify(`Welcome back, ${user.name}! 👑`);
      return user;
    },

    register(name, email, phone, password) {
      const users = getStored('vitasta_users', DEFAULT_USERS);
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('An account with this email already exists. Please log in.');
      }
      const newUser = {
        id: 'usr_' + Date.now(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password: password,
        role: 'CLIENT',
        avatar: '',
        createdAt: new Date().toISOString(),
        membershipTier: 'Royal Patron'
      };
      users.push(newUser);
      setStored('vitasta_users', users);
      currentUser = newUser;
      setStored('vitasta_current_user', newUser);
      updateHeaderAuthUI();
      notify(`Account created successfully! Welcome to Vitasta.`);
      return newUser;
    },

    logout() {
      currentUser = null;
      localStorage.removeItem('vitasta_current_user');
      updateHeaderAuthUI();
      closeAllModals();
      notify('You have been signed out.');
    },

    quickLogin(type) {
      if (type === 'admin') {
        return this.login('admin@vitasta.com', 'password123');
      } else {
        return this.login('client@vitasta.com', 'password123');
      }
    }
  };

  // Expose on window for easy access
  window.VitastaAuth = Auth;

  // ==========================================
  // HEADER AUTH UI UPDATE
  // ==========================================
  
  function updateHeaderAuthUI() {
    const authBtn = document.getElementById('btn-header-auth');
    if (!authBtn) return;

    if (currentUser) {
      const initials = currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
      const isAdmin = currentUser.role === 'ADMIN';

      authBtn.innerHTML = `
        <div class="user-avatar-pill ${isAdmin ? 'admin-pill' : ''}">
          <span class="user-avatar-initials">${initials}</span>
          <span class="user-nav-name">${currentUser.name.split(' ')[0]}</span>
          ${isAdmin ? '<span class="user-role-tag">Atelier Admin</span>' : ''}
          <svg class="dropdown-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      `;
      authBtn.classList.add('logged-in');
    } else {
      authBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span class="auth-text">Sign In</span>
      `;
      authBtn.classList.remove('logged-in');
    }

    updateMobileDrawerUserUI();
  }

  window.updateMobileDrawerUserUI = function updateMobileDrawerUserUI() {
    const box = document.getElementById('mobile-drawer-user-box');
    if (!box) return;

    if (currentUser) {
      const initials = currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
      const isAdmin = currentUser.role === 'ADMIN';

      box.innerHTML = `
        <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:0.65rem;">
          <div style="width:2.2rem; height:2.2rem; border-radius:50%; background:${isAdmin ? 'var(--color-red-regal)' : 'var(--color-blue-royal)'}; color:white; font-weight:700; font-size:0.85rem; display:flex; align-items:center; justify-content:center; border:2px solid rgba(255,255,255,0.2);">
            ${initials}
          </div>
          <div style="flex:1;">
            <div style="color:white; font-weight:700; font-size:0.9rem;">${currentUser.name}</div>
            <div style="color:rgba(255,255,255,0.6); font-size:0.7rem;">${isAdmin ? '👑 Atelier Administrator' : '👑 ' + (currentUser.membershipTier || 'Royal Patron')}</div>
          </div>
        </div>
        <div style="display:flex; gap:0.5rem;">
          <button type="button" id="btn-mobile-open-portal" style="flex:1; padding:0.45rem 0.65rem; border-radius:0.5rem; background:rgba(255,255,255,0.15); border:1px solid rgba(255,255,255,0.25); color:white; font-size:0.75rem; font-weight:600; cursor:pointer;">
            ${isAdmin ? '👑 Admin Panel' : '👤 My Account'}
          </button>
          <button type="button" id="btn-mobile-logout" style="padding:0.45rem 0.65rem; border-radius:0.5rem; background:rgba(193,39,45,0.25); border:1px solid rgba(193,39,45,0.4); color:#ff8a8e; font-size:0.75rem; font-weight:600; cursor:pointer;">
            Sign Out
          </button>
        </div>
      `;

      document.getElementById('btn-mobile-open-portal')?.addEventListener('click', () => {
        document.getElementById('mobile-nav-backdrop')?.classList.remove('open');
        document.body.style.overflow = '';
        if (isAdmin) {
          openAdminModal('dashboard');
        } else {
          openAccountModal('profile');
        }
      });

      document.getElementById('btn-mobile-logout')?.addEventListener('click', () => {
        document.getElementById('mobile-nav-backdrop')?.classList.remove('open');
        document.body.style.overflow = '';
        Auth.logout();
      });
    } else {
      box.innerHTML = `
        <div style="display:flex; align-items:center; justify-content:space-between; gap:0.5rem;">
          <div>
            <div style="color:white; font-weight:600; font-size:0.85rem;">👑 Royal Atelier Account</div>
            <div style="color:rgba(255,255,255,0.6); font-size:0.7rem;">Orders, Shortlist & Bespoke Status</div>
          </div>
          <button type="button" id="btn-mobile-signin" style="padding:0.45rem 0.85rem; border-radius:999px; background:var(--color-red-regal); border:none; color:white; font-size:0.75rem; font-weight:600; cursor:pointer; box-shadow:0 2px 8px rgba(0,0,0,0.3);">
            Sign In
          </button>
        </div>
      `;

      document.getElementById('btn-mobile-signin')?.addEventListener('click', () => {
        document.getElementById('mobile-nav-backdrop')?.classList.remove('open');
        document.body.style.overflow = '';
        openAuthModal('login');
      });
    }
  };

  // ==========================================
  // MODAL CONTROLLERS & RENDERERS
  // ==========================================
  
  function closeAllModals() {
    document.querySelectorAll('.app-portal-modal').forEach(m => m.classList.remove('open'));
    document.body.style.overflow = '';
  }

  // 1. AUTH MODAL
  function openAuthModal(defaultTab = 'login') {
    closeAllModals();
    const modal = document.getElementById('auth-portal-modal');
    if (!modal) return;
    switchAuthTab(defaultTab);
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function switchAuthTab(tabName) {
    document.querySelectorAll('.auth-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    document.getElementById('auth-login-view').style.display = tabName === 'login' ? 'block' : 'none';
    document.getElementById('auth-register-view').style.display = tabName === 'register' ? 'block' : 'none';
    document.getElementById('auth-forgot-view').style.display = tabName === 'forgot' ? 'block' : 'none';
    const errorBox = document.getElementById('auth-error-msg');
    if (errorBox) errorBox.style.display = 'none';
  }

  // 2. ACCOUNT MODAL
  function openAccountModal(defaultTab = 'profile') {
    if (!currentUser) {
      openAuthModal('login');
      return;
    }
    closeAllModals();
    const modal = document.getElementById('account-portal-modal');
    if (!modal) return;
    switchAccountTab(defaultTab);
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function switchAccountTab(tabName) {
    document.querySelectorAll('.account-nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.accountTab === tabName);
    });
    document.querySelectorAll('.account-tab-content').forEach(view => {
      view.style.display = 'none';
    });
    const activeView = document.getElementById(`account-${tabName}-view`);
    if (activeView) activeView.style.display = 'block';

    if (tabName === 'profile') renderAccountProfile();
    if (tabName === 'orders') renderAccountOrders();
    if (tabName === 'tracking') renderAccountTracking();
    if (tabName === 'addresses') renderAccountAddresses();
    if (tabName === 'shortlist') renderAccountShortlist();
  }

  // 3. ADMIN ATELIER MODAL
  function openAdminModal(defaultTab = 'dashboard') {
    if (!currentUser || currentUser.role !== 'ADMIN') {
      notify('Admin access required. Please sign in as Atelier Admin.');
      openAuthModal('login');
      return;
    }
    closeAllModals();
    const modal = document.getElementById('admin-portal-modal');
    if (!modal) return;
    switchAdminTab(defaultTab);
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function switchAdminTab(tabName) {
    document.querySelectorAll('.admin-nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.adminTab === tabName);
    });
    document.querySelectorAll('.admin-tab-content').forEach(view => {
      view.style.display = 'none';
    });
    const activeView = document.getElementById(`admin-${tabName}-view`);
    if (activeView) activeView.style.display = 'block';

    if (tabName === 'dashboard') renderAdminDashboard();
    if (tabName === 'products') renderAdminProducts();
    if (tabName === 'orders') renderAdminOrders();
    if (tabName === 'reviews') renderAdminReviews();
    if (tabName === 'coupons') renderAdminCoupons();
    if (tabName === 'customers') renderAdminCustomers();
    if (tabName === 'messages') renderAdminMessages();
    if (tabName === 'settings') renderAdminSettings();
  }

  // ==========================================
  // ACCOUNT TAB RENDERERS
  // ==========================================
  
  function renderAccountProfile() {
    const container = document.getElementById('account-profile-view');
    if (!container || !currentUser) return;

    container.innerHTML = `
      <div class="account-card-header">
        <div>
          <h3 class="account-card-title">Royal Profile & Atelier Account</h3>
          <p class="account-card-subtitle">Manage your personal information and royal bespoke preferences</p>
        </div>
        <span class="membership-badge">${currentUser.membershipTier || 'Royal Patron'}</span>
      </div>

      <form id="form-update-profile" class="account-form-grid">
        <div class="form-group">
          <label class="form-label">Full Name</label>
          <input type="text" class="form-input" id="profile-name" value="${currentUser.name}" required>
        </div>
        <div class="form-group">
          <label class="form-label">Email Address (Account ID)</label>
          <input type="email" class="form-input" id="profile-email" value="${currentUser.email}" readonly style="background: var(--color-sand); cursor: not-allowed;">
        </div>
        <div class="form-group">
          <label class="form-label">WhatsApp / Contact Phone</label>
          <input type="tel" class="form-input" id="profile-phone" value="${currentUser.phone || ''}" placeholder="+91 98765 43210">
        </div>
        <div class="form-group">
          <label class="form-label">Account Role</label>
          <input type="text" class="form-input" value="${currentUser.role === 'ADMIN' ? '👑 Atelier Head / Admin' : '👤 Royal Client'}" readonly style="background: var(--color-sand);">
        </div>
        <div class="form-action-full">
          <button type="submit" class="btn-primary-red" style="border:none; cursor:pointer;">
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>

      <div class="account-security-section">
        <h4 class="security-heading">Account Security</h4>
        <p class="security-text">Need to change your password or update your royal address?</p>
        <button class="btn-outline-royal" id="btn-show-password-change">Change Password</button>
      </div>
    `;

    document.getElementById('form-update-profile')?.addEventListener('submit', (e) => {
      e.preventDefault();
      currentUser.name = document.getElementById('profile-name').value.trim();
      currentUser.phone = document.getElementById('profile-phone').value.trim();
      
      const users = getStored('vitasta_users', DEFAULT_USERS);
      const idx = users.findIndex(u => u.id === currentUser.id);
      if (idx > -1) {
        users[idx] = { ...currentUser };
        setStored('vitasta_users', users);
      }
      setStored('vitasta_current_user', currentUser);
      updateHeaderAuthUI();
      notify('Profile updated successfully! ✨');
    });
  }

  function renderAccountOrders() {
    const container = document.getElementById('account-orders-view');
    if (!container) return;

    const allOrders = getStored('vitasta_orders', DEFAULT_ORDERS);
    const userOrders = allOrders.filter(o => o.userId === currentUser.id || o.userEmail === currentUser.email);

    if (userOrders.length === 0) {
      container.innerHTML = `
        <div class="empty-state-box">
          <div class="empty-state-icon">👑</div>
          <h3 class="empty-state-title">No Custom Orders Yet</h3>
          <p class="empty-state-desc">Explore our royal collections of handcrafted pure chiffon and georgette sarees.</p>
          <a href="#catalog" class="btn-primary-red" onclick="document.getElementById('account-portal-modal').classList.remove('open')">Explore Catalog</a>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="account-card-header">
        <div>
          <h3 class="account-card-title">My Royal Orders & Inquiries (${userOrders.length})</h3>
          <p class="account-card-subtitle">Track your handcrafted creations and pre-dispatch video verifications</p>
        </div>
      </div>

      <div class="orders-list-wrap">
        ${userOrders.map(order => `
          <div class="order-card-panel">
            <div class="order-card-top">
              <div class="order-meta-col">
                <span class="order-meta-label">ORDER ID</span>
                <span class="order-id-code">#${order.id}</span>
              </div>
              <div class="order-meta-col">
                <span class="order-meta-label">BOOKING DATE</span>
                <span class="order-date-text">${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
              <div class="order-meta-col">
                <span class="order-meta-label">TOTAL ESTIMATE</span>
                <span class="order-total-val">₹${order.total.toLocaleString('en-IN')}</span>
              </div>
              <div class="order-meta-col">
                <span class="order-status-badge status-${order.orderStatus.toLowerCase()}">${order.statusLabel || order.orderStatus}</span>
              </div>
              <div class="order-meta-actions">
                <button class="btn-view-invoice" data-order-id="${order.id}">🧾 View Bill</button>
              </div>
            </div>

            <!-- Items -->
            <div class="order-items-strip">
              ${order.items.map(item => `
                <div class="order-item-row">
                  <img src="${item.image}" alt="${item.title}" class="order-item-thumb">
                  <div class="order-item-details">
                    <h5 class="order-item-name">${item.title}</h5>
                    <p class="order-item-fabric">${item.fabric} · ${item.color} · Qty: ${item.quantity}</p>
                    <span class="order-item-price">${item.priceFormatted}</span>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Timeline & Verification -->
            <div class="order-timeline-footer">
              <div class="timeline-header-row">
                <span class="timeline-heading">🪡 Handcrafting & Dispatch Tracking</span>
                ${order.trackingNumber ? `<span class="tracking-chip">Tracking: <strong>${order.trackingNumber}</strong></span>` : ''}
              </div>

              <div class="timeline-steps-flow">
                ${(order.timeline || []).map((step, idx) => `
                  <div class="timeline-step-point ${step.completed ? 'completed' : 'pending'}">
                    <div class="step-dot">${step.completed ? '✓' : idx + 1}</div>
                    <div class="step-info">
                      <span class="step-title">${step.title}</span>
                      <span class="step-time">${step.time}</span>
                    </div>
                  </div>
                `).join('')}
              </div>

              ${order.preDispatchVideoUrl ? `
                <div class="pre-dispatch-video-alert">
                  <div class="video-alert-icon">📹</div>
                  <div class="video-alert-content">
                    <strong>Pre-Dispatch Video Available:</strong>
                    <span>Your saree's final quality check video has been prepared by our Jodhpur Atelier.</span>
                  </div>
                  <a href="${order.preDispatchVideoUrl}" target="_blank" rel="noopener" class="btn-watch-video">Watch Video</a>
                </div>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Attach invoice buttons
    container.querySelectorAll('.btn-view-invoice').forEach(btn => {
      btn.addEventListener('click', () => {
        const orderId = btn.dataset.orderId;
        const order = allOrders.find(o => o.id === orderId);
        if (order) openInvoiceModal(order);
      });
    });
  }

  function renderAccountAddresses() {
    const container = document.getElementById('account-addresses-view');
    if (!container) return;

    const addresses = getStored('vitasta_addresses', DEFAULT_ADDRESSES).filter(a => a.userId === currentUser.id);

    container.innerHTML = `
      <div class="account-card-header">
        <div>
          <h3 class="account-card-title">Saved Shipping Addresses</h3>
          <p class="account-card-subtitle">Manage delivery addresses for royal courier dispatches</p>
        </div>
        <button class="btn-primary-red" id="btn-add-address-modal" style="border:none; cursor:pointer; font-size:0.78rem; padding: 0.5rem 1.25rem;">+ Add New Address</button>
      </div>

      <div class="addresses-grid">
        ${addresses.map(addr => `
          <div class="address-card-box ${addr.isDefault ? 'default-address' : ''}">
            ${addr.isDefault ? '<span class="default-chip">Default Address</span>' : ''}
            <h4 class="address-name">${addr.fullName}</h4>
            <p class="address-text">${addr.street}</p>
            <p class="address-text">${addr.city}, ${addr.state} – ${addr.pinCode}</p>
            <p class="address-phone">📞 ${addr.phone}</p>
            <div class="address-card-actions">
              ${!addr.isDefault ? `<button class="btn-set-default" data-addr-id="${addr.id}">Set as Default</button>` : ''}
              <button class="btn-delete-addr" data-addr-id="${addr.id}">Delete</button>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Add Address Sub-Form (Collapsible) -->
      <div id="new-address-form-wrap" style="display:none; margin-top:2rem; padding:1.5rem; background:var(--color-cream); border-radius:1rem; border:1px solid var(--color-sand);">
        <h4 style="font-family:var(--font-royal); color:var(--color-blue-royal); margin-bottom:1rem;">Add Delivery Address</h4>
        <form id="form-save-address" class="account-form-grid">
          <div class="form-group">
            <label class="form-label">Full Recipient Name</label>
            <input type="text" class="form-input" id="addr-name" required>
          </div>
          <div class="form-group">
            <label class="form-label">Contact Phone</label>
            <input type="tel" class="form-input" id="addr-phone" required>
          </div>
          <div class="form-group" style="grid-column: 1 / -1;">
            <label class="form-label">Street Address & Landmark</label>
            <input type="text" class="form-input" id="addr-street" required>
          </div>
          <div class="form-group">
            <label class="form-label">City</label>
            <input type="text" class="form-input" id="addr-city" required>
          </div>
          <div class="form-group">
            <label class="form-label">State</label>
            <select class="form-input" id="addr-state" required>
              ${INDIAN_STATES.map(st => `<option value="${st}" ${st === 'Rajasthan' ? 'selected' : ''}>${st}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">PIN Code</label>
            <input type="text" class="form-input" id="addr-pin" required>
          </div>
          <div class="form-action-full" style="display:flex; gap:1rem;">
            <button type="submit" class="btn-primary-red" style="border:none; cursor:pointer;">Save Address</button>
            <button type="button" class="btn-outline-royal" id="btn-cancel-address">Cancel</button>
          </div>
        </form>
      </div>
    `;

    document.getElementById('btn-add-address-modal')?.addEventListener('click', () => {
      document.getElementById('new-address-form-wrap').style.display = 'block';
    });
    document.getElementById('btn-cancel-address')?.addEventListener('click', () => {
      document.getElementById('new-address-form-wrap').style.display = 'none';
    });

    document.getElementById('form-save-address')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const allAddrs = getStored('vitasta_addresses', DEFAULT_ADDRESSES);
      const newAddr = {
        id: 'addr_' + Date.now(),
        userId: currentUser.id,
        fullName: document.getElementById('addr-name').value.trim(),
        phone: document.getElementById('addr-phone').value.trim(),
        street: document.getElementById('addr-street').value.trim(),
        city: document.getElementById('addr-city').value.trim(),
        state: document.getElementById('addr-state').value,
        pinCode: document.getElementById('addr-pin').value.trim(),
        isDefault: allAddrs.filter(a => a.userId === currentUser.id).length === 0
      };
      allAddrs.push(newAddr);
      setStored('vitasta_addresses', allAddrs);
      notify('New address added! 📦');
      renderAccountAddresses();
    });

    container.querySelectorAll('.btn-set-default').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.addrId;
        const allAddrs = getStored('vitasta_addresses', DEFAULT_ADDRESSES);
        allAddrs.forEach(a => {
          if (a.userId === currentUser.id) a.isDefault = a.id === id;
        });
        setStored('vitasta_addresses', allAddrs);
        notify('Default delivery address updated.');
        renderAccountAddresses();
      });
    });

    container.querySelectorAll('.btn-delete-addr').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.addrId;
        let allAddrs = getStored('vitasta_addresses', DEFAULT_ADDRESSES);
        allAddrs = allAddrs.filter(a => a.id !== id);
        setStored('vitasta_addresses', allAddrs);
        notify('Address removed.');
        renderAccountAddresses();
      });
    });
  }

  function renderAccountShortlist() {
    const container = document.getElementById('account-shortlist-view');
    if (!container) return;

    const shortlist = getStored('vitasta_shortlist', []);

    if (shortlist.length === 0) {
      container.innerHTML = `
        <div class="empty-state-box">
          <div class="empty-state-icon">👑</div>
          <h3 class="empty-state-title">Your Shortlist is Empty</h3>
          <p class="empty-state-desc">Browse through our handcrafted royal sarees and click the heart icon to save your favorites.</p>
          <a href="#catalog" class="btn-primary-red" onclick="document.getElementById('account-portal-modal').classList.remove('open')">Browse Royal Catalog</a>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="account-card-header">
        <div>
          <h3 class="account-card-title">Saved Royal Sarees (${shortlist.length})</h3>
          <p class="account-card-subtitle">Your curated selection ready for WhatsApp booking</p>
        </div>
      </div>

      <div class="account-shortlist-grid">
        ${shortlist.map(product => `
          <div class="shortlist-card-item">
            <img src="${product.primary_image || (product.images[0] && (product.images[0].cdn_url || product.images[0].asset_path)) || ''}" alt="${product.title}" class="shortlist-img" loading="eager" decoding="async">
            <div class="shortlist-info">
              <span class="shortlist-cat">${product.category_name}</span>
              <h5 class="shortlist-title">${product.title}</h5>
              <span class="shortlist-price">${product.price_formatted}</span>
            </div>
            <a href="https://wa.me/918824017443?text=${encodeURIComponent(`Hello Vitasta, I want to book: ${product.title} (${product.price_formatted})`)}" target="_blank" rel="noopener" class="btn-book-wa-mini">
              Inquire on WhatsApp
            </a>
          </div>
        `).join('')}
      </div>
    `;
  }

  // ==========================================
  // ACCOUNT ORDER TRACKING VIEW (Thar Delight Style)
  // ==========================================
  
  function renderAccountTracking(searchId = '') {
    const container = document.getElementById('account-tracking-view');
    if (!container) return;

    const allOrders = getStored('vitasta_orders', DEFAULT_ORDERS);
    const userOrders = currentUser 
      ? allOrders.filter(o => o.userId === currentUser.id || o.userEmail === currentUser.email)
      : allOrders;

    let targetOrder = null;
    if (searchId) {
      const q = searchId.toLowerCase().trim();
      targetOrder = allOrders.find(o => 
        o.id.toLowerCase() === q ||
        o.id.toLowerCase().replace('vit-ord-', '') === q ||
        (o.userPhone && o.userPhone.replace(/\D/g, '').includes(q.replace(/\D/g, ''))) ||
        (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q))
      );
    } else if (userOrders.length > 0) {
      targetOrder = userOrders[0];
    } else if (allOrders.length > 0) {
      targetOrder = allOrders[0];
    }

    container.innerHTML = `
      <div class="account-card-header">
        <div>
          <h3 class="account-card-title">Royal Handcraft & Order Tracking</h3>
          <p class="account-card-subtitle">Live 6-stage artisan production timeline, Loom QC & pre-dispatch video verification</p>
        </div>
      </div>

      <!-- Search Box -->
      <div class="tracker-search-container">
        <form id="form-track-order-search" class="tracker-search-form">
          <div class="tracker-input-group">
            <span class="tracker-search-icon">🔍</span>
            <input type="text" id="track-search-input" class="tracker-search-input" placeholder="Enter Order ID (e.g. VIT-ORD-8821) or phone number..." value="${targetOrder ? targetOrder.id : ''}">
            <button type="submit" class="btn-primary-red tracker-search-btn" style="border:none; cursor:pointer;">Track Order</button>
          </div>
        </form>
        <div class="tracker-demo-chips">
          <span class="demo-label">Quick Demo Tracking:</span>
          ${allOrders.map(o => `
            <button type="button" class="btn-demo-chip ${targetOrder && targetOrder.id === o.id ? 'active' : ''}" data-order-id="${o.id}">
              #${o.id} (${o.orderStatus})
            </button>
          `).join('')}
        </div>
      </div>

      ${targetOrder ? `
        <div class="tracker-results-card">
          <!-- Order Summary Top Bar -->
          <div class="tracker-summary-header">
            <div class="tracker-meta-item">
              <span class="tracker-meta-label">ORDER ID</span>
              <span class="tracker-meta-value">#${targetOrder.id}</span>
            </div>
            <div class="tracker-meta-item">
              <span class="tracker-meta-label">ROYAL PATRON</span>
              <span class="tracker-meta-value">${targetOrder.userName}</span>
            </div>
            <div class="tracker-meta-item">
              <span class="tracker-meta-label">ESTIMATED DISPATCH</span>
              <span class="tracker-meta-value">${targetOrder.estimatedDispatch ? new Date(targetOrder.estimatedDispatch).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '15–30 Days'}</span>
            </div>
            <div class="tracker-meta-item">
              <span class="tracker-meta-label">CURRENT STAGE</span>
              <span class="order-status-badge status-${targetOrder.orderStatus.toLowerCase()}">${targetOrder.statusLabel || targetOrder.orderStatus}</span>
            </div>
          </div>

          <!-- Pre-Dispatch Video Alert (If Present) -->
          ${targetOrder.preDispatchVideoUrl ? `
            <div class="pre-dispatch-video-alert tracker-video-highlight">
              <div class="video-alert-icon">📹</div>
              <div class="video-alert-content">
                <strong>Pre-Dispatch Video Verification Ready:</strong>
                <span>Our Jodhpur atelier has prepared a detailed quality inspection and drape video for your saree.</span>
              </div>
              <a href="${targetOrder.preDispatchVideoUrl}" target="_blank" rel="noopener" class="btn-watch-video">Watch Video Verification</a>
            </div>
          ` : `
            <div class="pre-dispatch-video-alert" style="background: rgba(11, 59, 96, 0.05); border-color: rgba(11, 59, 96, 0.15);">
              <div class="video-alert-icon">🪡</div>
              <div class="video-alert-content">
                <strong>Atelier Handcrafting In Progress:</strong>
                <span>A personalized pre-dispatch inspection video will be sent to your WhatsApp (${targetOrder.userPhone || '+91 88240 17443'}) prior to courier dispatch.</span>
              </div>
            </div>
          `}

          <!-- 6-Stage Visual Tracker Timeline -->
          <div class="tracker-timeline-section">
            <h4 class="tracker-section-heading">👑 Handcrafting & Atelier Progress (6 Stages)</h4>
            <div class="tracker-stages-flow">
              ${[
                { stage: 1, title: 'Bespoke Order Confirmed', desc: 'Fabric reserved & master artisan assigned', matchStatus: ['PENDING', 'CONFIRMED', 'IN_PRODUCTION', 'VIDEO_VERIFIED', 'SHIPPED', 'DELIVERED'] },
                { stage: 2, title: 'Pure Fabric Selection & Dyeing', desc: 'Pure silk / chiffon drape natural dyeing', matchStatus: ['CONFIRMED', 'IN_PRODUCTION', 'VIDEO_VERIFIED', 'SHIPPED', 'DELIVERED'] },
                { stage: 3, title: 'Artisan Adda Hand Embroidery', desc: 'Aari, Gota Patti, Pitta & Zardozi handwork', matchStatus: ['IN_PRODUCTION', 'VIDEO_VERIFIED', 'SHIPPED', 'DELIVERED'] },
                { stage: 4, title: 'Finishing & Atelier Quality Check', desc: 'Tassel work, fall & hand hem finishing', matchStatus: ['VIDEO_VERIFIED', 'SHIPPED', 'DELIVERED'] },
                { stage: 5, title: 'Pre-Dispatch Video Verification', desc: 'HD video proof shared with royal patron', matchStatus: ['VIDEO_VERIFIED', 'SHIPPED', 'DELIVERED'] },
                { stage: 6, title: 'Insured Express Courier Dispatch', desc: targetOrder.trackingNumber ? `Tracking: ${targetOrder.trackingNumber}` : 'Dispatched via premium express transit', matchStatus: ['SHIPPED', 'DELIVERED'] }
              ].map((step, idx) => {
                const isCompleted = step.matchStatus.includes(targetOrder.orderStatus);
                const isCurrent = targetOrder.orderStatus === step.matchStatus[0] || (idx === 2 && targetOrder.orderStatus === 'IN_PRODUCTION');
                return `
                  <div class="tracker-stage-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}">
                    <div class="stage-step-dot">
                      ${isCompleted ? '✓' : idx + 1}
                    </div>
                    <div class="stage-step-content">
                      <div class="stage-step-title">${step.title}</div>
                      <div class="stage-step-desc">${step.desc}</div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Items Ordered in this Creation -->
          <div class="tracker-items-section">
            <h4 class="tracker-section-heading">👗 Ordered Saree Masterpieces</h4>
            <div class="tracker-items-grid">
              ${targetOrder.items.map(item => `
                <div class="tracker-item-card">
                  <img src="${item.image}" alt="${item.title}" class="tracker-item-thumb">
                  <div class="tracker-item-details">
                    <h5 class="tracker-item-title">${item.title}</h5>
                    <p class="tracker-item-spec">${item.fabric} · ${item.color} · Qty: ${item.quantity}</p>
                    <span class="tracker-item-price">${item.priceFormatted}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Shipping Details & Actions -->
          <div class="tracker-footer-card">
            <div>
              <span class="sub-label">DELIVERY DESTINATION</span>
              <div style="font-weight:600; color:var(--color-blue-royal); margin-top:0.25rem;">${targetOrder.shippingAddress?.fullName || targetOrder.userName}</div>
              <div style="font-size:0.8rem; color:var(--color-text-body);">${targetOrder.shippingAddress ? `${targetOrder.shippingAddress.street}, ${targetOrder.shippingAddress.city}, ${targetOrder.shippingAddress.state} – ${targetOrder.shippingAddress.pinCode}` : 'Palace Address, Jodhpur, Rajasthan'}</div>
              <div style="font-size:0.75rem; color:var(--color-text-muted); margin-top:0.2rem;">Contact: ${targetOrder.userPhone}</div>
            </div>
            <div style="display:flex; flex-direction:column; gap:0.5rem; align-items:flex-end;">
              ${targetOrder.trackingNumber ? `
                <div class="courier-pill-box">
                  <span style="font-size:0.72rem; color:var(--color-text-muted);">COURIER AWB:</span>
                  <strong style="color:var(--color-blue-royal);">${targetOrder.trackingNumber}</strong>
                  <button type="button" class="btn-copy-tracking" data-tracking="${targetOrder.trackingNumber}">📋 Copy</button>
                </div>
              ` : ''}
              <button class="btn-view-invoice" data-order-id="${targetOrder.id}" style="font-size:0.8rem; padding:0.45rem 1rem;">🧾 View GST Invoice</button>
            </div>
          </div>
        </div>
      ` : `
        <div class="empty-state-box">
          <div class="empty-state-icon">🔍</div>
          <h3 class="empty-state-title">No Royal Order Found</h3>
          <p class="empty-state-desc">Please verify your Order ID or contact our Jodhpur Atelier Concierge on WhatsApp with your phone number.</p>
          <a href="https://wa.me/918824017443?text=Hello%20Vitasta,%20I%20need%20help%20tracking%20my%20order." target="_blank" rel="noopener" class="btn-primary-red" style="text-decoration:none;">Chat with Atelier Concierge</a>
        </div>
      `}
    `;

    document.getElementById('form-track-order-search')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = document.getElementById('track-search-input').value.trim();
      renderAccountTracking(q);
    });

    container.querySelectorAll('.btn-demo-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        renderAccountTracking(btn.dataset.orderId);
      });
    });

    container.querySelectorAll('.btn-copy-tracking').forEach(btn => {
      btn.addEventListener('click', () => {
        navigator.clipboard.writeText(btn.dataset.tracking);
        notify('Tracking AWB copied to clipboard! 📋');
      });
    });

    container.querySelectorAll('.btn-view-invoice').forEach(btn => {
      btn.addEventListener('click', () => {
        const orderId = btn.dataset.orderId;
        const order = allOrders.find(o => o.id === orderId);
        if (order) openInvoiceModal(order);
      });
    });
  }

  // ==========================================
  // ROYAL ADMIN ATELIER DASHBOARD RENDERERS
  // ==========================================
  
  function renderAdminDashboard() {
    const container = document.getElementById('admin-dashboard-view');
    if (!container) return;

    const products = window.VITASTA_DATA ? window.VITASTA_DATA.products : [];
    const orders = getStored('vitasta_orders', DEFAULT_ORDERS);
    const users = getStored('vitasta_users', DEFAULT_USERS);
    const reviews = getStored('vitasta_db_reviews', window.VITASTA_DATA?.reviews || []);
    const coupons = getStored('vitasta_db_coupons', [
      { id: 'cpn_1', code: 'ROYAL10', isActive: true },
      { id: 'cpn_2', code: 'JODHPUR5', isActive: true },
      { id: 'cpn_3', code: 'ATELIER2000', isActive: true }
    ]);
    const messages = getStored('vitasta_db_messages', [
      { id: 'msg_1', status: 'READ' },
      { id: 'msg_2', status: 'UNREAD' }
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const activeProduction = orders.filter(o => o.orderStatus === 'IN_PRODUCTION' || o.orderStatus === 'PENDING').length;
    const activeCoupons = coupons.filter(c => c.isActive).length;
    const unreadMessages = messages.filter(m => m.status === 'UNREAD').length;
    const avgRating = reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(2)
      : '4.96';

    container.innerHTML = `
      <div class="admin-stats-strip">
        <div class="admin-stat-card">
          <div class="stat-icon-wrap" style="background: rgba(11,59,96,0.1); color: var(--color-blue-royal);">👑</div>
          <div class="stat-info">
            <span class="stat-number">${products.length}</span>
            <span class="stat-label">Handcrafted Sarees</span>
          </div>
        </div>
        <div class="admin-stat-card">
          <div class="stat-icon-wrap" style="background: rgba(193,39,45,0.1); color: var(--color-red-regal);">🪡</div>
          <div class="stat-info">
            <span class="stat-number">${activeProduction}</span>
            <span class="stat-label">In Adda Production</span>
          </div>
        </div>
        <div class="admin-stat-card">
          <div class="stat-icon-wrap" style="background: rgba(37,211,102,0.1); color: #16a34a);">💰</div>
          <div class="stat-info">
            <span class="stat-number">₹${totalRevenue.toLocaleString('en-IN')}</span>
            <span class="stat-label">Atelier Inquiries Value</span>
          </div>
        </div>
        <div class="admin-stat-card">
          <div class="stat-icon-wrap" style="background: rgba(212,175,55,0.15); color: var(--color-gold);">⭐</div>
          <div class="stat-info">
            <span class="stat-number">${avgRating} (${reviews.length})</span>
            <span class="stat-label">Patron Reviews</span>
          </div>
        </div>
        <div class="admin-stat-card">
          <div class="stat-icon-wrap" style="background: rgba(11,59,96,0.1); color: var(--color-blue-royal);">🏷️</div>
          <div class="stat-info">
            <span class="stat-number">${activeCoupons} Active</span>
            <span class="stat-label">Royal Coupons</span>
          </div>
        </div>
        <div class="admin-stat-card">
          <div class="stat-icon-wrap" style="background: rgba(193,39,45,0.1); color: var(--color-red-regal);">✉️</div>
          <div class="stat-info">
            <span class="stat-number">${messages.length} (${unreadMessages} New)</span>
            <span class="stat-label">Patron Inquiries</span>
          </div>
        </div>
      </div>

      <!-- Quick Actions Bar -->
      <div class="admin-quick-actions-bar">
        <h4 style="font-family:var(--font-royal); color:var(--color-blue-royal); margin-bottom:0.75rem;">Atelier Management Shortcuts</h4>
        <div style="display:flex; flex-wrap:wrap; gap:0.75rem;">
          <button class="btn-primary-red" onclick="window.VitastaAdmin.switchTab('products')" style="border:none; cursor:pointer;">+ Add / Manage Sarees</button>
          <button class="btn-outline-royal" onclick="window.VitastaAdmin.switchTab('orders')">Update Dispatch Pipeline (${orders.length})</button>
          <button class="btn-outline-royal" onclick="window.VitastaAdmin.switchTab('reviews')">Moderate Reviews (${reviews.length})</button>
          <button class="btn-outline-royal" onclick="window.VitastaAdmin.switchTab('coupons')">Royal Coupons (${coupons.length})</button>
          <button class="btn-outline-royal" onclick="window.VitastaAdmin.switchTab('messages')">Inquiries (${unreadMessages} Unread)</button>
          <button class="btn-outline-royal" onclick="window.VitastaAdmin.switchTab('settings')">⚡ Multi-Tier Caching & Policies</button>
        </div>
      </div>

      <!-- Recent Orders Table -->
      <div class="admin-table-card">
        <div class="admin-card-header">
          <h4 class="admin-table-title">Recent Royal Inquiries & Orders</h4>
          <button class="btn-text-link" onclick="window.VitastaAdmin.switchTab('orders')">View All →</button>
        </div>
        <div class="table-responsive">
          <table class="admin-data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Client</th>
                <th>Saree Creations</th>
                <th>Value</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${orders.slice(0, 5).map(o => `
                <tr>
                  <td><strong>#${o.id}</strong></td>
                  <td>
                    <div><strong>${o.userName}</strong></div>
                    <div style="font-size:0.72rem; color:var(--color-text-muted);">${o.userPhone}</div>
                  </td>
                  <td>${o.items.map(i => i.title).join(', ').slice(0, 35)}...</td>
                  <td><strong>₹${o.total.toLocaleString('en-IN')}</strong></td>
                  <td><span class="order-status-badge status-${o.orderStatus.toLowerCase()}">${o.statusLabel || o.orderStatus}</span></td>
                  <td><button class="btn-table-action" onclick="window.VitastaAdmin.switchTab('orders')">Manage</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderAdminProducts() {
    const container = document.getElementById('admin-products-view');
    if (!container) return;

    const data = window.VITASTA_DATA || {};
    const products = data.products || [];

    container.innerHTML = `
      <div class="account-card-header">
        <div>
          <h3 class="account-card-title">Saree Catalog Management (${products.length})</h3>
          <p class="account-card-subtitle">Add, edit, or modify prices and fabric specifications in real-time</p>
        </div>
        <button class="btn-primary-red" id="btn-admin-add-product" style="border:none; cursor:pointer;">+ Add New Royal Saree</button>
      </div>

      <!-- Add / Edit Saree Form Panel -->
      <div id="admin-product-form-wrap" style="display:none; margin-bottom:2rem; padding:1.75rem; background:var(--color-cream); border-radius:1rem; border:1px solid var(--color-sand);">
        <h4 id="admin-product-form-title" style="font-family:var(--font-royal); color:var(--color-blue-royal); margin-bottom:1rem;">Add New Saree to Royal Catalog</h4>
        <form id="form-admin-save-product" class="account-form-grid">
          <input type="hidden" id="prod-edit-id" value="">
          <div class="form-group" style="grid-column: 1 / -1;">
            <label class="form-label">Saree Title</label>
            <input type="text" class="form-input" id="prod-title" placeholder="e.g. Royal Emerald Pure Chiffon Adda Work Saree" required>
          </div>
          <div class="form-group">
            <label class="form-label">Royal Collection / Category</label>
            <select class="form-input" id="prod-category" required>
              <option value="riwaayat-e-chiffon">Riwaayat-e-Chiffon</option>
              <option value="georgette-reet">Georgette Reet</option>
              <option value="silk-noorani">Silk Noorani</option>
              <option value="organza-adaa">Organza Adaa</option>
              <option value="banarasi-virasat">Banarasi Virasat</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Price (INR ₹)</label>
            <input type="number" class="form-input" id="prod-price" placeholder="18500" required>
          </div>
          <div class="form-group">
            <label class="form-label">Saree Fabric</label>
            <input type="text" class="form-input" id="prod-fabric" placeholder="e.g. Pure Chiffon" required>
          </div>
          <div class="form-group">
            <label class="form-label">Adda Craft / Handwork</label>
            <input type="text" class="form-input" id="prod-work" placeholder="e.g. Aari & Gota Patti" required>
          </div>
          <div class="form-group">
            <label class="form-label">Primary Color</label>
            <input type="text" class="form-input" id="prod-color" placeholder="e.g. Royal Ruby Red" required>
          </div>
          <div class="form-group">
            <label class="form-label">Image Asset Path / URL</label>
            <input type="text" class="form-input" id="prod-image" placeholder="https://res.cloudinary.com/... or image URL" required>
          </div>
          <div class="form-group" style="grid-column: 1 / -1;">
            <label class="form-label">Royal Description & Heritage Note</label>
            <textarea class="form-textarea" id="prod-desc" rows="3" placeholder="Artisan hand embroidery narrative..."></textarea>
          </div>
          <div class="form-action-full" style="display:flex; gap:1rem;">
            <button type="submit" class="btn-primary-red" style="border:none; cursor:pointer;">Save to Live Catalog</button>
            <button type="button" class="btn-outline-royal" id="btn-admin-cancel-product">Cancel</button>
          </div>
        </form>
      </div>

      <!-- Products Table -->
      <div class="admin-table-card">
        <div class="table-responsive">
          <table class="admin-data-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title & Collection</th>
                <th>Fabric & Craft</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${products.map(p => `
                <tr>
                  <td>
                    <img src="${p.primary_image || (p.images[0] && (p.images[0].cdn_url || p.images[0].asset_path)) || ''}" alt="${p.title}" class="admin-prod-thumb" loading="eager" decoding="async">
                  </td>
                  <td>
                    <div><strong>${p.title}</strong></div>
                    <div style="font-size:0.72rem; color:var(--color-red-regal);">${p.category_name}</div>
                  </td>
                  <td>
                    <div style="font-size:0.8rem;">${p.specifications.fabric}</div>
                    <div style="font-size:0.72rem; color:var(--color-text-muted);">${p.specifications.work || 'Adda Work'}</div>
                  </td>
                  <td><strong>${p.price_formatted}</strong></td>
                  <td><span class="stock-chip">Made to Order</span></td>
                  <td>
                    <div style="display:flex; gap:0.35rem;">
                      <button class="btn-table-action" onclick="window.VitastaAdmin.editProduct(${p.id})">Edit</button>
                      <button class="btn-table-action-danger" onclick="window.VitastaAdmin.deleteProduct(${p.id})">Delete</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    document.getElementById('btn-admin-add-product')?.addEventListener('click', () => {
      document.getElementById('admin-product-form-wrap').style.display = 'block';
      document.getElementById('admin-product-form-title').textContent = 'Add New Saree to Royal Catalog';
      document.getElementById('form-admin-save-product').reset();
      document.getElementById('prod-edit-id').value = '';
    });

    document.getElementById('btn-admin-cancel-product')?.addEventListener('click', () => {
      document.getElementById('admin-product-form-wrap').style.display = 'none';
    });

    document.getElementById('form-admin-save-product')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const editId = document.getElementById('prod-edit-id').value;
      const title = document.getElementById('prod-title').value.trim();
      const categoryId = document.getElementById('prod-category').value;
      const priceNum = parseInt(document.getElementById('prod-price').value, 10);
      const fabric = document.getElementById('prod-fabric').value.trim();
      const work = document.getElementById('prod-work').value.trim();
      const color = document.getElementById('prod-color').value.trim();
      const imagePath = document.getElementById('prod-image').value.trim();
      const desc = document.getElementById('prod-desc').value.trim();

      const catNameMap = {
        'riwaayat-e-chiffon': 'Riwaayat-e-Chiffon',
        'georgette-reet': 'Georgette Reet',
        'silk-noorani': 'Silk Noorani',
        'organza-adaa': 'Organza Adaa',
        'banarasi-virasat': 'Banarasi Virasat'
      };

      if (editId) {
        // Edit existing
        const pId = parseInt(editId, 10);
        const prod = products.find(p => p.id === pId);
        if (prod) {
          prod.title = title;
          prod.category_id = categoryId;
          prod.category_name = catNameMap[categoryId] || categoryId;
          prod.price = priceNum;
          prod.price_formatted = `₹${priceNum.toLocaleString('en-IN')}`;
          prod.specifications.fabric = fabric;
          prod.specifications.work = work;
          prod.specifications.color = color;
          prod.primary_image = imagePath;
          prod.description = desc;
          notify(`"${title}" updated in royal catalog! ✨`);
        }
      } else {
        // Add new
        const newProduct = {
          id: Date.now(),
          title: title,
          category_id: categoryId,
          category_name: catNameMap[categoryId] || categoryId,
          price: priceNum,
          price_formatted: `₹${priceNum.toLocaleString('en-IN')}`,
          currency: 'INR',
          description: desc,
          primary_image: imagePath,
          images: [{ asset_path: imagePath }],
          specifications: {
            fabric: fabric,
            blouse_fabric: fabric,
            work: work,
            color: color,
            blouse_color: color,
            saree_length: '5.5 Metres',
            blouse_length: '1 Metre',
            material_care: 'Dry Clean Only',
            country_of_origin: 'India'
          }
        };
        products.unshift(newProduct);
        notify(`New saree "${title}" published to live catalog! 👑`);
      }

      document.getElementById('admin-product-form-wrap').style.display = 'none';
      renderAdminProducts();
      // Re-render frontend store catalog
      if (typeof window.renderVitastaCatalog === 'function') {
        window.renderVitastaCatalog();
      }
    });
  }

  function renderAdminOrders() {
    const container = document.getElementById('admin-orders-view');
    if (!container) return;

    const orders = getStored('vitasta_orders', DEFAULT_ORDERS);

    container.innerHTML = `
      <div class="account-card-header">
        <div>
          <h3 class="account-card-title">Dispatch & Artisan Pipeline Management (${orders.length})</h3>
          <p class="account-card-subtitle">Manage customer orders, add video verification links & update tracking</p>
        </div>
      </div>

      <div class="admin-orders-full-list">
        ${orders.map(order => `
          <div class="admin-order-card-box" id="admin-order-box-${order.id}">
            <div class="admin-order-header-row">
              <div>
                <h4 style="font-family:var(--font-royal); color:var(--color-blue-royal);">Order #${order.id}</h4>
                <div style="font-size:0.75rem; color:var(--color-text-muted);">Client: <strong>${order.userName}</strong> (${order.userPhone} | ${order.userEmail})</div>
              </div>
              <div style="display:flex; align-items:center; gap:0.5rem;">
                <select class="status-select-box" data-order-id="${order.id}">
                  <option value="PENDING" ${order.orderStatus === 'PENDING' ? 'selected' : ''}>Pending Consultation</option>
                  <option value="CONFIRMED" ${order.orderStatus === 'CONFIRMED' ? 'selected' : ''}>Confirmed & Booked</option>
                  <option value="IN_PRODUCTION" ${order.orderStatus === 'IN_PRODUCTION' ? 'selected' : ''}>In Adda Production</option>
                  <option value="VIDEO_VERIFIED" ${order.orderStatus === 'VIDEO_VERIFIED' ? 'selected' : ''}>Pre-Dispatch Video Ready</option>
                  <option value="SHIPPED" ${order.orderStatus === 'SHIPPED' ? 'selected' : ''}>Dispatched via Courier</option>
                  <option value="DELIVERED" ${order.orderStatus === 'DELIVERED' ? 'selected' : ''}>Delivered</option>
                  <option value="CANCELLED" ${order.orderStatus === 'CANCELLED' ? 'selected' : ''}>Cancelled</option>
                </select>
              </div>
            </div>

            <div class="admin-order-body-grid">
              <div class="admin-order-items-col">
                <span class="sub-label">Ordered Creations</span>
                ${order.items.map(item => `
                  <div style="display:flex; align-items:center; gap:0.75rem; margin-top:0.4rem;">
                    <img src="${item.image}" alt="${item.title}" style="width:40px; height:40px; border-radius:6px; object-fit:cover;">
                    <div style="font-size:0.8rem;">
                      <div><strong>${item.title}</strong></div>
                      <div style="color:var(--color-text-muted); font-size:0.72rem;">${item.priceFormatted} · Qty: ${item.quantity}</div>
                    </div>
                  </div>
                `).join('')}
              </div>

              <div class="admin-order-delivery-col">
                <span class="sub-label">Dispatch & Verification Controls</span>
                <div style="margin-top:0.5rem; display:flex; flex-direction:column; gap:0.4rem;">
                  <div style="font-size:0.75rem;">
                    <strong>Courier Tracking:</strong>
                    <input type="text" class="form-input-compact" value="${order.trackingNumber || ''}" placeholder="e.g. DTDC-992144" data-track-id="${order.id}">
                  </div>
                  <div style="font-size:0.75rem;">
                    <strong>Pre-Dispatch Video URL:</strong>
                    <input type="text" class="form-input-compact" value="${order.preDispatchVideoUrl || ''}" placeholder="https://..." data-video-id="${order.id}">
                  </div>
                  <button class="btn-save-order-dispatch" data-save-id="${order.id}">Save Dispatch Info</button>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Status change handlers
    container.querySelectorAll('.status-select-box').forEach(select => {
      select.addEventListener('change', () => {
        const oId = select.dataset.orderId;
        const newStatus = select.value;
        const allOrders = getStored('vitasta_orders', DEFAULT_ORDERS);
        const order = allOrders.find(o => o.id === oId);
        if (order) {
          order.orderStatus = newStatus;
          const labelMap = {
            'PENDING': 'Pending Consultation',
            'CONFIRMED': 'Confirmed & Booked',
            'IN_PRODUCTION': 'Artisan Crafting (Adda Handwork)',
            'VIDEO_VERIFIED': 'Pre-Dispatch Video Ready',
            'SHIPPED': 'Dispatched via Courier',
            'DELIVERED': 'Delivered to Address',
            'CANCELLED': 'Cancelled'
          };
          order.statusLabel = labelMap[newStatus] || newStatus;
          setStored('vitasta_orders', allOrders);
          notify(`Order #${oId} status updated to: ${order.statusLabel}`);
        }
      });
    });

    // Save tracking & video info
    container.querySelectorAll('.btn-save-order-dispatch').forEach(btn => {
      btn.addEventListener('click', () => {
        const oId = btn.dataset.saveId;
        const trackInput = container.querySelector(`[data-track-id="${oId}"]`);
        const videoInput = container.querySelector(`[data-video-id="${oId}"]`);
        const allOrders = getStored('vitasta_orders', DEFAULT_ORDERS);
        const order = allOrders.find(o => o.id === oId);
        if (order) {
          order.trackingNumber = trackInput.value.trim();
          order.preDispatchVideoUrl = videoInput.value.trim();
          setStored('vitasta_orders', allOrders);
          notify(`Dispatch & Video details saved for #${oId}! 📹`);
        }
      });
    });
  }

  // ==========================================
  // ROYAL ADMIN REVIEWS & MODERATION (Thar Delight Style)
  // ==========================================

  function renderAdminReviews() {
    const container = document.getElementById('admin-reviews-view');
    if (!container) return;

    const reviews = getStored('vitasta_db_reviews', window.VITASTA_DATA?.reviews || []);
    const avgRating = reviews.length > 0 
      ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(2)
      : '5.00';
    const fiveStarCount = reviews.filter(r => r.rating === 5).length;

    container.innerHTML = `
      <div class="account-card-header">
        <div>
          <h3 class="account-card-title">Customer Reviews & Feedback Moderation (${reviews.length})</h3>
          <p class="account-card-subtitle">Manage patron testimonials, feature reviews on home page, and verify handcraft feedback</p>
        </div>
        <button class="btn-primary-red" id="btn-admin-add-review" style="border:none; cursor:pointer;">+ Add Verified Review</button>
      </div>

      <!-- Reviews Summary Metrics -->
      <div class="admin-stats-strip" style="margin-bottom:1.5rem;">
        <div class="admin-stat-card">
          <div class="stat-icon-wrap" style="background:rgba(212,175,55,0.15); color:var(--color-gold);">⭐</div>
          <div class="stat-info">
            <span class="stat-number">${avgRating} / 5.0</span>
            <span class="stat-label">Average Patron Rating</span>
          </div>
        </div>
        <div class="admin-stat-card">
          <div class="stat-icon-wrap" style="background:rgba(11,59,96,0.1); color:var(--color-blue-royal);">👑</div>
          <div class="stat-info">
            <span class="stat-number">${reviews.length}</span>
            <span class="stat-label">Published Reviews</span>
          </div>
        </div>
        <div class="admin-stat-card">
          <div class="stat-icon-wrap" style="background:rgba(22,163,74,0.1); color:#16a34a);">✨</div>
          <div class="stat-info">
            <span class="stat-number">${fiveStarCount}</span>
            <span class="stat-label">5-Star Testimonials</span>
          </div>
        </div>
      </div>

      <!-- Add Review Form (Collapsible) -->
      <div id="admin-review-form-wrap" style="display:none; margin-bottom:2rem; padding:1.75rem; background:var(--color-cream); border-radius:1rem; border:1px solid var(--color-sand);">
        <h4 style="font-family:var(--font-royal); color:var(--color-blue-royal); margin-bottom:1rem;">Add Verified Royal Patron Review</h4>
        <form id="form-admin-save-review" class="account-form-grid">
          <div class="form-group">
            <label class="form-label">Patron Full Name</label>
            <input type="text" class="form-input" id="adm-rev-name" placeholder="e.g. Maharani Radhika Raje" required>
          </div>
          <div class="form-group">
            <label class="form-label">City, State</label>
            <input type="text" class="form-input" id="adm-rev-loc" placeholder="e.g. Vadodara, Gujarat" required>
          </div>
          <div class="form-group">
            <label class="form-label">Associated Royal Saree / Collection</label>
            <select class="form-input" id="adm-rev-prod">
              ${(window.VITASTA_DATA?.products || []).map(p => `<option value="${p.title}">${p.title} (${p.category_name})</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Star Rating</label>
            <select class="form-input" id="adm-rev-rating">
              <option value="5" selected>★★★★★ (5 Stars - Exceptional)</option>
              <option value="4">★★★★☆ (4 Stars - Very Good)</option>
              <option value="3">★★★☆☆ (3 Stars)</option>
            </select>
          </div>
          <div class="form-group" style="grid-column: 1 / -1;">
            <label class="form-label">Review Headline</label>
            <input type="text" class="form-input" id="adm-rev-headline" placeholder="e.g. Masterpiece Adda Embroidery & Ethereal Drape" required>
          </div>
          <div class="form-group" style="grid-column: 1 / -1;">
            <label class="form-label">Detailed Patron Feedback</label>
            <textarea class="form-textarea" id="adm-rev-comment" rows="3" placeholder="Patron's words regarding the craftsmanship, fabric quality, pre-dispatch video..." required></textarea>
          </div>
          <div class="form-action-full" style="display:flex; gap:1rem;">
            <button type="submit" class="btn-primary-red" style="border:none; cursor:pointer;">Publish Review</button>
            <button type="button" class="btn-outline-royal" id="btn-admin-cancel-review">Cancel</button>
          </div>
        </form>
      </div>

      <!-- Reviews List Cards -->
      <div class="admin-reviews-list-grid">
        ${reviews.map(rev => `
          <div class="admin-review-card-box">
            <div class="admin-review-top-row">
              <div class="admin-reviewer-meta">
                <div class="reviewer-avatar-circle">${rev.author ? rev.author.charAt(0).toUpperCase() : '👑'}</div>
                <div>
                  <h4 class="reviewer-name-text">${rev.author}</h4>
                  <div class="reviewer-loc-text">${rev.location || 'Patron'} · ${rev.date || 'Sep 2026'}</div>
                </div>
              </div>
              <div class="review-stars-badge">
                <span class="stars-gold">${'★'.repeat(rev.rating || 5)}${'☆'.repeat(5 - (rev.rating || 5))}</span>
                <span class="rating-num">${rev.rating || 5}.0</span>
              </div>
            </div>

            <div class="admin-review-product-tag">
              👗 ${rev.product_title || rev.product_category || 'Handcrafted Saree'}
            </div>

            <h5 class="admin-review-title">&ldquo;${rev.title || 'Exceptional Royal Craftsmanship'}&rdquo;</h5>
            <p class="admin-review-comment">${rev.comment}</p>

            <div class="admin-review-actions-bar">
              <span class="verified-badge-chip">✓ Verified Patron</span>
              <div style="display:flex; gap:0.5rem;">
                <button type="button" class="btn-delete-review btn-table-action-danger" data-rev-id="${rev.id}">Delete</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    document.getElementById('btn-admin-add-review')?.addEventListener('click', () => {
      document.getElementById('admin-review-form-wrap').style.display = 'block';
    });
    document.getElementById('btn-admin-cancel-review')?.addEventListener('click', () => {
      document.getElementById('admin-review-form-wrap').style.display = 'none';
    });

    document.getElementById('form-admin-save-review')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const newRev = {
        id: 'rev_' + Date.now(),
        author: document.getElementById('adm-rev-name').value.trim(),
        location: document.getElementById('adm-rev-loc').value.trim(),
        product_title: document.getElementById('adm-rev-prod').value,
        product_category: 'Bespoke Atelier Creation',
        rating: parseInt(document.getElementById('adm-rev-rating').value, 10),
        title: document.getElementById('adm-rev-headline').value.trim(),
        comment: document.getElementById('adm-rev-comment').value.trim(),
        date: new Date().toISOString().split('T')[0],
        verified: true,
        avatar_initial: document.getElementById('adm-rev-name').value.trim().charAt(0).toUpperCase()
      };

      if (window.VitastaDB && window.VitastaDB.review) {
        window.VitastaDB.review.create(newRev);
      } else {
        const stored = getStored('vitasta_db_reviews', window.VITASTA_DATA?.reviews || []);
        stored.unshift(newRev);
        setStored('vitasta_db_reviews', stored);
      }

      notify('New verified patron review published! ⭐');
      renderAdminReviews();
      if (typeof window.renderVitastaCatalog === 'function') {
        window.renderVitastaCatalog();
      }
    });

    container.querySelectorAll('.btn-delete-review').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('Delete this patron review?')) {
          const id = btn.dataset.revId;
          if (window.VitastaDB && window.VitastaDB.review) {
            window.VitastaDB.review.delete({ where: { id: id } });
          }
          let stored = getStored('vitasta_db_reviews', window.VITASTA_DATA?.reviews || []);
          stored = stored.filter(r => r.id !== id);
          setStored('vitasta_db_reviews', stored);
          notify('Review removed.');
          renderAdminReviews();
          if (typeof window.renderVitastaCatalog === 'function') {
            window.renderVitastaCatalog();
          }
        }
      });
    });
  }

  // ==========================================
  // ROYAL ADMIN COUPONS & PROMOS (Thar Delight Style)
  // ==========================================

  function renderAdminCoupons() {
    const container = document.getElementById('admin-coupons-view');
    if (!container) return;

    const coupons = getStored('vitasta_db_coupons', [
      { id: 'cpn_1', code: 'ROYAL10', discountType: 'PERCENTAGE', discountValue: 10, minOrder: 15000, maxDiscount: 3000, isActive: true, usageCount: 42, expiry: '2026-12-31' },
      { id: 'cpn_2', code: 'JODHPUR5', discountType: 'PERCENTAGE', discountValue: 5, minOrder: 10000, maxDiscount: 1500, isActive: true, usageCount: 68, expiry: '2026-12-31' },
      { id: 'cpn_3', code: 'ATELIER2000', discountType: 'FLAT', discountValue: 2000, minOrder: 25000, maxDiscount: 2000, isActive: true, usageCount: 19, expiry: '2026-12-31' }
    ]);

    const activeCount = coupons.filter(c => c.isActive).length;
    const totalRedemptions = coupons.reduce((sum, c) => sum + (c.usageCount || 0), 0);

    container.innerHTML = `
      <div class="account-card-header">
        <div>
          <h3 class="account-card-title">Royal Atelier Coupons & Promo Codes (${coupons.length})</h3>
          <p class="account-card-subtitle">Manage promotional vouchers, festival privileges and WhatsApp booking discounts</p>
        </div>
        <button class="btn-primary-red" id="btn-admin-add-coupon" style="border:none; cursor:pointer;">+ Create Royal Coupon</button>
      </div>

      <!-- Coupon Metrics -->
      <div class="admin-stats-strip" style="margin-bottom:1.5rem;">
        <div class="admin-stat-card">
          <div class="stat-icon-wrap" style="background:rgba(11,59,96,0.1); color:var(--color-blue-royal);">🏷️</div>
          <div class="stat-info">
            <span class="stat-number">${activeCount} Active</span>
            <span class="stat-label">Live Atelier Vouchers</span>
          </div>
        </div>
        <div class="admin-stat-card">
          <div class="stat-icon-wrap" style="background:rgba(22,163,74,0.1); color:#16a34a);">🎁</div>
          <div class="stat-info">
            <span class="stat-number">${totalRedemptions}</span>
            <span class="stat-label">Patron Redemptions</span>
          </div>
        </div>
      </div>

      <!-- Create Coupon Form (Collapsible) -->
      <div id="admin-coupon-form-wrap" style="display:none; margin-bottom:2rem; padding:1.75rem; background:var(--color-cream); border-radius:1rem; border:1px solid var(--color-sand);">
        <h4 style="font-family:var(--font-royal); color:var(--color-blue-royal); margin-bottom:1rem;">Create New Royal Promo Voucher</h4>
        <form id="form-admin-save-coupon" class="account-form-grid">
          <div class="form-group">
            <label class="form-label">Coupon Code (Uppercase)</label>
            <input type="text" class="form-input" id="cpn-code" placeholder="e.g. DIWALI15" required style="text-transform:uppercase; font-weight:700; letter-spacing:1px;">
          </div>
          <div class="form-group">
            <label class="form-label">Discount Type</label>
            <select class="form-input" id="cpn-type" required>
              <option value="PERCENTAGE">Percentage (%) Discount</option>
              <option value="FLAT">Flat INR (₹) Amount Off</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Discount Value</label>
            <input type="number" class="form-input" id="cpn-val" placeholder="e.g. 15 for 15% or 2000 for ₹2000" required>
          </div>
          <div class="form-group">
            <label class="form-label">Minimum Order Requirement (₹)</label>
            <input type="number" class="form-input" id="cpn-min" placeholder="e.g. 15000" value="10000" required>
          </div>
          <div class="form-group">
            <label class="form-label">Maximum Discount Limit (₹)</label>
            <input type="number" class="form-input" id="cpn-max" placeholder="e.g. 3000" value="3000">
          </div>
          <div class="form-group">
            <label class="form-label">Expiry Date</label>
            <input type="date" class="form-input" id="cpn-expiry" value="2026-12-31" required>
          </div>
          <div class="form-action-full" style="display:flex; gap:1rem;">
            <button type="submit" class="btn-primary-red" style="border:none; cursor:pointer;">Save Royal Voucher</button>
            <button type="button" class="btn-outline-royal" id="btn-admin-cancel-coupon">Cancel</button>
          </div>
        </form>
      </div>

      <!-- Coupons Grid Cards -->
      <div class="admin-coupons-grid">
        ${coupons.map(cpn => `
          <div class="admin-coupon-card-box ${cpn.isActive ? 'active-coupon' : 'inactive-coupon'}">
            <div class="coupon-header-row">
              <div class="coupon-code-chip">${cpn.code}</div>
              <span class="coupon-status-badge ${cpn.isActive ? 'status-active' : 'status-inactive'}">
                ${cpn.isActive ? '● Active' : '○ Disabled'}
              </span>
            </div>

            <div class="coupon-discount-text">
              ${cpn.discountType === 'PERCENTAGE' ? `${cpn.discountValue}% OFF` : `₹${cpn.discountValue.toLocaleString('en-IN')} FLAT OFF`}
            </div>

            <div class="coupon-terms-text">
              Min. Order: <strong>₹${(cpn.minOrder || 0).toLocaleString('en-IN')}</strong> · Max Cap: <strong>₹${(cpn.maxDiscount || 0).toLocaleString('en-IN')}</strong>
            </div>

            <div class="coupon-meta-row">
              <span>Expires: ${cpn.expiry || '2026-12-31'}</span>
              <span><strong>${cpn.usageCount || 0}</strong> Patrons Used</span>
            </div>

            <div class="coupon-actions-row">
              <button type="button" class="btn-toggle-coupon btn-table-action" data-cpn-id="${cpn.id}">
                ${cpn.isActive ? 'Pause Code' : 'Activate Code'}
              </button>
              <button type="button" class="btn-delete-coupon btn-table-action-danger" data-cpn-id="${cpn.id}">Delete</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    document.getElementById('btn-admin-add-coupon')?.addEventListener('click', () => {
      document.getElementById('admin-coupon-form-wrap').style.display = 'block';
    });
    document.getElementById('btn-admin-cancel-coupon')?.addEventListener('click', () => {
      document.getElementById('admin-coupon-form-wrap').style.display = 'none';
    });

    document.getElementById('form-admin-save-coupon')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const newCpn = {
        id: 'cpn_' + Date.now(),
        code: document.getElementById('cpn-code').value.trim().toUpperCase(),
        discountType: document.getElementById('cpn-type').value,
        discountValue: parseFloat(document.getElementById('cpn-val').value),
        minOrder: parseFloat(document.getElementById('cpn-min').value) || 0,
        maxDiscount: parseFloat(document.getElementById('cpn-max').value) || 0,
        expiry: document.getElementById('cpn-expiry').value,
        isActive: true,
        usageCount: 0
      };

      if (window.VitastaDB && window.VitastaDB.coupon) {
        window.VitastaDB.coupon.create(newCpn);
      } else {
        const stored = getStored('vitasta_db_coupons', []);
        stored.unshift(newCpn);
        setStored('vitasta_db_coupons', stored);
      }

      notify(`Royal Voucher "${newCpn.code}" is now active! 🏷️`);
      renderAdminCoupons();
    });

    container.querySelectorAll('.btn-toggle-coupon').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.cpnId;
        const stored = getStored('vitasta_db_coupons', []);
        const cpn = stored.find(c => c.id === id);
        if (cpn) {
          cpn.isActive = !cpn.isActive;
          setStored('vitasta_db_coupons', stored);
          if (window.VitastaDB && window.VitastaDB.coupon) {
            window.VitastaDB.coupon.update({ where: { id: id }, data: { isActive: cpn.isActive } });
          }
          notify(`Coupon ${cpn.code} ${cpn.isActive ? 'activated' : 'paused'}.`);
          renderAdminCoupons();
        }
      });
    });

    container.querySelectorAll('.btn-delete-coupon').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('Delete this royal coupon code?')) {
          const id = btn.dataset.cpnId;
          let stored = getStored('vitasta_db_coupons', []);
          stored = stored.filter(c => c.id !== id);
          setStored('vitasta_db_coupons', stored);
          if (window.VitastaDB && window.VitastaDB.coupon) {
            window.VitastaDB.coupon.delete({ where: { id: id } });
          }
          notify('Coupon deleted.');
          renderAdminCoupons();
        }
      });
    });
  }

  // ==========================================
  // ROYAL ADMIN BESPOKE INQUIRIES (Thar Delight Style)
  // ==========================================

  function renderAdminMessages() {
    const container = document.getElementById('admin-messages-view');
    if (!container) return;

    const messages = getStored('vitasta_db_messages', [
      { id: 'msg_1', name: 'Princess Rohini', phone: '+91 98290 11223', email: 'rohini@udaipurpalace.in', category: 'Banarasi Virasat', message: 'Inquiring for a bespoke crimson red kadhwa georgette for an October royal banquet. Can we add custom Gaji silk blouse embroidery?', status: 'READ', createdAt: '2026-09-15T14:30:00Z' },
      { id: 'msg_2', name: 'Meenakshi Sundaram', phone: '+91 94440 55667', email: 'meenakshi.s@gmail.com', category: 'Riwaayat-e-Chiffon', message: 'Looking for sunset ombre chiffon with heavy cutdana tassels for my daughter’s sangeet in Chennai.', status: 'UNREAD', createdAt: '2026-09-18T09:15:00Z' }
    ]);

    const unreadCount = messages.filter(m => m.status === 'UNREAD').length;

    container.innerHTML = `
      <div class="account-card-header">
        <div>
          <h3 class="account-card-title">Patron Inquiries & Bespoke Messages (${messages.length})</h3>
          <p class="account-card-subtitle">Consultation requests, custom color requests, and WhatsApp inquiry log</p>
        </div>
        ${unreadCount > 0 ? `<span class="membership-badge" style="background:var(--color-red-regal);">${unreadCount} Unread Requests</span>` : ''}
      </div>

      <div class="admin-messages-list-grid">
        ${messages.map(msg => `
          <div class="admin-message-card-box ${msg.status === 'UNREAD' ? 'unread-msg' : ''}">
            <div class="admin-msg-header-row">
              <div>
                <div style="display:flex; align-items:center; gap:0.5rem;">
                  <h4 class="msg-sender-name">${msg.name}</h4>
                  <span class="msg-status-tag ${msg.status === 'UNREAD' ? 'tag-unread' : 'tag-resolved'}">${msg.status}</span>
                </div>
                <div class="msg-sender-contact">
                  📞 <strong>${msg.phone || '—'}</strong> ${msg.email ? `· ✉️ ${msg.email}` : ''}
                </div>
              </div>
              <div class="msg-time-text">
                ${new Date(msg.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            <div class="msg-category-chip">
              👑 Interest: <strong>${msg.category || 'General Consultation'}</strong>
            </div>

            <p class="msg-body-text">${msg.message}</p>

            <div class="msg-actions-row">
              <a href="https://wa.me/${(msg.phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${msg.name}, Greetings from Vitasta by Smita Saraswat Atelier. Regarding your bespoke inquiry for ${msg.category}...`)}" target="_blank" rel="noopener" class="btn-primary-red" style="font-size:0.75rem; padding:0.4rem 0.9rem; text-decoration:none;">
                💬 Open WhatsApp Chat
              </a>
              <button type="button" class="btn-resolve-msg btn-table-action" data-msg-id="${msg.id}">
                ${msg.status === 'UNREAD' ? '✓ Mark as Read' : '↺ Mark Unread'}
              </button>
              <button type="button" class="btn-delete-msg btn-table-action-danger" data-msg-id="${msg.id}">Delete</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    container.querySelectorAll('.btn-resolve-msg').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.msgId;
        const stored = getStored('vitasta_db_messages', []);
        const msg = stored.find(m => m.id === id);
        if (msg) {
          msg.status = msg.status === 'UNREAD' ? 'READ' : 'UNREAD';
          setStored('vitasta_db_messages', stored);
          if (window.VitastaDB && window.VitastaDB.message) {
            window.VitastaDB.message.update({ where: { id: id }, data: { status: msg.status } });
          }
          notify(`Inquiry marked as ${msg.status}.`);
          renderAdminMessages();
        }
      });
    });

    container.querySelectorAll('.btn-delete-msg').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('Delete this bespoke inquiry message?')) {
          const id = btn.dataset.msgId;
          let stored = getStored('vitasta_db_messages', []);
          stored = stored.filter(m => m.id !== id);
          setStored('vitasta_db_messages', stored);
          if (window.VitastaDB && window.VitastaDB.message) {
            window.VitastaDB.message.delete({ where: { id: id } });
          }
          notify('Inquiry deleted.');
          renderAdminMessages();
        }
      });
    });
  }

  function renderAdminCustomers() {
    const container = document.getElementById('admin-customers-view');
    if (!container) return;

    const users = getStored('vitasta_users', DEFAULT_USERS);
    const orders = getStored('vitasta_orders', DEFAULT_ORDERS);

    container.innerHTML = `
      <div class="account-card-header">
        <div>
          <h3 class="account-card-title">Royal Clients Directory (${users.length})</h3>
          <p class="account-card-subtitle">Registered patron accounts and booking history</p>
        </div>
      </div>

      <div class="admin-table-card">
        <div class="table-responsive">
          <table class="admin-data-table">
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Email & Phone</th>
                <th>Role & Membership</th>
                <th>Total Orders</th>
                <th>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              ${users.map(u => {
                const userOrders = orders.filter(o => o.userId === u.id || o.userEmail === u.email);
                return `
                  <tr>
                    <td><strong>${u.name}</strong></td>
                    <td>
                      <div>${u.email}</div>
                      <div style="font-size:0.72rem; color:var(--color-text-muted);">${u.phone || '—'}</div>
                    </td>
                    <td><span class="membership-badge">${u.role === 'ADMIN' ? '👑 Atelier Head' : (u.membershipTier || 'Royal Patron')}</span></td>
                    <td><strong>${userOrders.length} orders</strong></td>
                    <td style="font-size:0.78rem;">${new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderAdminSettings() {
    const container = document.getElementById('admin-settings-view');
    if (!container) return;

    const brand = window.VITASTA_DATA ? window.VITASTA_DATA.brand : {};

    container.innerHTML = `
      <div class="account-card-header">
        <div>
          <h3 class="account-card-title">Atelier & Brand Settings</h3>
          <p class="account-card-subtitle">Manage store announcements, support contact and policies</p>
        </div>
      </div>

      <form id="form-admin-brand-settings" class="account-form-grid">
        <div class="form-group" style="grid-column: 1 / -1;">
          <label class="form-label">Top Announcement Bar Text</label>
          <input type="text" class="form-input" id="setting-announcement" value="Thoughtfully Handcrafted in Jodhpur • Pre-Dispatch Video Verification for Every Saree" required>
        </div>
        <div class="form-group">
          <label class="form-label">Official Atelier WhatsApp Number</label>
          <input type="text" class="form-input" id="setting-whatsapp" value="${brand.contact_support?.whatsapp || '918824017443'}" required>
        </div>
        <div class="form-group">
          <label class="form-label">Customer Support Email</label>
          <input type="email" class="form-input" id="setting-email" value="${brand.contact_support?.email || 'vitastabysmita@gmail.com'}" required>
        </div>
        <div class="form-group">
          <label class="form-label">Handcrafting Timeline Notice</label>
          <input type="text" class="form-input" id="setting-timeline" value="15–30 Days" required>
        </div>
        <div class="form-group">
          <label class="form-label">Dispatch Hub Location</label>
          <input type="text" class="form-input" id="setting-hub" value="Paota B Road, Jodhpur, Rajasthan" required>
        </div>
      <!-- Database & Multi-Tier Caching Telemetry Controls (Thar Delight Style) -->
      <div style="margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid var(--color-sand);">
        <h4 style="font-family:var(--font-royal); color:var(--color-blue-royal); margin-bottom:0.35rem;">⚡ Database & Multi-Tier Caching Engine</h4>
        <p style="font-size:0.78rem; color:var(--color-text-muted); margin-bottom:1.25rem;">Live telemetry for L1 in-memory cache, L2 persistent storage, and Prisma-compatible DB layer</p>
        
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(160px, 1fr)); gap:1rem; margin-bottom:1.5rem;">
          <div style="padding:1rem; background:var(--color-cream); border:1px solid var(--color-sand); border-radius:0.75rem;">
            <div style="font-size:0.65rem; font-weight:700; text-transform:uppercase; color:var(--color-text-muted);">Cache Hit Rate</div>
            <div style="font-size:1.3rem; font-weight:700; color:#16a34a;" id="cache-telemetry-rate">${window.VitastaCache ? window.VitastaCache.getMetrics().hitRate : '100%'}</div>
          </div>
          <div style="padding:1rem; background:var(--color-cream); border:1px solid var(--color-sand); border-radius:0.75rem;">
            <div style="font-size:0.65rem; font-weight:700; text-transform:uppercase; color:var(--color-text-muted);">L1 Memory Entries</div>
            <div style="font-size:1.3rem; font-weight:700; color:var(--color-blue-royal);" id="cache-telemetry-mem">${window.VitastaCache ? window.VitastaCache.getMetrics().memoryEntries : '0'}</div>
          </div>
          <div style="padding:1rem; background:var(--color-cream); border:1px solid var(--color-sand); border-radius:0.75rem;">
            <div style="font-size:0.65rem; font-weight:700; text-transform:uppercase; color:var(--color-text-muted);">Total DB Records</div>
            <div style="font-size:1.3rem; font-weight:700; color:var(--color-red-regal);">${(window.VITASTA_DATA?.products?.length || 21) + 2 + 5}</div>
          </div>
        </div>

        <div style="display:flex; flex-wrap:wrap; gap:0.75rem;">
          <button type="button" class="btn-primary-red" id="btn-purge-cache" style="border:none; cursor:pointer; font-size:0.78rem; padding:0.5rem 1.25rem;">🧹 Purge & Pre-warm Cache</button>
          <button type="button" class="btn-outline-royal" id="btn-export-db">💾 Export DB Snapshot (JSON)</button>
          <button type="button" class="btn-table-action-danger" id="btn-reset-db">⚠️ Factory Reset DB</button>
        </div>
      </div>
    `;

    document.getElementById('form-admin-brand-settings')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const annText = document.getElementById('setting-announcement').value.trim();
      const waNum = document.getElementById('setting-whatsapp').value.trim();

      const annBar = document.querySelector('.announcement-bar');
      if (annBar) {
        annBar.innerHTML = `<div><span class="badge-pill">Royal Atelier</span> ${annText}</div>`;
      }
      notify('Brand settings saved & applied to live store! 👑');
    });

    document.getElementById('btn-purge-cache')?.addEventListener('click', () => {
      if (window.VitastaCache) {
        window.VitastaCache.clearAll();
        notify('L1 Memory & L2 Storage Caches purged & re-warmed! ⚡');
        renderAdminSettings();
      }
    });

    document.getElementById('btn-export-db')?.addEventListener('click', () => {
      if (window.VitastaDB) {
        const backup = window.VitastaDB.exportBackup();
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute("href", dataStr);
        dlAnchor.setAttribute("download", `vitasta_db_backup_${Date.now()}.json`);
        dlAnchor.click();
        notify('Database backup JSON exported successfully! 💾');
      }
    });

    document.getElementById('btn-reset-db')?.addEventListener('click', () => {
      if (confirm('Reset all catalog and database tables to original factory chat extraction?')) {
        if (window.VitastaDB) window.VitastaDB.resetToFactory();
        notify('Database reset to factory defaults.');
        location.reload();
      }
    });
  }

  // ==========================================
  // INVOICE / BILL MODAL
  // ==========================================
  
  function openInvoiceModal(order) {
    let invModal = document.getElementById('invoice-preview-modal');
    if (!invModal) return;

    const invBody = document.getElementById('invoice-modal-content');
    if (!invBody) return;

    invBody.innerHTML = `
      <div class="invoice-sheet">
        <div class="invoice-sheet-header">
          <div>
            <h2 style="font-family:var(--font-royal); font-size:1.6rem; color:var(--color-blue-royal);">VITASTA</h2>
            <div style="font-family:var(--font-script); color:var(--color-text-muted); font-size:0.9rem;">unfolding serenity</div>
            <div style="font-size:0.75rem; color:var(--color-text-muted); margin-top:0.25rem;">House No. 10A, Kanti, Paota B Road, Jodhpur, Rajasthan – 342001</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:1.2rem; font-weight:700; color:var(--color-red-regal);">ORDER INVOICE</div>
            <div style="font-size:0.8rem; font-weight:600; color:var(--color-blue-royal);">#${order.id}</div>
            <div style="font-size:0.75rem; color:var(--color-text-muted);">Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}</div>
          </div>
        </div>

        <div class="invoice-parties-row">
          <div>
            <span class="inv-sub-title">BILLED TO:</span>
            <div style="font-weight:700; color:var(--color-blue-royal);">${order.userName}</div>
            <div style="font-size:0.78rem; color:var(--color-text-body);">${order.shippingAddress ? `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} – ${order.shippingAddress.pinCode}` : ''}</div>
            <div style="font-size:0.78rem; color:var(--color-text-body);">Phone: ${order.userPhone}</div>
          </div>
          <div style="text-align:right;">
            <span class="inv-sub-title">ATELIER DISPATCH:</span>
            <div style="font-weight:600; color:var(--color-blue-royal);">100% Handcrafted Creation</div>
            <div style="font-size:0.78rem; color:var(--color-text-muted);">Pre-Dispatch Video Verification</div>
            <div style="font-size:0.78rem; color:var(--color-text-muted);">Status: ${order.statusLabel || order.orderStatus}</div>
          </div>
        </div>

        <table class="invoice-items-table">
          <thead>
            <tr>
              <th>Item & Description</th>
              <th>Fabric & Craft</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th style="text-align:right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td><strong>${item.title}</strong></td>
                <td>${item.fabric}</td>
                <td>${item.quantity}</td>
                <td>${item.priceFormatted}</td>
                <td style="text-align:right;"><strong>${item.priceFormatted}</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="invoice-totals-wrap">
          <div class="inv-total-line">
            <span>Subtotal:</span>
            <span>₹${order.total.toLocaleString('en-IN')}</span>
          </div>
          <div class="inv-total-line">
            <span>Artisan Adda Work & Finishing:</span>
            <span style="color:#16a34a;">Included</span>
          </div>
          <div class="inv-total-line inv-grand-total">
            <span>Grand Total:</span>
            <span>₹${order.total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div class="invoice-footer-note">
          <p>Thank you for patronizing Vitasta by Smita Saraswat. Every saree is an authentic handcrafted masterpiece made in Jodhpur, Rajasthan.</p>
        </div>
      </div>
    `;

    invModal.classList.add('open');
  }

  // ==========================================
  // ATELIER ADMIN GLOBAL OBJECT
  // ==========================================
  
  window.VitastaAccount = {
    open: openAccountModal,
    switchTab: switchAccountTab,
    trackOrder(orderId) {
      openAccountModal('tracking');
      renderAccountTracking(orderId);
    }
  };

  window.VitastaAdmin = {
    open: openAdminModal,
    switchTab: switchAdminTab,
    editProduct(pId) {
      const data = window.VITASTA_DATA || {};
      const prod = (data.products || []).find(p => p.id === pId);
      if (!prod) return;
      document.getElementById('admin-product-form-wrap').style.display = 'block';
      document.getElementById('admin-product-form-title').textContent = `Edit Saree: ${prod.title}`;
      document.getElementById('prod-edit-id').value = prod.id;
      document.getElementById('prod-title').value = prod.title;
      document.getElementById('prod-category').value = prod.category_id;
      document.getElementById('prod-price').value = prod.price;
      document.getElementById('prod-fabric').value = prod.specifications.fabric;
      document.getElementById('prod-work').value = prod.specifications.work || '';
      document.getElementById('prod-color').value = prod.specifications.color || '';
      document.getElementById('prod-image').value = prod.primary_image || '';
      document.getElementById('prod-desc').value = prod.description || '';
    },
    deleteProduct(pId) {
      if (confirm('Are you sure you want to remove this saree from the catalog?')) {
        const data = window.VITASTA_DATA || {};
        data.products = (data.products || []).filter(p => p.id !== pId);
        notify('Saree removed from catalog.');
        renderAdminProducts();
        if (typeof window.renderVitastaCatalog === 'function') {
          window.renderVitastaCatalog();
        }
      }
    }
  };

  // ==========================================
  // INITIALIZE EVENT LISTENERS ON DOM READY
  // ==========================================
  
  document.addEventListener('DOMContentLoaded', () => {
    updateHeaderAuthUI();

    // Header Auth button click
    const authBtn = document.getElementById('btn-header-auth');
    if (authBtn) {
      authBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentUser) {
          // Toggle dropdown or open account
          const dropdown = document.getElementById('header-user-dropdown');
          if (dropdown) dropdown.classList.toggle('show');
        } else {
          openAuthModal('login');
        }
      });
    }

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      const dropdown = document.getElementById('header-user-dropdown');
      if (dropdown && !dropdown.contains(e.target) && e.target !== authBtn) {
        dropdown.classList.remove('show');
      }
    });

    // Dropdown options
    document.getElementById('dropdown-opt-profile')?.addEventListener('click', () => {
      document.getElementById('header-user-dropdown')?.classList.remove('show');
      openAccountModal('profile');
    });
    document.getElementById('dropdown-opt-orders')?.addEventListener('click', () => {
      document.getElementById('header-user-dropdown')?.classList.remove('show');
      openAccountModal('orders');
    });
    document.getElementById('dropdown-opt-tracking')?.addEventListener('click', () => {
      document.getElementById('header-user-dropdown')?.classList.remove('show');
      openAccountModal('tracking');
    });
    document.getElementById('dropdown-opt-addresses')?.addEventListener('click', () => {
      document.getElementById('header-user-dropdown')?.classList.remove('show');
      openAccountModal('addresses');
    });
    document.getElementById('dropdown-opt-admin')?.addEventListener('click', () => {
      document.getElementById('header-user-dropdown')?.classList.remove('show');
      if (!currentUser || currentUser.role !== 'ADMIN') {
        Auth.quickLogin('admin');
      }
      openAdminModal('dashboard');
    });
    document.getElementById('dropdown-opt-logout')?.addEventListener('click', () => {
      document.getElementById('header-user-dropdown')?.classList.remove('show');
      Auth.logout();
    });

    // Quick 1-Click Demo Login Handlers
    document.getElementById('btn-quick-login-admin')?.addEventListener('click', () => {
      Auth.quickLogin('admin');
      closeAllModals();
      openAdminModal('dashboard');
    });

    document.getElementById('btn-quick-login-client')?.addEventListener('click', () => {
      Auth.quickLogin('client');
      closeAllModals();
      openAccountModal('profile');
    });

    // Footer Quick Links
    document.getElementById('footer-link-admin')?.addEventListener('click', (e) => {
      e.preventDefault();
      if (!currentUser || currentUser.role !== 'ADMIN') {
        Auth.quickLogin('admin');
      }
      openAdminModal('dashboard');
    });

    document.getElementById('footer-bottom-admin-link')?.addEventListener('click', (e) => {
      e.preventDefault();
      if (!currentUser || currentUser.role !== 'ADMIN') {
        Auth.quickLogin('admin');
      }
      openAdminModal('dashboard');
    });

    document.getElementById('footer-link-account')?.addEventListener('click', (e) => {
      e.preventDefault();
      if (!currentUser) {
        Auth.quickLogin('client');
      }
      openAccountModal('profile');
    });

    document.getElementById('footer-link-tracking')?.addEventListener('click', (e) => {
      e.preventDefault();
      if (!currentUser) {
        Auth.quickLogin('client');
      }
      openAccountModal('tracking');
    });

    // Auth Modal tab buttons
    document.querySelectorAll('.auth-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => switchAuthTab(btn.dataset.tab));
    });

    // Auth Forms
    document.getElementById('form-auth-login')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const pass = document.getElementById('login-password').value;
      try {
        Auth.login(email, pass);
        closeAllModals();
      } catch (err) {
        const errorBox = document.getElementById('auth-error-msg');
        if (errorBox) {
          errorBox.textContent = err.message;
          errorBox.style.display = 'block';
        }
      }
    });

    document.getElementById('form-auth-register')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-name').value;
      const email = document.getElementById('reg-email').value;
      const phone = document.getElementById('reg-phone').value;
      const pass = document.getElementById('reg-password').value;
      const confirmPass = document.getElementById('reg-confirm-password').value;

      if (pass !== confirmPass) {
        const errorBox = document.getElementById('auth-error-msg');
        if (errorBox) {
          errorBox.textContent = 'Passwords do not match.';
          errorBox.style.display = 'block';
        }
        return;
      }

      try {
        Auth.register(name, email, phone, pass);
        closeAllModals();
      } catch (err) {
        const errorBox = document.getElementById('auth-error-msg');
        if (errorBox) {
          errorBox.textContent = err.message;
          errorBox.style.display = 'block';
        }
      }
    });


    // Close buttons for modals
    document.querySelectorAll('.portal-modal-close').forEach(btn => {
      btn.addEventListener('click', closeAllModals);
    });
    document.querySelectorAll('.app-portal-modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeAllModals();
      });
    });

    // Account sidebar tabs
    document.querySelectorAll('.account-nav-item').forEach(btn => {
      btn.addEventListener('click', () => switchAccountTab(btn.dataset.accountTab));
    });

    // Admin sidebar tabs
    document.querySelectorAll('.admin-nav-item').forEach(btn => {
      btn.addEventListener('click', () => switchAdminTab(btn.dataset.adminTab));
    });

    // Hash Route Support (#admin, #admin-controls, #account, #track-order)
    function handleHashRoute() {
      const hash = window.location.hash;
      if (hash === '#admin' || hash === '#admin-controls') {
        if (!currentUser || currentUser.role !== 'ADMIN') {
          Auth.quickLogin('admin');
        }
        openAdminModal('dashboard');
      } else if (hash === '#account' || hash === '#profile') {
        if (!currentUser) {
          Auth.quickLogin('client');
        }
        openAccountModal('profile');
      } else if (hash === '#track-order' || hash === '#tracking') {
        if (!currentUser) {
          Auth.quickLogin('client');
        }
        openAccountModal('tracking');
      }
    }

    window.addEventListener('hashchange', handleHashRoute);
    handleHashRoute();

    // Global Key Shortcut: Ctrl+Shift+A or Alt+A to directly open Admin Controls
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) || (e.altKey && (e.key === 'A' || e.key === 'a'))) {
        e.preventDefault();
        if (!currentUser || currentUser.role !== 'ADMIN') {
          Auth.quickLogin('admin');
        }
        openAdminModal('dashboard');
      }
    });
  });

})();

