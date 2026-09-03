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