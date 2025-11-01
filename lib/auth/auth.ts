"server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db"; // your drizzle instance
import * as schema from "@/lib/db/schema";
import { createStripeCustomer } from "@/lib/payments/stripe";

export type Session = typeof auth.$Infer.Session;
export type User = Session["user"];

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema,
  }),
  emailAndPassword: {
    enabled: process.env.NODE_ENV === "development", // only enable in development for testing
  },
  trustedOrigins: ["http://localhost:3000"],
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  databaseHooks: {
    user: {
      create: {
        async after(user, context) {
          console.log("User created:", user);
          await createStripeCustomer(user);
        },
      },
    },
  },
});
