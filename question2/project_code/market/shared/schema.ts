import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),

  
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,





});

export const stocks = pgTable("stocks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  symbol: text("symbol").notNull().unique(),
});

export const stockPrices = pgTable("stock_prices", {
  id: serial("id").primaryKey(),
  stockId: integer("stock_id").notNull().references(() => stocks.id),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});








export const insertStockSchema = createInsertSchema(stocks).pick({
  name: true,
  symbol: true,
});

export const insertStockPriceSchema = createInsertSchema(stockPrices).pick({
  stockId: true,
  price: true,
  timestamp: true,
});










export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertStock = z.infer<typeof insertStockSchema>;
export type Stock = typeof stocks.$inferSelect;

export type InsertStockPrice = z.infer<typeof insertStockPriceSchema>;
export type StockPrice = typeof stockPrices.$inferSelect;
