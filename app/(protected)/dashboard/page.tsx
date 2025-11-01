import { Heading } from "@/components/ui/typography";
import SignOutButton from "@/components/auth/sign-out";
import CheckoutButton from "@/components/payments/checkout-button";
import IncrementUsageButton from "@/components/payments/increment-usage-button";

export default function Dashboard() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-y-4">
      <Heading>Dashboard</Heading>
      <SignOutButton />

      <CheckoutButton planName="mini" />
      <IncrementUsageButton />
    </div>
  );
}
