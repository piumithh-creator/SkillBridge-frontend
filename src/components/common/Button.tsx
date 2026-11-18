import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../utils/format";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const variants = {
  primary: "bg-primary text-white hover:bg-primary-600 shadow-sm shadow-primary/25",
  secondary: "bg-secondary text-white hover:bg-slate-800",
  outline: "border border-slate-300 bg-surface text-secondary hover:border-primary hover:text-primary",
  danger: "bg-rose-600 text-white hover:bg-rose-700",
  ghost: "text-slate-600 hover:bg-slate-100"
};
const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2.5 text-sm", lg: "px-6 py-3 text-base" };

export const Button = ({ variant = "primary", size = "md", isLoading, className, disabled, children, type = "button", ...rest }: ButtonProps) => (
  <button
    type={type}
    disabled={disabled || isLoading}
    className={cn(
      "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
      variants[variant], sizes[size], className
    )}
    {...rest}
  >
    {isLoading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
    {children}
  </button>
);
