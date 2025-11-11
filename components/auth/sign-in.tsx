"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/core/auth/auth-client";
import config from "@/ostack.config";

export default function SignInButton() {
  const [isPending, setIsPending] = React.useState(false);
  const handleGithubSignIn = async () => {
    setIsPending(true);
    await authClient.signIn.social({
      provider: "github",
      callbackURL: config.proxy.protectedRoutes[0],
    });
  };

  return (
    <Button onClick={handleGithubSignIn} className="w-[84px]">
      {isPending ? "..." : "Sign In"}
    </Button>
  );
}
