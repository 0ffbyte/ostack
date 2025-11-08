"use client";
import { checkoutAction } from "@/lib/payments/actions";
import { Button } from "@/components/ui/button";

export default function CheckoutButton({ planName }: { planName: string }) {
  return <Button onClick={() => checkoutAction(planName)}>Subscribe</Button>;
  1;
}
