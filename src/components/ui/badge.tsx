import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 whitespace-nowrap rounded-md px-1.5 py-[3px] text-[11.5px] font-medium leading-none",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground",
        outline: "border text-muted-foreground",
        accent: "bg-accent-soft text-accent",
        solid: "bg-primary text-primary-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
