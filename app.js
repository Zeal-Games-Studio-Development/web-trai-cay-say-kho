/* ===================================================
   NACOMS - App JavaScript
   =================================================== */

// ===== PRODUCT DATA =====
const products = [
  {
    id: 1,
    name: 'Xoài Sấy Muối Ớt',
    category: 'xoai',
    price: 75000,
    weight: '200g',
    badge: 'hot',
    badgeText: '🔥 Bán Chạy',
    image: 'images/product_xoai_muoi_ot.png',
    emoji: '🥭',
  },
  {
    id: 2,
    name: 'Xoài Sấy Dẻo',
    category: 'xoai',
    price: 70000,
    weight: '200g',
    badge: 'new',
    badgeText: '✨ Mới',
    image: 'images/product_xoai_muoi_ot.png',
    emoji: '🥭',
  },
  {
    id: 3,
    name: 'Thơm Sấy Dẻo',
    category: 'thorn',
    price: 65000,
    weight: '200g',
    badge: null,
    badgeText: '',
    image: 'images/product_thorn_say.png',
    emoji: '🍍',
  },
  {
    id: 4,
    name: 'Thơm Sấy Muối Ớt',
    category: 'thorn',
    price: 68000,
    weight: '200g',
    badge: 'hot',
    badgeText: '🔥 Bán Chạy',
    image: 'images/product_thorn_say.png',
    emoji: '🍍',
  },
  {
    id: 5,
    name: 'Chanh Dây Sấy Dẻo',
    category: 'khac',
    price: 80000,
    weight: '150g',
    badge: 'new',
    badgeText: '✨ Mới',
    image: 'images/product_chanh_day.png',
    emoji: '🍋',
  },
  {
    id: 6,
    name: 'Tắc Sấy Dẻo Mật Ong',
    category: 'khac',
    price: 72000,
    weight: '150g',
    badge: null,
    badgeText: '',
    image: 'images/product_chanh_day.png',
    emoji: '🍊',
  },
  {
    id: 7,
    name: 'Chôm Chôm Sấy Dẻo',
    category: 'khac',
    price: 85000,
    weight: '150g',
    badge: 'sale',
    badgeText: '🏷 Sale',
    image: 'images/about_section.png',
    emoji: '🌺',
  },
  {
    id: 8,
    name: 'Hỗn Hợp Trái Cây',
    category: 'khac',
    price: 95000,
    weight: '300g',
    badge: 'hot',
    badgeText: '🔥 Bán Chạy',
    image: 'images/about_section.png',
    emoji: '🎁',
  },
];

// ===== CART STATE =====
let cart = [];

// ===== FORMAT CURRENCY =====
function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

// ===== RENDER PRODUCTS =====
function renderProducts(filter = 'all') {
  const grid = document.getElementById('products-grid');
  const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);

  grid.innerHTML = filtered.map((p, i) => `
    <div class="product-card reveal reveal-delay-${(i % 4) + 1}" data-id="${p.id}" data-category="${p.category}">
      <div class="product-img-wrap">
        ${p.badge ? `<div class="product-badge badge-${p.badge}">${p.badgeText}</div>` : ''}
        <img src="${p.image}" alt="${p.name}" class="product-img" loading="lazy"
          onerror="this.style.display='none'; this.parentElement.classList.add('img-fallback');"
        />
        <div class="product-img-emoji" style="
          position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
          font-size:5rem;opacity:0.15;pointer-events:none;
        ">${p.emoji}</div>
      </div>
      <div class="product-info">
        <h3 class="product-name">${p.name}</h3>
        <p class="product-weight">📦 Trọng lượng: ${p.weight}</p>
        <div class="product-price-row">
          <span class="product-price">${formatCurrency(p.price)}</span>
          <button class="product-add-btn" data-id="${p.id}" aria-label="Thêm vào giỏ">+</button>
        </div>
      </div>
    </div>
  `).join('');

  // Attach add to cart listeners
  grid.querySelectorAll('.product-add-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(parseInt(btn.dataset.id));
    });
  });

  // Trigger reveal
  requestAnimationFrame(() => {
    grid.querySelectorAll('.reveal').forEach(el => {
      setTimeout(() => el.classList.add('revealed'), 50);
    });
  });
}

// ===== CART FUNCTIONS =====
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCartUI();
  showToast(`✅ Đã thêm "${product.name}" vào giỏ hàng!`);

  // Animate cart button
  const cartBtn = document.getElementById('cart-btn');
  cartBtn.classList.add('pulse-anim');
  setTimeout(() => cartBtn.classList.remove('pulse-anim'), 600);
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartUI();
  renderCartItems();
}

function updateQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(productId);
    return;
  }
  updateCartUI();
  renderCartItems();
}

function updateCartUI() {
  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
  const countEl = document.getElementById('cart-count');
  countEl.textContent = totalQty;

  if (totalQty > 0) {
    countEl.classList.add('visible');
  } else {
    countEl.classList.remove('visible');
  }
}

function renderCartItems() {
  const body = document.getElementById('cart-body');
  const footer = document.getElementById('cart-footer');
  const totalEl = document.getElementById('cart-total-price');

  if (cart.length === 0) {
    body.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <p>Giỏ hàng trống</p>
        <a href="#products" class="btn btn-primary" onclick="closeCart()">Mua Sắm Ngay</a>
      </div>
    `;
    footer.style.display = 'none';
    return;
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  totalEl.textContent = formatCurrency(total);
  footer.style.display = 'block';

  body.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img"
        onerror="this.style.fontSize='2rem';this.style.textAlign='center';this.style.lineHeight='80px';this.textContent='${item.emoji}';"
      />
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${formatCurrency(item.price)}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
          <button class="qty-btn" onclick="removeFromCart(${item.id})" style="margin-left:auto;color:#c8365a;">🗑</button>
        </div>
      </div>
    </div>
  `).join('');
}

function openCart() {
  const modal = document.getElementById('cart-modal');
  modal.classList.add('open');
  renderCartItems();
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  const modal = document.getElementById('cart-modal');
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

// ===== TOAST =====
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('visible');
  setTimeout(() => toast.classList.remove('visible'), 3000);
}

// ===== NAVIGATION =====
function initNavigation() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close on nav link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-40% 0px -40% 0px',
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, observerOptions);

  sections.forEach(s => observer.observe(s));
}

// ===== SCROLL EFFECTS =====
function initScrollEffects() {
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('back-to-top');
  const hero = document.querySelector('.hero');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Sticky navbar shadow
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top
    if (scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }, { passive: true });

  // Hero parallax
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const heroImg = hero.querySelector('.hero-img');
      if (heroImg && scrolled < window.innerHeight) {
        heroImg.style.transform = `scale(1) translateY(${scrolled * 0.15}px)`;
      }
    }, { passive: true });

    // Trigger hero animation
    setTimeout(() => hero.classList.add('loaded'), 100);
  }

  // Back to top click
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== REVEAL ON SCROLL =====
function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(el => observer.observe(el));
}

// ===== PRODUCT FILTER =====
function initProductFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProducts(btn.dataset.filter);

      // Re-init reveal for new cards
      setTimeout(initReveal, 50);
    });
  });
}

// ===== ANNOUNCEMENT BAR =====
function initAnnouncementBar() {
  const bar = document.getElementById('announcement-bar');
  const closeBtn = document.getElementById('ann-close-btn');

  closeBtn.addEventListener('click', () => {
    bar.style.maxHeight = bar.scrollHeight + 'px';
    bar.style.overflow = 'hidden';
    bar.style.transition = 'max-height 0.4s ease, opacity 0.4s ease';
    requestAnimationFrame(() => {
      bar.style.maxHeight = '0';
      bar.style.opacity = '0';
    });
    setTimeout(() => bar.remove(), 400);
  });
}

// ===== FORMS =====
function initForms() {
  // Newsletter
  const newsForm = document.getElementById('newsletter-form');
  newsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('newsletter-email').value;
    showToast(`🎉 Cảm ơn! "${email}" đã đăng ký nhận ưu đãi!`);
    newsForm.reset();
  });

  // Contact
  const contactForm = document.getElementById('contact-form');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name').value;
    showToast(`✅ Cảm ơn ${name}! Chúng tôi sẽ liên hệ lại sớm nhất.`);
    contactForm.reset();
  });
}

// ===== CART BUTTON =====
function initCart() {
  document.getElementById('cart-btn').addEventListener('click', openCart);
  document.getElementById('cart-close').addEventListener('click', closeCart);
  document.getElementById('cart-backdrop').addEventListener('click', closeCart);

  // Add pulse style dynamically
  const style = document.createElement('style');
  style.textContent = `
    .pulse-anim { animation: cartPulse 0.6s ease !important; }
    @keyframes cartPulse {
      0% { transform: scale(1); }
      30% { transform: scale(1.2); }
      60% { transform: scale(0.9); }
      100% { transform: scale(1); }
    }
  `;
  document.head.appendChild(style);
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = document.querySelector('.header')?.offsetHeight || 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// ===== IMAGE FALLBACK STYLES =====
function initImageFallbacks() {
  const style = document.createElement('style');
  style.textContent = `
    .img-fallback {
      background: linear-gradient(135deg, #FFF5F0, #FFE5E0) !important;
    }
    .img-fallback .product-img { display: none !important; }
    .img-fallback .product-img-emoji { opacity: 0.6 !important; }
  `;
  document.head.appendChild(style);
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  initNavigation();
  initScrollEffects();
  initReveal();
  initProductFilter();
  initAnnouncementBar();
  initForms();
  initCart();
  initSmoothScroll();
  initImageFallbacks();

  // Add reveal class to non-product elements
  document.querySelectorAll(
    '.feature-item, .testimonial-card, .blog-card, .blog-card-mini, .contact-item, .value-item'
  ).forEach((el, i) => {
    el.classList.add('reveal');
    el.classList.add(`reveal-delay-${(i % 4) + 1}`);
  });
  setTimeout(initReveal, 100);
});
