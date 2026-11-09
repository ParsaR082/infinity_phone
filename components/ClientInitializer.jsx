'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ClientInitializer() {
  const pathname = usePathname();

  useEffect(() => {
    // Remove intro/prepaint classes
    document.documentElement.classList.remove('is-intro', 'is-prepaint');
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'none';

    // Update badges
    function updateBadges() {
      if (!window.Store) return;
      const toPersian = window.toPersianNumber || ((n) => String(n));

      const cartEl = document.getElementById('cartBadgeCount');
      if (cartEl) cartEl.textContent = toPersian(window.Store.getCartCount());

      const wlEl = document.getElementById('wishlistBadgeCount');
      if (wlEl) wlEl.textContent = toPersian(window.Store.getWishlistCount());

      const cmpEl = document.getElementById('compareBadgeCount');
      if (cmpEl) cmpEl.textContent = toPersian(window.Store.getCompareList().length);
    }

    const timer = setTimeout(updateBadges, 150);

    const onCartUpdate = () => updateBadges();
    const onWishlistUpdate = () => updateBadges();
    const onCompareUpdate = () => updateBadges();

    window.addEventListener('store:cart-updated', onCartUpdate);
    window.addEventListener('store:wishlist-updated', onWishlistUpdate);
    window.addEventListener('store:compare-updated', onCompareUpdate);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('store:cart-updated', onCartUpdate);
      window.removeEventListener('store:wishlist-updated', onWishlistUpdate);
      window.removeEventListener('store:compare-updated', onCompareUpdate);
    };
  }, [pathname]);

  return null;
}

