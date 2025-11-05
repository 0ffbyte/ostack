"use client";
import { P, H1 } from "@/components/ui/typography";
import LoginButton from "@/components/auth/login";

export default function Home() {
  return (
    <main className="font-sans flex flex-col items-center justify-center min-h-screen space-y-4">
      <H1>Ostack SaaS</H1>
      <P>Welcome to ostack-saas, a fully featured SaaS template.</P>

      <LoginButton />
    </main>
  );
}
