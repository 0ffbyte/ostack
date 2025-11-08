"server-only";
import { Client, Receiver } from "@upstash/qstash";

export const client = new Client({
  token: process.env.QSTASH_TOKEN,
});

export const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
});

export const verifySignature = async (request: Request) => {
  const signature = request.headers.get("Upstash-Signature")!;
  const body = await request.json();
  const isValid = await receiver.verify({
    body: JSON.stringify(body),
    signature,
    url: request.url,
  });

  if (!isValid) throw new Error("Invalid signature");
  return body;
};

/** Cron Jobs */
// Report usage events to Stripe every 6 hours
await client.schedules.create({
  destination: `${process.env.BETTER_AUTH_URL}/api/stripe/batch-usage-events`,
  scheduleId: "my-test-schedule",
  cron: "0 */6 * * *",
  body: JSON.stringify({
    message: "Hello cron job!",
  }),
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
});
