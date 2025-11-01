"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";

export default function LoginButton() {
  const [isPending, setIsPending] = React.useState(false);
  const handleSignOut = async () => {
    setIsPending(true);
    await authClient.signOut().then(() => {
      window.location.reload();
    });
  };

  return (
    <Button onClick={handleSignOut} className="w-[84px]">
      {isPending ? "Signing Out..." : "Sign Out"}
    </Button>
  );
}
