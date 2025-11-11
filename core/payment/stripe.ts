"server-only";
import Stripe from "stripe";
import { redirect } from "next/navigation";
import {
  updateUser,
  updateSubscription,
  createSubscription,
  deleteSubscription,
  getSubscription,
} from "@/core/payment/queries";
import config from "@/ostack.config";
import { verifySession } from "../auth/session";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

/** Session creation */
export async function createCheckoutSession({ planId }: { planId: string }) {
  const { user } = await verifySession();
  if (!user.stripeCustomerId)
    throw new Error("No Stripe customer found for user.");

  // redirect to billing portal if user is already subscribed
  const subscription = await getSubscription(user.id);
  if (subscription?.status === "active")
    redirect(`${process.env.BETTER_AUTH_URL}/dashboard`); // dashboard for now

  // retrieve plan information
  const plan = config.stripe.plans.find((plan) => plan.id === planId);
  if (!plan?.priceId) throw new Error("No price found for this plan.");

  // create checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [{ price: plan.priceId, quantity: 1 }],
    ui_mode: "hosted", // change to embedded to enable modal checkout
    mode: "subscription",
    success_url: config.stripe.checkoutSuccessUrl,
    cancel_url: config.stripe.checkoutCancelUrl,
    customer: user.stripeCustomerId,
    client_reference_id: user.id.toString(),
    allow_promotion_codes: false,
    metadata: {
      userId: user.id,
      planId: plan.id,
      includedQuota: plan.includedQuota,
      overagePriceId: plan.overagePriceId,
    },
  });
  redirect(session.url!);
}

export async function createCustomerPortalSession() {
  const { user } = await verifySession();
  if (!user.stripeCustomerId)
    throw new Error("No Stripe customer found for user.");

  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.BETTER_AUTH_URL}/dashboard`,
    configuration: "bpc_1SPkkt5nzQqSqsEE20YdxU7D",
  });

  redirect(session.url!);
}

/** Webhook handlers */

export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  // metadata
  const userId = session.metadata?.userId as string;
  const planId = session.metadata?.planId as string;
  const includedQuota = session.metadata?.includedQuota as string;
  const overagePriceId = session.metadata?.overagePriceId;

  if (!userId) throw new Error("No user id found in session metadata");

  // expire all open user checkout sessions
  await stripe.checkout.sessions
    .list({
      customer: customerId,
      status: "open",
      limit: 100,
    })
    .then((sessions) => {
      sessions.data.forEach((session) =>
        stripe.checkout.sessions.expire(session.id)
      );
    });

  // attach overage price to subscription
  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["items.data.price.product"],
  });

  await stripe.subscriptions.update(subscriptionId, {
    items: [{ price: overagePriceId }],
    metadata: {
      userId,
      planId,
      includedQuota,
    },
  });

  // create subscription record in db
  const billingPeriodStart = subscription.items.data[0]?.current_period_start;
  const billingPeriodEnd = subscription.items.data[0]?.current_period_end;
  const status = subscription.status;

  await createSubscription({
    userId: userId,
    stripeSubscriptionId: subscriptionId,
    planId: planId,
    billingPeriodStart: new Date(billingPeriodStart * 1000),
    billingPeriodEnd: new Date(billingPeriodEnd * 1000),
    status,
  });
}

export async function handleSubscriptionChange(
  subscription: Stripe.Subscription
) {
  // extract data from subscription
  const subscriptionId = subscription.id as string;
  const status = subscription.status;
  const cancelAtPeriodEnd = subscription.cancel_at_period_end;
  const schedule = subscription.schedule as string;

  const billingPeriodStart = subscription.items.data[0]?.current_period_start;
  const billingPeriodEnd = subscription.items.data[0]?.current_period_end;

  // metadata
  const planId = subscription.metadata?.planId;
  const scheduledDowngrade = subscription.metadata?.scheduledDowngrade;

  // update relevant fields
  if (status === "active" || status === "trialing") {
    await updateSubscription(subscriptionId, {
      planId: planId,
      billingPeriodStart: new Date(billingPeriodStart * 1000),
      billingPeriodEnd: new Date(billingPeriodEnd * 1000),
      cancelAtPeriodEnd: cancelAtPeriodEnd,
      downgradeAtPeriodEnd: !!schedule ? !!scheduledDowngrade : false, // if it has a schedule, it's scheduled to downgrade
      stripeSubscriptionScheduleId: schedule,
      status,
    });
  }
  // handle deletes on subscription status changes
  else if (status === "canceled" || status === "unpaid") {
    console.log("Deleting subscription:", subscriptionId);
    await deleteSubscription(subscriptionId);
  }
}

/** Customer  */
export async function createStripeCustomer({
  id,
  email,
  name,
}: {
  id: string;
  email: string;
  name: string;
}) {
  const stripeCustomer = await stripe.customers.create({
    email,
    name,
  });

  await updateUser(id, { stripeCustomerId: stripeCustomer.id });
  console.log("Created Stripe customer:", stripeCustomer.id);
}
