import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  integer,
  numeric,
} from "drizzle-orm/pg-core";

export const login = pgTable("login", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  verified: boolean("verified").default(false),
  verificationlink: text("verificationlink"),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  provider: varchar("provider", { length: 50 }),
  completed: boolean("completed").default(false),
  googleRefreshToken: text("google_refresh_token"),
});

export const apply = pgTable("apply", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  phoneNum: varchar("phone_num", { length: 50 }),
  program: varchar("program", { length: 255 }),
  college: varchar("college", { length: 255 }),
  message: text("message"),
  createdAt: varchar("created_at", { length: 50 }),
});

export const product = pgTable("product", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  postalcode: varchar("postalcode", { length: 20 }),
  phone: varchar("phone", { length: 50 }),
  quantity: varchar("quantity", { length: 20 }),
  productName: varchar("productname", { length: 255 }),
  price: numeric("price", { precision: 10, scale: 2 }).default("0"),
  size: varchar("size", { length: 50 }),
  orderId: varchar("order_id", { length: 100 }),
  orderDate: varchar("order_date", { length: 50 }),
  status: varchar("status", { length: 50 }).default("Pending"),
  paymentMethod: varchar("payment_method", { length: 50 }).default("Cash on Delivery"),
  isPaid: boolean("is_paid").default(false),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  image: varchar("image", { length: 500 }).notNull(),
  rating: numeric("rating", { precision: 3, scale: 1 }).default("4.5"),
  reviews: integer("reviews").default(0),
  badge: varchar("badge", { length: 100 }),
  description: text("description"),
  sizes: text("sizes"),
  stock: integer("stock").default(0),
  active: boolean("active").default(true),
});

export const notify = pgTable("notify", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }),
});

export const vacancy = pgTable("vacancy", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  salary: varchar("salary", { length: 100 }).notNull(),
  role: varchar("role", { length: 100 }).notNull(),
  skills: text("skills"),
  responsibilities: text("responsibilities"),
  location: varchar("location", { length: 255 }),
  deadline: varchar("deadline", { length: 100 }),
});

export const vacancyApplication = pgTable("vacancy_application", {
  id: serial("id").primaryKey(),
  vacancyId: integer("vacancy_id").references(() => vacancy.id),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  resumeUrl: text("resume_url"),
  coverLetter: text("cover_letter"),
  createdAt: varchar("created_at", { length: 50 }),
});

export const college = pgTable("college", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }),
  image: varchar("image", { length: 500 }),
  description: text("description"),
  features: text("features"),
  active: boolean("active").default(true),
});

export const employeeInterest = pgTable("employee_interest", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  role: varchar("role", { length: 100 }),
  message: text("message"),
  createdAt: varchar("created_at", { length: 50 }),
});

export const paymentSessions = pgTable("payment_sessions", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 100 }).notNull().unique(),
  paymentMethod: varchar("payment_method", { length: 50 }).notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  customerEmail: varchar("customer_email", { length: 255 }),
  customerName: varchar("customer_name", { length: 255 }),
  gatewayRef: varchar("gateway_ref", { length: 255 }),
  gatewayTxnId: varchar("gateway_txn_id", { length: 255 }),
  used: boolean("used").default(false),
  createdAt: varchar("created_at", { length: 50 }).notNull(),
  completedAt: varchar("completed_at", { length: 50 }),
});

export const paymentSettings = pgTable("payment_settings", {
  id: serial("id").primaryKey(),
  mode: varchar("mode", { length: 20 }).notNull().default("demo"),
  enabledMethods: text("enabled_methods").notNull().default("Cash on Delivery,Khalti,eSewa,FonePay,Card"),
  khaltiPublicKey: text("khalti_public_key"),
  khaltiSecretKey: text("khalti_secret_key"),
  esewaMerchantId: text("esewa_merchant_id"),
  esewaSecretKey: text("esewa_secret_key"),
  fonepayMerchantId: text("fonepay_merchant_id"),
  fonepaySecretKey: text("fonepay_secret_key"),
  updatedAt: varchar("updated_at", { length: 50 }),
});

export const faq = pgTable("faq", {
  id: serial("id").primaryKey(),
  question: varchar("question", { length: 500 }).notNull(),
  answer: text("answer").notNull(),
  active: boolean("active").default(true),
  sortOrder: integer("sort_order").default(0),
});

export const guide = pgTable("guide", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: text("subtitle"),
  // Chapters stored as JSON string: [{ heading, body, items: string[] }]
  chapters: text("chapters"),
  // Which section this guide belongs to: tips | questions | course | guide
  category: varchar("category", { length: 50 }).notNull().default("guide"),
  // Filename of the uploaded PDF guide (stored on disk under uploads/guides)
  pdfUrl: varchar("pdf_url", { length: 500 }),
  active: boolean("active").default(true),
  updatedAt: varchar("updated_at", { length: 50 }),
});