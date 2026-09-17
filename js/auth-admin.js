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
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
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
    if (tabName === 'customers') renderAdminCustomers();
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
  // ROYAL ADMIN ATELIER DASHBOARD RENDERERS
  // ==========================================
  
  function renderAdminDashboard() {
    const container = document.getElementById('admin-dashboard-view');
    if (!container) return;

    const products = window.VITASTA_DATA ? window.VITASTA_DATA.products : [];
    const orders = getStored('vitasta_orders', DEFAULT_ORDERS);
    const users = getStored('vitasta_users', DEFAULT_USERS);

    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const activeProduction = orders.filter(o => o.orderStatus === 'IN_PRODUCTION' || o.orderStatus === 'PENDING').length;

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
          <div class="stat-icon-wrap" style="background: rgba(11,59,96,0.1); color: var(--color-blue-light);">👤</div>
          <div class="stat-info">
            <span class="stat-number">${users.length}</span>
            <span class="stat-label">Royal Registered Clients</span>
          </div>
        </div>
      </div>

      <!-- Quick Actions Bar -->
      <div class="admin-quick-actions-bar">
        <h4 style="font-family:var(--font-royal); color:var(--color-blue-royal); margin-bottom:0.75rem;">Atelier Management Shortcuts</h4>
        <div style="display:flex; flex-wrap:wrap; gap:0.75rem;">
          <button class="btn-primary-red" onclick="window.VitastaAdmin.switchTab('products')" style="border:none; cursor:pointer;">+ Add / Manage Sarees</button>
          <button class="btn-outline-royal" onclick="window.VitastaAdmin.switchTab('orders')">Update Dispatch Pipeline (${orders.length})</button>
          <button class="btn-outline-royal" onclick="window.VitastaAdmin.switchTab('settings')">Edit Brand Policies</button>
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
                  <td><button class="btn-table-action" onclick="window.VitastaAdmin.editOrder('${o.id}')">Manage</button></td>
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
    document.getElementById('dropdown-opt-addresses')?.addEventListener('click', () => {
      document.getElementById('header-user-dropdown')?.classList.remove('show');
      openAccountModal('addresses');
    });
    document.getElementById('dropdown-opt-admin')?.addEventListener('click', () => {
      document.getElementById('header-user-dropdown')?.classList.remove('show');
      openAdminModal('dashboard');
    });
    document.getElementById('dropdown-opt-logout')?.addEventListener('click', () => {
      document.getElementById('header-user-dropdown')?.classList.remove('show');
      Auth.logout();
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
  });

})();
