"server-only";
import { headers } from "next/headers";
import { auth } from "./auth";

export const verifySession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session || !session.user || !session.user.id)
    throw new Error("Unauthorized");
  return session;
};
