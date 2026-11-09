/**
 * Infinity Phone - Homepage Interactive Controller
 * Manages product collection grid, brand universe, live filters, search, quick view & 3D tilt interactions.
 */

(function () {
  let activeBrand = 'all';
  let activeStorage = 'all';
  let activeSort = 'featured';
  let searchQuery = '';

  function initHomepage() {
    renderFeaturedPhones();
    renderCollectionGrid();
    setupEventListeners();
    setupTiltEffect();
  }

  // Render the horizontal featured phone cards
  function renderFeaturedPhones() {
    const track = document.getElementById('featuredPhonesTrack');
    if (!track) return;

    const featured = (window.PRODUCTS_DATA || []).filter(p => p.isFeatured).slice(0, 6);
    track.innerHTML = featured.map((p, idx) => `
      <div class="fcard js-tilt-card" data-brand="${p.brand}">
        <div class="fcard__header">
          <span class="fcard__num">۰${idx + 1}</span>
          <span class="fcard__badge">${p.badge || p.brandName}</span>
        </div>
        <div class="fcard__img-box">
          <img src="${p.images[0]}" alt="${p.name}" class="fcard__img" loading="lazy" />
        </div>
        <div class="fcard__content">
          <div class="fcard__brand-row">
            <span class="fcard__brand">${p.brandName}</span>
            <span class="fcard__name-en ltr-text">${p.nameEn}</span>
          </div>
          <h3 class="fcard__title"><a href="/product/${p.slug}">${p.name}</a></h3>
          <p class="fcard__tagline">${p.tagline}</p>
          <div class="fcard__footer">
            <div class="fcard__price-box">
              <span class="fcard__price-label">شروع قیمت از:</span>
              <strong class="fcard__price">${window.formatToman(p.basePrice)}</strong>
            </div>
            <div class="fcard__actions">
              <button type="button" class="btn btn--sm btn--secondary" onclick="Store.openQuickView('${p.id}')" title="مشاهده سریع">
                🔍
              </button>
              <button type="button" class="btn btn--sm btn--secondary" onclick="Store.addToCart('${p.id}')">
                خرید
              </button>
              <a href="/product/${p.slug}" class="btn btn--sm btn--primary">جزئیات</a>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Filter & Sort Products for Collection
  function getFilteredProducts() {
    let list = [...(window.PRODUCTS_DATA || [])];

    // Filter by Brand
    if (activeBrand !== 'all') {
      list = list.filter(p => p.brand === activeBrand);
    }

    // Filter by Storage
    if (activeStorage !== 'all') {
      list = list.filter(p => (p.storageVariants || []).some(s => s.size === activeStorage));
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.nameEn.toLowerCase().includes(q) || 
        p.brandName.toLowerCase().includes(q) ||
        (p.shortDesc && p.shortDesc.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (activeSort === 'price-asc') {
      list.sort((a, b) => a.basePrice - b.basePrice);
    } else if (activeSort === 'price-desc') {
      list.sort((a, b) => b.basePrice - a.basePrice);
    } else if (activeSort === 'newest') {
      list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    } else if (activeSort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }

  // Render Collection Grid
  function renderCollectionGrid() {
    const grid = document.getElementById('collectionGrid');
    const countEl = document.getElementById('collectionCount');
    if (!grid) return;

    const list = getFilteredProducts();
    if (countEl) countEl.textContent = window.toPersianNumber(list.length);

    if (list.length === 0) {
      grid.innerHTML = `
        <div class="col-empty">
          <div class="col-empty__icon">🔍</div>
          <h3>هیچ محصولی با فیلترهای انتخابی یافت نشد</h3>
          <p>لطفاً فیلترهای برند یا حافظه را تغییر دهید یا عبارت دیگری جستجو کنید.</p>
          <button type="button" class="btn btn--secondary" onclick="resetFilters()">بازنشانی فیلترها</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = list.map(p => `
      <div class="pcard js-tilt-card" data-id="${p.id}">
        <div class="pcard__thumb-box">
          <a href="/product/${p.slug}" class="pcard__thumb-link">
            <img src="${p.images[0]}" alt="${p.name}" class="pcard__img" loading="lazy" />
          </a>
          ${p.badge ? `<span class="pcard__badge">${p.badge}</span>` : ''}
          <div class="pcard__floating-actions">
            <button type="button" class="pcard__icon-btn ${Store.isInWishlist(p.id) ? 'is-active' : ''}" onclick="Store.toggleWishlist('${p.id}'); this.classList.toggle('is-active', Store.isInWishlist('${p.id}'));" title="علاقه‌مندی">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${Store.isInWishlist(p.id) ? '#ff4b4b' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
            <button type="button" class="pcard__icon-btn ${Store.isInCompare(p.id) ? 'is-active' : ''}" onclick="Store.toggleCompare('${p.id}'); this.classList.toggle('is-active', Store.isInCompare('${p.id}'));" title="مقایسه مشخصات">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 3h5v5"/><path d="M4 20L21 3"/><path d="M21 16v5h-5"/><path d="M15 15l6 6"/><path d="M4 4l5 5"/></svg>
            </button>
            <button type="button" class="pcard__icon-btn" onclick="Store.openQuickView('${p.id}')" title="پیش‌نمایش سریع">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
          </div>
        </div>

        <div class="pcard__body">
          <div class="pcard__meta">
            <span class="pcard__brand">${p.brandName}</span>
            <span class="pcard__rating">★ ${window.toPersianNumber(p.rating)}</span>
          </div>

          <h3 class="pcard__title"><a href="/product/${p.slug}">${p.name}</a></h3>
          <div class="pcard__title-en ltr-text">${p.nameEn}</div>

          <div class="pcard__specs-tags">
            <span class="spec-tag">${p.specs.chipset.split('(')[0].trim()}</span>
            <span class="spec-tag">${p.specs.camera.split('+')[0].trim()}</span>
          </div>

          <div class="pcard__price-row">
            <div>
              <div class="pcard__price">${window.formatToman(p.basePrice)}</div>
              ${p.previousPrice ? `<del class="pcard__prev-price">${window.formatToman(p.previousPrice)}</del>` : ''}
            </div>
            <button type="button" class="btn btn--primary btn--sm pcard__add-btn" onclick="Store.addToCart('${p.id}')">
              <span>خرید</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            </button>
          </div>
        </div>
      </div>
    `).join('');

    setupTiltEffect();
  }

  // 3D Perspective Tilt on Card Hover
  function setupTiltEffect() {
    if (window.matchMedia('(max-width: 991px)').matches) return;
    const cards = document.querySelectorAll('.js-tilt-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  window.setBrandFilter = function (brand, el) {
    activeBrand = brand;
    document.querySelectorAll('.brand-tab').forEach(b => b.classList.remove('is-active'));
    if (el) el.classList.add('is-active');
    renderCollectionGrid();
  };

  window.setStorageFilter = function (storage, el) {
    activeStorage = storage;
    document.querySelectorAll('.storage-filter-btn').forEach(b => b.classList.remove('is-active'));
    if (el) el.classList.add('is-active');
    renderCollectionGrid();
  };

  window.setSort = function (sort) {
    activeSort = sort;
    renderCollectionGrid();
  };

  window.handleCollectionSearch = function (val) {
    searchQuery = val;
    renderCollectionGrid();
  };

  window.resetFilters = function () {
    activeBrand = 'all';
    activeStorage = 'all';
    activeSort = 'featured';
    searchQuery = '';
    const searchInput = document.getElementById('collectionSearchInput');
    if (searchInput) searchInput.value = '';
    document.querySelectorAll('.brand-tab').forEach(b => b.classList.toggle('is-active', b.dataset.brand === 'all'));
    document.querySelectorAll('.storage-filter-btn').forEach(b => b.classList.toggle('is-active', b.dataset.storage === 'all'));
    renderCollectionGrid();
  };

  window.toggleMobileNav = function () {
    const nav = document.getElementById('mobileNav');
    if (nav) {
      nav.classList.toggle('is-open');
      document.body.classList.toggle('modal-locked');
    }
  };

  function setupEventListeners() {
    window.addEventListener('store:wishlist-updated', () => {
      renderCollectionGrid();
    });

    window.addEventListener('store:compare-updated', () => {
      renderCollectionGrid();
    });
  }

  window.addEventListener('DOMContentLoaded', initHomepage);
})();
