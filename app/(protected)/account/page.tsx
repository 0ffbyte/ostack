import { H1, P } from "@/components/ui/typography";
import { auth } from "@/core/auth/auth";
import { headers } from "next/headers";
import { Suspense } from "react";

export default function Account() {
  return (
    <div className="w-full min-h-screen flex items-start justify-center">
      <main className="max-w-[1024px] w-full flex flex-col justify-start space-y-[48px] pt-[80px] p-2">
        <H1>Account</H1>

        <Suspense fallback={<div>Loading...</div>}>
          <UserInfo />
        </Suspense>
      </main>
    </div>
  );
}

const UserInfo = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  console.log(session);

  if (!session || !session.user || !session.user.id) {
    return (
      <div className="flex flex-col items-start justify-start">
        <P>Session data not available</P>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start justify-start">
      <P>name: {session.user.name}</P>
      <P>email: {session.user.email}</P>
      <P>customer_id: {session.user.stripeCustomerId}</P>
      <P>plan_id: {session.user.planId}</P>
    </div>
  );
};
