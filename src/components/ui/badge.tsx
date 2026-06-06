import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 [a]:hover:bg-blue-200 dark:[a]:hover:bg-blue-900",
        secondary:
          "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 [a]:hover:bg-slate-200",
        destructive:
          "bg-red-500/10 text-red-500 focus-visible:ring-red-500/20 dark:bg-red-900/20 dark:focus-visible:ring-red-900/40 [a]:hover:bg-red-500/20",
        outline:
          "border-border text-foreground [a]:hover:bg-slate-100 [a]:hover:text-slate-900 dark:[a]:hover:bg-slate-800",
        ghost:
          "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800",
        link: "text-blue-600 underline-offset-4 hover:underline dark:text-blue-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
