import { verifySignature } from "@/lib/integrations/upstash";
import { NextResponse } from "next/server";
import { eq, inArray, and, sum } from "drizzle-orm";
import { db } from "@/lib/db";
import { transaction, user } from "@/lib/db/schema";
import { stripe } from "@/lib/payments/stripe";
import config from "@/ostack.config";

export async function POST(request: Request) {
  const body = await verifySignature(request);
  const { batch } = body as { batch: string[] };
  if (batch.length === 0)
    return NextResponse.json(
      { message: "No user ids found in batch" },
      { status: 400 }
    );

  // 1. Queries and aggregate all unreported transactions for the user ids in the batch
  const usageTotals = await db
    .select({
      userId: transaction.userId,
      stripeCustomerId: user.stripeCustomerId,
      totalAmount: sum(transaction.amount).mapWith(Number),
    })
    .from(transaction)
    .innerJoin(user, eq(transaction.userId, user.id))
    .where(
      and(inArray(transaction.userId, batch), eq(transaction.reported, false))
    )
    .groupBy(transaction.userId, user.stripeCustomerId);
  console.log("Usage totals", usageTotals);

  // 2. Report usage to Stripe for each user & mark transactions as reported
  for (const usage of usageTotals) {
    try {
      await stripe.billing.meterEvents.create({
        event_name: config.meterEventName,
        payload: {
          value: usage.totalAmount.toString(),
          stripe_customer_id: usage.stripeCustomerId!,
        },
        identifier: `usage_${usage.stripeCustomerId}_${Date.now()}`,
      });

      await db
        .update(transaction)
        .set({ reported: true })
        .where(
          and(
            eq(transaction.userId, usage.userId),
            eq(transaction.reported, false)
          )
        );
    } catch (err) {
      console.error(`Failed to report for user ${usage.userId}`, err);
    }
  }

  return NextResponse.json({ message: "Batch usage events" }, { status: 200 });
}

/**
 * What this route handler does:
 * 1. Queries and aggregates all unreported transactions for the user ids in the batch
 * 2. Report usage to Stripe for each user & mark transactions as reported
 */
