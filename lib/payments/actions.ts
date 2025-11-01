"use server";
import { sql } from "drizzle-orm";
import { db } from "../db";
import { balance, transaction } from "../db/schema";
import { createCheckoutSession } from "./stripe";
import { getUser, getUserSubscription } from "../db/queries";
import { verifySession } from "../auth/session";

export const checkoutAction = async (planName: string) => {
  await createCheckoutSession({ planName });
};

export const incrementUsage = async (amount: number) => {
  const subscription = await getUserSubscription();
  if (subscription?.status !== "active")
    throw new Error("No active subscription found.");

  if (amount < 0) throw new Error("Amount must be greater than 0.");

  await db.insert(transaction).values({
    userId: subscription.userId,
    eventName: "sonna-energy",
    amount,
  });
  await db.update(balance).set({
    currentPeriodAmount: sql`${balance.currentPeriodAmount} + ${amount}`,
  });
};
