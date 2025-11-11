import { H2, H1, P } from "@/components/ui/typography";
import LoginButton from "@/components/auth/sign-in";

export default async function Home() {
  return (
    <div className="w-full min-h-screen flex items-start justify-center">
      <main className="max-w-[1024px] w-full flex flex-col justify-start space-y-[48px] pt-[128px]">
        <header className="">
          <H1>
            OStack, <span className="text-zinc-400">Built to Last.</span>
          </H1>
          <H2>Welcome to ostack, a fully featured SaaS template.</H2>
        </header>

        <div className="space-y-[16px] max-w-[420px] w-full">
          <P>Sign in to get started.</P>
          <LoginButton />
        </div>
      </main>
    </div>
  );
}
