"server-only";
import Stripe from "stripe";
import { redirect } from "next/navigation";
import {
  getUser,
  updateUser,
  updateSubscription,
  createUserSubscription,
  deleteSubscription,
  getUserSubscription,
  createBalance,
} from "@/lib/db/queries";
import { Plans } from "../constants";
import type { User } from "../auth/auth";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

export async function createCheckoutSession({
  planName,
}: {
  planName: string;
}) {
  const user = await getUser();
  if (!user || !user.stripeCustomerId)
    throw new Error("No Stripe customer found for user.");

  // redirect to billing portal if user is already subscribed
  const subscription = await getUserSubscription();
  if (subscription?.status === "active")
    redirect(`${process.env.BETTER_AUTH_URL}/dashboard`); // dashboard for now

  // retrieve plan information
  const priceId = Plans.find((plan) => plan.name === planName)?.priceId;
  if (!priceId) throw new Error("No price found for this plan.");

  // create checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [{ price: priceId, quantity: 1 }],
    ui_mode: "hosted", // change to embedded to enable modal checkout
    mode: "subscription",
    success_url: `${process.env.BETTER_AUTH_URL}/dashboard`,
    cancel_url: `${process.env.BETTER_AUTH_URL}/`,
    customer: user.stripeCustomerId,
    client_reference_id: user.id.toString(),
    allow_promotion_codes: false,
    metadata: {
      userId: user.id,
      email: user.email,
      planName,
    },
  });
  redirect(session.url!);
}

export async function createStripeCustomer(user: User) {
  const stripeCustomer = await stripe.customers.create({
    email: user.email,
    name: user.name,
  });

  await updateUser(user.id, { stripeCustomerId: stripeCustomer.id });
  console.log("Created Stripe customer:", stripeCustomer.id);
}

/*
export async function createCustomerPortalSession(team: Team) {
  if (!team.stripeCustomerId || !team.stripeProductId) {
    redirect("/pricing");
  }

  let configuration: Stripe.BillingPortal.Configuration;
  const configurations = await stripe.billingPortal.configurations.list();

  if (configurations.data.length > 0) {
    configuration = configurations.data[0];
  } else {
    const product = await stripe.products.retrieve(team.stripeProductId);
    if (!product.active) {
      throw new Error("Team's product is not active in Stripe");
    }

    const prices = await stripe.prices.list({
      product: product.id,
      active: true,
    });
    if (prices.data.length === 0) {
      throw new Error("No active prices found for the team's product");
    }

    configuration = await stripe.billingPortal.configurations.create({
      business_profile: {
        headline: "Manage your subscription",
      },
      features: {
        subscription_update: {
          enabled: true,
          default_allowed_updates: ["price", "quantity", "promotion_code"],
          proration_behavior: "create_prorations",
          products: [
            {
              product: product.id,
              prices: prices.data.map((price) => price.id),
            },
          ],
        },
        subscription_cancel: {
          enabled: true,
          mode: "at_period_end",
          cancellation_reason: {
            enabled: true,
            options: [
              "too_expensive",
              "missing_features",
              "switched_service",
              "unused",
              "other",
            ],
          },
        },
        payment_method_update: {
          enabled: true,
        },
      },
    });
  }

  return stripe.billingPortal.sessions.create({
    customer: team.stripeCustomerId,
    return_url: `${process.env.BASE_URL}/dashboard`,
    configuration: configuration.id,
  });
}
*/

export async function handleSubscriptionChange(
  subscription: Stripe.Subscription
) {
  // extract data from subscription
  const subscriptionId = subscription.id as string;
  const status = subscription.status;
  const cancelAtPeriodEnd = subscription.cancel_at_period_end;

  // update relevant fields
  if (status === "active" || status === "trialing") {
    const plan = subscription.items.data[0]?.plan;
    await updateSubscription(subscriptionId, {
      planName: (plan?.product as Stripe.Product).name,
      status,
      cancelAtPeriodEnd,
    });
  }
  // handle deletes on subscription status changes
  else if (status === "canceled" || status === "unpaid") {
    console.log("Deleting subscription:", subscriptionId);
    await deleteSubscription(subscriptionId);
  }
}

export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  const userId = session.metadata?.userId as string;
  const planName = session.metadata?.planName as string;
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;
  console.log("session metadata", session.metadata);

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

  // create subscription record in db
  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["items.data.price.product"],
  });

  const plan = subscription.items.data[0]?.price;
  const status = subscription.status;
  if (!plan) throw new Error("No plan found for this subscription.");

  await createUserSubscription({
    stripeSubscriptionId: subscriptionId,
    userId: userId,
    planName: planName,
    status,
  });

  // create a balance record for the user
  await createBalance(userId);
  console.log("Created balance record for user:", userId);

  // add overage price to subscription
  const overagePriceId = Plans.find(
    (plan) => plan.name === planName
  )?.overagePriceId;
  if (!overagePriceId) throw new Error("No overage price found for this plan.");

  await stripe.subscriptions.update(subscriptionId, {
    items: [{ price: overagePriceId }],
  });
  console.log("Added overage price to subscription:", subscriptionId);
}
