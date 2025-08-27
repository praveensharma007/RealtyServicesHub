import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: ["user", "owner", "provider"] }).notNull(),
  name: text("name").notNull(),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const properties = pgTable("properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ownerId: varchar("owner_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  propertyType: text("property_type").notNull(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  squareFeet: integer("square_feet").notNull(),
  address: text("address").notNull(),
  monthlyRent: decimal("monthly_rent", { precision: 10, scale: 2 }).notNull(),
  contactNumber: text("contact_number").notNull(),
  images: text("images").array().default([]),
  status: text("status", { enum: ["available", "pending", "rented"] }).default("available"),
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  providerId: varchar("provider_id").references(() => users.id).notNull(),
  category: text("category", { 
    enum: ["plumbing", "electrical", "hospital", "doctor", "grocery", "cab"] 
  }).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  priceRange: text("price_range").notNull(),
  availability: boolean("availability").default(true),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("0.0"),
  totalBookings: integer("total_bookings").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  serviceId: varchar("service_id").references(() => services.id),
  providerId: varchar("provider_id").references(() => users.id).notNull(),
  serviceTitle: text("service_title").notNull(),
  serviceCategory: text("service_category").notNull(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerAddress: text("customer_address").notNull(),
  scheduledDate: timestamp("scheduled_date").notNull(),
  scheduledTime: text("scheduled_time").notNull(),
  cost: decimal("cost", { precision: 10, scale: 2 }).notNull(),
  status: text("status", { 
    enum: ["pending", "confirmed", "completed", "cancelled"] 
  }).default("pending"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const propertyLikes = pgTable("property_likes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  propertyId: varchar("property_id").references(() => properties.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const propertyViews = pgTable("property_views", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  propertyId: varchar("property_id").references(() => properties.id).notNull(),
  viewedAt: timestamp("viewed_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertPropertySchema = createInsertSchema(properties).omit({ id: true, ownerId: true, views: true, likes: true, createdAt: true });
export const insertServiceSchema = createInsertSchema(services).omit({ id: true, providerId: true, rating: true, totalBookings: true, createdAt: true });
export const insertBookingSchema = createInsertSchema(bookings).omit({ id: true, createdAt: true });
export const insertPropertyLikeSchema = createInsertSchema(propertyLikes).omit({ id: true, createdAt: true });
export const insertPropertyViewSchema = createInsertSchema(propertyViews).omit({ id: true, viewedAt: true });

// Login schema
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["user", "owner", "provider"]),
});

// Types
export type User = typeof users.$inferSelect;
export type Property = typeof properties.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type PropertyLike = typeof propertyLikes.$inferSelect;
export type PropertyView = typeof propertyViews.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type InsertPropertyLike = z.infer<typeof insertPropertyLikeSchema>;
export type InsertPropertyView = z.infer<typeof insertPropertyViewSchema>;
export type LoginData = z.infer<typeof loginSchema>;
