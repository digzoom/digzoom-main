import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  int,
  decimal,
  json,
  boolean,
  bigint,
} from "drizzle-orm/mysql-core";

// Users table (from auth)
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Categories
export const categories = mysqlTable("categories", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  nameAr: varchar("name_ar", { length: 255 }).notNull(),
  nameEn: varchar("name_en", { length: 255 }).notNull(),
  icon: varchar("icon", { length: 100 }),
  color: varchar("color", { length: 50 }),
  productCount: int("product_count").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Category = typeof categories.$inferSelect;

// Products
export const products = mysqlTable("products", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  titleAr: varchar("title_ar", { length: 255 }).notNull(),
  titleEn: varchar("title_en", { length: 255 }).notNull(),
  descriptionAr: text("description_ar"),
  descriptionEn: text("description_en"),
  longDescriptionAr: text("long_description_ar"),
  longDescriptionEn: text("long_description_en"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  discount: int("discount").default(0),
  image: varchar("image", { length: 500 }),
  categoryId: bigint("category_id", { mode: "number", unsigned: true }).references(() => categories.id),
  fileType: varchar("file_type", { length: 50 }),
  fileSize: varchar("file_size", { length: 50 }),
  features: json("features"),
  rating: decimal("rating", { precision: 3, scale: 1 }).default("4.5"),
  reviewCount: int("review_count").default(0),
  salesCount: int("sales_count").default(0),
  isFeatured: boolean("is_featured").default(false),
  isNew: boolean("is_new").default(false),
  inStock: boolean("in_stock").default(true),
  downloadUrl: varchar("download_url", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Product = typeof products.$inferSelect;

// Orders
export const orders = mysqlTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).references(() => users.id),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerEmail: varchar("customer_email", { length: 320 }),
  customerPhone: varchar("customer_phone", { length: 50 }),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["pending", "processing", "completed", "cancelled", "refunded"]).default("pending").notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }),
  paymentStatus: mysqlEnum("payment_status", ["pending", "paid", "failed", "refunded"]).default("pending").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Order = typeof orders.$inferSelect;

// Order Items
export const orderItems = mysqlTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: bigint("order_id", { mode: "number", unsigned: true }).references(() => orders.id),
  productId: bigint("product_id", { mode: "number", unsigned: true }).references(() => products.id),
  productName: varchar("product_name", { length: 255 }).notNull(),
  quantity: int("quantity").default(1).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;

// Analytics - Page Views
export const pageViews = mysqlTable("page_views", {
  id: serial("id").primaryKey(),
  page: varchar("page", { length: 255 }).notNull(),
  sessionId: varchar("session_id", { length: 255 }),
  userId: bigint("user_id", { mode: "number", unsigned: true }).references(() => users.id),
  ip: varchar("ip", { length: 100 }),
  country: varchar("country", { length: 100 }),
  city: varchar("city", { length: 100 }),
  device: varchar("device", { length: 50 }),
  browser: varchar("browser", { length: 100 }),
  referer: varchar("referer", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Analytics - Events
export const events = mysqlTable("events", {
  id: serial("id").primaryKey(),
  eventName: varchar("event_name", { length: 100 }).notNull(),
  eventData: json("event_data"),
  sessionId: varchar("session_id", { length: 255 }),
  userId: bigint("user_id", { mode: "number", unsigned: true }).references(() => users.id),
  page: varchar("page", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Social Media Services
export const socialServices = mysqlTable("social_services", {
  id: serial("id").primaryKey(),
  platform: varchar("platform", { length: 100 }).notNull(),
  serviceType: varchar("service_type", { length: 100 }).notNull(),
  nameAr: varchar("name_ar", { length: 255 }).notNull(),
  nameEn: varchar("name_en", { length: 255 }).notNull(),
  descriptionAr: text("description_ar"),
  descriptionEn: text("description_en"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  quantity: int("quantity").notNull(),
  unit: varchar("unit", { length: 50 }),
  minQuantity: int("min_quantity").default(1),
  maxQuantity: int("max_quantity").default(100000),
  deliveryTime: varchar("delivery_time", { length: 100 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SocialService = typeof socialServices.$inferSelect;

// Coupons
export const coupons = mysqlTable("coupons", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  discountType: mysqlEnum("discount_type", ["percentage", "fixed"]).default("percentage").notNull(),
  discountValue: decimal("discount_value", { precision: 10, scale: 2 }).notNull(),
  minOrderAmount: decimal("min_order_amount", { precision: 10, scale: 2 }).default("0"),
  maxUses: int("max_uses"),
  usedCount: int("used_count").default(0),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
