import { cn } from "@/lib/utils";

export function H1({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h1
      className={cn(
        "text-[36px] leading-[40px] font-sans-semibold text-pretty antialiased md:subpixel-antialiased",
        className
      )}
    >
      {children}
    </h1>
  );
}

export function H2({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "text-[20px] leading-[32px] font-semibold font-sans",
        className
      )}
    >
      {children}
    </h2>
  );
}

export function P({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-[16px] leading-[22px] font-sans font-medium text-ellipsis",
        className
      )}
    >
      {children}
    </p>
  );
}
