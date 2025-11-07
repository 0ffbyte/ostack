import { H1 } from "@/components/ui/typography";
import SignOutButton from "@/components/auth/sign-out";
import CheckoutButton from "@/components/payments/checkout-button";
import IncrementUsageButton from "@/components/payments/increment-usage-button";
import SubscriptionInfo from "@/components/subscription-info";
import ManagePlan from "@/components/payments/manage-plan";
import { Suspense } from "react";

export default function Dashboard() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-y-4">
      <H1>Dashboard</H1>

      <Suspense fallback={<div>Loading subscription info...</div>}>
        <SubscriptionInfo />
      </Suspense>

      <SignOutButton />

      <CheckoutButton planName="mini" />
      <IncrementUsageButton />

      <ManagePlan />
    </div>
  );
}
