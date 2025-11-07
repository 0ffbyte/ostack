import {
  integer,
  pgTable,
  text,
  timestamp,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

/** App Tables */

/** Auth Tables */
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  stripeCustomerId: text("stripe_customer_id").unique(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const subscription = pgTable("subscription", {
  id: text("id")
    .primaryKey()
    .$default(() => sql`gen_random_uuid()`),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  stripeSubscriptionId: text("stripe_subscription_id").unique().notNull(),
  stripeSubscriptionScheduleId: text(
    "stripe_subscription_schedule_id"
  ).unique(),

  currentPlanId: text("current_plan_id").notNull(),
  includedQuota: integer("included_quota").notNull(),

  billingPeriodStart: timestamp("billing_period_start").notNull(),
  billingPeriodEnd: timestamp("billing_period_end").notNull(),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
  downgradeAtPeriodEnd: boolean("downgrade_at_period_end")
    .notNull()
    .default(false),

  overageEnabled: boolean("overage_enabled").notNull().default(true),
  overageLimit: integer("overage_limit").notNull().default(300),

  status: text("subscription_status").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// usage transaction log used for billing and usage reporting
export const transaction = pgTable(
  "transaction",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    eventName: text("event_name").notNull(),
    amount: integer("amount").notNull(),
    reported: boolean("reported").default(false).notNull(),
    timestamp: timestamp("timestamp").notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index("idx_transaction_user_id").on(table.userId),
    timestampIdx: index("idx_transaction_timestamp").on(table.timestamp),
  })
);

export const uploads = pgTable("uploads", {
  id: text("id").primaryKey(),
  key: text("key").notNull(),
  type: text("type").notNull(),
  size: integer("size").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
