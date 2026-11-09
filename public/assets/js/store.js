/**
 * Infinity Phone - Frontend Shopping & Interaction Store
 * Pure client-side state with localStorage persistence.
 */

(function () {
  const CART_KEY = 'inf_cart_v1';
  const WISHLIST_KEY = 'inf_wishlist_v1';
  const COMPARE_KEY = 'inf_compare_v1';

  function loadCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      window.dispatchEvent(new CustomEvent('store:cart-updated', { detail: { cart } }));
    } catch (e) {}
  }

  function loadWishlist() {
    try {
      return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveWishlist(wishlist) {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
      window.dispatchEvent(new CustomEvent('store:wishlist-updated', { detail: { wishlist } }));
    } catch (e) {}
  }

  function loadCompare() {
    try {
      return JSON.parse(localStorage.getItem(COMPARE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveCompare(compareList) {
    try {
      localStorage.setItem(COMPARE_KEY, JSON.stringify(compareList));
      window.dispatchEvent(new CustomEvent('store:compare-updated', { detail: { compareList } }));
    } catch (e) {}
  }

  // Audio SFX Controller
  let audioCtx = null;
  let bgMusic = null;
  let isSoundOn = false;

  function initAudio() {
    if (bgMusic) return;
    try {
      bgMusic = new Audio('/assets/sfx/v2/bed-summer-colors-78.mp3');
      bgMusic.loop = true;
      bgMusic.volume = 0.25;
    } catch (e) {}
  }

  function playSfx(name) {
    if (!isSoundOn) return;
    try {
      const sfx = new Audio(`/assets/sfx/v2/${name}.mp3`);
      sfx.volume = 0.4;
      sfx.play().catch(() => {});
    } catch (e) {}
  }

  window.Store = {
    getProducts: function () {
      return window.PRODUCTS_DATA || [];
    },

    getProductBySlug: function (slug) {
      return (window.PRODUCTS_DATA || []).find(p => p.slug === slug);
    },

    getProductById: function (id) {
      return (window.PRODUCTS_DATA || []).find(p => p.id === id);
    },

    // Cart Management
    getCart: function () {
      return loadCart();
    },

    addToCart: function (productId, colorId, storageSize, qty) {
      qty = qty || 1;
      const product = this.getProductById(productId);
      if (!product) return;

      const color = (product.colors || []).find(c => c.id === colorId) || product.colors[0];
      const storage = (product.storageVariants || []).find(s => s.size === storageSize) || product.storageVariants[0];
      const unitPrice = product.basePrice + (storage ? storage.priceDiff : 0);

      const cart = loadCart();
      const existingIndex = cart.findIndex(item => 
        item.productId === productId && 
        item.colorId === color.id && 
        item.storageSize === storage.size
      );

      if (existingIndex > -1) {
        cart[existingIndex].quantity += qty;
      } else {
        cart.push({
          cartItemId: 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
          productId: product.id,
          slug: product.slug,
          name: product.name,
          nameEn: product.nameEn,
          brand: product.brand,
          color: color,
          storage: storage,
          unitPrice: unitPrice,
          image: product.images[0],
          quantity: qty
        });
      }

      saveCart(cart);
      playSfx('click');
      this.openCart();
      this.showToast(`«${product.name}» به سبد خرید افزوده شد.`);
    },

    updateQuantity: function (cartItemId, delta) {
      const cart = loadCart();
      const item = cart.find(i => i.cartItemId === cartItemId);
      if (!item) return;

      item.quantity += delta;
      if (item.quantity <= 0) {
        this.removeFromCart(cartItemId);
      } else {
        saveCart(cart);
        playSfx('click');
      }
    },

    removeFromCart: function (cartItemId) {
      let cart = loadCart();
      cart = cart.filter(i => i.cartItemId !== cartItemId);
      saveCart(cart);
      playSfx('click');
      this.showToast('آیتم از سبد خرید حذف شد.');
    },

    clearCart: function () {
      saveCart([]);
    },

    getCartCount: function () {
      return loadCart().reduce((sum, item) => sum + item.quantity, 0);
    },

    getCartTotal: function () {
      return loadCart().reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    },

    // Wishlist
    getWishlist: function () {
      return loadWishlist();
    },

    isInWishlist: function (productId) {
      return loadWishlist().includes(productId);
    },

    toggleWishlist: function (productId) {
      let wl = loadWishlist();
      const product = this.getProductById(productId);
      const name = product ? product.name : 'محصول';

      if (wl.includes(productId)) {
        wl = wl.filter(id => id !== productId);
        this.showToast(`«${name}» از لیست علاقه‌مندی‌ها حذف شد.`);
      } else {
        wl.push(productId);
        this.showToast(`«${name}» به لیست علاقه‌مندی‌ها افزوده شد.`);
      }
      playSfx('click');
      saveWishlist(wl);
    },

    getWishlistCount: function () {
      return loadWishlist().length;
    },

    // Compare System
    getCompareList: function () {
      return loadCompare();
    },

    isInCompare: function (productId) {
      return loadCompare().includes(productId);
    },

    toggleCompare: function (productId) {
      let list = loadCompare();
      const product = this.getProductById(productId);
      const name = product ? product.name : 'محصول';

      if (list.includes(productId)) {
        list = list.filter(id => id !== productId);
        this.showToast(`«${name}» از لیست مقایسه حذف شد.`);
      } else {
        if (list.length >= 3) {
          this.showToast('حداکثر می‌توانید ۳ گوشی را همزمان مقایسه فرمایید.');
          return;
        }
        list.push(productId);
        this.showToast(`«${name}» به لیست مقایسه اضافه شد.`);
        if (list.length >= 2) {
          this.openCompare();
        }
      }
      playSfx('click');
      saveCompare(list);
    },

    removeFromCompare: function (productId) {
      let list = loadCompare();
      list = list.filter(id => id !== productId);
      saveCompare(list);
      this.renderCompareModal();
    },

    // Sound Toggle
    toggleSound: function () {
      initAudio();
      const btn = document.getElementById('snd');
      isSoundOn = !isSoundOn;
      if (btn) {
        btn.classList.toggle('snd--off', !isSoundOn);
        btn.classList.toggle('snd--on', isSoundOn);
        btn.setAttribute('aria-pressed', isSoundOn ? 'true' : 'false');
      }

      if (bgMusic) {
        if (isSoundOn) {
          bgMusic.play().catch(() => {});
          this.showToast('صدای محیطی و افکت‌های صوتی فعال شد.');
        } else {
          bgMusic.pause();
          this.showToast('صدای محیطی غیرفعال شد.');
        }
      }
    },

    // UI Drawers & Modals
    openCart: function () {
      const drawer = document.getElementById('cartDrawer');
      if (drawer) {
        drawer.classList.add('is-open');
        document.body.classList.add('modal-locked');
        this.renderCartDrawer();
      }
    },

    closeCart: function () {
      const drawer = document.getElementById('cartDrawer');
      if (drawer) {
        drawer.classList.remove('is-open');
        document.body.classList.remove('modal-locked');
      }
    },

    openWishlist: function () {
      const drawer = document.getElementById('wishlistDrawer');
      if (drawer) {
        drawer.classList.add('is-open');
        document.body.classList.add('modal-locked');
        this.renderWishlistDrawer();
      }
    },

    closeWishlist: function () {
      const drawer = document.getElementById('wishlistDrawer');
      if (drawer) {
        drawer.classList.remove('is-open');
        document.body.classList.remove('modal-locked');
      }
    },

    openCompare: function () {
      const modal = document.getElementById('compareModal');
      if (modal) {
        modal.classList.add('is-open');
        document.body.classList.add('modal-locked');
        this.renderCompareModal();
      }
    },

    closeCompare: function () {
      const modal = document.getElementById('compareModal');
      if (modal) {
        modal.classList.remove('is-open');
        document.body.classList.remove('modal-locked');
      }
    },

    openSearch: function () {
      const modal = document.getElementById('searchModal');
      if (modal) {
        modal.classList.add('is-open');
        document.body.classList.add('modal-locked');
        setTimeout(() => {
          const input = document.getElementById('searchInput');
          if (input) input.focus();
        }, 100);
      }
    },

    closeSearch: function () {
      const modal = document.getElementById('searchModal');
      if (modal) {
        modal.classList.remove('is-open');
        document.body.classList.remove('modal-locked');
      }
    },

    openCheckout: function () {
      if (this.getCartCount() === 0) {
        this.showToast('سبد خرید شما در حال حاضر خالی است.');
        return;
      }
      this.closeCart();
      const modal = document.getElementById('checkoutModal');
      if (modal) {
        modal.classList.add('is-open');
        document.body.classList.add('modal-locked');
        this.renderCheckoutSummary();
      }
    },

    closeCheckout: function () {
      const modal = document.getElementById('checkoutModal');
      if (modal) {
        modal.classList.remove('is-open');
        document.body.classList.remove('modal-locked');
      }
    },

    openQuickView: function (productId) {
      const p = this.getProductById(productId);
      if (!p) return;
      const modal = document.getElementById('quickViewModal');
      const body = document.getElementById('quickViewBody');
      if (!modal || !body) return;

      body.innerHTML = `
        <div class="qv-grid">
          <div class="qv-gallery">
            <img id="qvMainImg" src="${p.images[0]}" alt="${p.name}" class="qv-main-img" />
            <div class="qv-thumbs">
              ${p.images.map((img, i) => `
                <button type="button" class="qv-thumb ${i === 0 ? 'is-active' : ''}" onclick="document.getElementById('qvMainImg').src='${img}'; document.querySelectorAll('.qv-thumb').forEach(b=>b.classList.remove('is-active')); this.classList.add('is-active');">
                  <img src="${img}" alt="${p.name}" />
                </button>
              `).join('')}
            </div>
          </div>
          <div class="qv-details">
            <div class="qv-brand">${p.brandName} • <span class="ltr-text">${p.nameEn}</span></div>
            <h3 class="qv-title">${p.name}</h3>
            <div class="qv-price">${window.formatToman(p.basePrice)}</div>
            <p class="qv-desc">${p.shortDesc}</p>
            <div class="qv-specs">
              <div>🖥️ ${p.specs.screen}</div>
              <div>⚡ ${p.specs.chipset}</div>
              <div>📷 ${p.specs.camera}</div>
            </div>
            <div class="qv-actions">
              <button type="button" class="btn btn--primary btn--block btn--lg" onclick="Store.addToCart('${p.id}'); Store.closeQuickView();">
                افزودن به سبد خرید
              </button>
              <a href="/product/${p.slug}" class="btn btn--secondary btn--block">مشاهده مشخصات کامل و خرید اقساطی ←</a>
            </div>
          </div>
        </div>
      `;

      modal.classList.add('is-open');
      document.body.classList.add('modal-locked');
    },

    closeQuickView: function () {
      const modal = document.getElementById('quickViewModal');
      if (modal) {
        modal.classList.remove('is-open');
        document.body.classList.remove('modal-locked');
      }
    },

    showToast: function (message) {
      let toast = document.getElementById('appToast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'appToast';
        toast.className = 'app-toast';
        document.body.appendChild(toast);
      }
      toast.textContent = message;
      toast.classList.add('is-visible');
      clearTimeout(this._toastTimeout);
      this._toastTimeout = setTimeout(() => {
        toast.classList.remove('is-visible');
      }, 3500);
    },

    // Render Cart Drawer
    renderCartDrawer: function () {
      const container = document.getElementById('cartDrawerItems');
      const totalEl = document.getElementById('cartDrawerTotal');
      const badgeCountEl = document.getElementById('cartBadgeCount');
      if (!container) return;

      const cart = this.getCart();
      if (badgeCountEl) badgeCountEl.textContent = window.toPersianNumber(this.getCartCount());

      if (cart.length === 0) {
        container.innerHTML = `
          <div class="cart-empty-state">
            <div class="cart-empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            </div>
            <p class="cart-empty-title">سبد خرید شما خالی است</p>
            <p class="cart-empty-desc">جدیدترین گوشی‌های پرچمدار را در مجموعه ما بررسی کنید.</p>
            <button class="btn btn--primary" onclick="Store.closeCart(); document.getElementById('collection')?.scrollIntoView({behavior:'smooth'})">مشاهده پرچمداران</button>
          </div>
        `;
        if (totalEl) totalEl.textContent = window.formatToman(0);
        return;
      }

      let html = '';
      cart.forEach(item => {
        html += `
          <div class="cart-item">
            <div class="cart-item__thumb">
              <img src="${item.image}" alt="${item.name}" loading="lazy" />
            </div>
            <div class="cart-item__info">
              <div class="cart-item__name">${item.name}</div>
              <div class="cart-item__meta">
                <span class="cart-item__color" style="--c:${item.color.hex}"></span>
                <span>${item.color.name}</span> • <span>${item.storage.size}</span>
              </div>
              <div class="cart-item__price">${window.formatToman(item.unitPrice)}</div>
              <div class="cart-item__controls">
                <div class="qty-stepper">
                  <button type="button" class="qty-btn" onclick="Store.updateQuantity('${item.cartItemId}', -1)">-</button>
                  <span class="qty-val">${window.toPersianNumber(item.quantity)}</span>
                  <button type="button" class="qty-btn" onclick="Store.updateQuantity('${item.cartItemId}', 1)">+</button>
                </div>
                <button type="button" class="cart-item__remove" onclick="Store.removeFromCart('${item.cartItemId}')">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  حذف
                </button>
              </div>
            </div>
          </div>
        `;
      });

      container.innerHTML = html;
      if (totalEl) totalEl.textContent = window.formatToman(this.getCartTotal());
    },

    // Render Wishlist Drawer
    renderWishlistDrawer: function () {
      const container = document.getElementById('wishlistDrawerItems');
      const badgeCountEl = document.getElementById('wishlistBadgeCount');
      if (!container) return;

      const wlIds = this.getWishlist();
      if (badgeCountEl) badgeCountEl.textContent = window.toPersianNumber(wlIds.length);

      const items = wlIds.map(id => this.getProductById(id)).filter(Boolean);

      if (items.length === 0) {
        container.innerHTML = `
          <div class="cart-empty-state">
            <div class="cart-empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </div>
            <p class="cart-empty-title">لیست علاقه‌مندی‌ها خالی است</p>
            <p class="cart-empty-desc">با کلیک روی آیکون قلب، پرچمداران دلخواهتان را ذخیره نمایید.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = items.map(p => `
        <div class="cart-item">
          <div class="cart-item__thumb">
            <img src="${p.images[0]}" alt="${p.name}" loading="lazy" />
          </div>
          <div class="cart-item__info">
            <div class="cart-item__name"><a href="/product/${p.slug}">${p.name}</a></div>
            <div class="cart-item__meta">${p.brandName} • <span class="ltr-text">${p.nameEn}</span></div>
            <div class="cart-item__price">${window.formatToman(p.basePrice)}</div>
            <div class="cart-item__controls">
              <button type="button" class="btn btn--primary btn--sm" onclick="Store.addToCart('${p.id}'); Store.closeWishlist();">
                خرید
              </button>
              <button type="button" class="cart-item__remove" onclick="Store.toggleWishlist('${p.id}'); Store.renderWishlistDrawer();">
                حذف
              </button>
            </div>
          </div>
        </div>
      `).join('');
    },

    // Render Compare Modal
    renderCompareModal: function () {
      const container = document.getElementById('compareModalBody');
      if (!container) return;

      const compareIds = this.getCompareList();
      const products = compareIds.map(id => this.getProductById(id)).filter(Boolean);

      if (products.length === 0) {
        container.innerHTML = `
          <div class="cart-empty-state">
            <p class="cart-empty-title">هیچ گوشی برای مقایسه انتخاب نشده است</p>
            <p class="cart-empty-desc">روی دکمه مقایسه کارت‌های محصول کلیک کنید تا مشخصات آن‌ها در کنار هم قرار گیرند.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = `
        <div class="compare-table-wrap">
          <table class="compare-table">
            <thead>
              <tr>
                <th class="spec-head">مشخصه فنی</th>
                ${products.map(p => `
                  <th>
                    <div class="compare-col-head">
                      <button type="button" class="compare-remove-btn" onclick="Store.removeFromCompare('${p.id}')">✕</button>
                      <img src="${p.images[0]}" alt="${p.name}" class="compare-img" />
                      <h4>${p.name}</h4>
                      <div class="compare-price">${window.formatToman(p.basePrice)}</div>
                      <button type="button" class="btn btn--primary btn--sm" style="margin-top:8px;" onclick="Store.addToCart('${p.id}'); Store.closeCompare();">خرید</button>
                    </div>
                  </th>
                `).join('')}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="spec-label">برند سازنده</td>
                ${products.map(p => `<td>${p.brandName}</td>`).join('')}
              </tr>
              <tr>
                <td class="spec-label">تراشه و پردازنده</td>
                ${products.map(p => `<td>${p.specs.chipset}</td>`).join('')}
              </tr>
              <tr>
                <td class="spec-label">صفحه‌نمایش</td>
                ${products.map(p => `<td>${p.specs.screen}</td>`).join('')}
              </tr>
              <tr>
                <td class="spec-label">دوربین اصلی</td>
                ${products.map(p => `<td>${p.specs.camera}</td>`).join('')}
              </tr>
              <tr>
                <td class="spec-label">دوربین سلفی</td>
                ${products.map(p => `<td>${p.specs.frontCamera}</td>`).join('')}
              </tr>
              <tr>
                <td class="spec-label">باتری و شارژ</td>
                ${products.map(p => `<td>${p.specs.battery}</td>`).join('')}
              </tr>
              <tr>
                <td class="spec-label">جنس بدنه و شیلد</td>
                ${products.map(p => `<td>${p.specs.material}</td>`).join('')}
              </tr>
              <tr>
                <td class="spec-label">وزن</td>
                ${products.map(p => `<td>${p.specs.weight}</td>`).join('')}
              </tr>
              <tr>
                <td class="spec-label">سیستم‌عامل و AI</td>
                ${products.map(p => `<td>${p.specs.os}</td>`).join('')}
              </tr>
            </tbody>
          </table>
        </div>
      `;
    },

    renderCheckoutSummary: function () {
      const summaryEl = document.getElementById('checkoutItemsList');
      const totalEl = document.getElementById('checkoutTotalAmount');
      if (!summaryEl) return;

      const cart = this.getCart();
      let html = '';
      cart.forEach(item => {
        html += `
          <div class="checkout-summary-row">
            <span>${item.name} (${item.storage.size} - ${item.color.name}) × ${window.toPersianNumber(item.quantity)}</span>
            <span>${window.formatToman(item.unitPrice * item.quantity)}</span>
          </div>
        `;
      });
      summaryEl.innerHTML = html;
      if (totalEl) totalEl.textContent = window.formatToman(this.getCartTotal());
    },

    processDemoCheckout: function (e) {
      if (e) e.preventDefault();
      const form = document.getElementById('checkoutForm');
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const orderNumber = 'INF-' + Math.floor(100000 + Math.random() * 900000);
      const trackingCode = 'TRK-' + Math.floor(10000000 + Math.random() * 90000000);
      const totalFormatted = window.formatToman(this.getCartTotal());

      const modalBody = document.getElementById('checkoutModalBody');
      if (modalBody) {
        modalBody.innerHTML = `
          <div class="checkout-success">
            <div class="checkout-success__icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#00f59b" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <h3 class="checkout-success__title">سفارش شما با موفقیت ثبت شد!</h3>
            <p class="checkout-success__desc">این سفارش در حالت آزمایشی (Demo) ثبت گردیده و بدون کسر وجه واقعی است.</p>
            
            <div class="order-receipt">
              <div class="receipt-row">
                <span>شماره سفارش:</span>
                <strong class="ltr-text">${orderNumber}</strong>
              </div>
              <div class="receipt-row">
                <span>کد رهگیری پستی:</span>
                <strong class="ltr-text">${trackingCode}</strong>
              </div>
              <div class="receipt-row">
                <span>مبلغ کل پرداخت‌شده:</span>
                <strong>${totalFormatted}</strong>
              </div>
              <div class="receipt-row">
                <span>وضعیت:</span>
                <span style="color:#00f59b;">تایید شده و در صف بسته‌بندی بیمه‌شده</span>
              </div>
            </div>

            <button type="button" class="btn btn--primary" style="margin-top:24px; width:100%;" onclick="Store.clearCart(); Store.closeCheckout(); location.reload();">
              بازگشت به فروشگاه
            </button>
          </div>
        `;
      }
    }
  };

  // Sync badges on load
  window.addEventListener('DOMContentLoaded', () => {
    const badge = document.getElementById('cartBadgeCount');
    if (badge) badge.textContent = window.toPersianNumber(window.Store.getCartCount());

    const wlBadge = document.getElementById('wishlistBadgeCount');
    if (wlBadge) wlBadge.textContent = window.toPersianNumber(window.Store.getWishlistCount());

    const cmpBadge = document.getElementById('compareBadgeCount');
    if (cmpBadge) cmpBadge.textContent = window.toPersianNumber(window.Store.getCompareList().length);

    // Hook up sound toggle button
    const sndBtn = document.getElementById('snd');
    if (sndBtn) {
      sndBtn.addEventListener('click', () => {
        window.Store.toggleSound();
      });
    }
  });

  window.addEventListener('store:cart-updated', () => {
    const badge = document.getElementById('cartBadgeCount');
    if (badge) badge.textContent = window.toPersianNumber(window.Store.getCartCount());
    window.Store.renderCartDrawer();
  });

  window.addEventListener('store:wishlist-updated', () => {
    const wlBadge = document.getElementById('wishlistBadgeCount');
    if (wlBadge) wlBadge.textContent = window.toPersianNumber(window.Store.getWishlistCount());
    window.Store.renderWishlistDrawer();
  });

  window.addEventListener('store:compare-updated', () => {
    const cmpBadge = document.getElementById('compareBadgeCount');
    if (cmpBadge) cmpBadge.textContent = window.toPersianNumber(window.Store.getCompareList().length);
  });
})();
