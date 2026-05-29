const business = {
  name: "VACON",
  contactName: "Cristian",
  whatsapp: "5491140615610",
  paymentLink: "",
  currency: "ARS",
};

const products = [
  {
    id: "vcn-tickeadora-001",
    code: "VCN-TIC-001",
    name: "Tickeadora de estacionamiento gris alta",
    category: "Estacionamiento",
    description: "Equipo de control y emision de tickets para estacionamientos, con gabinete gris oscuro y teclado frontal.",
    price: 690000,
    stock: "Disponible",
    image: "assets/products/tickeadora-estacionamiento-gris.webp",
    featured: 1,
  },
  {
    id: "vcn-biometrico-002",
    code: "VCN-BIO-002",
    name: "Reloj biometrico Mini",
    category: "Control horario",
    description: "Terminal biometrica compacta para control de asistencia por huella, practica para comercios y empresas.",
    price: 850000,
    stock: "Consultar stock",
    image: "assets/products/reloj-biometrico-mini.webp",
    featured: 2,
  },
  {
    id: "vcn-facial-003",
    code: "VCN-FAC-003",
    name: "Reloj de reconocimiento facial",
    category: "Control horario",
    description: "Equipo avanzado para registro de personal con reconocimiento facial, pantalla integrada y lector biometrico.",
    price: 1000000,
    stock: "Consultar stock",
    image: "assets/products/reloj-reconocimiento-facial.webp",
    featured: 3,
  },
];

const state = {
  category: "Todos",
  search: "",
  sort: "featured",
  cart: new Map(),
};

const formatPrice = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: business.currency,
  maximumFractionDigits: 0,
});

const els = {
  products: document.querySelector("[data-products]"),
  categories: document.querySelector("[data-categories]"),
  search: document.querySelector("[data-search]"),
  sort: document.querySelector("[data-sort]"),
  cartItems: document.querySelector("[data-cart-items]"),
  cartEmpty: document.querySelector("[data-cart-empty]"),
  cartCount: document.querySelector("[data-cart-count]"),
  subtotal: document.querySelector("[data-subtotal]"),
  total: document.querySelector("[data-total]"),
  checkout: document.querySelector("[data-checkout]"),
  modal: document.querySelector("[data-modal]"),
  modalClose: document.querySelector("[data-modal-close]"),
  paymentLink: document.querySelector("[data-payment-link]"),
  checkoutWhatsapp: document.querySelector("[data-checkout-whatsapp]"),
  whatsappLink: document.querySelector("[data-whatsapp-link]"),
};

function getFilteredProducts() {
  const search = state.search.trim().toLowerCase();
  const filtered = products.filter((product) => {
    const matchesCategory = state.category === "Todos" || product.category === state.category;
    const haystack = `${product.code} ${product.name} ${product.description}`.toLowerCase();
    return matchesCategory && haystack.includes(search);
  });

  return filtered.sort((a, b) => {
    if (state.sort === "price-asc") return a.price - b.price;
    if (state.sort === "price-desc") return b.price - a.price;
    return a.featured - b.featured;
  });
}

function renderCategories() {
  const categories = ["Todos", ...new Set(products.map((product) => product.category))];
  els.categories.innerHTML = categories
    .map(
      (category) => `
        <button class="${category === state.category ? "is-active" : ""}" type="button" data-category="${category}">
          ${category}
        </button>
      `
    )
    .join("");
}

function renderProducts() {
  const filtered = getFilteredProducts();
  els.products.innerHTML = filtered.length
    ? filtered
        .map(
          (product) => `
            <article class="product-card">
              <div class="product-art">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
              </div>
              <div class="product-content">
                <div class="product-meta">
                  <span>${product.category}</span>
                  <span>${product.code}</span>
                </div>
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="price-row">
                  <span class="price">${formatPrice.format(product.price)}</span>
                  <span class="stock">${product.stock}</span>
                </div>
                <button class="add-button" type="button" data-add="${product.id}">Agregar</button>
              </div>
            </article>
          `
        )
        .join("")
    : `<div class="cart-empty">No encontramos productos con esos filtros.</div>`;
}

function addToCart(productId) {
  const current = state.cart.get(productId) || 0;
  state.cart.set(productId, current + 1);
  renderCart();
}

function updateQuantity(productId, delta) {
  const current = state.cart.get(productId) || 0;
  const next = current + delta;
  if (next <= 0) {
    state.cart.delete(productId);
  } else {
    state.cart.set(productId, next);
  }
  renderCart();
}

function getCartLines() {
  return [...state.cart.entries()]
    .map(([productId, quantity]) => {
      const product = products.find((item) => item.id === productId);
      return product ? { ...product, quantity, lineTotal: product.price * quantity } : null;
    })
    .filter(Boolean);
}

function getSubtotal() {
  return getCartLines().reduce((sum, item) => sum + item.lineTotal, 0);
}

function renderCart() {
  const lines = getCartLines();
  const count = lines.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = getSubtotal();

  els.cartCount.textContent = count;
  els.cartEmpty.hidden = lines.length > 0;
  els.checkout.disabled = lines.length === 0;
  els.subtotal.textContent = formatPrice.format(subtotal);
  els.total.textContent = formatPrice.format(subtotal);

  els.cartItems.innerHTML = lines
    .map(
      (item) => `
        <div class="cart-item">
          <div>
            <strong>${item.name}</strong>
            <span>${item.code} - ${formatPrice.format(item.lineTotal)}</span>
          </div>
          <div class="quantity" aria-label="Cantidad de ${item.name}">
            <button type="button" data-qty="${item.id}" data-delta="-1">-</button>
            <output>${item.quantity}</output>
            <button type="button" data-qty="${item.id}" data-delta="1">+</button>
          </div>
        </div>
      `
    )
    .join("");
}

function buildOrderText() {
  const lines = getCartLines();
  const details = lines
    .map((item) => `- ${item.quantity} x ${item.name} (${item.code}): ${formatPrice.format(item.lineTotal)}`)
    .join("\n");

  return `Hola ${business.contactName}, quiero avanzar con este pedido:\n${details}\nTotal estimado: ${formatPrice.format(getSubtotal())}`;
}

function getWhatsappUrl(text = `Hola ${business.contactName}, quiero hacer una consulta.`) {
  return `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(text)}`;
}

function openCheckout() {
  if (state.cart.size === 0) return;

  const orderText = buildOrderText();
  els.paymentLink.href = business.paymentLink || getWhatsappUrl(`${orderText}\nQuiero recibir un link de pago.`);
  els.checkoutWhatsapp.href = getWhatsappUrl(orderText);
  els.modal.hidden = false;
}

document.addEventListener("click", (event) => {
  const categoryButton = event.target.closest("[data-category]");
  const addButton = event.target.closest("[data-add]");
  const qtyButton = event.target.closest("[data-qty]");

  if (categoryButton) {
    state.category = categoryButton.dataset.category;
    renderCategories();
    renderProducts();
  }

  if (addButton) {
    addToCart(addButton.dataset.add);
    document.body.classList.add("cart-open");
  }

  if (qtyButton) {
    updateQuantity(qtyButton.dataset.qty, Number(qtyButton.dataset.delta));
  }

  if (event.target.closest("[data-cart-toggle]")) {
    document.body.classList.toggle("cart-open");
  }

  if (event.target.closest("[data-cart-close]")) {
    document.body.classList.remove("cart-open");
  }
});

els.search.addEventListener("input", (event) => {
  state.search = event.target.value;
  renderProducts();
});

els.sort.addEventListener("change", (event) => {
  state.sort = event.target.value;
  renderProducts();
});

els.checkout.addEventListener("click", openCheckout);
els.modalClose.addEventListener("click", () => {
  els.modal.hidden = true;
});
els.modal.addEventListener("click", (event) => {
  if (event.target === els.modal) {
    els.modal.hidden = true;
  }
});

els.whatsappLink.href = getWhatsappUrl();
renderCategories();
renderProducts();
renderCart();
