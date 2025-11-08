"server-only";
import { Session } from "./auth";
import { verifySession } from "./session";

export async function withAuth<T>(action: (ctx: Session) => T) {
  const session = await verifySession();
  return action(session);
}

const user = withAuth((ctx) => ctx.user);
