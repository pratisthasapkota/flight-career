import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  category: string;
  rating: number;
  reviews: number;
  badge: string | null;
  description: string;
  sizes: string[];
  stock?: number;
  active?: boolean;
  productId?: number;
}

interface CartItem extends Product {
  size: string;
  quantity: number;
}

interface SortOption {
  label: string;
  value: string;
}

interface ProductsApiResponse {
  data: Product[];
}

const fallbackProducts: Product[] = [
  { id: 1, name: "Pilot Uniform Set", image: "/r.png", price: 129.99, category: "Pilot", rating: 4.8, reviews: 124, badge: "Best Seller", description: "Professional pilot uniform with epaulets, shirt, tie, and trousers. IATA compliant.", sizes: ["S", "M", "L", "XL", "XXL"] },
  { id: 2, name: "Cabin Crew Dress", image: "/p.png", price: 109.99, category: "Cabin Crew", rating: 4.7, reviews: 98, badge: "Popular", description: "Elegant cabin crew dress designed for comfort and professionalism during long flights.", sizes: ["XS", "S", "M", "L", "XL"] },
  { id: 3, name: "Ground Staff Blazer", image: "/q.png", price: 99.99, category: "Ground Staff", rating: 4.5, reviews: 67, badge: null, description: "Sharp and professional ground staff blazer. Perfect for airport customer service roles.", sizes: ["S", "M", "L", "XL"] },
  { id: 4, name: "Flight Attendant Outfit", image: "/u.png", price: 119.99, category: "Cabin Crew", rating: 4.6, reviews: 85, badge: "New", description: "Complete flight attendant outfit with matching scarf and accessories.", sizes: ["XS", "S", "M", "L", "XL"] },
  { id: 5, name: "Blue Crew Set", image: "/v.png", price: 89.99, category: "Cabin Crew", rating: 4.4, reviews: 56, badge: null, description: "Budget-friendly cabin crew set ideal for training and fresh recruits.", sizes: ["S", "M", "L", "XL"] },
  { id: 6, name: "Formal Aviation Dress", image: "/dress.png", price: 139.99, category: "Cabin Crew", rating: 4.9, reviews: 142, badge: "Top Rated", description: "Premium formal dress for senior cabin crew and in-flight managers.", sizes: ["XS", "S", "M", "L"] },
  { id: 7, name: "Pilot Leather Jacket", image: "/r.png", price: 189.99, category: "Pilot", rating: 4.8, reviews: 73, badge: "Premium", description: "Classic aviator leather jacket. Durable, warm, and stylish for off-duty pilots.", sizes: ["S", "M", "L", "XL", "XXL"] },
  { id: 8, name: "Cabin Crew Training Kit", image: "/p.png", price: 59.99, category: "Accessories", rating: 4.3, reviews: 41, badge: null, description: "Essential training kit including grooming accessories, name badge, and guide.", sizes: ["One Size"] },
  { id: 9, name: "Airport Operations Polo", image: "/q.png", price: 49.99, category: "Ground Staff", rating: 4.2, reviews: 38, badge: null, description: "Comfortable polo shirt for ground operations and ramp staff.", sizes: ["S", "M", "L", "XL", "XXL"] },
  { id: 10, name: "Aviation Tie Set", image: "/u.png", price: 34.99, category: "Accessories", rating: 4.5, reviews: 92, badge: "Best Value", description: "Set of 3 aviation-themed ties. Perfect gift for aviation enthusiasts.", sizes: ["One Size"] },
  { id: 11, name: "Senior Crew Blazer", image: "/v.png", price: 159.99, category: "Cabin Crew", rating: 4.7, reviews: 64, badge: null, description: "Premium blazer for senior cabin crew with embroidered airline crest option.", sizes: ["XS", "S", "M", "L", "XL"] },
  { id: 12, name: "Pilot Cap & Badge Set", image: "/dress.png", price: 44.99, category: "Pilot", rating: 4.6, reviews: 108, badge: "Popular", description: "Official-style pilot cap with gold badge. A must-have accessory.", sizes: ["One Size"] },
];

const categories: string[] = ["All", "Pilot", "Cabin Crew", "Ground Staff", "Accessories"];
const sortOptions: SortOption[] = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Top Rated", value: "rating" },
  { label: "Most Reviewed", value: "reviews" },
];

const Store: React.FC = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const raw = sessionStorage.getItem("aeroCart");
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [showCart, setShowCart] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<Record<number, string>>({});
  const [addedAnimation, setAddedAnimation] = useState<Set<number>>(() => new Set());
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [catalogProducts, setCatalogProducts] = useState<Product[] | null>(null);
  const [modalQty, setModalQty] = useState<number>(1);
  const [flyingCart, setFlyingCart] = useState<{ id: number } | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const PAGE_SIZE = 8;

  useEffect(() => {
    let cancelled = false;
    const backendUrl: string = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
    axios
      .get<ProductsApiResponse>(`${backendUrl}/api/products?active=true`)
      .then((res) => {
        if (cancelled) return;
        const active = (res.data.data || [])
          .filter((p: Product) => p.active !== false)
          .map((p: Product) => ({ ...p, productId: p.id }));
        setCatalogProducts(active.length ? active : null);
      })
      .catch(() => {
        if (!cancelled) setCatalogProducts(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const allProducts: Product[] = catalogProducts || fallbackProducts;

  useEffect(() => {
    sessionStorage.setItem("aeroCart", JSON.stringify(cart));
  }, [cart]);

  const filteredProducts = useMemo(() => {
    let items = [...allProducts];
    if (activeCategory !== "All") {
      items = items.filter((p: Product) => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (p: Product) =>
          p.name.toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    switch (sortBy) {
      case "price-asc": items.sort((a: Product, b: Product) => a.price - b.price); break;
      case "price-desc": items.sort((a: Product, b: Product) => b.price - a.price); break;
      case "rating": items.sort((a: Product, b: Product) => b.rating - a.rating); break;
      case "reviews": items.sort((a: Product, b: Product) => b.reviews - a.reviews); break;
      default: break;
    }
    return items;
  }, [allProducts, activeCategory, sortBy, searchQuery]);

  const totalPages: number = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const safePage: number = Math.min(currentPage, totalPages);
  const paginatedProducts: Product[] = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, safePage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, sortBy, searchQuery]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const isOutOfStock = (product: Product): boolean =>
    typeof product.stock === "number" && product.stock <= 0;

  const addToCart = (product: Product, qty: number = 1): void => {
    if (isOutOfStock(product)) return;
    const size: string = selectedSizes[product.id] || product.sizes[0] || "One Size";
    setCart((prev: CartItem[]) => {
      const existingIndex = prev.findIndex((item: CartItem) => item.id === product.id && item.size === size);
      if (existingIndex >= 0) {
        const newCart = [...prev];
        newCart[existingIndex].quantity += qty;
        return newCart;
      }
      return [...prev, { ...product, size, quantity: qty }];
    });
    setAddedAnimation((prev: Set<number>) => new Set(prev).add(product.id));
    window.setTimeout(() => {
      setAddedAnimation((prev: Set<number>) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 1500);
    launchFlyingCart();
  };

  const launchFlyingCart = (): void => {
    setFlyingCart({ id: Date.now() });
    window.setTimeout(() => setFlyingCart(null), 800);
  };

  const buyNow = (product: Product): void => {
    if (isOutOfStock(product)) return;
    const size: string = selectedSizes[product.id] || product.sizes[0] || "One Size";
    const item: CartItem = { ...product, size, quantity: 1 };
    navigate("/price", { state: { product: item } });
  };

  const removeFromCart = (index: number): void => {
    setCart((prev: CartItem[]) => prev.filter((_: CartItem, i: number) => i !== index));
  };

  const updateCartQty = (index: number, delta: number): void => {
    setCart((prev: CartItem[]) => {
      const newCart = [...prev];
      newCart[index].quantity = Math.max(1, newCart[index].quantity + delta);
      return newCart;
    });
  };

  const cartTotal: number = cart.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);
  const cartCount: number = cart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);

  const goToCheckout = (): void => {
    setShowCart(false);
    navigate("/price", { state: { cart } });
  };

  const renderStars = (rating: number): string => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty);
  };

  return (
    <>
      <style>{`
          .store-page {
            font-family: 'Poppins', sans-serif;
            background: #f5f7fb;
            min-height: 100vh;
          }

          /* ===== HERO ===== */
          .store-hero {
            background: linear-gradient(135deg, #001a3d 0%, #002b5c 40%, #00509e 100%);
            padding: 90px 20px 110px;
            text-align: center;
            color: white;
            position: relative;
            overflow: hidden;
          }

          .store-hero::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle at 30% 50%, rgba(255,215,0,0.06) 0%, transparent 50%),
                        radial-gradient(circle at 70% 80%, rgba(255,255,255,0.03) 0%, transparent 40%);
            animation: float 6s ease-in-out infinite;
          }

          .store-hero h1 {
            position: relative;
            z-index: 2;
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 12px;
            animation: fadeInUp 0.7s ease forwards;
          }

          .store-hero p {
            position: relative;
            z-index: 2;
            font-size: 1.15rem;
            opacity: 0.9;
            max-width: 550px;
            margin: 0 auto 30px;
            animation: fadeInUp 0.7s ease 0.2s forwards;
            opacity: 0;
          }

          .store-search-bar {
            position: relative;
            z-index: 2;
            max-width: 500px;
            margin: 0 auto;
            animation: fadeInUp 0.7s ease 0.4s forwards;
            opacity: 0;
          }

          .store-search-bar input {
            width: 100%;
            padding: 16px 24px 16px 50px;
            border: none;
            border-radius: 50px;
            font-size: 1rem;
            font-family: 'Poppins', sans-serif;
            box-shadow: 0 8px 30px rgba(0,0,0,0.2);
            outline: none;
            transition: box-shadow 0.3s ease;
          }

          .store-search-bar input:focus {
            box-shadow: 0 8px 40px rgba(0,0,0,0.3), 0 0 0 3px rgba(255,215,0,0.3);
          }

          .store-search-bar .search-icon {
            position: absolute;
            left: 20px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 1.1rem;
            color: #999;
          }

          /* ===== TOOLBAR ===== */
          .store-toolbar {
            max-width: 1200px;
            margin: -30px auto 0;
            padding: 20px 30px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 6px 25px rgba(0,0,0,0.08);
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 15px;
            position: relative;
            z-index: 3;
            animation: fadeInUp 0.6s ease 0.3s forwards;
            opacity: 0;
          }

          .category-tabs {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
          }

          .category-tab {
            padding: 8px 18px;
            border: 2px solid #e0e0e0;
            border-radius: 25px;
            background: white;
            color: #555;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: 'Poppins', sans-serif;
          }

          .category-tab:hover {
            border-color: #00509e;
            color: #00509e;
          }

          .category-tab.active {
            background: #00509e;
            border-color: #00509e;
            color: white;
          }

          .sort-select {
            padding: 8px 16px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-size: 13px;
            font-family: 'Poppins', sans-serif;
            color: #555;
            cursor: pointer;
            outline: none;
            transition: border-color 0.3s ease;
          }

          .sort-select:focus {
            border-color: #00509e;
          }

          .cart-btn {
            position: relative;
            background: #001a3d;
            color: white;
            border: none;
            padding: 10px 22px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            font-family: 'Poppins', sans-serif;
            transition: all 0.3s ease;
          }

          .cart-btn:hover {
            background: #002b5c;
            transform: translateY(-1px);
          }

          .cart-badge {
            position: absolute;
            top: -8px;
            right: -8px;
            background: #ff3333;
            color: white;
            border-radius: 50%;
            width: 22px;
            height: 22px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-weight: 700;
            animation: scaleIn 0.3s ease;
          }

          /* ===== PRODUCT GRID ===== */
          .store-grid-container {
            max-width: 1200px;
            margin: 40px auto;
            padding: 0 20px;
          }

          .results-info {
            color: #888;
            font-size: 0.9rem;
            margin-bottom: 20px;
          }

          .pagination {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 40px;
          }

          .page-btn {
            min-width: 42px;
            height: 42px;
            padding: 0 14px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            background: white;
            color: #555;
            font-size: 14px;
            font-weight: 600;
            font-family: 'Poppins', sans-serif;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .page-btn:hover:not(:disabled):not(.active) {
            border-color: #00509e;
            color: #00509e;
          }

          .page-btn.active {
            background: #00509e;
            border-color: #00509e;
            color: white;
          }

          .page-btn:disabled {
            opacity: 0.4;
            cursor: not-allowed;
          }

          .store-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 25px;
          }

          .product-card {
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.06);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
            opacity: 0;
            animation: fadeInUp 0.5s ease forwards;
          }

          .product-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 15px 35px rgba(0,0,0,0.12);
          }

          .product-img-wrapper {
            position: relative;
            overflow: hidden;
            height: 240px;
            background: #f0f4ff;
          }

          .product-img-wrapper img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
          }

          .product-card:hover .product-img-wrapper img {
            transform: scale(1.08);
          }

          .product-badge {
            position: absolute;
            top: 12px;
            left: 12px;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            z-index: 2;
          }

          .badge-bestseller { background: #ffd700; color: #001a3d; }
          .badge-popular { background: #00509e; color: white; }
          .badge-new { background: #00c853; color: white; }
          .badge-toprated { background: #ff6d00; color: white; }
          .badge-premium { background: #7b1fa2; color: white; }
          .badge-bestvalue { background: #00bfa5; color: white; }

          .product-quick-actions {
            position: absolute;
            top: 12px;
            right: 12px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            opacity: 0;
            transform: translateX(10px);
            transition: all 0.3s ease;
            z-index: 2;
          }

          .product-card:hover .product-quick-actions {
            opacity: 1;
            transform: translateX(0);
          }

          .quick-action-btn {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: white;
            border: none;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            transition: all 0.2s ease;
          }

          .quick-action-btn:hover {
            background: #00509e;
            color: white;
            transform: scale(1.1);
          }

          .product-info {
            padding: 20px;
          }

          .product-category-tag {
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #00509e;
            margin-bottom: 6px;
          }

          .product-name {
            font-size: 1.05rem;
            font-weight: 600;
            color: #1a1a2e;
            margin-bottom: 6px;
          }

          .product-rating {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-bottom: 10px;
          }

          .stars {
            color: #ffc107;
            font-size: 13px;
            letter-spacing: 1px;
          }

          .rating-text {
            font-size: 12px;
            color: #888;
          }

          .product-price-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 12px;
          }

          .product-price {
            font-size: 1.25rem;
            font-weight: 700;
            color: #001a3d;
          }

          .add-to-cart-btn {
            padding: 10px 20px;
            background: linear-gradient(135deg, #00509e, #003f7f);
            color: white;
            border: none;
            border-radius: 25px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: 'Poppins', sans-serif;
          }

          .add-to-cart-btn:hover {
            background: linear-gradient(135deg, #003f7f, #001a3d);
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(0,63,127,0.3);
          }

          .add-to-cart-btn.added {
            background: linear-gradient(135deg, #00c853, #009624);
            animation: pulse 0.4s ease;
          }

          .product-buttons {
            display: flex;
            gap: 8px;
            margin-top: 14px;
          }

          .product-buttons .add-to-cart-btn {
            flex: 1;
            border-radius: 10px;
            background: #e8f0fe;
            color: #00509e;
            font-size: 12px;
            padding: 11px 8px;
            box-sizing: border-box;
          }

          .product-buttons .add-to-cart-btn:hover {
            background: #d0e2fc;
            transform: translateY(-1px);
            box-shadow: none;
          }

          .product-buttons .add-to-cart-btn.added {
            background: linear-gradient(135deg, #00c853, #009624);
            color: white;
          }

          .buy-now-btn {
            flex: 1;
            padding: 11px 8px;
            background: linear-gradient(135deg, #ffb300, #ff8f00);
            color: #1a1a2e;
            border: none;
            border-radius: 10px;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: 'Poppins', sans-serif;
            box-sizing: border-box;
          }

          .buy-now-btn:hover {
            background: linear-gradient(135deg, #ffa000, #f57c00);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(255,152,0,0.35);
            color: white;
          }

          .quantity-stepper {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 18px;
            background: #f5f7fb;
            padding: 8px 14px;
            border-radius: 10px;
          }

          .quantity-stepper span {
            font-size: 13px;
            font-weight: 600;
            color: #555;
            flex: 1;
          }

          .qty-step-btn {
            width: 30px;
            height: 30px;
            border-radius: 8px;
            border: 1px solid #ddd;
            background: white;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
            color: #00509e;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
          }

          .qty-step-btn:hover {
            border-color: #00509e;
            background: #e8f0fe;
          }

          .modal-buy-row {
            display: flex;
            gap: 10px;
            margin-top: 10px;
          }

          .modal-buy-row .modal-buy-now {
            flex: 1;
            padding: 14px;
            background: linear-gradient(135deg, #ffb300, #ff8f00);
            color: #1a1a2e;
            border: none;
            border-radius: 12px;
            font-size: 1rem;
            font-weight: 700;
            cursor: pointer;
            font-family: 'Poppins', sans-serif;
            transition: all 0.3s ease;
          }

          .modal-buy-row .modal-buy-now:hover {
            background: linear-gradient(135deg, #ffa000, #f57c00);
            color: white;
            transform: translateY(-1px);
          }

          /* flying cart animation */
          .flying-cart {
            position: fixed;
            top: 40%;
            left: 55%;
            z-index: 5000;
            font-size: 26px;
            pointer-events: none;
            animation: flyToCart 0.8s cubic-bezier(0.5, -0.4, 0.4, 1.2) forwards;
          }

          @keyframes flyToCart {
            0% {
              transform: translate(0, 0) scale(1);
              opacity: 1;
            }
            100% {
              transform: translate(120px, -35vh) scale(0.3);
              opacity: 0;
            }
          }

          .size-selector {
            display: flex;
            gap: 4px;
            margin-top: 8px;
          }

          .size-btn {
            padding: 4px 10px;
            border: 1px solid #ddd;
            border-radius: 6px;
            background: white;
            font-size: 11px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-family: 'Poppins', sans-serif;
          }

          .size-btn:hover, .size-btn.selected {
            border-color: #00509e;
            color: #00509e;
            background: #f0f6ff;
          }

          /* ===== CART SIDEBAR ===== */
          .cart-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 2000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
          }

          .cart-overlay.open {
            opacity: 1;
            visibility: visible;
          }

          .cart-sidebar {
            position: fixed;
            top: 0;
            right: -420px;
            width: 400px;
            max-width: 90vw;
            height: 100%;
            background: white;
            z-index: 2001;
            box-shadow: -5px 0 30px rgba(0,0,0,0.2);
            transition: right 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            display: flex;
            flex-direction: column;
          }

          .cart-sidebar.open {
            right: 0;
          }

          .cart-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 24px;
            border-bottom: 1px solid #eee;
          }

          .cart-header h2 {
            font-size: 1.2rem;
            color: #001a3d;
          }

          .cart-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #666;
            transition: color 0.2s;
          }

          .cart-close:hover {
            color: #ff3333;
          }

          .cart-items {
            flex: 1;
            overflow-y: auto;
            padding: 16px 24px;
          }

          .cart-item {
            display: flex;
            gap: 14px;
            padding: 14px 0;
            border-bottom: 1px solid #f0f0f0;
            animation: fadeInRight 0.3s ease;
          }

          .cart-item-img {
            width: 70px;
            height: 70px;
            border-radius: 10px;
            object-fit: cover;
            background: #f0f4ff;
          }

          .cart-item-details {
            flex: 1;
          }

          .cart-item-name {
            font-size: 0.9rem;
            font-weight: 600;
            color: #1a1a2e;
            margin-bottom: 2px;
          }

          .cart-item-size {
            font-size: 0.75rem;
            color: #888;
          }

          .cart-item-price {
            font-size: 0.9rem;
            font-weight: 700;
            color: #00509e;
          }

          .cart-item-qty {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 6px;
          }

          .qty-btn {
            width: 26px;
            height: 26px;
            border-radius: 6px;
            border: 1px solid #ddd;
            background: white;
            cursor: pointer;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
          }

          .qty-btn:hover {
            border-color: #00509e;
            color: #00509e;
          }

          .cart-item-remove {
            background: none;
            border: none;
            color: #cc0000;
            cursor: pointer;
            font-size: 12px;
            margin-top: 4px;
            transition: color 0.2s;
          }

          .cart-item-remove:hover {
            color: #ff0000;
          }

          .cart-empty {
            text-align: center;
            padding: 60px 20px;
            color: #aaa;
          }

          .cart-empty-icon {
            font-size: 3rem;
            margin-bottom: 12px;
          }

          .cart-footer {
            padding: 20px 24px;
            border-top: 2px solid #eee;
            background: #fafafa;
          }

          .cart-total {
            display: flex;
            justify-content: space-between;
            font-size: 1.1rem;
            font-weight: 700;
            color: #001a3d;
            margin-bottom: 16px;
          }

          .checkout-btn {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #00509e, #003f7f);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            font-family: 'Poppins', sans-serif;
            transition: all 0.3s ease;
          }

          .checkout-btn:hover {
            background: linear-gradient(135deg, #003f7f, #001a3d);
            transform: translateY(-1px);
            box-shadow: 0 4px 15px rgba(0,63,127,0.3);
          }

          /* ===== PRODUCT MODAL ===== */
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.6);
            z-index: 3000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
          }

          .modal-overlay.open {
            opacity: 1;
            visibility: visible;
          }

          .modal-content {
            background: white;
            border-radius: 20px;
            max-width: 700px;
            width: 100%;
            max-height: 85vh;
            overflow-y: auto;
            display: flex;
            transform: scale(0.9) translateY(20px);
            transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }

          .modal-overlay.open .modal-content {
            transform: scale(1) translateY(0);
          }

          .modal-img {
            width: 50%;
            min-height: 400px;
            object-fit: cover;
            border-radius: 20px 0 0 20px;
          }

          .modal-details {
            padding: 30px;
            width: 50%;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          .modal-category {
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #00509e;
            margin-bottom: 8px;
          }

          .modal-name {
            font-size: 1.5rem;
            color: #001a3d;
            margin-bottom: 8px;
          }

          .modal-rating {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 12px;
          }

          .modal-price {
            font-size: 1.8rem;
            font-weight: 700;
            color: #001a3d;
            margin-bottom: 12px;
          }

          .modal-desc {
            font-size: 0.92rem;
            line-height: 1.7;
            color: #555;
            margin-bottom: 20px;
          }

          .modal-sizes {
            display: flex;
            gap: 8px;
            margin-bottom: 20px;
          }

          .modal-size-btn {
            padding: 8px 16px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            background: white;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-family: 'Poppins', sans-serif;
          }

          .modal-size-btn:hover, .modal-size-btn.selected {
            border-color: #00509e;
            color: #00509e;
            background: #f0f6ff;
          }

          .modal-add-btn {
            padding: 14px;
            background: linear-gradient(135deg, #00509e, #003f7f);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            font-family: 'Poppins', sans-serif;
            transition: all 0.3s ease;
          }

          .modal-add-btn:hover {
            background: linear-gradient(135deg, #003f7f, #001a3d);
            transform: translateY(-1px);
          }

          .modal-close-btn {
            position: absolute;
            top: 16px;
            right: 16px;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: white;
            border: none;
            box-shadow: 0 2px 10px rgba(0,0,0,0.15);
            cursor: pointer;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            z-index: 10;
          }

          .modal-close-btn:hover {
            background: #ff3333;
            color: white;
          }

          /* ===== FEATURES BAR ===== */
          .features-bar {
            max-width: 1200px;
            margin: 0 auto 40px;
            padding: 0 20px;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
          }

          .feature-item {
            text-align: center;
            padding: 25px 15px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.04);
            animation: fadeInUp 0.5s ease forwards;
            opacity: 0;
          }

          .feature-icon {
            font-size: 2rem;
            margin-bottom: 10px;
          }

          .feature-title {
            font-size: 0.85rem;
            font-weight: 600;
            color: #001a3d;
          }

          .feature-desc {
            font-size: 0.75rem;
            color: #888;
            margin-top: 4px;
          }

          @media (max-width: 900px) {
            .store-hero h1 { font-size: 2rem; }
            .store-toolbar { flex-direction: column; align-items: stretch; }
            .features-bar { grid-template-columns: repeat(2, 1fr); }
            .modal-content { flex-direction: column; }
            .modal-img { width: 100%; min-height: 250px; border-radius: 20px 20px 0 0; }
            .modal-details { width: 100%; }
            .store-grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
          }

          @media (max-width: 500px) {
            .features-bar { grid-template-columns: 1fr; }
            .store-grid { grid-template-columns: 1fr; }
          }
        `}</style>

        <Navbar />

        {/* ===== HERO ===== */}
        <div className="store-hero">
          <h1>CrewStyle Aviation Store</h1>
          <p>Professional uniforms, accessories, and gear for aviation professionals worldwide.</p>
          <div className="store-search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search products, categories..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* ===== TOOLBAR ===== */}
        <div className="store-toolbar">
          <div className="category-tabs">
            {categories.map((cat: string) => (
              <button
                key={cat}
                className={`category-tab ${activeCategory === cat ? "active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <select className="sort-select" value={sortBy} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value)}>
              {sortOptions.map((opt: SortOption) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <button className="cart-btn" onClick={() => setShowCart(true)}>
              🛒 Cart
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          </div>
        </div>

        {/* ===== FEATURES BAR ===== */}
        <div className="features-bar">
          {[
            { icon: "✈️", title: "Aviation Grade", desc: "IATA compliant uniforms" },
            { icon: "🚚", title: "Free Shipping", desc: "On orders over $150" },
            { icon: "🔄", title: "Easy Returns", desc: "30-day return policy" },
            { icon: "💬", title: "24/7 Support", desc: "Dedicated support team" },
          ].map((f: { icon: string; title: string; desc: string }, i: number) => (
            <div className="feature-item" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>

        {/* ===== PRODUCTS ===== */}
        <div className="store-grid-container">
          <div className="results-info">
            {filteredProducts.length === 0
              ? "Showing 0 products"
              : `Showing ${paginatedProducts.length > 0 ? (safePage - 1) * PAGE_SIZE + 1 : 0}–${(safePage - 1) * PAGE_SIZE + paginatedProducts.length} of ${filteredProducts.length} products`}
          </div>
          <div className="store-grid">
            {paginatedProducts.map((product: Product, index: number) => {
              const badgeClass: string = product.badge
                ? `badge-${product.badge.toLowerCase().replace(/\s/g, "")}`
                : "";
              return (
                <div
                  className="product-card"
                  key={product.id}
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <div className="product-img-wrapper">
                    {product.badge && <span className={`product-badge ${badgeClass}`}>{product.badge}</span>}
                    {isOutOfStock(product) && (
                      <span className="product-badge" style={{ background: "#6b7280", color: "white", left: "auto", right: "12px" }}>
                        Out of Stock
                      </span>
                    )}
                    <img src={product.image} alt={product.name} />
                    <div className="product-quick-actions">
                      <button
                        className="quick-action-btn"
                        title="Quick View"
                        onClick={() => { setModalQty(1); setSelectedProduct(product); }}
                      >
                        👁
                      </button>
                      <button
                        className="quick-action-btn"
                        title="Add to Cart"
                        onClick={() => addToCart(product)}
                        disabled={isOutOfStock(product)}
                        style={isOutOfStock(product) ? { opacity: 0.4, cursor: "not-allowed" } : {}}
                      >
                        🛒
                      </button>
                    </div>
                  </div>
                  <div className="product-info">
                    <div className="product-category-tag">{product.category}</div>
                    <div className="product-name">{product.name}</div>
                    <div className="product-rating">
                      <span className="stars">{renderStars(product.rating)}</span>
                      <span className="rating-text">{product.rating} ({product.reviews})</span>
                    </div>
                    {product.sizes && product.sizes.length > 0 && (
                      <div className="size-selector">
                        {product.sizes.map((size: string) => (
                          <button
                            key={size}
                            className={`size-btn ${(selectedSizes[product.id] || product.sizes[0]) === size ? "selected" : ""}`}
                            onClick={() => setSelectedSizes({ ...selectedSizes, [product.id]: size })}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="product-price-row">
                      <span className="product-price">${product.price.toFixed(2)}</span>
                    </div>
                    <div className="product-buttons">
                      <button
                        className={`add-to-cart-btn ${addedAnimation.has(product.id) ? "added" : ""}`}
                        onClick={() => addToCart(product)}
                        disabled={isOutOfStock(product)}
                        style={isOutOfStock(product) ? { opacity: 0.6, cursor: "not-allowed" } : {}}
                      >
                        {isOutOfStock(product) ? "Out of Stock" : addedAnimation.has(product.id) ? "✓ Added" : "🛒 Add to Cart"}
                      </button>
                      <button
                        className="buy-now-btn"
                        onClick={() => buyNow(product)}
                        disabled={isOutOfStock(product)}
                        style={isOutOfStock(product) ? { opacity: 0.6, cursor: "not-allowed" } : {}}
                      >
                        ⚡ Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 20px", color: "#aaa" }}>
              <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🔍</div>
              <p>No products found. Try a different search or category.</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                ‹ Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`page-btn ${currentPage === page ? "active" : ""}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className="page-btn"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Next ›
              </button>
            </div>
          )}
        </div>

        {/* ===== CART SIDEBAR ===== */}
        <div className={`cart-overlay ${showCart ? "open" : ""}`} onClick={() => setShowCart(false)} />
        <div className={`cart-sidebar ${showCart ? "open" : ""}`}>
          <div className="cart-header">
            <h2>Shopping Cart ({cartCount})</h2>
            <button className="cart-close" onClick={() => setShowCart(false)}>✕</button>
          </div>
          <div className="cart-items">
            {cart.length === 0 ? (
              <div className="cart-empty">
                <div className="cart-empty-icon">🛒</div>
                <p>Your cart is empty</p>
              </div>
            ) : (
              cart.map((item: CartItem, index: number) => (
                <div className="cart-item" key={`${item.id}-${item.size}`}>
                  <img className="cart-item-img" src={item.image} alt={item.name} />
                  <div className="cart-item-details">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-size">Size: {item.size}</div>
                    <div className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</div>
                    <div className="cart-item-qty">
                      <button className="qty-btn" onClick={() => updateCartQty(index, -1)}>−</button>
                      <span style={{ fontWeight: 600 }}>{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateCartQty(index, 1)}>+</button>
                    </div>
                    <button className="cart-item-remove" onClick={() => removeFromCart(index)}>Remove</button>
                  </div>
                </div>
              ))
            )}
          </div>
          {cart.length > 0 && (
            <div className="cart-footer">
              <div className="cart-total">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <button className="checkout-btn" onClick={goToCheckout}>
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>

        {/* ===== PRODUCT MODAL ===== */}
        <div className={`modal-overlay ${selectedProduct ? "open" : ""}`} onClick={() => setSelectedProduct(null)}>
          {selectedProduct && (
            <div className="modal-content" onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
              <button className="modal-close-btn" onClick={() => setSelectedProduct(null)}>✕</button>
              <img className="modal-img" src={selectedProduct.image} alt={selectedProduct.name} />
              <div className="modal-details">
                <div className="modal-category">{selectedProduct.category}</div>
                <div className="modal-name">{selectedProduct.name}</div>
                <div className="modal-rating">
                  <span className="stars">{renderStars(selectedProduct.rating)}</span>
                  <span className="rating-text">{selectedProduct.rating} ({selectedProduct.reviews} reviews)</span>
                </div>
                <div className="modal-price">${selectedProduct.price.toFixed(2)}</div>
                <div className="modal-desc">{selectedProduct.description}</div>
                <div className="modal-sizes">
                  {selectedProduct.sizes.map((size: string) => (
                    <button
                      key={size}
                      className={`modal-size-btn ${(selectedSizes[selectedProduct.id] || selectedProduct.sizes[0]) === size ? "selected" : ""}`}
                      onClick={() => setSelectedSizes({ ...selectedSizes, [selectedProduct.id]: size })}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <div className="quantity-stepper">
                  <span>Quantity</span>
                  <button className="qty-step-btn" onClick={() => setModalQty(Math.max(1, modalQty - 1))}>−</button>
                  <span style={{ width: 30, textAlign: "center" }}>{modalQty}</span>
                  <button className="qty-step-btn" onClick={() => setModalQty(modalQty + 1)}>+</button>
                </div>
                <button
                  className="modal-add-btn"
                  disabled={isOutOfStock(selectedProduct)}
                  style={isOutOfStock(selectedProduct) ? { opacity: 0.6, cursor: "not-allowed" } : {}}
                  onClick={() => {
                    addToCart(selectedProduct, modalQty);
                    setModalQty(1);
                    setSelectedProduct(null);
                  }}
                >
                  {isOutOfStock(selectedProduct) ? "Out of Stock" : `Add to Cart — $${(selectedProduct.price * modalQty).toFixed(2)}`}
                </button>
                <div className="modal-buy-row">
                  <button
                    className="modal-buy-now"
                    disabled={isOutOfStock(selectedProduct)}
                    style={isOutOfStock(selectedProduct) ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                    onClick={() => {
                      const size: string = selectedSizes[selectedProduct.id] || selectedProduct.sizes[0] || "One Size";
                      const item: CartItem = { ...selectedProduct, size, quantity: modalQty };
                      setModalQty(1);
                      setSelectedProduct(null);
                      navigate("/price", { state: { product: item } });
                    }}
                  >
                    ⚡ Buy Now — ${(selectedProduct.price * modalQty).toFixed(2)}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {flyingCart && (
          <span className="flying-cart">🛒</span>
        )}

        <Footer />
      </>
  );
};

export default Store;
