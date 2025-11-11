import { Suspense } from "react";
import { H1, H2, P } from "@/components/ui/typography";
import Link from "next/link";
import CheckoutButton from "@/components/payment/checkout-button";
import SignOutButton from "@/components/auth/sign-out";
import ManagePlan from "@/components/payment/manage-plan";
import TriggerAlert from "@/components/trigger-alert";
import { getUserSubscription } from "@/lib/data/user";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <div className="w-full min-h-screen flex items-start justify-center">
      <main className="max-w-[1024px] w-full flex flex-col justify-start space-y-[48px] pt-[80px] p-2">
        <header>
          <H1>Library</H1>
          <H2>Welcome to OStack dashboard.</H2>
          <br />

          <div className="flex gap-1">
            <SignOutButton />
            <Button>
              <Link href="/account">Account</Link>
            </Button>
            <TriggerAlert />
          </div>
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
      <P>Plan: {subscription?.planId}</P>
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
