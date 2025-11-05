"use client";

import { H1 } from "@/components/ui/typography";
import SignOutButton from "@/components/auth/sign-out";
import CheckoutButton from "@/components/payments/checkout-button";
import IncrementUsageButton from "@/components/payments/increment-usage-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { GlassMaterial } from "@/lib/constants";
import {
  cancelSubscription,
  updateSubscription,
  customerPortalAction,
} from "@/lib/payments/actions";
import { authClient } from "@/lib/auth/auth-client";

export default function Dashboard() {
  const { data: session } = authClient.useSession();
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-y-4">
      <H1>Dashboard</H1>
      <p>{session && session.user?.name}</p>
      <p>{session && session.user?.stripeCustomerId}</p>
      <SignOutButton />

      <CheckoutButton planName="plus" />
      <IncrementUsageButton />

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Manage Account</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          side="bottom"
          sideOffset={8}
          className="bg-[#f2f2f2]/80"
          style={GlassMaterial}
        >
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <DropdownMenuItem>Profile Settings</DropdownMenuItem>
          <DropdownMenuItem onClick={() => updateSubscription("mini")}>
            Downgrade Plan
          </DropdownMenuItem>
          <DropdownMenuItem onClick={cancelSubscription}>
            Cancel Plan
          </DropdownMenuItem>
          <DropdownMenuItem onClick={customerPortalAction}>
            Billing Portal
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive">Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
