import React from "react";
import clsx from "clsx";

type BadgeProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "outline" | "secondary" | "primary";
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  className = "",
  ...props
}) => {
  const variants: Record<string, string> = {
    default:
      "bg-foreground text-primary-foreground px-2 py-0.5 text-xs",
    outline:
      "border border-border text-muted px-2 py-0.5 text-xs bg-transparent",
    secondary: "bg-glass text-muted px-2 py-0.5 text-xs",
    primary: "bg-primary text-primary-foreground px-2 py-0.5 text-xs",
  };

  return (
    <div
      {...props}
      className={clsx(
        "inline-flex items-center rounded-full",
        variants[variant],
        className
      )}
    >
      {children}
    </div>
  );
};
