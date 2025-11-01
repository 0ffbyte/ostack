"use client";
import { incrementUsage } from "@/lib/payments/actions";
import { Button } from "@/components/ui/button";

export default function IncrementUsageButton() {
  return (
    <Button className="bg-blue-500" onClick={() => incrementUsage(1)}>
      Increment Usage
    </Button>
  );
  1;
}
