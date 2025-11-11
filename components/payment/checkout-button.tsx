"use client";
import { checkoutAction } from "@/core/payment/actions";
import { Button } from "@/components/ui/button";
import useAppStore from "@/lib/store";

export default function CheckoutButton({ planName }: { planName: string }) {
  const setAlert = useAppStore((state) => state.setAlert);
  const handleClick = () => {
    checkoutAction(planName).catch((err) => {
      setAlert({
        title: "Error",
        message: err.message,
      });
    });
  };
  return <Button onClick={handleClick}>Subscribe</Button>;
  1;
}
