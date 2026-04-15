import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import { getUser } from "./utils/auth";
import { getCart, setCart as persistCart } from "./utils/cart";

// Shared content used to render the landing page sections.
const CATEGORIES = [
  { emoji: "✨", label: "All" },
  { emoji: "🍼", label: "Feeding" },
  { emoji: "🛁", label: "Bath Time" },
  { emoji: "🧸", label: "Toys" },
  { emoji: "👶", label: "Clothing" },
  { emoji: "🛏️", label: "Sleep" },
  { emoji: "🧴", label: "Skincare" },
  { emoji: "🚗", label: "Travel" },
  { emoji: "📚", label: "Learning" },
];

const PRODUCTS = [
  {
    id: 1,
    emoji: "🍼",
    category: "Feeding",
    name: "Soft Silicone Bottle",
    brand: "NurtureCo",
    price: 899,
    rating: "⭐ 4.9",
    tag: "Bestseller",
    bg: "#fdf0e8",
  },
  {
    id: 2,
    emoji: "🧸",
    category: "Toys",
    name: "Organic Teddy Bear",
    brand: "CozyCubs",
    price: 1299,
    rating: "⭐ 4.8",
    tag: "Organic",
    bg: "#e8f4e8",
  },
  {
    id: 3,
    emoji: "🛁",
    category: "Bath Time",
    name: "Baby Bath Tub",
    brand: "SplashJoy",
    price: 1490,
    rating: "⭐ 4.7",
    tag: "Safe",
    bg: "#e8f0f9",
  },
  {
    id: 4,
    emoji: "🧴",
    category: "Skincare",
    name: "Gentle Lotion SPF30",
    brand: "PureSkin",
    price: 549,
    rating: "⭐ 4.9",
    tag: "Natural",
    bg: "#f5e8f9",
  },
  {
    id: 5,
    emoji: "👕",
    category: "Clothing",
    name: "Bamboo Onesie Set",
    brand: "SoftDreams",
    price: 1199,
    rating: "⭐ 4.8",
    tag: "Eco",
    bg: "#fef9e0",
  },
  {
    id: 6,
    emoji: "🛏️",
    category: "Sleep",
    name: "Cloud Sleep Sack",
    brand: "DreamBaby",
    price: 1399,
    rating: "⭐ 5.0",
    tag: "New",
    bg: "#fde8ec",
  },
  {
    id: 7,
    emoji: "🚗",
    category: "Travel",
    name: "Lightweight Stroller",
    brand: "GoEasy",
    price: 1499,
    rating: "⭐ 4.6",
    tag: "Popular",
    bg: "#e8faf4",
  },
  {
    id: 8,
    emoji: "📚",
    category: "Learning",
    name: "Touch & Feel Board Books",
    brand: "TinyMinds",
    price: 499,
    rating: "⭐ 4.9",
    tag: "Award",
    bg: "#fff4e8",
  },
  {
    id: 9,
    emoji: "🧃",
    category: "Feeding",
    name: "Anti-Colic Feeding Set",
    brand: "NurtureCo",
    price: 1099,
    rating: "⭐ 4.8",
    tag: "Popular",
    bg: "#fdf0e8",
  },
  {
    id: 10,
    emoji: "🥣",
    category: "Feeding",
    name: "Leakproof Sipper Cup",
    brand: "LittleSip",
    price: 699,
    rating: "⭐ 4.7",
    tag: "Safe",
    bg: "#f9efe6",
  },
  {
    id: 11,
    emoji: "🧽",
    category: "Bath Time",
    name: "Foam Bath Support",
    brand: "SplashJoy",
    price: 799,
    rating: "⭐ 4.8",
    tag: "Comfort",
    bg: "#e8f0f9",
  },
  {
    id: 12,
    emoji: "🫧",
    category: "Bath Time",
    name: "Tear-Free Baby Shampoo",
    brand: "PureNest",
    price: 459,
    rating: "⭐ 4.9",
    tag: "Gentle",
    bg: "#eef6ff",
  },
  {
    id: 13,
    emoji: "🪇",
    category: "Toys",
    name: "Sensory Rattle Set",
    brand: "CozyCubs",
    price: 649,
    rating: "⭐ 4.7",
    tag: "Fun",
    bg: "#e8f4e8",
  },
  {
    id: 14,
    emoji: "🧩",
    category: "Toys",
    name: "Stacking Ring Tower",
    brand: "TinyPlay",
    price: 729,
    rating: "⭐ 4.8",
    tag: "Learning",
    bg: "#f0f8ee",
  },
  {
    id: 15,
    emoji: "🧦",
    category: "Clothing",
    name: "Cotton Bib Pack",
    brand: "SoftDreams",
    price: 399,
    rating: "⭐ 4.7",
    tag: "Daily",
    bg: "#fef9e0",
  },
  {
    id: 16,
    emoji: "🧥",
    category: "Clothing",
    name: "Winter Baby Romper",
    brand: "WarmNest",
    price: 999,
    rating: "⭐ 4.8",
    tag: "Cozy",
    bg: "#fffbe9",
  },
  {
    id: 17,
    emoji: "🛌",
    category: "Sleep",
    name: "Breathable Crib Sheet",
    brand: "DreamBaby",
    price: 849,
    rating: "⭐ 4.9",
    tag: "Premium",
    bg: "#fde8ec",
  },
  {
    id: 18,
    emoji: "🌙",
    category: "Sleep",
    name: "Night Comfort Blanket",
    brand: "SleepNest",
    price: 1190,
    rating: "⭐ 4.8",
    tag: "Soft",
    bg: "#fff0f4",
  },
  {
    id: 19,
    emoji: "🧼",
    category: "Skincare",
    name: "Diaper Rash Cream",
    brand: "PureSkin",
    price: 349,
    rating: "⭐ 4.9",
    tag: "Care",
    bg: "#f5e8f9",
  },
  {
    id: 20,
    emoji: "🫗",
    category: "Skincare",
    name: "Baby Massage Oil",
    brand: "NatureDrop",
    price: 429,
    rating: "⭐ 4.8",
    tag: "Natural",
    bg: "#faeffd",
  },
  {
    id: 21,
    emoji: "🚙",
    category: "Travel",
    name: "Car Seat Head Support",
    brand: "GoEasy",
    price: 949,
    rating: "⭐ 4.7",
    tag: "Travel",
    bg: "#e8faf4",
  },
  {
    id: 22,
    emoji: "🎒",
    category: "Travel",
    name: "Foldable Diaper Backpack",
    brand: "TripBuddy",
    price: 1290,
    rating: "⭐ 4.8",
    tag: "Smart",
    bg: "#eefcf7",
  },
  {
    id: 23,
    emoji: "🔠",
    category: "Learning",
    name: "ABC Flash Card Kit",
    brand: "TinyMinds",
    price: 379,
    rating: "⭐ 4.8",
    tag: "Early Learn",
    bg: "#fff4e8",
  },
  {
    id: 24,
    emoji: "📖",
    category: "Learning",
    name: "Animal Sound Storybook",
    brand: "BrightSteps",
    price: 589,
    rating: "⭐ 4.9",
    tag: "Interactive",
    bg: "#fff8ef",
  },
];

const FEATURES = [
  {
    icon: "🌿",
    color: "#a8c5a0",
    title: "100% Organic",
    desc: "All products are made from certified organic and natural materials, safe for your little one.",
  },
  {
    icon: "🔬",
    color: "#b5d8f0",
    title: "Clinically Tested",
    desc: "Rigorously tested by pediatricians and dermatologists for maximum safety.",
  },
  {
    icon: "🚚",
    color: "#f7c5b0",
    title: "Free Delivery",
    desc: "Free shipping on all orders above ₹999. Same-day delivery in Hyderabad.",
  },
  {
    icon: "↩️",
    color: "#cdb4db",
    title: "Easy Returns",
    desc: "30-day hassle-free returns with full refund policy — no questions asked.",
  },
];

const TESTIMONIALS = [
  {
    stars: "★★★★★",
    text: "BabyCare has been a lifesaver! The quality of products is outstanding and my baby absolutely loves the organic teddy bear.",
    name: "Priya Sharma",
    role: "Mom of 8-month-old",
    avatar: "👩",
    bg: "#fde8ec",
  },
  {
    stars: "★★★★★",
    text: "The delivery was super fast and packaging was so cute. The silicone bottle is leak-proof and so easy to clean!",
    name: "Ravi Kumar",
    role: "Dad of twins",
    avatar: "👨",
    bg: "#e8f4e8",
  },
  {
    stars: "★★★★★",
    text: "I love that everything is certified organic. The skincare line is gentle and my baby's skin has never been softer!",
    name: "Anita Reddy",
    role: "Mom of newborn",
    avatar: "👩",
    bg: "#e8f0f9",
  },
];

const BLOG_POSTS = [
  {
    id: 1,
    date: "Apr 2026",
    title: "5 Bedtime Routines That Help Babies Sleep Better",
    desc: "Simple, pediatrician-friendly rituals to make nights calmer for both babies and parents.",
  },
  {
    id: 2,
    date: "Mar 2026",
    title: "Choosing Organic Skincare for Sensitive Baby Skin",
    desc: "How to read labels and avoid common irritants while building a gentle skincare routine.",
  },
  {
    id: 3,
    date: "Feb 2026",
    title: "First Travel Checklist for New Parents",
    desc: "A practical packing list covering feeding, hygiene, sleep, and stroller essentials.",
  },
];

// Main landing page component.
export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUserState] = useState(() => getUser());
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("babycare-theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  // Local UI state for cart behavior and newsletter signup.
  const [cart, setCart] = useState(() => getCart());
  const [cartOpen, setCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [addedIds, setAddedIds] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [nlEmail, setNlEmail] = useState("");
  const [nlSuccess, setNlSuccess] = useState(false);
  const [featuredIndex, setFeaturedIndex] = useState(() =>
    Math.floor(Math.random() * PRODUCTS.length),
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setUserState(getUser());
  }, [location.pathname]);

  useEffect(() => {
    persistCart(cart);
  }, [cart]);

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("babycare-theme", theme);

    return () => {
      document.body.removeAttribute("data-theme");
    };
  }, [theme]);

  useEffect(() => {
    const timer = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % PRODUCTS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const addToCart = (product) => {
    if (isAdminUser) return;
    setCart((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists)
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i,
        );
      return [...prev, { ...product, qty: 1 }];
    });
    setAddedIds((prev) => [...prev, product.id]);
    setTimeout(
      () => setAddedIds((prev) => prev.filter((id) => id !== product.id)),
      1000,
    );
  };

  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((i) => i.id !== id));

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const isAdminUser = Boolean(user?.isAdmin);
  const featuredProduct = PRODUCTS[featuredIndex];
  const displayedProducts =
    activeCategory === "All"
      ? PRODUCTS.slice(0, 8)
      : PRODUCTS.filter((p) => p.category === activeCategory);

  const handleNL = (e) => {
    e.preventDefault();
    if (nlEmail) {
      setNlSuccess(true);
      setNlEmail("");
    }
  };

  const handleCheckout = () => {
    if (!user?.token) {
      navigate("/login?next=/checkout");
      return;
    }

    if (isAdminUser) {
      navigate("/admin");
      return;
    }

    navigate("/checkout");
  };

  return (
    <>
      <div className="app">
        {/* Decorative background layers. */}
        <div className="blob-bg">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
          <div className="blob blob-4" />
        </div>

        {/* Top navigation bar. */}
        <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
          <div className="logo">
            <span className="logo-dot" /> BabyCare
          </div>
          <ul className="nav-links">
            {[
              { label: "Shop", href: "#products" },
              { label: "Categories", href: "#categories" },
              { label: "About", href: "#about" },
              { label: "Blog", href: "#blog" },
              { label: "Contact", href: "#contact" },
            ].map((link) => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
          <div className="nav-actions">
            <button
              className="theme-toggle"
              type="button"
              aria-label={
                theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
              }
              title={
                theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
              }
              onClick={() =>
                setTheme((prev) => (prev === "dark" ? "light" : "dark"))
              }
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            {user ? (
              <>
                <Link className="nav-link-btn" to="/profile">
                  Profile
                </Link>
                {!isAdminUser && (
                  <Link className="nav-link-btn" to="/my-orders">
                    My Orders
                  </Link>
                )}
                {user.isAdmin && (
                  <Link className="nav-link-btn" to="/admin">
                    Admin
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link className="nav-link-btn" to="/login">
                  Login
                </Link>
                <Link className="nav-link-btn" to="/signup">
                  Signup
                </Link>
              </>
            )}
            {!isAdminUser && (
              <button className="nav-cta" onClick={() => setCartOpen(true)}>
                🛒 Cart {cartCount > 0 && `(${cartCount})`}
              </button>
            )}
          </div>
        </nav>

        {/* Hero section. */}
        <section className="hero">
          <div className="hero-text">
            <span className="hero-badge">🌿 New Collection 2026</span>
            <h1>
              Everything Your <span>Little One</span> Needs to Thrive
            </h1>
            <p className="hero-sub">
              Premium organic baby products curated with love. Safe, gentle, and
              beautifully designed for your precious bundle of joy.
            </p>
            <div className="hero-actions">
              <button
                className="btn-primary"
                onClick={() =>
                  document
                    .getElementById("products")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Shop Now ✨
              </button>
              <button
                className="btn-outline"
                onClick={() =>
                  document
                    .getElementById("about")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Our Story →
              </button>
            </div>
            <div className="hero-stats">
              {[
                ["50K+", "Happy Families"],
                ["200+", "Products"],
                ["100%", "Organic"],
              ].map(([n, l]) => (
                <div key={l}>
                  <div className="stat-num">{n}</div>
                  <div className="stat-label">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card-main">
              <span className="product-emoji">{featuredProduct.emoji}</span>
              <div className="product-name">{featuredProduct.name}</div>
              <div className="product-price">
                ₹{featuredProduct.price.toLocaleString("en-IN")}
              </div>
              <div className="product-stars">{featuredProduct.rating}</div>
              <div className="floating-badge badge-top">
                ✨ {featuredProduct.tag}
              </div>
              <div className="floating-badge badge-bot">
                ✅ Pediatrician Approved
              </div>
            </div>
          </div>
        </section>

        {/* Category shortcuts. */}
        <section className="categories" id="categories">
          <div className="section-label">Browse</div>
          <h2 className="section-title">Shop by Category</h2>
          <div className="cat-grid">
            {CATEGORIES.map((c) => (
              <button
                key={c.label}
                className={`cat-pill${activeCategory === c.label ? " active" : ""}`}
                onClick={() => setActiveCategory(c.label)}
              >
                <span>{c.emoji}</span>
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Product showcase. */}
        <section className="products" id="products">
          <div className="section-label">Our Products</div>
          <h2 className="section-title">
            {activeCategory === "All"
              ? "Bestselling Products"
              : `${activeCategory} Essentials`}
          </h2>
          <p className="section-sub">
            {activeCategory === "All"
              ? "Handpicked favorites loved by thousands of parents. Every product is certified safe and tested."
              : `Top picks from our ${activeCategory.toLowerCase()} range, chosen for safety, comfort, and quality.`}
          </p>
          <div className="product-grid">
            {displayedProducts.map((p) => (
              <div
                className="product-card"
                key={p.id}
                style={{ background: p.bg }}
              >
                <span className="pc-tag">{p.tag}</span>
                <span className="pc-emoji">{p.emoji}</span>
                <div className="pc-name">{p.name}</div>
                <div className="pc-brand">{p.brand}</div>
                <div className="pc-footer">
                  <div>
                    <div className="pc-price">
                      ₹{p.price.toLocaleString("en-IN")}
                    </div>
                    <div className="pc-rating">{p.rating} (2.1k)</div>
                  </div>
                  <button
                    className={`pc-add${addedIds.includes(p.id) ? " added" : ""}`}
                    disabled={isAdminUser}
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(p);
                    }}
                  >
                    {addedIds.includes(p.id) ? "✓" : "+"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Brand benefits. */}
        <section className="features" id="about">
          <div className="section-label">Why Us</div>
          <h2 className="section-title">Why Parents Choose BabyCare</h2>
          <div className="feat-grid">
            {FEATURES.map((f) => (
              <div className="feat-card" key={f.title}>
                <div
                  className="feat-icon"
                  style={{ background: f.color + "33" }}
                >
                  {f.icon}
                </div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Social proof. */}
        <section className="testimonials">
          <div className="section-label">Reviews</div>
          <h2 className="section-title">What Parents Are Saying</h2>
          <div className="testi-grid">
            {TESTIMONIALS.map((t) => (
              <div className="testi-card" key={t.name}>
                <div className="testi-stars">{t.stars}</div>
                <p className="testi-text">"{t.text}"</p>
                <div className="testi-author">
                  <div className="testi-avatar" style={{ background: t.bg }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter signup. */}
        <section className="newsletter">
          <div className="section-label">Stay Connected</div>
          <h2 className="section-title">
            Get Parenting Tips & Exclusive Offers
          </h2>
          <p className="section-sub">
            Join 50,000+ parents who get weekly tips, product launches, and
            special discounts.
          </p>
          {nlSuccess ? (
            <p
              style={{
                marginTop: "2rem",
                fontWeight: 600,
                color: "var(--ink)",
              }}
            >
              🎉 You're on the list! Welcome to the BabyCare family.
            </p>
          ) : (
            <form className="nl-form" onSubmit={handleNL}>
              <input
                className="nl-input"
                type="email"
                placeholder="your@email.com"
                value={nlEmail}
                onChange={(e) => setNlEmail(e.target.value)}
                required
              />
              <button className="btn-primary" type="submit">
                Subscribe 💌
              </button>
            </form>
          )}
        </section>

        <section className="blog" id="blog">
          <div className="section-label">Blog</div>
          <h2 className="section-title">Parenting Guides & Product Tips</h2>
          <p className="section-sub">
            Fresh reads for new parents, from sleep routines to organic product
            selection.
          </p>
          <div className="blog-grid">
            {BLOG_POSTS.map((post) => (
              <article className="blog-card" key={post.id}>
                <div className="blog-meta">{post.date}</div>
                <h3 className="blog-title">{post.title}</h3>
                <p className="blog-desc">{post.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="contact" id="contact">
          <div className="section-label">Contact</div>
          <h2 className="section-title">Need Help? We Are Here</h2>
          <p className="section-sub">
            Reach out for order help, product guidance, or support requests.
          </p>
          <div className="contact-wrap">
            <div className="contact-card">
              <h4>Customer Care</h4>
              <p>
                support@babycare.in
                <br />
                +91 40 1234 5678
              </p>
            </div>
            <div className="contact-card">
              <h4>Order Support</h4>
              <p>
                Track, return, or modify orders from your account dashboard
                anytime.
              </p>
            </div>
          </div>
        </section>

        {/* Footer links. */}
        <footer id="footer">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="logo">
                <span className="logo-dot" /> BabyCare
              </div>
              <p>
                Premium organic baby products crafted with love, science, and
                care for your little one.
              </p>
            </div>
            {[
              {
                title: "Shop",
                links: [
                  { name: "New Arrivals", href: "#products" },
                  { name: "Bestsellers", href: "#products" },
                  { name: "Organic Range", href: "#products" },
                  { name: "Sale", href: "#products" },
                ],
              },
              {
                title: "Support",
                links: [
                  { name: "Track Order", href: "#contact" },
                  { name: "Returns", href: "#contact" },
                  { name: "FAQs", href: "#blog" },
                  { name: "Size Guide", href: "#contact" },
                ],
              },
              {
                title: "Company",
                links: [
                  { name: "About Us", href: "#about" },
                  { name: "Blog", href: "#blog" },
                  { name: "Careers", href: "#contact" },
                  { name: "Press", href: "#contact" },
                ],
              },
            ].map((col) => (
              <div className="footer-col" key={col.title}>
                <h5>{col.title}</h5>
                <ul>
                  {col.links.map((l) => (
                    <li key={l.name}>
                      <a href={l.href}>{l.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="footer-bottom">
            <span>© 2026 BabyCare. Made with 💖 in Hyderabad</span>
            <span>Privacy · Terms · Cookies</span>
          </div>
        </footer>

        {!isAdminUser && (
          <>
            {/* Floating cart button. */}
            <button className="cart-fab" onClick={() => setCartOpen(true)}>
              🛒
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </button>

            {/* Cart overlay backdrop. */}
            <div
              className={`cart-overlay${cartOpen ? " open" : ""}`}
              onClick={() => setCartOpen(false)}
            />

            {/* Cart drawer panel. */}
            <div className={`cart-drawer${cartOpen ? " open" : ""}`}>
              <div className="cart-header">
                <h3>Your Cart 🛒</h3>
                <button
                  className="cart-close"
                  onClick={() => setCartOpen(false)}
                >
                  ✕
                </button>
              </div>
              {cart.length === 0 ? (
                <div className="cart-empty">
                  <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                    🧸
                  </div>
                  <p>Your cart is empty</p>
                  <p style={{ fontSize: ".8rem", marginTop: ".5rem" }}>
                    Add some products for your little one!
                  </p>
                </div>
              ) : (
                <>
                  {cart.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <span className="ci-emoji">{item.emoji}</span>
                      <div>
                        <div className="ci-name">{item.name}</div>
                        <div className="ci-price">
                          ₹{(item.price * item.qty).toLocaleString("en-IN")} ×{" "}
                          {item.qty}
                        </div>
                      </div>
                      <button
                        className="ci-remove"
                        onClick={() => removeFromCart(item.id)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <div className="cart-total">
                    <span>Total</span>
                    <span style={{ color: "var(--peach)" }}>
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <button
                    className="btn-primary"
                    style={{
                      width: "100%",
                      marginTop: "1.2rem",
                      textAlign: "center",
                    }}
                    onClick={handleCheckout}
                  >
                    Checkout →
                  </button>
                  {user && (
                    <button
                      className="btn-outline"
                      style={{
                        width: "100%",
                        marginTop: "0.7rem",
                        textAlign: "center",
                      }}
                      onClick={() => {
                        setCartOpen(false);
                        navigate("/my-orders");
                      }}
                    >
                      My Orders
                    </button>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
