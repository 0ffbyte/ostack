import { H1, H2, P } from "@/components/ui/typography";
import CheckoutButton from "@/components/payments/checkout-button";
import { Suspense } from "react";
import { getUserSubscription } from "@/lib/data/user";
import SignOutButton from "@/components/auth/sign-out";
import ManagePlan from "@/components/payments/manage-plan";

export default function Dashboard() {
  return (
    <div className="w-full min-h-screen flex items-start justify-center">
      <main className="max-w-[1024px] w-full flex flex-col justify-start space-y-[48px] pt-[128px]">
        <header>
          <H1>Dashboard</H1>
          <H2>Welcome to OStack dashboard.</H2>
          <br />
          <SignOutButton />
        </header>

        <div className="space-y-[16px] max-w-[420px] w-full">
          <Suspense fallback={<div>Loading subscription info...</div>}>
            <SubscriptionInfo />
          </Suspense>
        </div>
      </main>
    </div>
  );
}

async function SubscriptionInfo() {
  const subscription = await getUserSubscription();
  return (
    <div className="flex flex-col">
      <H2>Subscription Info</H2>
      <P>Plan: {subscription?.currentPlanId}</P>
      <P>Included Quota: {subscription?.includedQuota}</P>
      <P>Cancel at Period End: {subscription?.cancelAtPeriodEnd?.toString()}</P>
      <P>
        Downgrade at Period End:{" "}
        {subscription?.downgradeAtPeriodEnd?.toString()}
      </P>
      <br />
      {!subscription ? <CheckoutButton planName="mini" /> : <ManagePlan />}
    </div>
  );
}
