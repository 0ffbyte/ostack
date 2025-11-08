"server-only";
import { db } from "@/lib/data/db";
import { subscription, transaction } from "@/lib/data/db/schema";
import { eq, gte, lt, sum, and } from "drizzle-orm";
import { verifySession } from "@/lib/auth/session";

export const getUserSubscription = async () => {
  const { user } = await verifySession();
  const data = await db
    .select()
    .from(subscription)
    .where(eq(subscription.userId, user.id))
    .limit(1);
  if (data.length === 0) return null;
  return data[0];
};

export async function getCurrentUsage(userId: string) {
  const data = await db
    .select({
      userId: subscription.userId,
      totalUsage: sum(transaction.amount).mapWith(Number),
      periodStart: subscription.billingPeriodStart,
      periodEnd: subscription.billingPeriodEnd,
      overageLimit: subscription.overageLimit,
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
      subscription.billingPeriodEnd,
      subscription.overageLimit
    );

  console.log("usage_data:", data);
  return data[0];
}
