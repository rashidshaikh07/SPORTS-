/**
 * CricSphere - Cricket Store & Products Logic
 */

document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector("#products-container") || document.querySelector("#home-products-grid")) {
    initProductsView();
  }
});

let currentCategory = "All";
let searchQuery = "";
let sortBy = "featured";

async function initProductsView() {
  bindStoreControls();
  await loadProducts();
}

function bindStoreControls() {
  // Category tabs
  const catButtons = document.querySelectorAll(".store-cat-filter");
  catButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      catButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.dataset.category;
      loadProducts();
    });
  });

  // Search input
  const searchInput = document.querySelector("#store-search");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.trim();
      loadProducts();
    });
  }

  // Sort dropdown
  const sortSelect = document.querySelector("#store-sort");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      sortBy = e.target.value;
      loadProducts();
    });
  }
}

async function loadProducts() {
  const container = document.querySelector("#products-container") || document.querySelector("#home-products-grid");
  if (!container) return;

  container.innerHTML = `<div style="text-align: center; padding: 40px; color: var(--text-dim);">Loading gear & merchandise...</div>`;

  try {
    let products = await window.CricDB.getProducts(currentCategory, searchQuery);

    // Sort products
    if (sortBy === "price-low") {
      products.sort((a, b) => (a.discount_price || a.price) - (b.discount_price || b.price));
    } else if (sortBy === "price-high") {
      products.sort((a, b) => (b.discount_price || b.price) - (a.discount_price || a.price));
    } else if (sortBy === "rating") {
      products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    if (!products || products.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 50px 20px; background: var(--card-bg); border-radius: var(--radius-md); border: 1px solid var(--card-border);">
          <div style="font-size: 2.5rem; margin-bottom: 10px;">🛍️</div>
          <h3 style="color: #fff; margin-bottom: 8px;">No gear found</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem;">Try adjusting your search terms or selecting another category.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = products.map(p => {
      const activePrice = p.discount_price || p.price;
      const hasDiscount = p.discount_price && p.discount_price < p.price;

      return `
        <div class="product-card">
          <div class="product-img-box">
            <img src="${p.image_url}" alt="${p.name}" class="product-img" onerror="this.src='https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=500'">
            <span class="product-category-tag">${p.category}</span>
          </div>

          <div class="product-body">
            <div>
              <h3 class="product-title">${p.name}</h3>
              <div class="product-rating">
                <span>★</span> <strong>${p.rating || 4.8}</strong>
                <span style="color: var(--text-dim); font-size: 0.75rem;">(${p.stock || 10} in stock)</span>
              </div>
              <p style="color: var(--text-muted); font-size: 0.82rem; margin-bottom: 12px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                ${p.description || 'Premium official tournament gear.'}
              </p>
            </div>

            <div>
              <div class="product-price-row">
                <span class="price-current">$${activePrice.toFixed(2)}</span>
                ${hasDiscount ? `<span class="price-old">$${p.price.toFixed(2)}</span>` : ''}
              </div>

              <button class="btn btn-primary" style="width: 100%;" onclick='window.addToCart(${JSON.stringify(p).replace(/'/g, "&apos;")})'>
                🛒 Add to Cart
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");
  } catch (err) {
    console.error("Error loading products:", err);
    container.innerHTML = `<div style="text-align: center; padding: 40px; color: var(--red-500);">Failed to load products: ${err.message}</div>`;
  }
}

window.loadProducts = loadProducts;
