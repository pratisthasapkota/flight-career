import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface Vacancy {
  id: number | string;
  title: string;
  salary: string;
  role: string;
  skills: string;
  responsibilities: string;
  location: string;
  deadline: string;
}

interface Product {
  id: number | string;
  name: string;
  category: string;
  price: number | string;
  image: string;
  rating: number | string;
  reviews: number | string;
  badge: string | null;
  description: string | null;
  sizes: string | string[];
  stock: number | string;
  active: boolean;
}

interface OrderItem {
  id: number | string;
  orderId?: string;
  productName: string;
  size: string;
  quantity: number | string;
  price: number | string;
  name?: string;
  email?: string;
  address?: string;
  city?: string;
  postalcode?: string;
  phone?: string;
  orderDate?: string;
  status?: string;
}

interface OrderGroup {
  key: string;
  name: string;
  email: string;
  address: string;
  city: string;
  postalcode: string;
  phone: string;
  orderDate: string;
  status: string;
  items: OrderItem[];
}

interface VacancyApplication {
  id: number | string;
  name: string;
  email: string;
  phone: string;
  resumeUrl?: string;
  coverLetter?: string;
  createdAt?: string;
}

interface JobApplication {
  id: number | string;
  name: string;
  email: string;
  phone: string;
  program: string;
  college: string;
  message?: string;
  createdAt?: string;
}

interface EmployeeInterest {
  id: number | string;
  name: string;
  email: string;
  phone: string;
  role: string;
  message?: string;
  createdAt?: string;
}

interface User {
  id: number | string;
  email: string;
  verified: boolean;
}

interface Subscriber {
  id: number | string;
  email: string;
}

interface AdminData {
  vacancies: Vacancy[];
  vacancyApplications: VacancyApplication[];
  jobApplications: JobApplication[];
  employeeInterests: EmployeeInterest[];
  users: User[];
  subscribers: Subscriber[];
  orders: OrderItem[];
}

interface VacancyForm {
  title: string;
  salary: string;
  role: string;
  skills: string;
  responsibilities: string;
  location: string;
  deadline: string;
}

interface ProductForm {
  name: string;
  category: string;
  price: string;
  image: string;
  rating: string;
  reviews: string;
  badge: string;
  description: string;
  sizes: string;
  stock: string;
  active: boolean;
}

interface OrderFilters {
  status: string;
  from: string;
  to: string;
  search: string;
}

interface VacancyFilters {
  search: string;
  role: string;
  from: string;
  to: string;
}

interface VacancyAppFilters {
  search: string;
  from: string;
  to: string;
}

interface InterestFilters {
  search: string;
  role: string;
  from: string;
  to: string;
}

interface JobAppFilters {
  search: string;
  program: string;
  from: string;
  to: string;
}

interface ProductFilters {
  search: string;
  category: string;
}

interface UserFilters {
  search: string;
  verified: string;
}

interface SubscriberFilters {
  search: string;
}

interface Tab {
  id: string;
  label: string;
  icon: string;
}

interface StatCard {
  label: string;
  value: string | number;
  color: string;
  bg: string;
}

interface Financials {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

const emptyVacancy: VacancyForm = {
  title: "",
  salary: "",
  role: "Cabin Crew",
  skills: "",
  responsibilities: "",
  location: "",
  deadline: "",
};

const vacancyRoles: string[] = ["Cabin Crew", "Pilot", "Maintenance", "Ground Staff", "ATC", "Safety", "Management"];

const productCategories: string[] = ["Pilot", "Cabin Crew", "Ground Staff", "Accessories"];

const emptyProduct: ProductForm = {
  name: "",
  category: "Cabin Crew",
  price: "",
  image: "",
  rating: "4.5",
  reviews: "0",
  badge: "",
  description: "",
  sizes: "",
  stock: "0",
  active: true,
};

const orderStatuses: string[] = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const money = (n: number | string): string =>
  `$${Number(n || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const statusClass = (s: string): string => {
  switch (s) {
    case "Delivered":
      return "adm-tag-green";
    case "Shipped":
      return "adm-tag-purple";
    case "Processing":
      return "adm-tag-blue";
    case "Cancelled":
      return "adm-tag-gray";
    default:
      return "adm-tag-orange";
  }
};

const formatDateTime = (iso?: string): string => {
  if (!iso) return "N/A";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString();
};

const computeOrderGroups = (orders: OrderItem[]): OrderGroup[] => {
  const map = new Map<string, OrderGroup>();
  orders.forEach((o) => {
    const key = o.orderId || `#${o.id}`;
    if (!map.has(key)) {
      map.set(key, {
        key,
        name: o.name || "",
        email: o.email || "",
        address: o.address || "",
        city: o.city || "",
        postalcode: o.postalcode || "",
        phone: o.phone || "",
        orderDate: o.orderDate || "",
        status: o.status || "Pending",
        items: [],
      });
    }
    map.get(key)!.items.push(o);
  });
  const groups = [...map.values()];
  groups.sort((a, b) => {
    const da = a.orderDate ? new Date(a.orderDate).getTime() : 0;
    const db = b.orderDate ? new Date(b.orderDate).getTime() : 0;
    return db - da;
  });
  return groups;
};

const orderFinancials = (group: OrderGroup): Financials => {
  const subtotal = group.items.reduce(
    (sum: number, i: OrderItem) => sum + (Number(i.price) || 0) * (Number(i.quantity) || 1),
    0
  );
  const shipping = subtotal >= 150 ? 0 : 9.99;
  const tax = subtotal * 0.1;
  return { subtotal, shipping, tax, total: subtotal + shipping + tax };
};

interface AdmFilterBarProps {
  search?: string;
  setSearch?: (v: string) => void;
  searchPlaceholder?: string;
  selectValue?: string;
  setSelect?: (v: string) => void;
  selectOptions?: string[];
  selectLabel?: string;
  from?: string;
  setFrom?: (v: string) => void;
  to?: string;
  setTo?: (v: string) => void;
  withDates?: boolean;
  clearable?: boolean;
}

const AdmFilterBar: React.FC<AdmFilterBarProps> = ({
  search = "",
  setSearch,
  searchPlaceholder = "Search...",
  selectValue = "",
  setSelect,
  selectOptions = [],
  selectLabel = "All",
  from = "",
  setFrom,
  to = "",
  setTo,
  withDates = false,
  clearable = true,
}) => {
  const hasActive = search || selectValue || from || to;
  const clearAll = (): void => {
    if (setSearch) setSearch("");
    if (setSelect) setSelect("");
    if (setFrom) setFrom("");
    if (setTo) setTo("");
  };
  return (
    <div className="adm-filter-bar">
      {setSearch && (
        <input
          type="text"
          className="adm-filter-input"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        />
      )}
      {setSelect && Array.isArray(selectOptions) && selectOptions.length > 0 && (
        <select className="adm-filter-select" value={selectValue} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelect(e.target.value)}>
          <option value="">{selectLabel}</option>
          {selectOptions.map((o: string) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      )}
      {withDates && (
        <>
          <label className="adm-filter-label">From</label>
          <input type="date" className="adm-filter-input" value={from} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFrom!(e.target.value)} />
          <label className="adm-filter-label">To</label>
          <input type="date" className="adm-filter-input" value={to} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTo!(e.target.value)} />
        </>
      )}
      {clearable && hasActive && (
        <button type="button" className="adm-filter-clear" onClick={clearAll}>&#10005; Clear</button>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<AdminData | null>(null);
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [loading, setLoading] = useState<boolean>(true);

  const [showVacancyForm, setShowVacancyForm] = useState<boolean>(false);
  const [editingVacancy, setEditingVacancy] = useState<Vacancy | null>(null);
  const [vacancyForm, setVacancyForm] = useState<VacancyForm>({ ...emptyVacancy });
  const [savingVacancy, setSavingVacancy] = useState<boolean>(false);

  const [showProductForm, setShowProductForm] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<ProductForm>({ ...emptyProduct });
  const [savingProduct, setSavingProduct] = useState<boolean>(false);

  const [orderFilters, setOrderFilters] = useState<OrderFilters>({ status: "", from: "", to: "", search: "" });
  const [vacancyFilters, setVacancyFilters] = useState<VacancyFilters>({ search: "", role: "", from: "", to: "" });
  const [vacancyAppFilters, setVacancyAppFilters] = useState<VacancyAppFilters>({ search: "", from: "", to: "" });
  const [interestFilters, setInterestFilters] = useState<InterestFilters>({ search: "", role: "", from: "", to: "" });
  const [jobAppFilters, setJobAppFilters] = useState<JobAppFilters>({ search: "", program: "", from: "", to: "" });
  const [productFilters, setProductFilters] = useState<ProductFilters>({ search: "", category: "" });
  const [userFilters, setUserFilters] = useState<UserFilters>({ search: "", verified: "" });
  const [subscriberFilters, setSubscriberFilters] = useState<SubscriberFilters>({ search: "" });

  const backendUrl: string = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  const getHeaders = (): Record<string, string> => ({
    Authorization: `Bearer ${localStorage.getItem("adminToken") || ""}`,
  });

useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchData = async (): Promise<void> => {
    try {
      const [appsRes, catRes] = await Promise.all([
        axios.get<{ data: AdminData }>(`${backendUrl}/api/admin/applications`, { headers: getHeaders() }),
        axios.get<{ data: Product[] }>(`${backendUrl}/api/products`).catch(() => null),
      ]);
      setData(appsRes.data.data);
      if (catRes && Array.isArray(catRes.data.data)) {
        setCatalog(catRes.data.data);
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
        return;
      }
      console.error("Failed to fetch admin data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = (): void => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const openCreateForm = (): void => {
    setEditingVacancy(null);
    setVacancyForm({ ...emptyVacancy });
    setShowVacancyForm(true);
  };

  const openEditForm = (v: Vacancy): void => {
    setEditingVacancy(v);
    setVacancyForm({
      title: v.title || "",
      salary: v.salary || "",
      role: v.role || "Cabin Crew",
      skills: v.skills || "",
      responsibilities: v.responsibilities || "",
      location: v.location || "",
      deadline: v.deadline || "",
    });
    setShowVacancyForm(true);
  };

  const closeVacancyForm = (): void => {
    setShowVacancyForm(false);
    setEditingVacancy(null);
    setVacancyForm({ ...emptyVacancy });
  };

  const handleVacancyFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setVacancyForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveVacancy = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setSavingVacancy(true);
    try {
      if (editingVacancy) {
        await axios.put(`${backendUrl}/api/vacancies/${editingVacancy.id}`, vacancyForm, { headers: getHeaders() });
      } else {
        await axios.post(`${backendUrl}/api/vacancies`, vacancyForm, { headers: getHeaders() });
      }
      await fetchData();
      closeVacancyForm();
    } catch (err) {
      console.error("Failed to save vacancy", err);
      alert("Failed to save vacancy");
    } finally {
      setSavingVacancy(false);
    }
  };

  const handleDeleteVacancy = async (id: number | string): Promise<void> => {
    if (!window.confirm("Are you sure you want to delete this vacancy?")) return;
    try {
      await axios.delete(`${backendUrl}/api/vacancies/${id}`, { headers: getHeaders() });
      await fetchData();
    } catch (err) {
      console.error("Failed to delete vacancy", err);
      alert("Failed to delete vacancy");
    }
  };

  const handleResendVerification = async (id: number | string): Promise<void> => {
    try {
      await axios.post(`${backendUrl}/api/admin/users/${id}/resend-verification`, {}, { headers: getHeaders() });
      alert("Verification email sent successfully");
    } catch (err: any) {
      console.error("Failed to resend verification", err);
      alert(err.response?.data?.message || "Failed to resend verification email");
    }
  };

  const handleDeleteUser = async (id: number | string): Promise<void> => {
    if (!window.confirm(`Delete this user (ID ${id})? This will permanently remove the account and cannot be undone.`)) return;
    try {
      await axios.delete(`${backendUrl}/api/admin/users/${id}`, { headers: getHeaders() });
      await fetchData();
    } catch (err: any) {
      console.error("Failed to delete user", err);
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleDeleteSubscriber = async (id: number | string): Promise<void> => {
    if (!window.confirm(`Delete this subscriber (ID ${id})? This will permanently remove them from the notify list.`)) return;
    try {
      await axios.delete(`${backendUrl}/api/admin/subscribers/${id}`, { headers: getHeaders() });
      await fetchData();
    } catch (err: any) {
      console.error("Failed to delete subscriber", err);
      alert(err.response?.data?.message || "Failed to delete subscriber");
    }
  };

  const productToPayload = (p: ProductForm): Record<string, unknown> => ({
    name: p.name,
    category: p.category,
    price: p.price,
    image: p.image,
    rating: p.rating,
    reviews: p.reviews,
    badge: p.badge || null,
    description: p.description || null,
    sizes: p.sizes,
    stock: p.stock,
    active: p.active,
  });

  const openCreateProduct = (): void => {
    setEditingProduct(null);
    setProductForm({ ...emptyProduct });
    setShowProductForm(true);
  };

  const openEditProduct = (p: Product): void => {
    setEditingProduct(p);
    setProductForm({
      name: p.name || "",
      category: p.category || "Cabin Crew",
      price: String(p.price ?? ""),
      image: p.image || "",
      rating: String(p.rating ?? "4.5"),
      reviews: String(p.reviews ?? "0"),
      badge: p.badge || "",
      description: p.description || "",
      sizes: Array.isArray(p.sizes) ? p.sizes.join(",") : p.sizes || "",
      stock: String(p.stock ?? "0"),
      active: p.active !== false,
    });
    setShowProductForm(true);
  };

  const closeProductForm = (): void => {
    setShowProductForm(false);
    setEditingProduct(null);
    setProductForm({ ...emptyProduct });
  };

  const handleProductFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setProductForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setSavingProduct(true);
    try {
      if (editingProduct) {
        await axios.put(`${backendUrl}/api/products/${editingProduct.id}`, productToPayload(productForm), { headers: getHeaders() });
      } else {
        await axios.post(`${backendUrl}/api/products`, productToPayload(productForm), { headers: getHeaders() });
      }
      await fetchData();
      closeProductForm();
    } catch (err: any) {
      console.error("Failed to save product", err);
      alert(err.response?.data?.message || "Failed to save product");
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: number | string): Promise<void> => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${backendUrl}/api/products/${id}`, { headers: getHeaders() });
      await fetchData();
    } catch (err) {
      console.error("Failed to delete product", err);
      alert("Failed to delete product");
    }
  };

  const handleToggleProductActive = async (p: Product): Promise<void> => {
    try {
      await axios.put(`${backendUrl}/api/products/${p.id}`, productToPayload({ ...p, active: !p.active } as ProductForm), { headers: getHeaders() });
      await fetchData();
    } catch (err) {
      console.error("Failed to toggle product", err);
      alert("Failed to update product");
    }
  };

  const updateOrderStatus = async (key: string, status: string): Promise<void> => {
    try {
      await axios.put(
        `${backendUrl}/api/admin/orders/${encodeURIComponent(key)}/status`,
        { status },
        { headers: getHeaders() }
      );
      await fetchData();
    } catch (err) {
      console.error("Failed to update order status", err);
      alert("Failed to update order status");
    }
  };

  const deleteOrder = async (key: string): Promise<void> => {
    if (!window.confirm("Delete this entire order?")) return;
    try {
      await axios.delete(`${backendUrl}/api/admin/orders/${encodeURIComponent(key)}`, {
        headers: getHeaders(),
      });
      await fetchData();
    } catch (err) {
      console.error("Failed to delete order", err);
      alert("Failed to delete order");
    }
  };

  const orderGroups = useMemo(
    (): OrderGroup[] => (data ? computeOrderGroups(data.orders || []) : []),
    [data]
  );

  const totalRevenue: number = orderGroups.reduce((sum: number, g: OrderGroup) => sum + orderFinancials(g).total, 0);
  const pendingOrders: number = orderGroups.filter((g: OrderGroup) => g.status === "Pending").length;

  const dayStart = (isoBase?: string): number | null => {
    const d = isoBase ? new Date(isoBase) : new Date(NaN);
    return isNaN(d.getTime()) ? null : d.getTime();
  };
  const inRange = (ts: number | null, from: string, to: string): boolean => {
    if (ts === null) return true;
    if (from && ts < new Date(from).getTime()) return false;
    if (to && ts > new Date(`${to}T23:59:59`).getTime()) return false;
    return true;
  };

  const filteredOrders = useMemo(
    (): OrderGroup[] =>
      orderGroups.filter((g: OrderGroup) => {
        if (orderFilters.status && g.status !== orderFilters.status) return false;
        if (orderFilters.search) {
          const q = orderFilters.search.toLowerCase();
          if (!`${g.key} ${g.name || ""} ${g.email || ""}`.toLowerCase().includes(q)) return false;
        }
        return inRange(dayStart(g.orderDate), orderFilters.from, orderFilters.to);
      }),
    [orderGroups, orderFilters]
  );

  const filteredVacancies = useMemo(
    (): Vacancy[] =>
      (data?.vacancies || []).filter((v: Vacancy) => {
        if (vacancyFilters.role && v.role !== vacancyFilters.role) return false;
        if (vacancyFilters.search) {
          const q = vacancyFilters.search.toLowerCase();
          if (!`${v.title || ""} ${v.location || ""} ${v.salary || ""}`.toLowerCase().includes(q)) return false;
        }
        return inRange(dayStart(v.deadline), vacancyFilters.from, vacancyFilters.to);
      }),
    [data, vacancyFilters]
  );

  const filteredVacancyApps = useMemo(
    (): VacancyApplication[] =>
      (data?.vacancyApplications || []).filter((a: VacancyApplication) => {
        if (vacancyAppFilters.search) {
          const q = vacancyAppFilters.search.toLowerCase();
          if (!`${a.name || ""} ${a.email || ""} ${a.phone || ""}`.toLowerCase().includes(q)) return false;
        }
        return inRange(dayStart(a.createdAt), vacancyAppFilters.from, vacancyAppFilters.to);
      }),
    [data, vacancyAppFilters]
  );

  const filteredInterests = useMemo(
    (): EmployeeInterest[] =>
      (data?.employeeInterests || []).filter((i: EmployeeInterest) => {
        if (interestFilters.role && i.role !== interestFilters.role) return false;
        if (interestFilters.search) {
          const q = interestFilters.search.toLowerCase();
          if (!`${i.name || ""} ${i.email || ""} ${i.message || ""}`.toLowerCase().includes(q)) return false;
        }
        return inRange(dayStart(i.createdAt), interestFilters.from, interestFilters.to);
      }),
    [data, interestFilters]
  );

  const filteredJobApps = useMemo(
    (): JobApplication[] =>
      (data?.jobApplications || []).filter((a: JobApplication) => {
        if (jobAppFilters.program && a.program !== jobAppFilters.program) return false;
        if (jobAppFilters.search) {
          const q = jobAppFilters.search.toLowerCase();
          if (!`${a.name || ""} ${a.email || ""} ${a.college || ""} ${a.program || ""}`.toLowerCase().includes(q)) return false;
        }
        return inRange(dayStart(a.createdAt), jobAppFilters.from, jobAppFilters.to);
      }),
    [data, jobAppFilters]
  );

  const filteredProducts = useMemo(
    (): Product[] =>
      catalog.filter((p: Product) => {
        if (productFilters.category && p.category !== productFilters.category) return false;
        if (productFilters.search) {
          const q = productFilters.search.toLowerCase();
          if (!`${p.name || ""} ${p.category || ""}`.toLowerCase().includes(q)) return false;
        }
        return true;
      }),
    [catalog, productFilters]
  );

  const filteredUsers = useMemo(
    (): User[] =>
      (data?.users || []).filter((u: User) => {
        if (userFilters.verified) {
          if (userFilters.verified === "Verified" && !u.verified) return false;
          if (userFilters.verified === "Unverified" && u.verified) return false;
        }
        if (userFilters.search) {
          const q = userFilters.search.toLowerCase();
          if (!(u.email || "").toLowerCase().includes(q)) return false;
        }
        return true;
      }),
    [data, userFilters]
  );

  const filteredSubscribers = useMemo(
    (): Subscriber[] =>
      (data?.subscribers || []).filter((s: Subscriber) => {
        if (subscriberFilters.search) {
          const q = subscriberFilters.search.toLowerCase();
          if (!(s.email || "").toLowerCase().includes(q)) return false;
        }
        return true;
      }),
    [data, subscriberFilters]
  );

  const revenueSeries = useMemo(() => {
    const map = new Map<string, number>();
    orderGroups.forEach((g: OrderGroup) => {
      if (!g.orderDate) return;
      const d = new Date(g.orderDate);
      if (isNaN(d.getTime())) return;
      const key = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
      map.set(key, (map.get(key) || 0) + orderFinancials(g).total);
    });
    return [...map.entries()]
      .map(([date, revenue]: [string, number]) => ({ date, revenue: Number(revenue.toFixed(2)) }))
      .slice(-14);
  }, [orderGroups]);

  const orderSeries = useMemo(() => {
    const map = new Map<string, number>();
    orderGroups.forEach((g: OrderGroup) => {
      if (!g.orderDate) return;
      const d = new Date(g.orderDate);
      if (isNaN(d.getTime())) return;
      const key = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
      map.set(key, (map.get(key) || 0) + 1);
    });
    return [...map.entries()].map(([date, orders]: [string, number]) => ({ date, orders })).slice(-14);
  }, [orderGroups]);

  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    orderGroups.forEach((g: OrderGroup) => {
      counts[g.status] = (counts[g.status] || 0) + 1;
    });
    return orderStatuses
      .filter((s: string) => counts[s])
      .map((s: string) => ({ name: s, value: counts[s] }));
  }, [orderGroups]);

  const topProducts = useMemo(() => {
    const map = new Map<string, number>();
    (data?.orders || []).forEach((o: OrderItem) => {
      const name = o.productName || "Unknown";
      map.set(name, (map.get(name) || 0) + (Number(o.quantity) || 1));
    });
    return [...map.entries()]
      .map(([name, qty]: [string, number]) => ({ name, qty }))
      .sort((a: { name: string; qty: number }, b: { name: string; qty: number }) => b.qty - a.qty)
      .slice(0, 5);
  }, [data]);

  const statusColors: Record<string, string> = {
    Pending: "#e65100",
    Processing: "#00509e",
    Shipped: "#7c3aed",
    Delivered: "#0a7e3f",
    Cancelled: "#6b7280",
  };

  const tabs: Tab[] = [
    { id: "overview", label: "Overview", icon: "■" },
    { id: "vacancies", label: "Vacancies", icon: "📋" },
    { id: "vacancy-apps", label: "Vacancy Applications", icon: "👤" },
    { id: "interests", label: "Employee Interests", icon: "🤝" },
    { id: "job-apps", label: "Job Applications", icon: "📄" },
    { id: "orders", label: "Orders", icon: "🛒" },
    { id: "products", label: "Products", icon: "📦" },
    { id: "users", label: "Users", icon: "👥" },
    { id: "subscribers", label: "Subscribers", icon: "✉️" },
  ];

  const statCards: StatCard[] = data
    ? [
        { label: "Total Revenue", value: money(totalRevenue), color: "#0a7e3f", bg: "#e6f9ee" },
        { label: "Orders", value: orderGroups.length, color: "#e65100", bg: "#fff3e0" },
        { label: "Pending Orders", value: pendingOrders, color: "#7c3aed", bg: "#f3e8ff" },
        { label: "Total Vacancies", value: data.vacancies?.length || 0, color: "#00509e", bg: "#e8f0fe" },
        { label: "Vacancy Applications", value: data.vacancyApplications?.length || 0, color: "#00838f", bg: "#e0f7fa" },
        { label: "Job Applications", value: data.jobApplications?.length || 0, color: "#00838f", bg: "#e0f7fa" },
        { label: "Employee Interests", value: data.employeeInterests?.length || 0, color: "#00838f", bg: "#e0f7fa" },
        { label: "Registered Users", value: data.users?.length || 0, color: "#00838f", bg: "#e0f7fa" },
        { label: "Subscribers", value: data.subscribers?.length || 0, color: "#7c3aed", bg: "#f3e8ff" },
      ]
    : [];

  return (
    <>
      <style>{`
        .adm-page {
          font-family: 'Poppins', sans-serif;
          min-height: 100vh;
          background: #f0f2f5;
        }

        .adm-topbar {
          background: linear-gradient(135deg, #001a3d, #00509e);
          color: white;
          padding: 15px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 15px rgba(0,0,0,0.2);
        }

        .adm-topbar h1 {
          font-size: 1.2rem;
          margin: 0;
          font-weight: 700;
        }

        .adm-topbar h1 span {
          color: #ffcc00;
        }

        .adm-topbar-right {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .adm-logout-btn {
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          padding: 8px 18px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'Poppins', sans-serif;
          transition: all 0.3s ease;
        }

        .adm-logout-btn:hover {
          background: rgba(255,255,255,0.25);
        }

        .adm-layout {
          display: flex;
          min-height: calc(100vh - 60px);
        }

        .adm-sidebar {
          width: 240px;
          background: white;
          border-right: 1px solid #e5e7eb;
          padding: 20px 0;
          flex-shrink: 0;
        }

        .adm-sidebar-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 24px;
          font-size: 14px;
          color: #555;
          cursor: pointer;
          transition: all 0.2s ease;
          border-left: 3px solid transparent;
        }

        .adm-sidebar-item:hover {
          background: #f8fafd;
          color: #00509e;
        }

        .adm-sidebar-item.active {
          background: #e8f0fe;
          color: #00509e;
          border-left-color: #00509e;
          font-weight: 600;
        }

        .adm-sidebar-item .icon {
          font-size: 16px;
          width: 22px;
          text-align: center;
        }

        .adm-main {
          flex: 1;
          padding: 25px 30px;
          overflow-x: auto;
        }

        .adm-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 18px;
          margin-bottom: 30px;
        }

        .adm-stat-card {
          background: white;
          border-radius: 12px;
          padding: 22px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          transition: transform 0.2s ease;
        }

        .adm-stat-card:hover {
          transform: translateY(-3px);
        }

        .adm-stat-card .stat-label {
          font-size: 12px;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .adm-stat-card .stat-value {
          font-size: 1.7rem;
          font-weight: 700;
          margin: 5px 0;
        }

        .adm-section-title {
          font-size: 1.1rem;
          color: #001a3d;
          margin-bottom: 15px;
          font-weight: 700;
        }

        .adm-table-wrap {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          overflow: hidden;
          margin-bottom: 25px;
        }

        .adm-table-header {
          padding: 18px 24px;
          border-bottom: 1px solid #eef2f7;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .adm-table-header h3 {
          margin: 0;
          font-size: 1rem;
          color: #001a3d;
        }

        .adm-table-header .count-badge {
          background: #e8f0fe;
          color: #00509e;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .adm-data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .adm-data-table th {
          background: #f8fafd;
          padding: 12px 18px;
          text-align: left;
          font-size: 12px;
          font-weight: 600;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #eef2f7;
        }

        .adm-data-table td {
          padding: 12px 18px;
          font-size: 14px;
          color: #333;
          border-bottom: 1px solid #f5f5f5;
          vertical-align: top;
        }

        .adm-data-table tbody tr:hover {
          background: #fafcff;
        }

        .adm-data-table tbody tr:last-child td {
          border-bottom: none;
        }

        .adm-tag {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
        }

        .adm-tag-blue { background: #e8f0fe; color: #00509e; }
        .adm-tag-green { background: #e6f9ee; color: #0a7e3f; }
        .adm-tag-orange { background: #fff3e0; color: #e65100; }
        .adm-tag-purple { background: #f3e8ff; color: #7c3aed; }
        .adm-tag-teal { background: #e0f7fa; color: #00838f; }
        .adm-tag-gray { background: #f3f4f6; color: #6b7280; }

        .adm-empty {
          text-align: center;
          padding: 40px 20px;
          color: #999;
        }

        .adm-empty .empty-icon {
          font-size: 40px;
          display: block;
          margin-bottom: 10px;
        }

        .adm-loading {
          text-align: center;
          padding: 80px 20px;
          color: #888;
        }

        .adm-loading .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e0e0e0;
          border-top-color: #00509e;
          border-radius: 50%;
          animation: admSpin 0.8s linear infinite;
          margin: 0 auto 15px;
        }

        @keyframes admSpin {
          to { transform: rotate(360deg); }
        }

        .adm-text-truncate {
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .adm-action-btns {
          display: flex;
          gap: 6px;
        }

        .adm-btn-sm {
          padding: 5px 12px;
          border-radius: 6px;
          border: none;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Poppins', sans-serif;
          transition: all 0.2s ease;
        }

        .adm-btn-edit {
          background: #e8f0fe;
          color: #00509e;
        }

        .adm-btn-edit:hover {
          background: #d0e2fc;
        }

        .adm-btn-delete {
          background: #fef2f2;
          color: #dc2626;
        }

        .adm-btn-delete:hover {
          background: #fee2e2;
        }

        .adm-btn-create {
          background: linear-gradient(135deg, #00509e, #003f7f);
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          border: none;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Poppins', sans-serif;
          transition: all 0.3s ease;
        }

        .adm-btn-create:hover {
          background: linear-gradient(135deg, #003f7f, #001a3d);
          transform: translateY(-1px);
        }

        .adm-filter-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
          background: white;
          padding: 14px 18px;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          margin-bottom: 18px;
        }

        .adm-filter-input,
        .adm-filter-select {
          padding: 8px 12px;
          border: 1.5px solid #dde3ea;
          border-radius: 8px;
          font-size: 13px;
          font-family: 'Poppins', sans-serif;
          outline: none;
          background: white;
          min-width: 150px;
          box-sizing: border-box;
          transition: border-color 0.3s ease;
        }

        .adm-filter-input:focus,
        .adm-filter-select:focus {
          border-color: #00509e;
          box-shadow: 0 0 0 3px rgba(0,80,158,0.1);
        }

        .adm-filter-label {
          font-size: 12px;
          font-weight: 600;
          color: #666;
        }

        .adm-filter-clear {
          padding: 8px 14px;
          background: #f3f4f6;
          border: none;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          color: #555;
          cursor: pointer;
          font-family: 'Poppins', sans-serif;
          transition: all 0.2s ease;
        }

        .adm-filter-clear:hover {
          background: #e5e7eb;
          color: #001a3d;
        }

        .adm-modal-overlay {
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          padding: 20px;
        }

        .adm-modal {
          background: white;
          border-radius: 16px;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0,0,0,0.25);
        }

        .adm-modal-header {
          background: linear-gradient(135deg, #001a3d, #00509e);
          color: white;
          padding: 20px 25px;
          border-radius: 16px 16px 0 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .adm-modal-header h2 {
          margin: 0;
          font-size: 1.1rem;
        }

        .adm-modal-close {
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          width: 30px; height: 30px;
          border-radius: 50%;
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .adm-modal-body {
          padding: 25px;
        }

        .adm-form-group {
          margin-bottom: 16px;
        }

        .adm-form-group label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #001a3d;
          margin-bottom: 5px;
        }

        .adm-form-group input,
        .adm-form-group select,
        .adm-form-group textarea {
          width: 100%;
          padding: 10px 14px;
          border: 1.5px solid #dde3ea;
          border-radius: 8px;
          font-size: 14px;
          font-family: 'Poppins', sans-serif;
          outline: none;
          transition: border-color 0.3s ease;
          box-sizing: border-box;
        }

        .adm-form-group input:focus,
        .adm-form-group select:focus,
        .adm-form-group textarea:focus {
          border-color: #00509e;
          box-shadow: 0 0 0 3px rgba(0,80,158,0.1);
        }

        .adm-form-group input[type="checkbox"] {
          width: auto;
          margin-right: 8px;
        }

        .adm-form-group textarea {
          resize: vertical;
          min-height: 70px;
        }

        .adm-form-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .adm-form-actions button {
          flex: 1;
          padding: 11px;
          border-radius: 8px;
          border: none;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Poppins', sans-serif;
          transition: all 0.3s ease;
        }

        .adm-form-save {
          background: linear-gradient(135deg, #00509e, #003f7f);
          color: white;
        }

        .adm-form-save:hover {
          background: linear-gradient(135deg, #003f7f, #001a3d);
        }

        .adm-form-save:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .adm-form-cancel {
          background: #f3f4f6;
          color: #555;
        }

        .adm-form-cancel:hover {
          background: #e5e7eb;
        }

        .adm-order-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          margin-bottom: 20px;
          overflow: hidden;
          animation: fadeInUp 0.3s ease;
        }

        .adm-order-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: #f8fafd;
          border-bottom: 1px solid #eef2f7;
          flex-wrap: wrap;
          gap: 10px;
        }

        .adm-order-head strong {
          color: #001a3d;
          font-size: 15px;
        }

        .adm-order-date {
          font-size: 12px;
          color: #888;
          margin-top: 2px;
        }

        .adm-order-actions {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .adm-order-actions select {
          padding: 6px 10px;
          border: 1.5px solid #dde3ea;
          border-radius: 6px;
          font-size: 12px;
          font-family: 'Poppins', sans-serif;
          background: white;
          cursor: pointer;
        }

        .adm-order-meta {
          padding: 12px 20px 0;
          font-size: 13px;
          color: #555;
        }

        .adm-order-address {
          padding: 4px 20px 14px;
          font-size: 12px;
          color: #888;
        }

        .adm-order-totals {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
          padding: 12px 20px;
          background: #fcfdff;
          border-top: 1px solid #eef2f7;
          font-size: 13px;
          color: #333;
          flex-wrap: wrap;
        }

        .adm-order-totals strong {
          font-size: 15px;
          color: #001a3d;
        }

        .adm-prod-img {
          width: 44px;
          height: 44px;
          border-radius: 8px;
          object-fit: cover;
          background: #f0f4ff;
        }

        .adm-ov-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 14px;
          margin-bottom: 22px;
        }

        .adm-ov-sub {
          font-size: 13px;
          color: #888;
          margin: 4px 0 0;
        }

        .adm-btn-outline {
          background: white;
          color: #00509e;
          border: 1.5px solid #d0e2fc;
        }

        .adm-btn-outline:hover {
          background: #e8f0fe;
          transform: translateY(-1px);
        }

        .adm-kpi {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .adm-kpi-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .adm-chart-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .adm-chart-card {
          background: white;
          border-radius: 14px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          overflow: hidden;
        }

        .adm-chart-body {
          padding: 16px 18px 12px;
        }

        .adm-chart-wide {
          grid-column: span 1;
        }

        @media (min-width: 1100px) {
          .adm-chart-row:first-of-type .adm-chart-wide {
            grid-column: span 2;
          }
          .adm-chart-row:last-of-type .adm-chart-wide {
            grid-column: span 1;
          }
        }

        @media (max-width: 1100px) {
          .adm-chart-row { grid-template-columns: 1fr; }
        }

        @media (max-width: 768px) {
          .adm-sidebar { display: none; }
          .adm-main { padding: 15px; }
          .adm-stats { grid-template-columns: 1fr 1fr; }
          .adm-topbar { padding: 12px 15px; }
          .adm-topbar h1 { font-size: 1rem; }
        }
      `}</style>

      <div className="adm-page">
        <div className="adm-topbar">
          <h1><span>&#9992;</span> AeroCareers <span>Admin</span></h1>
          <div className="adm-topbar-right">
            <button className="adm-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <div className="adm-layout">
          <div className="adm-sidebar">
            {tabs.map((tab: Tab) => (
              <div
                key={tab.id}
                className={`adm-sidebar-item ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="icon">{tab.icon}</span>
                {tab.label}
              </div>
            ))}
          </div>

          <div className="adm-main">
            {loading ? (
              <div className="adm-loading">
                <div className="spinner"></div>
                <p>Loading dashboard...</p>
              </div>
            ) : !data ? (
              <div className="adm-empty">
                <span className="empty-icon">&#9888;</span>
                <p>Failed to load data. Please try again.</p>
              </div>
            ) : (
              <>
                {activeTab === "overview" && (
                  <>
                    <div className="adm-ov-head">
                      <div>
                        <h2 className="adm-section-title" style={{ margin: 0 }}>Dashboard Overview</h2>
                        <p className="adm-ov-sub">A real-time snapshot of your aviation business.</p>
                      </div>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <button className="adm-btn-create" onClick={() => setActiveTab("products")}>+ Add Product</button>
                        <button className="adm-btn-create adm-btn-outline" onClick={() => setActiveTab("orders")}>View Orders</button>
                      </div>
                    </div>

                    <div className="adm-stats">
                      {statCards.map((s: StatCard, i: number) => (
                        <div className="adm-stat-card adm-kpi" key={i}>
                          <div className="adm-kpi-icon" style={{ background: s.bg, color: s.color }}>{s.label.slice(0, 2)}</div>
                          <div className="stat-label">{s.label}</div>
                          <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                        </div>
                      ))}
                    </div>

                    <div className="adm-chart-row">
                      <div className="adm-chart-card adm-chart-wide">
                        <div className="adm-table-header">
                          <h3>Revenue Trend</h3>
                          <span className="count-badge">Total {money(totalRevenue)}</span>
                        </div>
                        {revenueSeries.length > 0 ? (
                          <div className="adm-chart-body">
                            <ResponsiveContainer width="100%" height={260}>
                              <AreaChart data={revenueSeries} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                <defs>
                                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00509e" stopOpacity={0.35} />
                                    <stop offset="95%" stopColor="#00509e" stopOpacity={0} />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} width={55} tickFormatter={(v: number) => `$${v}`} />
                                <Tooltip formatter={(v: number) => [money(v), "Revenue"]} contentStyle={{ borderRadius: 10, border: "1px solid #eee", fontSize: 13 }} />
                                <Area type="monotone" dataKey="revenue" stroke="#00509e" strokeWidth={2.5} fill="url(#rev)" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <div className="adm-empty"><p>No revenue data yet</p></div>
                        )}
                      </div>

                      <div className="adm-chart-card">
                        <div className="adm-table-header">
                          <h3>Orders by Status</h3>
                          <span className="count-badge">{orderGroups.length}</span>
                        </div>
                        {statusData.length > 0 ? (
                          <div className="adm-chart-body">
                            <ResponsiveContainer width="100%" height={260}>
                              <PieChart>
                                <Pie
                                  data={statusData}
                                  dataKey="value"
                                  nameKey="name"
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={55}
                                  outerRadius={85}
                                  paddingAngle={3}
                                  label={(({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`) as any}
                                  labelLine={false}
                                  style={{ fontSize: 10 }}
                                >
                                  {statusData.map((entry: { name: string; value: number }) => (
                                    <Cell key={entry.name} fill={statusColors[entry.name] || "#888"} />
                                  ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #eee", fontSize: 13 }} />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <div className="adm-empty"><p>No order data yet</p></div>
                        )}
                      </div>
                    </div>

                    <div className="adm-chart-row">
                      <div className="adm-chart-card">
                        <div className="adm-table-header">
                          <h3>Orders Trend</h3>
                          <span className="count-badge">{orderGroups.length} orders</span>
                        </div>
                        {orderSeries.length > 0 ? (
                          <div className="adm-chart-body">
                            <ResponsiveContainer width="100%" height={240}>
                              <BarChart data={orderSeries} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} allowDecimals={false} width={30} />
                                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #eee", fontSize: 13 }} />
                                <Bar dataKey="orders" fill="#ffb300" radius={[6, 6, 0, 0]} maxBarSize={38} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <div className="adm-empty"><p>No order data yet</p></div>
                        )}
                      </div>

                      <div className="adm-chart-card adm-chart-wide">
                        <div className="adm-table-header">
                          <h3>Top Selling Products</h3>
                          <span className="count-badge">{topProducts.length}</span>
                        </div>
                        {topProducts.length > 0 ? (
                          <div className="adm-chart-body">
                            <ResponsiveContainer width="100%" height={240}>
                              <BarChart data={topProducts} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#eee" horizontal={false} />
                                <XAxis type="number" tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} allowDecimals={false} />
                                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#555" }} axisLine={false} tickLine={false} width={140} />
                                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #eee", fontSize: 13 }} />
                                <Bar dataKey="qty" name="Units Sold" fill="#0a7e3f" radius={[0, 6, 6, 0]} maxBarSize={22} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <div className="adm-empty"><p>No sales data yet</p></div>
                        )}
                      </div>
                    </div>

                    <div className="adm-stats" style={{ gridTemplateColumns: "1fr 1fr" }}>
                      <div className="adm-table-wrap">
                        <div className="adm-table-header">
                          <h3>Recent Orders</h3>
                          <span className="count-badge">{orderGroups.length}</span>
                        </div>
                        {orderGroups.length > 0 ? (
                          <table className="adm-data-table">
                            <thead>
                              <tr><th>Order</th><th>Name</th><th>Items</th><th>Total</th><th>Status</th></tr>
                            </thead>
                            <tbody>
                              {orderGroups.slice(0, 5).map((g: OrderGroup) => (
                                <tr key={g.key}>
                                  <td style={{ fontWeight: 600 }}>{g.key}</td>
                                  <td>{g.name}</td>
                                  <td>{g.items.length}</td>
                                  <td>{money(orderFinancials(g).total)}</td>
                                  <td><span className={`adm-tag ${statusClass(g.status)}`}>{g.status}</span></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <div className="adm-empty"><p>No orders yet</p></div>
                        )}
                      </div>

                      <div className="adm-table-wrap">
                        <div className="adm-table-header">
                          <h3>Recent Vacancy Applications</h3>
                          <span className="count-badge">{data.vacancyApplications?.length || 0}</span>
                        </div>
                        {data.vacancyApplications?.length ? data.vacancyApplications.length > 0 && (
                          <table className="adm-data-table">
                            <thead>
                              <tr><th>Name</th><th>Email</th><th>Date</th></tr>
                            </thead>
                            <tbody>
                              {data.vacancyApplications.slice(0, 5).map((app: VacancyApplication) => (
                                <tr key={app.id}>
                                  <td>{app.name}</td>
                                  <td>{app.email}</td>
                                  <td>{formatDateTime(app.createdAt)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <div className="adm-empty"><p>No applications yet</p></div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "vacancies" && (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                      <h2 className="adm-section-title" style={{ margin: 0 }}>All Vacancies</h2>
                      <button className="adm-btn-create" onClick={openCreateForm}>+ Add Vacancy</button>
                    </div>
                    <AdmFilterBar
                      search={vacancyFilters.search}
                      setSearch={(v: string) => setVacancyFilters({ ...vacancyFilters, search: v })}
                      searchPlaceholder="Search title, location, salary..."
                      selectValue={vacancyFilters.role}
                      setSelect={(v: string) => setVacancyFilters({ ...vacancyFilters, role: v })}
                      selectOptions={[...new Set((data.vacancies || []).map((v: Vacancy) => v.role))].sort()}
                      selectLabel="All Roles"
                      from={vacancyFilters.from}
                      setFrom={(v: string) => setVacancyFilters({ ...vacancyFilters, from: v })}
                      to={vacancyFilters.to}
                      setTo={(v: string) => setVacancyFilters({ ...vacancyFilters, to: v })}
                      withDates
                    />
                    <div className="adm-table-wrap">
                      <div className="adm-table-header">
                        <h3>Vacancies</h3>
                        <span className="count-badge">{filteredVacancies.length}</span>
                      </div>
                      {filteredVacancies.length > 0 ? (
                        <table className="adm-data-table">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Title</th>
                              <th>Role</th>
                              <th>Salary</th>
                              <th>Location</th>
                              <th>Deadline</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredVacancies.map((v: Vacancy) => (
                              <tr key={v.id}>
                                <td>{v.id}</td>
                                <td style={{ fontWeight: 600 }}>{v.title}</td>
                                <td><span className="adm-tag adm-tag-blue">{v.role}</span></td>
                                <td style={{ color: "#0a7e3f", fontWeight: 600 }}>{v.salary}</td>
                                <td>{v.location || "N/A"}</td>
                                <td>{v.deadline || "Open"}</td>
                                <td>
                                  <div className="adm-action-btns">
                                    <button className="adm-btn-sm adm-btn-edit" onClick={() => openEditForm(v)}>Edit</button>
                                    <button className="adm-btn-sm adm-btn-delete" onClick={() => handleDeleteVacancy(v.id)}>Delete</button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="adm-empty">
                          <span className="empty-icon">&#128203;</span>
                          <p>No vacancies found</p>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {activeTab === "vacancy-apps" && (
                  <>
                    <h2 className="adm-section-title">Vacancy Applications</h2>
                    <AdmFilterBar
                      search={vacancyAppFilters.search}
                      setSearch={(v: string) => setVacancyAppFilters({ ...vacancyAppFilters, search: v })}
                      searchPlaceholder="Search name, email, phone..."
                      from={vacancyAppFilters.from}
                      setFrom={(v: string) => setVacancyAppFilters({ ...vacancyAppFilters, from: v })}
                      to={vacancyAppFilters.to}
                      setTo={(v: string) => setVacancyAppFilters({ ...vacancyAppFilters, to: v })}
                      withDates
                    />
                    <div className="adm-table-wrap">
                      <div className="adm-table-header">
                        <h3>Applications</h3>
                        <span className="count-badge">{filteredVacancyApps.length}</span>
                      </div>
                      {filteredVacancyApps.length > 0 ? (
                        <table className="adm-data-table">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Phone</th>
                              <th>Cover Letter</th>
                              <th>CV</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredVacancyApps.map((app: VacancyApplication) => (
                              <tr key={app.id}>
                                <td>{app.id}</td>
                                <td style={{ fontWeight: 600 }}>{app.name}</td>
                                <td>{app.email}</td>
                                <td>{app.phone}</td>
                                <td className="adm-text-truncate">{app.coverLetter || "N/A"}</td>
                                <td>
                                  {app.resumeUrl ? (
                                    <a
                                      href={app.resumeUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      style={{ color: "#00509e", fontWeight: 600 }}
                                    >
                                      View CV
                                    </a>
                                  ) : (
                                    "N/A"
                                  )}
                                </td>
                                <td>{formatDateTime(app.createdAt)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="adm-empty">
                          <span className="empty-icon">&#128100;</span>
                          <p>No vacancy applications yet</p>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {activeTab === "interests" && (
                  <>
                    <h2 className="adm-section-title">Employee Interests</h2>
                    <AdmFilterBar
                      search={interestFilters.search}
                      setSearch={(v: string) => setInterestFilters({ ...interestFilters, search: v })}
                      searchPlaceholder="Search name, email, message..."
                      selectValue={interestFilters.role}
                      setSelect={(v: string) => setInterestFilters({ ...interestFilters, role: v })}
                      selectOptions={[...new Set((data.employeeInterests || []).map((i: EmployeeInterest) => i.role))].sort()}
                      selectLabel="All Roles"
                      from={interestFilters.from}
                      setFrom={(v: string) => setInterestFilters({ ...interestFilters, from: v })}
                      to={interestFilters.to}
                      setTo={(v: string) => setInterestFilters({ ...interestFilters, to: v })}
                      withDates
                    />
                    <div className="adm-table-wrap">
                      <div className="adm-table-header">
                        <h3>Interest Submissions</h3>
                        <span className="count-badge">{filteredInterests.length}</span>
                      </div>
                      {filteredInterests.length > 0 ? (
                        <table className="adm-data-table">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Phone</th>
                              <th>Preferred Role</th>
                              <th>Message</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredInterests.map((interest: EmployeeInterest) => (
                              <tr key={interest.id}>
                                <td>{interest.id}</td>
                                <td style={{ fontWeight: 600 }}>{interest.name}</td>
                                <td>{interest.email}</td>
                                <td>{interest.phone}</td>
                                <td><span className="adm-tag adm-tag-teal">{interest.role}</span></td>
                                <td className="adm-text-truncate">{interest.message || "N/A"}</td>
                                <td>{formatDateTime(interest.createdAt)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="adm-empty">
                          <span className="empty-icon">&#129309;</span>
                          <p>No employee interest submissions yet</p>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {activeTab === "job-apps" && (
                  <>
                    <h2 className="adm-section-title">Job Applications</h2>
                    <AdmFilterBar
                      search={jobAppFilters.search}
                      setSearch={(v: string) => setJobAppFilters({ ...jobAppFilters, search: v })}
                      searchPlaceholder="Search name, email, college..."
                      selectValue={jobAppFilters.program}
                      setSelect={(v: string) => setJobAppFilters({ ...jobAppFilters, program: v })}
                      selectOptions={[...new Set((data.jobApplications || []).map((a: JobApplication) => a.program))].sort()}
                      selectLabel="All Programs"
                      from={jobAppFilters.from}
                      setFrom={(v: string) => setJobAppFilters({ ...jobAppFilters, from: v })}
                      to={jobAppFilters.to}
                      setTo={(v: string) => setJobAppFilters({ ...jobAppFilters, to: v })}
                      withDates
                    />
                    <div className="adm-table-wrap">
                      <div className="adm-table-header">
                        <h3>Applications</h3>
                        <span className="count-badge">{filteredJobApps.length}</span>
                      </div>
                      {filteredJobApps.length > 0 ? (
                        <table className="adm-data-table">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Phone</th>
                              <th>Program</th>
                              <th>College</th>
                              <th>Message</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredJobApps.map((app: JobApplication) => (
                              <tr key={app.id}>
                                <td>{app.id}</td>
                                <td style={{ fontWeight: 600 }}>{app.name}</td>
                                <td>{app.email}</td>
                                <td>{app.phone}</td>
                                <td><span className="adm-tag adm-tag-purple">{app.program}</span></td>
                                <td>{app.college}</td>
                                <td className="adm-text-truncate">{app.message || "N/A"}</td>
                                <td>{formatDateTime(app.createdAt)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="adm-empty">
                          <span className="empty-icon">&#128196;</span>
                          <p>No job applications yet</p>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {activeTab === "orders" && (
                  <>
                    <h2 className="adm-section-title">Orders</h2>
                    <AdmFilterBar
                      search={orderFilters.search}
                      setSearch={(v: string) => setOrderFilters({ ...orderFilters, search: v })}
                      searchPlaceholder="Search order, name, email..."
                      selectValue={orderFilters.status}
                      setSelect={(v: string) => setOrderFilters({ ...orderFilters, status: v })}
                      selectOptions={orderStatuses}
                      selectLabel="All Statuses"
                      from={orderFilters.from}
                      setFrom={(v: string) => setOrderFilters({ ...orderFilters, from: v })}
                      to={orderFilters.to}
                      setTo={(v: string) => setOrderFilters({ ...orderFilters, to: v })}
                      withDates
                    />
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((group: OrderGroup) => {
                        const fin = orderFinancials(group);
                        return (
                          <div className="adm-order-card" key={group.key}>
                            <div className="adm-order-head">
                              <div>
                                <strong>Order {group.key}</strong>
                                <div className="adm-order-date">Placed {formatDateTime(group.orderDate)}</div>
                              </div>
                              <div className="adm-order-actions">
                                <select
                                  value={group.status}
                                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateOrderStatus(group.key, e.target.value)}
                                >
                                  {orderStatuses.map((s: string) => (
                                    <option key={s} value={s}>{s}</option>
                                  ))}
                                </select>
                                <button className="adm-btn-sm adm-btn-delete" onClick={() => deleteOrder(group.key)}>Delete</button>
                              </div>
                            </div>
                            <div className="adm-order-meta">
                              <strong>{group.name}</strong> · {group.email} · {group.phone || "No phone"}
                              <span className={`adm-tag ${statusClass(group.status)}`} style={{ marginLeft: "10px" }}>{group.status}</span>
                            </div>
                            <div className="adm-order-address">
                              Ship to: {group.address || "N/A"}, {group.city || ""} {group.postalcode || ""}
                            </div>
                            <table className="adm-data-table">
                              <thead>
                                <tr>
                                  <th>Product</th>
                                  <th>Size</th>
                                  <th>Qty</th>
                                  <th>Unit Price</th>
                                  <th>Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                {group.items.map((it: OrderItem) => (
                                  <tr key={it.id}>
                                    <td style={{ fontWeight: 600 }}>{it.productName || "N/A"}</td>
                                    <td>{it.size || "One Size"}</td>
                                    <td>{it.quantity}</td>
                                    <td>{money(it.price)}</td>
                                    <td>{money((Number(it.price) || 0) * (Number(it.quantity) || 1))}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            <div className="adm-order-totals">
                              <span>
                                Subtotal {money(fin.subtotal)} · Shipping {fin.shipping === 0 ? "Free" : money(fin.shipping)} · Tax {money(fin.tax)}
                              </span>
                              <strong>Total {money(fin.total)}</strong>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="adm-empty">
                        <span className="empty-icon">&#128722;</span>
                        <p>No orders yet</p>
                      </div>
                    )}
                  </>
                )}

                {activeTab === "products" && (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                      <h2 className="adm-section-title" style={{ margin: 0 }}>Store Products</h2>
                      <button className="adm-btn-create" onClick={openCreateProduct}>+ Add Product</button>
                    </div>
                    <AdmFilterBar
                      search={productFilters.search}
                      setSearch={(v: string) => setProductFilters({ ...productFilters, search: v })}
                      searchPlaceholder="Search product name..."
                      selectValue={productFilters.category}
                      setSelect={(v: string) => setProductFilters({ ...productFilters, category: v })}
                      selectOptions={productCategories}
                      selectLabel="All Categories"
                    />
                    <div className="adm-table-wrap">
                      <div className="adm-table-header">
                        <h3>Catalog</h3>
                        <span className="count-badge">{filteredProducts.length}</span>
                      </div>
                      {filteredProducts.length > 0 ? (
                        <table className="adm-data-table">
                          <thead>
                            <tr>
                              <th>Image</th>
                              <th>Name</th>
                              <th>Category</th>
                              <th>Price</th>
                              <th>Stock</th>
                              <th>Rating</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredProducts.map((p: Product) => (
                              <tr key={p.id} style={p.active === false ? { opacity: 0.55 } : {}}>
                                <td><img className="adm-prod-img" src={p.image} alt={p.name} /></td>
                                <td style={{ fontWeight: 600 }}>{p.name}</td>
                                <td><span className="adm-tag adm-tag-blue">{p.category}</span></td>
                                <td style={{ color: "#0a7e3f", fontWeight: 600 }}>{money(p.price)}</td>
                                <td>{p.stock}</td>
                                <td>{"★".repeat(Math.floor(Number(p.rating) || 0))} {Number(p.rating) || 0}</td>
                                <td>
                                  <button
                                    className={`adm-btn-sm ${p.active === false ? "adm-btn-delete" : "adm-btn-edit"}`}
                                    onClick={() => handleToggleProductActive(p)}
                                  >
                                    {p.active === false ? "Hidden" : "Active"}
                                  </button>
                                </td>
                                <td>
                                  <div className="adm-action-btns">
                                    <button className="adm-btn-sm adm-btn-edit" onClick={() => openEditProduct(p)}>Edit</button>
                                    <button className="adm-btn-sm adm-btn-delete" onClick={() => handleDeleteProduct(p.id)}>Delete</button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="adm-empty">
                          <span className="empty-icon">&#128230;</span>
                          <p>No products yet. Add your first product.</p>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {activeTab === "users" && (
                  <>
                    <h2 className="adm-section-title">Registered Users</h2>
                    <AdmFilterBar
                      search={userFilters.search}
                      setSearch={(v: string) => setUserFilters({ ...userFilters, search: v })}
                      searchPlaceholder="Search email..."
                      selectValue={userFilters.verified}
                      setSelect={(v: string) => setUserFilters({ ...userFilters, verified: v })}
                      selectOptions={["Verified", "Unverified"]}
                      selectLabel="All Users"
                    />
                    <div className="adm-table-wrap">
                      <div className="adm-table-header">
                        <h3>Users</h3>
                        <span className="count-badge">{filteredUsers.length}</span>
                      </div>
                      {filteredUsers.length > 0 ? (
                        <table className="adm-data-table">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Email</th>
                              <th>Verified</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredUsers.map((u: User) => (
                              <tr key={u.id}>
                                <td>{u.id}</td>
                                <td style={{ fontWeight: 600 }}>{u.email}</td>
                                <td>
                                  <span className={`adm-tag ${u.verified ? "adm-tag-green" : "adm-tag-gray"}`}>
                                    {u.verified ? "Yes" : "No"}
                                  </span>
                                </td>
                                <td>
                                  {!u.verified && (
                                    <button
                                      className="adm-btn-sm adm-btn-edit"
                                      onClick={() => handleResendVerification(u.id)}
                                    >
                                      Resend Verification
                                    </button>
                                  )}
                                  <button
                                    className="adm-btn-sm adm-btn-delete"
                                    style={{ marginLeft: !u.verified ? 6 : 0 }}
                                    onClick={() => handleDeleteUser(u.id)}
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="adm-empty">
                          <span className="empty-icon">&#128101;</span>
                          <p>No registered users yet</p>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {activeTab === "subscribers" && (
                  <>
                    <h2 className="adm-section-title">Notify Me Subscribers</h2>
                    <AdmFilterBar
                      search={subscriberFilters.search}
                      setSearch={(v: string) => setSubscriberFilters({ ...subscriberFilters, search: v })}
                      searchPlaceholder="Search email..."
                    />
                    <div className="adm-table-wrap">
                      <div className="adm-table-header">
                        <h3>Subscribers</h3>
                        <span className="count-badge">{filteredSubscribers.length}</span>
                      </div>
                      {filteredSubscribers.length > 0 ? (
                        <table className="adm-data-table">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Email</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredSubscribers.map((s: Subscriber) => (
                              <tr key={s.id}>
                                <td>{s.id}</td>
                                <td style={{ fontWeight: 600 }}>{s.email}</td>
                                <td>
                                  <div className="adm-action-btns">
                                    <button
                                      className="adm-btn-sm adm-btn-delete"
                                      onClick={() => handleDeleteSubscriber(s.id)}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="adm-empty">
                          <span className="empty-icon">&#9993;</span>
                          <p>No subscribers yet</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {showVacancyForm && (
          <div className="adm-modal-overlay" onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            if (e.target === e.currentTarget) closeVacancyForm();
          }}>
            <div className="adm-modal">
              <div className="adm-modal-header">
                <h2>{editingVacancy ? "Edit Vacancy" : "Create New Vacancy"}</h2>
                <button className="adm-modal-close" onClick={closeVacancyForm}>&times;</button>
              </div>
              <div className="adm-modal-body">
                <form onSubmit={handleSaveVacancy}>
                  <div className="adm-form-group">
                    <label>Job Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={vacancyForm.title}
                      onChange={handleVacancyFormChange}
                      placeholder="e.g. Cabin Crew - Qatar Airways"
                      required
                    />
                  </div>
                  <div className="adm-form-group">
                    <label>Role Category *</label>
                    <select name="role" value={vacancyForm.role} onChange={handleVacancyFormChange} required>
                      {vacancyRoles.map((r: string) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <div className="adm-form-group">
                    <label>Salary *</label>
                    <input
                      type="text"
                      name="salary"
                      value={vacancyForm.salary}
                      onChange={handleVacancyFormChange}
                      placeholder="e.g. $2,500 - $4,000/mo"
                      required
                    />
                  </div>
                  <div className="adm-form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      name="location"
                      value={vacancyForm.location}
                      onChange={handleVacancyFormChange}
                      placeholder="e.g. Doha, Qatar"
                    />
                  </div>
                  <div className="adm-form-group">
                    <label>Deadline</label>
                    <input
                      type="text"
                      name="deadline"
                      value={vacancyForm.deadline}
                      onChange={handleVacancyFormChange}
                      placeholder="e.g. Mar 30, 2026"
                    />
                  </div>
                  <div className="adm-form-group">
                    <label>Skills (comma-separated)</label>
                    <textarea
                      name="skills"
                      value={vacancyForm.skills}
                      onChange={handleVacancyFormChange}
                      placeholder="e.g. Communication,Teamwork,Leadership"
                      rows={3}
                    ></textarea>
                  </div>
                  <div className="adm-form-group">
                    <label>Responsibilities (comma-separated)</label>
                    <textarea
                      name="responsibilities"
                      value={vacancyForm.responsibilities}
                      onChange={handleVacancyFormChange}
                      placeholder="e.g. Ensure safety,Assist passengers,Handle emergencies"
                      rows={3}
                    ></textarea>
                  </div>
                  <div className="adm-form-actions">
                    <button type="button" className="adm-form-cancel" onClick={closeVacancyForm}>Cancel</button>
                    <button type="submit" className="adm-form-save" disabled={savingVacancy}>
                      {savingVacancy ? "Saving..." : editingVacancy ? "Update Vacancy" : "Create Vacancy"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {showProductForm && (
          <div className="adm-modal-overlay" onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            if (e.target === e.currentTarget) closeProductForm();
          }}>
            <div className="adm-modal">
              <div className="adm-modal-header">
                <h2>{editingProduct ? "Edit Product" : "Create New Product"}</h2>
                <button className="adm-modal-close" onClick={closeProductForm}>&times;</button>
              </div>
              <div className="adm-modal-body">
                <form onSubmit={handleSaveProduct}>
                  <div className="adm-form-group">
                    <label>Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={productForm.name}
                      onChange={handleProductFormChange}
                      placeholder="e.g. Pilot Uniform Set"
                      required
                    />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                    <div className="adm-form-group">
                      <label>Category *</label>
                      <select name="category" value={productForm.category} onChange={handleProductFormChange} required>
                        {productCategories.map((c: string) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="adm-form-group">
                      <label>Price ($) *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        name="price"
                        value={productForm.price}
                        onChange={handleProductFormChange}
                        placeholder="99.99"
                        required
                      />
                    </div>
                  </div>
                  <div className="adm-form-group">
                    <label>Image Path *</label>
                    <input
                      type="text"
                      name="image"
                      value={productForm.image}
                      onChange={handleProductFormChange}
                      placeholder="e.g. /r.png or https://..."
                      required
                    />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
                    <div className="adm-form-group">
                      <label>Rating</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        name="rating"
                        value={productForm.rating}
                        onChange={handleProductFormChange}
                      />
                    </div>
                    <div className="adm-form-group">
                      <label>Reviews</label>
                      <input
                        type="number"
                        min="0"
                        name="reviews"
                        value={productForm.reviews}
                        onChange={handleProductFormChange}
                      />
                    </div>
                    <div className="adm-form-group">
                      <label>Stock</label>
                      <input
                        type="number"
                        min="0"
                        name="stock"
                        value={productForm.stock}
                        onChange={handleProductFormChange}
                      />
                    </div>
                  </div>
                  <div className="adm-form-group">
                    <label>Badge</label>
                    <input
                      type="text"
                      name="badge"
                      value={productForm.badge}
                      onChange={handleProductFormChange}
                      placeholder="e.g. Best Seller, Popular, New"
                    />
                  </div>
                  <div className="adm-form-group">
                    <label>Sizes (comma-separated)</label>
                    <input
                      type="text"
                      name="sizes"
                      value={productForm.sizes}
                      onChange={handleProductFormChange}
                      placeholder="e.g. S, M, L, XL or One Size"
                    />
                  </div>
                  <div className="adm-form-group">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={productForm.description}
                      onChange={handleProductFormChange}
                      placeholder="Short product description for the store"
                      rows={3}
                    ></textarea>
                  </div>
                  <div className="adm-form-group">
                    <label style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 600 }}>
                      <input
                        type="checkbox"
                        name="active"
                        checked={productForm.active}
                        onChange={handleProductFormChange}
                      />
                      Active (visible in store)
                    </label>
                  </div>
                  <div className="adm-form-actions">
                    <button type="button" className="adm-form-cancel" onClick={closeProductForm}>Cancel</button>
                    <button type="submit" className="adm-form-save" disabled={savingProduct}>
                      {savingProduct ? "Saving..." : editingProduct ? "Update Product" : "Create Product"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
