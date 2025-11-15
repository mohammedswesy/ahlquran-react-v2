import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/cn"

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed",
    {
        variants: {
            variant: {
                primary: "bg-[var(--primary)] text-white hover:opacity-90 shadow",
                outline: "border border-gray-300 bg-white hover:bg-gray-50",
                ghost: "bg-transparent hover:bg-gray-100",
                destructive: "bg-red-600 text-white hover:bg-red-700",
            },
            size: {
                sm: "text-xs px-3 py-1.5",
                md: "text-sm px-4 py-2",
                lg: "text-base px-5 py-2.5",
            },
        },
        defaultVariants: { variant: "primary", size: "md" },
    }
)

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
    VariantProps<typeof buttonVariants>

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(buttonVariants({ variant, size }), className)}
                {...props}
            />
        )
    }
)

Button.displayName = "Button"
