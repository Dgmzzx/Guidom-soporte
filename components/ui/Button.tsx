import { forwardRef, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "amber" | "ghost" | "danger";
type Size = "sm" | "md";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-safety text-graphite font-semibold shadow-sm hover:bg-safety-hover active:scale-[0.98]",
  amber: "bg-amber text-graphite font-semibold shadow-sm hover:bg-amber/90 active:scale-[0.98]",
  ghost:
    "border border-line bg-transparent text-paper-dim hover:border-steelblue/50 hover:text-paper",
  danger:
    "border border-alert/30 bg-alert/10 text-alert hover:bg-alert hover:text-graphite",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-[12px]",
  md: "px-4 py-2 text-[13px]",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = "primary", size = "md", className = "", type = "button", ...rest },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={`inline-flex items-center justify-center gap-2 rounded-[6px] font-medium transition-all duration-150 focus-visible:ring-2 focus-visible:ring-safety/70 focus-visible:ring-offset-2 focus-visible:ring-offset-graphite disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...rest}
      />
    );
  },
);
