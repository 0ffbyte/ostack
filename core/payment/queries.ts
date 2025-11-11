import { db } from "@/core/db";
import { user, subscription } from "@/core/db/schema";
import { eq, InferSelectModel } from "drizzle-orm";
import type { User } from "@/core/auth/auth";

type Subscription = InferSelectModel<typeof subscription>;

export const getSubscription = async (userId: string) => {
  const data = await db
    .select()
    .from(subscription)
    .where(eq(subscription.userId, userId))
    .limit(1);

  if (data.length === 0) return null;

  return data[0];
};

export async function createSubscription(data: Partial<Subscription>) {
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

export const updateUser = async (userId: string, data: Partial<User>) => {
  await db.update(user).set(data).where(eq(user.id, userId));
};
