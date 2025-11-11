"server-only";
import { betterAuth, BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/core/db"; // your drizzle instance
import * as schema from "@/core/db/schema";
import { customSession } from "better-auth/plugins";
import { createStripeCustomer } from "@/core/payment/stripe";
import { getSubscription } from "../payment/queries";

export type Session = typeof auth.$Infer.Session;
export type User = Session["user"];

const authConfig = {
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema,
  }),
  trustedOrigins: [process.env.BETTER_AUTH_URL!],
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
          await createStripeCustomer({
            id: user.id,
            email: user.email,
            name: user.name,
          });
        },
      },
    },
  },
  user: {
    additionalFields: {
      stripeCustomerId: {
        type: "string",
        required: false,
      },
    },
  },
} satisfies BetterAuthOptions;

export const auth = betterAuth({
  ...authConfig,
  plugins: [
    customSession(async ({ user, session }) => {
      const subscription = await getSubscription(user.id);
      return {
        session,
        user: {
          ...user,
          planId: subscription?.planId ?? "",
        },
      };
    }, authConfig),
  ],
});
