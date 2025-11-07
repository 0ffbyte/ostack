import { db } from "@/lib/db";
import { transaction, user } from "@/lib/db/schema";
import { verifySignature } from "@/lib/integrations/upstash";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { client } from "@/lib/integrations/upstash";

export async function POST(request: Request) {
  await verifySignature(request);

  // Step 1:Query distinct user IDs who have at least one unreported usage event
  const users = await db
    .selectDistinct({ id: transaction.userId })
    .from(transaction)
    .where(eq(transaction.reported, false));
  const userIds = users.map((user) => user.id);

  if (users.length === 0) return NextResponse.json({ message: "No batches" });

  // Step 2: Split into batches of 128
  const batchSize = 128;
  const userIdBatches: string[][] = [];
  for (let i = 0; i < userIds.length; i += batchSize) {
    userIdBatches.push(userIds.slice(i, i + batchSize));
  }
  console.log("User ID batches", userIdBatches);

  // Step 3: Iterate over each batch and queue them to qstash
  for (const [idx, batch] of userIdBatches.entries()) {
    await client.publishJSON({
      url: `${process.env.BETTER_AUTH_URL}/api/stripe/report-usage`,
      body: { batch },
      method: "POST",
      delay: idx * 30, // 30s between batches
    });
    console.log(`Queued batch ${idx + 1}/${userIdBatches.length}`);
  }

  return NextResponse.json({ message: "Batch usage events" }, { status: 200 });
}

/**
 * What this route handler does:
 * 1. Verifies the signature of the request
 * 2. Queries all user ids with unreported usage events
 * 3. Prepares user id batches of 128s
 * 4. Iterates over each batch and queue them to qstash
 */
