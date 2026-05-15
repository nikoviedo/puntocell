import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-primary/15 text-primary ring-1 ring-primary/30",
        secondary:
          "bg-white/[0.06] text-foreground ring-1 ring-white/10",
        destructive:
          "bg-destructive/15 text-destructive ring-1 ring-destructive/30",
        outline:
          "text-foreground ring-1 ring-white/15",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
