"use server";
import { sql } from "drizzle-orm";
import { db } from "../db";
import { transaction } from "../db/schema";
import {
  createCheckoutSession,
  createCustomerPortalSession,
  stripe,
} from "./stripe";
import { getUserSubscription } from "../db/queries";
import { Plans } from "../constants";
import { verifySession } from "../auth/session";
import Stripe from "stripe";

export const checkoutAction = async (planId: string) => {
  await createCheckoutSession({ planId });
};

export const customerPortalAction = async () => {
  await createCustomerPortalSession();
};

export const updateSubscription = async (planId: string) => {
  const { user } = await verifySession();
  if (!user.stripeCustomerId)
    throw new Error("No Stripe customer found for user.");

  const subscription = await getUserSubscription(user.id);
  if (subscription?.status !== "active")
    throw new Error("No active subscription found.");

  // retreive subscription from stripe
  const stripeSubscription = await stripe.subscriptions.retrieve(
    subscription.stripeSubscriptionId
  );

  const currentPlan = Plans.find(
    (plan) => plan.id === subscription.currentPlanId
  );
  const newPlan = Plans.find((plan) => plan.id === planId);
  if (!newPlan || !currentPlan) throw new Error("No plan found.");

  const baseItem = stripeSubscription.items.data.find(
    (item) => item.price.id === currentPlan.priceId
  );
  const overageItem = stripeSubscription.items.data.find(
    (item) => item.price.id === currentPlan.overagePriceId
  );

  const isDowngrade = currentPlan?.monthlyCost > newPlan.monthlyCost;

  if (isDowngrade) {
    // retrieve subscription schedules from stripe
    const schedules = await stripe.subscriptionSchedules.list({
      customer: user.stripeCustomerId,
      limit: 1,
    });

    console.log("found", schedules.data.length, "schedules");

    // create new subscription schedule if none exists
    let subscriptionSchedule: Stripe.SubscriptionSchedule;
    if (schedules.data.length === 0) {
      subscriptionSchedule = await stripe.subscriptionSchedules.create({
        from_subscription: subscription.stripeSubscriptionId,
      });
    } else {
      subscriptionSchedule = schedules.data[0];
    }

    // schedule downgrade at the end of the current billing period
    await stripe.subscriptionSchedules.update(subscriptionSchedule.id, {
      end_behavior: "release",
      phases: [
        {
          items: [
            {
              price: currentPlan.priceId,
              quantity: 1,
            },
            {
              price: currentPlan.overagePriceId,
            },
          ],
          start_date: Math.floor(
            new Date(subscription.billingPeriodStart).getTime() / 1000
          ),
          end_date: Math.floor(
            new Date(subscription.billingPeriodEnd).getTime() / 1000
          ),
        },
        {
          items: [
            {
              price: newPlan.priceId,
              quantity: 1,
            },
            {
              price: newPlan.overagePriceId,
            },
          ],
          start_date: Math.floor(
            new Date(subscription.billingPeriodEnd).getTime() / 1000
          ),
          metadata: {
            userId: user.id,
            planId: newPlan.id,
            includedQuota: newPlan.limits.generations,
          },
        },
      ],
    });

    console.log("downgrade scheduled at the end of the current billing period");
  } else {
    // upgrade immediately
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      items: [
        {
          id: baseItem?.id,
          price: newPlan.priceId,
        },
        {
          id: overageItem?.id,
          price: newPlan.overagePriceId,
        },
      ],
      proration_behavior: "create_prorations",
      metadata: {
        userId: user.id,
        planId: newPlan.id,
        includedQuota: newPlan.limits.generations,
      },
    });

    console.log("upgraded subscription to new plan");
  }
};

export const cancelSubscription = async () => {
  const { user } = await verifySession();
  if (!user.stripeCustomerId)
    throw new Error("No Stripe customer found for user.");

  const subscription = await getUserSubscription(user.id);
  if (subscription?.status !== "active")
    throw new Error("No active subscription found.");

  // retrieve subscription schedules from stripe
  const schedules = await stripe.subscriptionSchedules.list({
    customer: user.stripeCustomerId,
    limit: 1,
  });

  const currentPlan = Plans.find(
    (plan) => plan.id === subscription.currentPlanId
  );

  console.log("found", schedules.data.length, "schedules");

  if (schedules.data.length > 0) {
    console.log("canceling subscription");
    await stripe.subscriptionSchedules.update(schedules.data[0].id, {
      end_behavior: "cancel",
      phases: [
        {
          items: [
            { price: currentPlan?.priceId, quantity: 1 },
            { price: currentPlan?.overagePriceId },
          ],
          start_date: Math.floor(
            new Date(subscription.billingPeriodStart).getTime() / 1000
          ),
          end_date: Math.floor(
            new Date(subscription.billingPeriodEnd).getTime() / 1000
          ),
        },
      ],
    });
  } else {
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });
  }
};

export const incrementUsage = async (amount: number) => {
  const { user } = await verifySession();

  const subscription = await getUserSubscription(user.id);
  if (subscription?.status !== "active")
    throw new Error("No active subscription found.");

  if (amount < 0) throw new Error("Amount must be greater than 0.");

  await db.insert(transaction).values({
    userId: subscription.userId,
    eventName: "energy",
    amount,
  });
};
