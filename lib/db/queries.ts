"server-only";
import { db } from "@/lib/db";
import { user, subscription, transaction } from "@/lib/db/schema";
import { eq, gte, lt, sum, InferSelectModel, and } from "drizzle-orm";
import type { User } from "@/lib/auth/auth";

type Subscription = InferSelectModel<typeof subscription>;

export const updateUser = async (userId: string, data: Partial<User>) => {
  await db.update(user).set(data).where(eq(user.id, userId));
};

export const getUserSubscription = async (userId: string) => {
  const data = await db
    .select()
    .from(subscription)
    .where(eq(subscription.userId, userId))
    .limit(1);

  if (data.length === 0) return null;

  return data[0];
};

export async function createUserSubscription(data: Partial<Subscription>) {
  await db.insert(subscription).values(data as Subscription);
}

export async function updateSubscription(
  stripeSubscriptionId: string,
  data: Partial<Subscription>
) {
  await db
    .update(subscription)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(subscription.stripeSubscriptionId, stripeSubscriptionId));
}

export async function deleteSubscription(stripeSubscriptionId: string) {
  await db
    .delete(subscription)
    .where(eq(subscription.stripeSubscriptionId, stripeSubscriptionId));
}

export async function getCurrentUsage(userId: string) {
  const data = await db
    .select({
      userId: subscription.userId,
      totalUsage: sum(transaction.amount).mapWith(Number),
      periodStart: subscription.billingPeriodStart,
      periodEnd: subscription.billingPeriodEnd,
    })
    .from(transaction)
    .innerJoin(subscription, eq(transaction.userId, subscription.userId))
    .where(
      and(
        eq(transaction.userId, userId),
        gte(transaction.timestamp, subscription.billingPeriodStart),
        lt(transaction.timestamp, subscription.billingPeriodEnd)
      )
    )
    .groupBy(
      subscription.userId,
      subscription.billingPeriodStart,
      subscription.billingPeriodEnd
    );

  console.log("usage_data:", data);
  return data[0];
}
