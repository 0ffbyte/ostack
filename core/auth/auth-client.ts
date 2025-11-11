"use client";
import { createAuthClient } from "better-auth/react";
import {
  inferAdditionalFields,
  magicLinkClient,
  customSessionClient,
} from "better-auth/client/plugins";
import { anonymousClient } from "better-auth/client/plugins";
import type { auth } from "@/core/auth/auth";

export const authClient = createAuthClient({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.BETTER_AUTH_URL,
  plugins: [
    magicLinkClient(),
    anonymousClient(),
    customSessionClient<typeof auth>(),
    inferAdditionalFields<typeof auth>({
      user: {
        stripeCustomerId: {
          type: "string",
          required: false,
        },
      },
    }),
  ],
});
