import { cn } from "@/lib/utils";

export function H1({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-[32px] leading-[40px] font-bold font-sans",
        className
      )}
    >
      {children}
    </p>
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
    <p
      className={cn(
        "text-[20px] leading-[32px] font-semibold font-sans",
        className
      )}
    >
      {children}
    </p>
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
        "text-[16px] leading-[24px] font-medium font-sans",
        className
      )}
    >
      {children}
    </p>
  );
}
