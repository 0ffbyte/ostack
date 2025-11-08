"use server";
import {
  createCheckoutSession,
  createCustomerPortalSession,
  stripe,
} from "./stripe";
import { getSubscription } from "@/lib/payments/queries";
import config from "@/ostack.config";
import { verifySession } from "../auth/session";

export const checkoutAction = async (planId: string) => {
  await createCheckoutSession({ planId });
};

export const customerPortalAction = async () => {
  await createCustomerPortalSession();
};

export const updateSubscription = async (planId: string) => {
  // 1: retreive user subscription from stripe (more robust)
  const { user } = await verifySession();
  if (!user.stripeCustomerId)
    throw new Error("No Stripe customer found for user.");

  const subscription = await getSubscription(user.id);
  if (subscription?.status !== "active")
    throw new Error("No active subscription found.");

  const stripeSubscription = await stripe.subscriptions.retrieve(
    subscription.stripeSubscriptionId
  );

  if (!stripeSubscription) throw new Error("No subscription found.");

  // 2: retrieve current plan information and prices
  const currentPlan = config.plans.find(
    (plan) => plan.id === subscription.currentPlanId
  );
  const newPlan = config.plans.find((plan) => plan.id === planId);
  if (!newPlan || !currentPlan) throw new Error("No plan found.");

  const baseItem = stripeSubscription.items.data.find(
    (item) => item.price.id === currentPlan.priceId
  );
  const overageItem = stripeSubscription.items.data.find(
    (item) => item.price.id === currentPlan.overagePriceId
  );

  // 3: schdule a downgrade when conditions apply else upgrade immediately
  if (currentPlan?.monthlyCost > newPlan.monthlyCost) {
    let subscriptionScheduleId: string;
    if (!subscription.stripeSubscriptionScheduleId) {
      const newSchudule = await stripe.subscriptionSchedules.create({
        from_subscription: subscription.stripeSubscriptionId,
      });
      subscriptionScheduleId = newSchudule.id;
    } else {
      subscriptionScheduleId = subscription.stripeSubscriptionScheduleId;
    }

    await stripe.subscriptionSchedules.update(subscriptionScheduleId, {
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
          metadata: {
            scheduledDowngrade: "true",
          },
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
            scheduledDowngrade: "",
          },
        },
      ],
    });

    console.log("downgrade scheduled at the end of the current billing period");
  } else {
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
        scheduledDowngrade: "",
        scheduledCancel: "",
      },
    });

    console.log("upgraded subscription to new plan");
  }
};

export const cancelSubscription = async () => {
  const { user } = await verifySession();
  if (!user.stripeCustomerId)
    throw new Error("No Stripe customer found for user.");

  const subscription = await getSubscription(user.id);
  if (subscription?.status !== "active")
    throw new Error("No active subscription found.");

  if (subscription.stripeSubscriptionScheduleId) {
    // release from schedule
    await stripe.subscriptionSchedules.release(
      subscription.stripeSubscriptionScheduleId
    );
  }
  // cancel subscription at period end
  await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
    cancel_at_period_end: true,
  });
};

export const restoreSubscription = async () => {
  const { user } = await verifySession();
  if (!user.stripeCustomerId)
    throw new Error("No Stripe customer found for user.");

  const subscription = await getSubscription(user.id);
  if (subscription?.status !== "active")
    throw new Error("No active subscription found.");

  if (subscription.stripeSubscriptionScheduleId) {
    console.log("resuming current subscription");
    await stripe.subscriptionSchedules.release(
      subscription.stripeSubscriptionScheduleId
    );
  } else {
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: false,
    });
  }
};
