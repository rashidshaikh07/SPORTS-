/**
 * CricSphere - Core App JavaScript
 * Handles navigation, mobile menu, cart management, toast notifications, and shared UI components
 */

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initLiveTicker();
  initCart();
  initModals();
});

/* ============================================================
   MOBILE NAVIGATION
   ============================================================ */
function initMobileNav() {
  const toggleBtn = document.querySelector(".mobile-nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  
  if (!toggleBtn || !navMenu) return;

  // Create backdrop if not existing
  let backdrop = document.querySelector(".nav-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.className = "drawer-backdrop nav-backdrop";
    document.body.appendChild(backdrop);
  }

  toggleBtn.addEventListener("click", () => {
    const isOpen = navMenu.classList.contains("active");
    if (isOpen) {
      navMenu.classList.remove("active");
      backdrop.classList.remove("active");
      toggleBtn.innerHTML = "☰";
    } else {
      navMenu.classList.add("active");
      backdrop.classList.add("active");
      toggleBtn.innerHTML = "✕";
    }
  });

  backdrop.addEventListener("click", () => {
    navMenu.classList.remove("active");
    backdrop.classList.remove("active");
    toggleBtn.innerHTML = "☰";
  });
}

/* ============================================================
   LIVE SCORE TICKER
   ============================================================ */
async function initLiveTicker() {
  const tickerContainer = document.querySelector(".ticker-scroll");
  if (!tickerContainer) return;

  try {
    const matches = await window.CricDB.getMatches();
    if (!matches || matches.length === 0) return;

    tickerContainer.innerHTML = matches.map(m => {
      const isLive = m.status === 'live';
      const statusBadge = isLive ? `<span class="badge badge-live">LIVE</span>` : `<span class="badge badge-upcoming">${m.status.toUpperCase()}</span>`;
      const scoreStr = isLive 
        ? `${m.team1_short}: ${m.team1_score} (${m.team1_overs}) vs ${m.team2_short}: ${m.team2_score} (${m.team2_overs})`
        : `${m.team1_short} vs ${m.team2_short} • ${m.tournament}`;

      return `
        <div class="ticker-item">
          ${statusBadge}
          <strong>${scoreStr}</strong>
          <span class="ticker-score">${m.result_summary || m.venue}</span>
        </div>
      `;
    }).join("");
  } catch (err) {
    console.warn("Could not load ticker data:", err);
  }
}

/* ============================================================
   SHOPPING CART SYSTEM
   ============================================================ */
const CART_STORAGE_KEY = "cric_cart_items";

function getCart() {
  try {
    const items = localStorage.getItem(CART_STORAGE_KEY);
    return items ? JSON.parse(items) : [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  updateCartUI();
}

function addToCart(product, qty = 1) {
  const cart = getCart();
  const existingIndex = cart.findIndex(item => item.id === product.id);

  if (existingIndex > -1) {
    cart[existingIndex].quantity += qty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.discount_price || product.price,
      image_url: product.image_url,
      quantity: qty
    });
  }

  saveCart(cart);
  showToast(`Added "${product.name}" to cart!`, "gold");
  openCartDrawer();
}

function updateCartItemQty(id, delta) {
  let cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== id);
  }

  saveCart(cart);
}

function removeCartItem(id) {
  let cart = getCart();
  cart = cart.filter(i => i.id !== id);
  saveCart(cart);
  showToast("Item removed from cart.", "normal");
}

function clearCart() {
  localStorage.removeItem(CART_STORAGE_KEY);
  updateCartUI();
}

function updateCartUI() {
  const cart = getCart();
  const countBadges = document.querySelectorAll(".cart-badge");
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  countBadges.forEach(badge => {
    badge.textContent = totalCount;
    badge.style.display = totalCount > 0 ? "flex" : "none";
  });

  const cartList = document.querySelector(".cart-items-container");
  const cartSubtotalEl = document.querySelector(".cart-subtotal-val");
  const checkoutBtn = document.querySelector(".cart-checkout-btn");

  if (!cartList) return;

  if (cart.length === 0) {
    cartList.innerHTML = `
      <div style="text-align: center; padding: 40px 0; color: var(--text-dim);">
        <div style="font-size: 3rem; margin-bottom: 10px;">🏏</div>
        <p style="font-size: 1.1rem; color: #fff; margin-bottom: 6px;">Your cart is empty</p>
        <p style="font-size: 0.85rem;">Discover top English Willow bats & gear in our store!</p>
      </div>
    `;
    if (cartSubtotalEl) cartSubtotalEl.textContent = "$0.00";
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }

  if (checkoutBtn) checkoutBtn.disabled = false;

  let subtotal = 0;
  cartList.innerHTML = cart.map(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    return `
      <div class="cart-item-row">
        <img src="${item.image_url}" alt="${item.name}" class="cart-item-img" onerror="this.src='https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=100'">
        <div class="cart-item-info">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">$${item.price.toFixed(2)}</div>
        </div>
        <div class="cart-qty-ctrls">
          <button class="qty-btn" onclick="updateCartItemQty('${item.id}', -1)">-</button>
          <span style="font-size: 0.85rem; font-weight: 700; color: #fff;">${item.quantity}</span>
          <button class="qty-btn" onclick="updateCartItemQty('${item.id}', 1)">+</button>
        </div>
        <button class="btn-icon delete" onclick="removeCartItem('${item.id}')" title="Remove">✕</button>
      </div>
    `;
  }).join("");

  if (cartSubtotalEl) {
    cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  }
}

function openCartDrawer() {
  const drawer = document.querySelector(".cart-drawer");
  const backdrop = document.querySelector(".cart-backdrop");
  if (drawer && backdrop) {
    drawer.classList.add("active");
    backdrop.classList.add("active");
    updateCartUI();
  }
}

function closeCartDrawer() {
  const drawer = document.querySelector(".cart-drawer");
  const backdrop = document.querySelector(".cart-backdrop");
  if (drawer && backdrop) {
    drawer.classList.remove("active");
    backdrop.classList.remove("active");
  }
}

function initCart() {
  updateCartUI();

  const triggers = document.querySelectorAll(".cart-trigger");
  triggers.forEach(t => t.addEventListener("click", openCartDrawer));

  const closeBtn = document.querySelector(".close-cart-btn");
  if (closeBtn) closeBtn.addEventListener("click", closeCartDrawer);

  const backdrop = document.querySelector(".cart-backdrop");
  if (backdrop) backdrop.addEventListener("click", closeCartDrawer);

  const checkoutBtn = document.querySelector(".cart-checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      closeCartDrawer();
      openCheckoutModal();
    });
  }
}

/* ============================================================
   CHECKOUT MODAL & ORDER SUBMISSION
   ============================================================ */
function openCheckoutModal() {
  const modal = document.querySelector("#checkout-modal");
  if (!modal) return;

  const cart = getCart();
  if (cart.length === 0) {
    showToast("Your cart is empty.", "error");
    return;
  }

  const subtotal = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const totalAmountEl = modal.querySelector(".checkout-total-val");
  if (totalAmountEl) {
    totalAmountEl.textContent = `$${subtotal.toFixed(2)}`;
  }

  modal.classList.add("active");
}

async function handleCheckoutSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const cart = getCart();

  if (cart.length === 0) {
    showToast("Your cart is empty.", "error");
    return;
  }

  const subtotal = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);

  const orderData = {
    customer_name: form.customer_name.value.trim(),
    customer_email: form.customer_email.value.trim(),
    customer_phone: form.customer_phone.value.trim(),
    delivery_address: form.delivery_address.value.trim(),
    payment_method: form.payment_method.value,
    items: cart,
    total_amount: subtotal,
    status: "pending"
  };

  const submitBtn = form.querySelector("button[type='submit']");
  submitBtn.disabled = true;
  submitBtn.textContent = "Processing Order...";

  try {
    const res = await window.CricDB.saveOrder(orderData);
    if (res && res.success) {
      showToast("🎉 Order placed successfully! We will contact you shortly.", "gold");
      clearCart();
      form.reset();
      const modal = document.querySelector("#checkout-modal");
      if (modal) modal.classList.remove("active");
    } else {
      showToast("Order saved locally. Confirmation underway.", "gold");
      clearCart();
      form.reset();
      const modal = document.querySelector("#checkout-modal");
      if (modal) modal.classList.remove("active");
    }
  } catch (err) {
    showToast("Error processing order. Please try again.", "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Place Cricket Order";
  }
}

/* ============================================================
   MODALS UTILITY
   ============================================================ */
function initModals() {
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.classList.remove("active");
      }
    });
  });

  document.querySelectorAll(".modal-close-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const modal = btn.closest(".modal-overlay");
      if (modal) modal.classList.remove("active");
    });
  });
}

/* ============================================================
   TOAST NOTIFICATION SYSTEM
   ============================================================ */
function showToast(message, type = "normal") {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${type === 'error' ? '⚠️' : type === 'gold' ? '🏏' : '✓'}</span>
    <div>${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Global functions
window.addToCart = addToCart;
window.updateCartItemQty = updateCartItemQty;
window.removeCartItem = removeCartItem;
window.clearCart = clearCart;
window.openCartDrawer = openCartDrawer;
window.closeCartDrawer = closeCartDrawer;
window.openCheckoutModal = openCheckoutModal;
window.handleCheckoutSubmit = handleCheckoutSubmit;
window.showToast = showToast;
