//import { user } from "@/core/db/schema";
//import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

/**
 * Define your database schema here.
 * Example article table:
 */

/*
export const article = pgTable("article", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  slug: varchar("slug", { length: 125 }).notNull(),
  title: varchar("title", { length: 125 }).notNull(),
  content: text("content").notNull(),
  image: text("image").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
*/
