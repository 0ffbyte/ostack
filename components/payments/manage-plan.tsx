"use client";
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
  restoreSubscription,
} from "@/lib/payments/actions";

export default function ManagePlan() {
  return (
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
        <DropdownMenuItem onClick={() => updateSubscription("plus")}>
          Update Plan
        </DropdownMenuItem>
        <DropdownMenuItem onClick={cancelSubscription}>
          Cancel Plan
        </DropdownMenuItem>
        <DropdownMenuItem onClick={restoreSubscription}>
          Restore Plan
        </DropdownMenuItem>
        <DropdownMenuItem onClick={customerPortalAction}>
          Billing Portal
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive">Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
