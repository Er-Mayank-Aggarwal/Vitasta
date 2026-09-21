/**
 * Vitasta Handcrafted Royal Sarees - Interactive App Logic
 * Inspired by Thar Delight UI patterns
 * Jodhpur, Rajasthan
 */

document.addEventListener('DOMContentLoaded', () => {
  const data = window.VITASTA_DATA;
  if (!data) {
    console.error('Vitasta data not found.');
    return;
  }

  // App State
  const state = {
    products: data.products || [],
    filteredProducts: [...data.products],
    activeCategory: 'all',
    searchQuery: '',
    sortOrder: 'default',
    shortlist: JSON.parse(localStorage.getItem('vitasta_shortlist') || '[]'),
    activeModalProduct: null
  };

  // DOM Elements
  const productsGrid = document.getElementById('products-grid');
  const catalogCountSpan = document.getElementById('catalog-count');
  const searchInput = document.getElementById('catalog-search');
  const sortSelect = document.getElementById('catalog-sort');
  const categoryTabsContainer = document.getElementById('category-filter-tabs');
  const categoriesGridContainer = document.getElementById('categories-grid');
  const careGuideGrid = document.getElementById('care-guide-grid');
  
  // Shortlist Drawer Elements
  const shortlistBtn = document.getElementById('btn-header-shortlist');
  const shortlistCountBadges = document.querySelectorAll('.shortlist-badge-count');
  const drawerBackdrop = document.getElementById('shortlist-drawer-backdrop');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const drawerItemsContainer = document.getElementById('drawer-items-container');
  const drawerTotalPrice = document.getElementById('drawer-total-price');
  const btnSendAllWhatsApp = document.getElementById('btn-drawer-send-all');

  // Modal Elements
  const modalBackdrop = document.getElementById('product-modal-backdrop');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalMainImg = document.getElementById('modal-main-img');
  const modalThumbStrip = document.getElementById('modal-thumb-strip');
  const modalCategory = document.getElementById('modal-category');
  const modalTitle = document.getElementById('modal-title');
  const modalPrice = document.getElementById('modal-price');
  const modalDesc = document.getElementById('modal-description');
  const modalSpecsBody = document.getElementById('modal-specs-body');
  const modalBtnWaOrder = document.getElementById('btn-modal-wa-order');
  const modalBtnShortlist = document.getElementById('btn-modal-shortlist');

  // Mobile Menu
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu');

  // WhatsApp helper
  const WHATSAPP_NUMBER = data.brand.contact_support.whatsapp || '918824017443';

  function createWhatsAppLink(message) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  // Toast Notification
  function showToast(message) {
    const toast = document.getElementById('site-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // ==========================================
  // RENDER CATEGORIES SHOWCASE (Thar Delight Style)
  // ==========================================
  // RENDER CATEGORIES SHOWCASE (Auto-Slideshow of Saree Images)
  // ==========================================
  let categorySlideshowTimer = null;

  // Preload and decode images in memory for 0ms latency switching
  function preloadImages(urls) {
    urls.forEach(url => {
      const img = new Image();
      img.src = url;
      if (img.decode) {
        img.decode().catch(() => {});
      }
    });
  }

  function renderCategories() {
    if (!categoriesGridContainer) return;

    const allCollectionImages = [];

    categoriesGridContainer.innerHTML = data.categories.map(cat => {
      const catProducts = state.products.filter(p => p.category_id === cat.id);
      const count = catProducts.length;

      // Extract all distinct images for products in this collection
      const catImages = [];
      catProducts.forEach(p => {
        if (p.primary_image && typeof p.primary_image === 'string' && !catImages.includes(p.primary_image)) {
          catImages.push(p.primary_image);
        }
        if (Array.isArray(p.images)) {
          p.images.forEach(item => {
            const url = typeof item === 'string' ? item : (item && (item.cdn_url || item.asset_path || item.url));
            if (url && typeof url === 'string' && !catImages.includes(url)) {
              catImages.push(url);
            }
          });
        }
      });

      // Fallback if no images found
      if (catImages.length === 0) {
        catImages.push('https://res.cloudinary.com/sjl1rfvu/image/upload/v1789675005/vitasta/brand/vitasta_logo_banner.jpg');
      }

      // Collect for eager preloading
      catImages.forEach(src => {
        if (!allCollectionImages.includes(src)) allCollectionImages.push(src);
      });

      return `
        <div class="category-card" data-cat-id="${cat.id}" title="Explore ${cat.name}">
          <div class="category-slideshow">
            ${catImages.map((img, idx) => `
              <div class="category-slide ${idx === 0 ? 'active' : ''}" data-slide-index="${idx}">
                <img src="${img}" alt="${cat.name}" class="category-slide-img" loading="eager" fetchpriority="high" decoding="async" />
              </div>
            `).join('')}
            <div class="category-slide-overlay"></div>
          </div>

          <div class="category-card-content">
            <span class="category-badge-chip">Royal Collection</span>
            <h3 class="category-card-name">${cat.name}</h3>
            <p class="category-card-desc">${cat.tagline || cat.fabric || 'Luxury handcrafted royal collection'}</p>
            <div class="category-card-meta">
              <span class="category-card-count">👑 ${count} Sarees</span>
              <span class="category-card-explore">
                Explore
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Preload all images immediately into browser cache
    preloadImages(allCollectionImages);

    // Add stagger animation
    categoriesGridContainer.classList.add('stagger-children');

    categoriesGridContainer.querySelectorAll('.category-card').forEach(card => {
      card.addEventListener('click', () => {
        const catId = card.getAttribute('data-cat-id');
        setActiveCategory(catId);
        const catalogSec = document.getElementById('catalog');
        if (catalogSec) catalogSec.scrollIntoView({ behavior: 'smooth' });
      });
    });

    startCategoryAutoSlideshow();
  }

  function startCategoryAutoSlideshow() {
    if (categorySlideshowTimer) clearInterval(categorySlideshowTimer);

    categorySlideshowTimer = setInterval(() => {
      const cards = document.querySelectorAll('.category-card');
      cards.forEach(card => {
        const slides = card.querySelectorAll('.category-slide');
        if (slides.length <= 1) return;

        let activeIdx = Array.from(slides).findIndex(s => s.classList.contains('active'));
        if (activeIdx === -1) activeIdx = 0;

        slides[activeIdx].classList.remove('active');

        const nextIdx = (activeIdx + 1) % slides.length;
        slides[nextIdx].classList.add('active');
      });
    }, 3200);
  }

  // ==========================================
  // RENDER FILTER TABS
  // ==========================================
  function renderCategoryTabs() {
    if (!categoryTabsContainer) return;
    const tabs = [
      { id: 'all', name: 'All Sarees' },
      ...data.categories
    ];

    categoryTabsContainer.innerHTML = tabs.map(tab => `
      <button class="filter-tab ${state.activeCategory === tab.id ? 'active' : ''}" data-cat-id="${tab.id}">
        ${tab.name}
      </button>
    `).join('');

    categoryTabsContainer.querySelectorAll('.filter-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        const catId = btn.getAttribute('data-cat-id');
        setActiveCategory(catId);
      });
    });
  }

  function setActiveCategory(catId) {
    state.activeCategory = catId;
    renderCategoryTabs();
    renderCategories();
    applyFilters();
  }

  // ==========================================
  // RENDER PRODUCT CATALOG (Thar Delight Card Style)
  // ==========================================
  function renderProducts() {
    if (!productsGrid) return;

    if (catalogCountSpan) {
      catalogCountSpan.textContent = `Showing ${state.filteredProducts.length} handcrafted pieces`;
    }

    if (state.filteredProducts.length === 0) {
      productsGrid.innerHTML = `
        <div class="no-results-msg">
          <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">👑</div>
          <h3 style="font-family: var(--font-royal); color: var(--color-blue-royal); margin-bottom: 0.5rem; font-size: 1.2rem;">No Sarees Match Your Selection</h3>
          <p style="color: var(--color-text-muted); max-width: 420px; margin: 0 auto 1.5rem; font-size: 0.88rem;">
            Try clearing your search query or selecting a different royal collection category.
          </p>
          <button class="btn-primary-red" id="btn-reset-filters" style="cursor:pointer; border:none;">View All Sarees</button>
        </div>
      `;
      const resetBtn = document.getElementById('btn-reset-filters');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          state.searchQuery = '';
          if (searchInput) searchInput.value = '';
          setActiveCategory('all');
        });
      }
      return;
    }

    productsGrid.innerHTML = state.filteredProducts.map(product => {
      const isShortlisted = state.shortlist.some(item => item.id === product.id);
      const primaryImg = product.primary_image || (product.images[0] && (product.images[0].cdn_url || product.images[0].asset_path)) || '';
      const fabricShort = (product.specifications.fabric || '').split(' ').slice(0, 2).join(' ');

      return `
        <div class="product-card" data-product-id="${product.id}">
          <!-- Image Container -->
          <div class="product-card-image-wrap" data-action="quick-view">
            <img src="${primaryImg}" alt="${product.title}" loading="eager" fetchpriority="high" decoding="async">
            
            <!-- Category Badge (Top Left) -->
            <span class="product-card-badge">${fabricShort}</span>
            
            <!-- Wishlist Heart Button (Top Right) -->
            <button class="btn-card-wishlist ${isShortlisted ? 'active' : ''}" data-action="toggle-wishlist" title="${isShortlisted ? 'Remove from Shortlist' : 'Add to Shortlist'}" aria-label="Shortlist">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="${isShortlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>

          <!-- Content (Unobstructed below image) -->
          <div class="product-card-content" data-action="quick-view">
            <div class="product-card-category">${product.category_name}</div>
            <h3 class="product-card-title">${product.title}</h3>
            <p class="product-card-desc">${product.specifications.work || 'Adda Handwork'} · ${product.specifications.color || ''}</p>
            <div class="product-card-bottom-row">
              <span class="product-card-price">${product.price_formatted}</span>
              <button class="btn-card-quick-view" data-action="quick-view">
                <span>View Details</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Add stagger animation
    productsGrid.classList.add('stagger-children');

    // Attach card event listeners
    productsGrid.querySelectorAll('.product-card').forEach(card => {
      const prodId = parseInt(card.getAttribute('data-product-id'), 10);
      const product = state.products.find(p => p.id === prodId);

      card.querySelectorAll('[data-action="quick-view"]').forEach(el => {
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          openProductModal(product);
        });
      });

      const wishBtn = card.querySelector('[data-action="toggle-wishlist"]');
      if (wishBtn) {
        wishBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleShortlist(product);
        });
      }
    });
  }

  // ==========================================
  // FILTERS, SEARCH & SORTING
  // ==========================================
  function applyFilters() {
    let result = [...state.products];

    // Category filter
    if (state.activeCategory !== 'all') {
      result = result.filter(p => p.category_id === state.activeCategory);
    }

    // Search query filter
    if (state.searchQuery.trim() !== '') {
      const q = state.searchQuery.toLowerCase().trim();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.category_name.toLowerCase().includes(q) ||
        p.specifications.fabric.toLowerCase().includes(q) ||
        (p.specifications.work && p.specifications.work.toLowerCase().includes(q)) ||
        p.specifications.color.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (state.sortOrder === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (state.sortOrder === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (state.sortOrder === 'name-asc') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    state.filteredProducts = result;
    renderProducts();
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      applyFilters();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sortOrder = e.target.value;
      applyFilters();
    });
  }

  // ==========================================
  // PRODUCT DETAIL MODAL
  // ==========================================
  // PRODUCT DETAIL MODAL (With Reviews & Comments Tab - Thar Delight Style)
  // ==========================================
  function getProductReviews(product) {
    try {
      const allReviews = window.VitastaDB ? (JSON.parse(localStorage.getItem('vitasta_db_reviews') || '[]')) : (data.reviews || []);
      const pIdStr = String(product.id);
      const pTitleLower = (product.title || '').toLowerCase();
      
      return allReviews.filter(r => {
        if (r.product_id && (String(r.product_id) === pIdStr || r.product_id === product.id)) return true;
        if (r.product_title && r.product_title.toLowerCase().includes(pTitleLower.slice(0, 15))) return true;
        return false;
      });
    } catch (e) {
      return (data.reviews || []).slice(0, 2);
    }
  }

  function renderModalReviewsList(product) {
    const reviewsList = document.getElementById('modal-reviews-list');
    const pill = document.getElementById('modal-reviews-pill');
    const ratingVal = document.getElementById('modal-rating-val');
    const ratingCount = document.getElementById('modal-rating-count');
    const starsDisplay = document.getElementById('modal-stars-display');
    if (!reviewsList) return;

    const reviews = getProductReviews(product);
    if (pill) pill.textContent = reviews.length;

    // Calculate rating
    const avgRating = reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1)
      : '5.0';

    if (ratingVal) ratingVal.textContent = avgRating;
    if (ratingCount) ratingCount.textContent = `(${reviews.length})`;
    if (starsDisplay) {
      const starNum = Math.round(parseFloat(avgRating));
      starsDisplay.textContent = '★'.repeat(starNum) + '☆'.repeat(5 - starNum);
    }

    if (reviews.length === 0) {
      reviewsList.innerHTML = `
        <div class="modal-no-reviews">
          <span style="font-size:2rem; display:block; margin-bottom:0.35rem;">💬</span>
          <strong>No customer reviews yet for this creation</strong>
          <p style="font-size:0.75rem; color:var(--color-text-muted);">Be the first royal patron to share your experience with this saree!</p>
        </div>
      `;
      return;
    }

    reviewsList.innerHTML = reviews.map(r => `
      <div class="modal-review-card">
        <div class="modal-review-header">
          <div class="review-author-wrap">
            <div class="review-avatar">${r.avatar_initial || (r.author || 'P').charAt(0).toUpperCase()}</div>
            <div>
              <div class="review-author-name">
                ${r.author || 'Royal Patron'}
                ${r.verified !== false ? '<span class="verified-badge">✓ Verified Patron</span>' : ''}
              </div>
              <div class="review-location">${r.location || 'Rajasthan, India'} • ${r.date ? new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently'}</div>
            </div>
          </div>
          <div class="review-stars-pill">${'★'.repeat(r.rating || 5)}</div>
        </div>
        ${r.title ? `<div class="review-headline">${r.title}</div>` : ''}
        <p class="review-comment-text">${r.comment}</p>
      </div>
    `).join('');
  }

  function setupModalTabs() {
    const tabButtons = document.querySelectorAll('.modal-tab-btn');
    const specsView = document.getElementById('modal-tab-specs-view');
    const reviewsView = document.getElementById('modal-tab-reviews-view');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.dataset.modalTab;
        if (tab === 'specs') {
          if (specsView) specsView.style.display = 'block';
          if (reviewsView) reviewsView.style.display = 'none';
        } else {
          if (specsView) specsView.style.display = 'none';
          if (reviewsView) reviewsView.style.display = 'block';
        }
      });
    });

    // Star rating selector inside modal
    const starButtons = document.querySelectorAll('#star-rating-selector .star-btn');
    const ratingInput = document.getElementById('review-selected-rating');
    starButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const rating = parseInt(btn.dataset.rating, 10);
        if (ratingInput) ratingInput.value = rating;
        starButtons.forEach((b, idx) => {
          if (idx < rating) {
            b.classList.add('active');
          } else {
            b.classList.remove('active');
          }
        });
      });
    });

    // Form submit inside modal
    const modalRevForm = document.getElementById('form-modal-add-review');
    if (modalRevForm) {
      modalRevForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const activeProd = state.activeModalProduct;
        if (!activeProd) return;

        const name = document.getElementById('modal-rev-name')?.value.trim();
        const location = document.getElementById('modal-rev-location')?.value.trim();
        const comment = document.getElementById('modal-rev-comment')?.value.trim();
        const rating = parseInt(document.getElementById('review-selected-rating')?.value || '5', 10);

        const newReview = {
          id: 'rev_' + Date.now(),
          product_id: activeProd.id,
          product_title: activeProd.title,
          product_category: activeProd.category_name,
          author: name,
          location: location,
          rating: rating,
          date: new Date().toISOString().split('T')[0],
          verified: true,
          title: 'Royal Handcraft Review',
          comment: comment,
          avatar_initial: name.charAt(0).toUpperCase()
        };

        if (window.VitastaDB && window.VitastaDB.review) {
          window.VitastaDB.review.create(newReview);
        } else {
          const stored = JSON.parse(localStorage.getItem('vitasta_db_reviews') || '[]');
          stored.unshift(newReview);
          localStorage.setItem('vitasta_db_reviews', JSON.stringify(stored));
        }

        modalRevForm.reset();
        showToast('Thank you! Your royal review has been published. ✨');
        renderModalReviewsList(activeProd);
        renderMainPageReviews();
      });
    }
  }

  function openProductModal(product) {
    if (!product || !modalBackdrop) return;
    state.activeModalProduct = product;

    modalCategory.textContent = product.category_name;
    modalTitle.textContent = product.title;
    modalPrice.textContent = product.price_formatted;
    modalDesc.textContent = product.description;

    // Reset tabs to specs
    document.querySelectorAll('.modal-tab-btn').forEach((b, idx) => {
      b.classList.toggle('active', idx === 0);
    });
    const specsView = document.getElementById('modal-tab-specs-view');
    const reviewsView = document.getElementById('modal-tab-reviews-view');
    if (specsView) specsView.style.display = 'block';
    if (reviewsView) reviewsView.style.display = 'none';

    // Gallery & Thumbnails
    const images = product.images || [];
    const mainImgSrc = product.primary_image || (images[0] && (images[0].cdn_url || images[0].asset_path)) || '';
    modalMainImg.src = mainImgSrc;
    modalMainImg.alt = product.title;

    modalThumbStrip.innerHTML = images.map((img, idx) => {
      const src = typeof img === 'string' ? img : (img.cdn_url || img.asset_path || '');
      return `
        <img class="modal-thumb ${idx === 0 ? 'active' : ''}" src="${src}" alt="${product.title} preview ${idx+1}" data-img-src="${src}">
      `;
    }).join('');

    modalThumbStrip.querySelectorAll('.modal-thumb').forEach(thumb => {
      thumb.addEventListener('click', () => {
        modalThumbStrip.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        modalMainImg.src = thumb.getAttribute('data-img-src');
      });
    });

    // Specifications Table
    const specs = product.specifications;
    const specEntries = [
      { label: 'Category', value: specs.product_category || product.category_name },
      { label: 'Saree Fabric', value: specs.fabric },
      { label: 'Blouse Fabric', value: specs.blouse_fabric },
      { label: 'Craft & Handwork', value: specs.work || 'Intricate Handcrafted Detail' },
      { label: 'Saree Color', value: specs.color },
      { label: 'Blouse Color', value: specs.blouse_color },
      { label: 'Saree Length', value: specs.saree_length || '5.5 Metres' },
      { label: 'Blouse Piece', value: specs.blouse_length || '1 Metre' },
      { label: 'Care Instructions', value: specs.material_care || 'Dry Clean Only' },
      { label: 'Country of Origin', value: specs.country_of_origin || 'India' }
    ];

    modalSpecsBody.innerHTML = specEntries.map(entry => `
      <tr>
        <td>${entry.label}</td>
        <td>${entry.value}</td>
      </tr>
    `).join('');

    // WhatsApp Order Link
    const waMsg = `Hello Vitasta, I would like to place an order / inquiry for:\n*${product.title}*\nPrice: ${product.price_formatted}\nFabric: ${specs.fabric}\nColor: ${specs.color}\n\nPlease share availability and timeline for handcrafted creation.`;
    modalBtnWaOrder.href = createWhatsAppLink(waMsg);

    // Update Shortlist button inside modal
    updateModalShortlistBtn(product);

    // Render reviews for this product
    renderModalReviewsList(product);

    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function updateModalShortlistBtn(product) {
    if (!modalBtnShortlist) return;
    const isShortlisted = state.shortlist.some(item => item.id === product.id);
    modalBtnShortlist.innerHTML = isShortlisted
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="var(--color-red-regal)" stroke="var(--color-red-regal)" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg> Remove from Shortlist`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg> Add to Shortlist`;
  }

  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
    state.activeModalProduct = null;
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  if (modalBtnShortlist) {
    modalBtnShortlist.addEventListener('click', () => {
      if (state.activeModalProduct) {
        toggleShortlist(state.activeModalProduct);
        updateModalShortlistBtn(state.activeModalProduct);
      }
    });
  }

  // ==========================================
  // SHORTLIST / INQUIRY DRAWER
  // ==========================================
  function toggleShortlist(product) {
    const idx = state.shortlist.findIndex(item => item.id === product.id);
    if (idx > -1) {
      state.shortlist.splice(idx, 1);
      showToast(`Removed "${product.title.slice(0, 24)}..." from Shortlist`);
    } else {
      state.shortlist.push(product);
      showToast(`Added "${product.title.slice(0, 24)}..." to Shortlist ❤️`);
    }

    localStorage.setItem('vitasta_shortlist', JSON.stringify(state.shortlist));
    updateShortlistUI();
    renderProducts();
  }

  function updateShortlistUI() {
    const count = state.shortlist.length;
    shortlistCountBadges.forEach(b => {
      b.textContent = count;
    });

    if (drawerItemsContainer) {
      if (count === 0) {
        drawerItemsContainer.innerHTML = `
          <div class="drawer-empty-text">
            <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">👑</div>
            <p style="font-weight: 600; color: var(--color-blue-royal); margin-bottom: 0.25rem;">Your Shortlist is Empty</p>
            <p>Browse our royal handcrafted sarees and save your favorites.</p>
          </div>
        `;
        if (drawerTotalPrice) drawerTotalPrice.textContent = '₹0';
        if (btnSendAllWhatsApp) btnSendAllWhatsApp.style.display = 'none';
      } else {
        let total = 0;
        drawerItemsContainer.innerHTML = state.shortlist.map(p => {
          total += p.price;
          const img = p.primary_image || (p.images[0] && (p.images[0].cdn_url || p.images[0].asset_path)) || '';
          return `
            <div class="drawer-item">
              <img src="${img}" alt="${p.title}" class="drawer-item-img">
              <div class="drawer-item-info">
                <div class="drawer-item-name">${p.title}</div>
                <div class="drawer-item-price">${p.price_formatted}</div>
              </div>
              <button class="drawer-item-remove" data-remove-id="${p.id}" title="Remove">✕</button>
            </div>
          `;
        }).join('');

        if (drawerTotalPrice) {
          drawerTotalPrice.textContent = `₹${total.toLocaleString('en-IN')}`;
        }
        if (btnSendAllWhatsApp) {
          btnSendAllWhatsApp.style.display = 'flex';
          const itemsListText = state.shortlist.map((p, i) => `${i+1}. ${p.title} (${p.price_formatted})`).join('\n');
          const combinedMsg = `Hello Vitasta Atelier,\n\nI am interested in inquiring about the following ${state.shortlist.length} handcrafted saree(s):\n\n${itemsListText}\n\nTotal Estimate: ₹${total.toLocaleString('en-IN')}\n\nPlease share current dispatch schedule & booking details.`;
          btnSendAllWhatsApp.href = createWhatsAppLink(combinedMsg);
        }

        drawerItemsContainer.querySelectorAll('[data-remove-id]').forEach(btn => {
          btn.addEventListener('click', () => {
            const pId = parseInt(btn.getAttribute('data-remove-id'), 10);
            const p = state.products.find(item => item.id === pId);
            if (p) toggleShortlist(p);
          });
        });
      }
    }
  }

  function openDrawer() {
    if (drawerBackdrop) {
      drawerBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDrawer() {
    if (drawerBackdrop) {
      drawerBackdrop.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (shortlistBtn) shortlistBtn.addEventListener('click', openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', (e) => {
      if (e.target === drawerBackdrop) closeDrawer();
    });
  }

  // ==========================================
  // RENDER THE VITASTA ROYAL PROMISE (Values Section - Thar Delight Style)
  // ==========================================
  function renderValuesSection() {
    const grid = document.getElementById('values-grid');
    if (!grid) return;
    const values = data.values || [];

    grid.innerHTML = values.map((val, idx) => `
      <div class="value-card-box">
        <div class="value-icon-circle">${val.icon}</div>
        <h3 class="value-card-title">${val.title}</h3>
        <p class="value-card-desc">${val.desc}</p>
      </div>
    `).join('');
  }

  // ==========================================
  // RENDER MAIN PAGE CUSTOMER REVIEWS & COMMENTS
  // ==========================================
  function renderMainPageReviews() {
    const grid = document.getElementById('main-reviews-grid');
    if (!grid) return;

    let reviews = [];
    try {
      reviews = JSON.parse(localStorage.getItem('vitasta_db_reviews') || '[]');
      if (!reviews || reviews.length === 0) reviews = data.reviews || [];
    } catch (e) {
      reviews = data.reviews || [];
    }

    grid.innerHTML = reviews.map(rev => `
      <div class="main-review-card">
        <div class="main-review-top">
          <div class="review-author-wrap">
            <div class="review-avatar" style="background:var(--color-blue-royal); color:white;">${rev.avatar_initial || (rev.author || 'P').charAt(0).toUpperCase()}</div>
            <div>
              <div class="review-author-name">
                ${rev.author}
                ${rev.verified !== false ? '<span class="verified-badge">✓ Verified Patron</span>' : ''}
              </div>
              <div class="review-location">${rev.location || 'Rajasthan'}</div>
            </div>
          </div>
          <div class="stars-gold">★★★★★</div>
        </div>
        ${rev.product_title ? `
          <div class="review-product-pill">
            <span>👗 ${rev.product_title}</span>
          </div>
        ` : ''}
        ${rev.title ? `<h4 class="main-review-headline">&ldquo;${rev.title}&rdquo;</h4>` : ''}
        <p class="main-review-body">${rev.comment}</p>
        <div class="main-review-footer">
          <span class="review-date">${rev.date ? new Date(rev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Verified Order'}</span>
          <span class="review-origin">📍 Jodhpur Handloom</span>
        </div>
      </div>
    `).join('');
  }

  // ==========================================
  // RENDER FAQ ACCORDION (Thar Delight Style)
  // ==========================================
  function renderFaqsSection() {
    const container = document.getElementById('faq-accordion-list');
    if (!container) return;
    const faqs = data.faqs || [];

    container.innerHTML = faqs.map((faq, idx) => `
      <div class="faq-item-card ${idx === 0 ? 'open' : ''}">
        <button class="faq-question-btn" type="button">
          <span class="faq-q-text">${faq.q}</span>
          <span class="faq-arrow-icon">${idx === 0 ? '−' : '+'}</span>
        </button>
        <div class="faq-answer-pane" style="${idx === 0 ? 'display:block;' : 'display:none;'}">
          <p class="faq-a-text">${faq.a}</p>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.faq-question-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.faq-item-card');
        const pane = card.querySelector('.faq-answer-pane');
        const icon = card.querySelector('.faq-arrow-icon');
        const isOpen = card.classList.contains('open');

        // Toggle
        if (isOpen) {
          card.classList.remove('open');
          pane.style.display = 'none';
          icon.textContent = '+';
        } else {
          card.classList.add('open');
          pane.style.display = 'block';
          icon.textContent = '−';
        }
      });
    });
  }

  // ==========================================
  // STANDALONE REVIEW MODAL HANDLING
  // ==========================================
  function setupStandaloneReviewModal() {
    const modal = document.getElementById('review-modal-backdrop');
    const openBtn = document.getElementById('btn-open-review-modal');
    const closeBtn = document.getElementById('review-modal-close');
    const productSelect = document.getElementById('standalone-rev-product');
    const form = document.getElementById('form-standalone-review');

    if (productSelect && state.products) {
      productSelect.innerHTML = state.products.map(p => `
        <option value="${p.id}">${p.title} (${p.category_name})</option>
      `).join('');
    }

    if (openBtn && modal) {
      openBtn.addEventListener('click', () => {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    }

    function closeReviewModal() {
      if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    }

    if (closeBtn) closeBtn.addEventListener('click', closeReviewModal);
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeReviewModal();
      });
    }

    // Star selector in standalone modal
    const starBtns = document.querySelectorAll('#standalone-star-selector .star-btn');
    const ratingHidden = document.getElementById('standalone-selected-rating');
    starBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const rating = parseInt(btn.dataset.rating, 10);
        if (ratingHidden) ratingHidden.value = rating;
        starBtns.forEach((b, idx) => {
          b.classList.toggle('active', idx < rating);
        });
      });
    });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const pId = document.getElementById('standalone-rev-product')?.value;
        const selectedProd = state.products.find(p => String(p.id) === String(pId)) || state.products[0];
        const name = document.getElementById('standalone-rev-name')?.value.trim();
        const location = document.getElementById('standalone-rev-location')?.value.trim();
        const title = document.getElementById('standalone-rev-title')?.value.trim();
        const comment = document.getElementById('standalone-rev-comment')?.value.trim();
        const rating = parseInt(document.getElementById('standalone-selected-rating')?.value || '5', 10);

        const newReview = {
          id: 'rev_' + Date.now(),
          product_id: selectedProd.id,
          product_title: selectedProd.title,
          product_category: selectedProd.category_name,
          author: name,
          location: location,
          rating: rating,
          date: new Date().toISOString().split('T')[0],
          verified: true,
          title: title,
          comment: comment,
          avatar_initial: name.charAt(0).toUpperCase()
        };

        if (window.VitastaDB && window.VitastaDB.review) {
          window.VitastaDB.review.create(newReview);
        } else {
          const stored = JSON.parse(localStorage.getItem('vitasta_db_reviews') || '[]');
          stored.unshift(newReview);
          localStorage.setItem('vitasta_db_reviews', JSON.stringify(stored));
        }

        form.reset();
        closeReviewModal();
        showToast('Your royal review has been published across the atelier! ✨');
        renderMainPageReviews();
      });
    }
  }

  // ==========================================
  // SAREE CARE GUIDE RENDERING
  // ==========================================
  function renderCareGuide() {
    if (!careGuideGrid) return;
    const instructions = data.brand.policies.saree_care_guide.instructions || [];
    const careIcons = ['🧴', '🧊', '☀️', '📦', '🧹', '💎', '🌿', '👗'];
    
    careGuideGrid.innerHTML = instructions.map((inst, idx) => `
      <div class="care-card">
        <div class="care-card-icon">${careIcons[idx % careIcons.length]}</div>
        <h4 class="care-card-title">Step ${idx + 1}</h4>
        <p class="care-card-text">${inst}</p>
      </div>
    `).join('');

    careGuideGrid.classList.add('stagger-children');
  }

  // ==========================================
  // BESPOKE INQUIRY FORM DISPATCH
  // ==========================================
  const inquiryForm = document.getElementById('atelier-inquiry-form');
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name')?.value || '';
      const phone = document.getElementById('form-phone')?.value || '';
      const category = document.getElementById('form-category')?.value || 'General Inquiry';
      const message = document.getElementById('form-message')?.value || '';

      // Save inquiry to DB
      if (window.VitastaDB && window.VitastaDB.message) {
        window.VitastaDB.message.create({
          name: name,
          phone: phone,
          email: '',
          category: category,
          message: message,
          status: 'UNREAD'
        });
      }

      const waMsg = `*Bespoke Inquiry - Vitasta Atelier*\nName: ${name}\nPhone: ${phone}\nInterest: ${category}\nMessage: ${message}`;
      window.open(createWhatsAppLink(waMsg), '_blank');
      showToast('Redirecting your inquiry to Vitasta WhatsApp Atelier...');
      inquiryForm.reset();
    });
  }

  // ==========================================
  // LUXURY MOBILE DRAWER MENU
  // ==========================================
  const mobileNavBackdrop = document.getElementById('mobile-nav-backdrop');
  const mobileNavCloseBtn = document.getElementById('mobile-nav-close-btn');

  function openMobileMenu() {
    if (!mobileNavBackdrop) return;
    mobileNavBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (typeof window.updateMobileDrawerUserUI === 'function') {
      window.updateMobileDrawerUserUI();
    }
  }

  function closeMobileMenu() {
    if (!mobileNavBackdrop) return;
    mobileNavBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openMobileMenu();
    });
  }

  if (mobileNavCloseBtn) {
    mobileNavCloseBtn.addEventListener('click', closeMobileMenu);
  }

  if (mobileNavBackdrop) {
    mobileNavBackdrop.addEventListener('click', (e) => {
      if (e.target === mobileNavBackdrop) {
        closeMobileMenu();
      }
    });

    mobileNavBackdrop.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        closeMobileMenu();
        const targetId = link.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            setTimeout(() => {
              targetEl.scrollIntoView({ behavior: 'smooth' });
            }, 200);
          }
        }
      });
    });
  }

  // Keyboard accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeDrawer();
      closeMobileMenu();
      const revModal = document.getElementById('review-modal-backdrop');
      if (revModal) {
        revModal.classList.remove('open');
        document.body.style.overflow = '';
      }
    }
  });

  // ==========================================
  // HEADER SCROLL BEHAVIOR (Thar Delight Exact Pattern)
  // ==========================================
  const siteHeader = document.querySelector('.site-header');
  const announcementBar = document.querySelector('.announcement-bar');
  let lastScrollY = 0;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    // Scrolled past 20px (Compact glass header + collapse announcement)
    if (currentScrollY > 20) {
      siteHeader?.classList.add('scrolled');
      if (announcementBar) {
        announcementBar.style.height = '0';
        announcementBar.style.padding = '0';
        announcementBar.style.opacity = '0';
        announcementBar.style.overflow = 'hidden';
      }
    } else {
      siteHeader?.classList.remove('scrolled');
      if (announcementBar) {
        announcementBar.style.height = '';
        announcementBar.style.padding = '';
        announcementBar.style.opacity = '';
        announcementBar.style.overflow = '';
      }
    }

    // Hide navbar when scrolling DOWN past 150px, show immediately when scrolling UP anywhere (Thar Delight)
    const isMenuOpen = document.querySelector('.mobile-nav-backdrop')?.classList.contains('open') ||
                       document.querySelector('.header-user-dropdown')?.classList.contains('show') ||
                       document.getElementById('review-modal-backdrop')?.classList.contains('open');

    if (!isMenuOpen && currentScrollY > 150 && currentScrollY > lastScrollY) {
      siteHeader?.classList.remove('header-visible');
      siteHeader?.classList.add('header-hidden');
    } else {
      siteHeader?.classList.remove('header-hidden');
      siteHeader?.classList.add('header-visible');
    }

    lastScrollY = currentScrollY;
  }, { passive: true });

  // ==========================================
  // INITIALIZE
  // ==========================================
  setupModalTabs();
  setupStandaloneReviewModal();

  window.renderVitastaCatalog = function () {
    state.products = data.products || [];
    applyFilters();
    renderCategories();
    renderMainPageReviews();
  };

  renderCategories();
  renderCategoryTabs();
  renderProducts();
  renderValuesSection();
  renderMainPageReviews();
  renderFaqsSection();
  renderCareGuide();
  updateShortlistUI();
});
