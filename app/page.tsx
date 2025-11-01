"use client";
import { Paragraph, Heading } from "@/components/ui/typography";
import LoginButton from "@/components/auth/login";

export default function Home() {
  return (
    <main className="font-sans flex flex-col items-center justify-center min-h-screen space-y-4">
      <Heading>Ostack SaaS</Heading>
      <Paragraph>
        Welcome to ostack-saas, a fully featured SaaS template.
      </Paragraph>

      <LoginButton />
    </main>
  );
}
