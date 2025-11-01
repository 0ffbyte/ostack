"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";

export default function LoginButton() {
  const [isPending, setIsPending] = React.useState(false);
  const handleGithubSignIn = async () => {
    setIsPending(true);
    await authClient.signIn.social({
      provider: "github",
      //callbackURL: "/dashboard",
    });
  };

  return (
    <Button onClick={handleGithubSignIn} className="w-[84px]">
      {isPending ? "Signing in..." : "Sign In"}
    </Button>
  );
}
