import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-ui font-medium ring-offset-background transition-medical focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-dark shadow-button rounded-medical",
        medical: "bg-gradient-primary text-primary-foreground hover:shadow-lg shadow-button rounded-medical border border-primary-light/20",
        healing: "bg-gradient-healing text-secondary-foreground hover:shadow-lg shadow-button rounded-medical",
        destructive: "bg-warning text-warning-foreground hover:bg-warning/90 shadow-button rounded-medical",
        outline: "border border-border bg-background hover:bg-accent hover:text-accent-foreground rounded-medical",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-dark shadow-button rounded-medical",
        ghost: "hover:bg-accent hover:text-accent-foreground rounded-medical",
        link: "text-primary underline-offset-4 hover:underline font-body",
        soft: "bg-background-soft text-foreground hover:bg-accent border border-border rounded-medical",
      },
      size: {
        default: "h-12 px-6 py-3 text-base",  // 48px height for accessibility
        sm: "h-10 px-4 py-2 text-sm rounded-lg",  // 40px height
        lg: "h-14 px-8 py-4 text-lg rounded-medical", // 56px height  
        icon: "h-12 w-12 rounded-medical",
        xs: "h-8 px-3 py-1 text-xs rounded-md",  // 32px for smaller actions
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
