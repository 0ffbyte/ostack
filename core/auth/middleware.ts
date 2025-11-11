"server-only";
import { Session } from "./auth";
import { verifySession } from "./session";

export async function withAuth<T>(action: (ctx: Session) => T) {
  const session = await verifySession();
  return action(session);
}

export async function withTransaction<T>(
  action: () => Promise<T>,
  amount: number
): Promise<void> {
  await verifySession();

  try {
    await action();
    console.log("transaction committed.", "cost:", amount);
  } catch {
    console.log("transaction rolled back.", "cost:", amount);
    throw new Error("Transaction rolled back");
  }
}
