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
  restoreSubscription,
} from "@/core/payment/actions";

export default function ManagePlan() {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-fit">
          Manage Subsciption
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="bottom"
        sideOffset={8}
        style={GlassMaterial}
      >
        <DropdownMenuLabel>Options</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => updateSubscription("plus")}>
          Update
        </DropdownMenuItem>
        <DropdownMenuItem onClick={cancelSubscription}>Cancel</DropdownMenuItem>
        <DropdownMenuItem onClick={restoreSubscription}>
          Restore
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
