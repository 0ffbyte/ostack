"server-only";
import { db } from "@/lib/db";
import { user, subscription, balance } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { verifySession } from "@/lib/auth/session";

export const getUser = async () => {
  const session = await verifySession();
  const userId = session.user.id;

  const data = await db.select().from(user).where(eq(user.id, userId));
  if (data.length === 0) return null;
  return data[0];
};

export const getUserByCustomerId = async (customerId: string) => {
  const data = await db
    .select()
    .from(user)
    .where(eq(user.stripeCustomerId, customerId));
  if (data.length === 0) return null;
  return data[0];
};

export async function updateUser(
  userId: string,
  userData: { stripeCustomerId: string }
) {
  await db
    .update(user)
    .set({
      ...userData,
    })
    .where(eq(user.id, userId));
}

export const getUserSubscription = async () => {
  const session = await verifySession();
  const userId = session.user.id;

  const data = await db
    .select()
    .from(subscription)
    .where(eq(subscription.userId, userId))
    .limit(1);

  if (data.length === 0) return null;

  return data[0];
};

export async function createUserSubscription(subscriptionData: {
  userId: string;
  stripeSubscriptionId: string;
  planName: string;
  status: string;
}) {
  await db.insert(subscription).values({ ...subscriptionData });
}

export async function updateSubscription(
  stripeSubscriptionId: string,
  subscriptionData: {
    planName?: string;
    status: string;
    cancelAtPeriodEnd?: boolean;
  }
) {
  await db
    .update(subscription)
    .set({
      ...subscriptionData,
      updatedAt: new Date(),
    })
    .where(eq(subscription.stripeSubscriptionId, stripeSubscriptionId));
}

export async function deleteSubscription(stripeSubscriptionId: string) {
  await db
    .delete(subscription)
    .where(eq(subscription.stripeSubscriptionId, stripeSubscriptionId));
}

export async function createBalance(userId: string) {
  await db.insert(balance).values({ userId });
}
