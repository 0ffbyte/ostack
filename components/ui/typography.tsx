import { cn } from "@/lib/utils";

export function Heading({
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

export function Paragraph({
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
