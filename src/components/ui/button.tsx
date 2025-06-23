import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-3xl text-sm font-black ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cartoon-button touch-target no-select tap-highlight transform-gpu",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white animate-glow",
        destructive: "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white animate-glow",
        outline: "border-4 border-purple-500 bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 text-purple-800 hover:text-purple-900 cartoon-shadow",
        secondary: "bg-gradient-to-r from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500 text-gray-800 cartoon-shadow",
        ghost: "hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 text-purple-700 hover:text-purple-800 rounded-2xl",
        link: "text-primary underline-offset-4 hover:underline",
        rainbow: "animate-rainbow text-white cartoon-shadow animate-float",
        success: "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white animate-glow",
        warning: "bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white animate-glow",
      },
      size: {
        default: "h-12 px-6 py-3 text-base rounded-3xl",
        sm: "h-10 rounded-2xl px-4 text-sm",
        lg: "h-16 rounded-3xl px-8 text-xl",
        xl: "h-20 rounded-3xl px-12 text-2xl",
        icon: "h-12 w-12 rounded-3xl",
        mobile: "h-14 px-6 text-lg rounded-3xl", // Mobile-optimized size
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
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }