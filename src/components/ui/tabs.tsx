import React from "react";
import clsx from "clsx";

export const Tabs = ({ children, className = "" }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={clsx("tabs", className)}>{children}</div>;
};

export const TabsList = ({ children, className = "" }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={clsx("flex gap-1", className)}>{children}</div>;
};

export const Tab = ({ children, active = false, className = "", ...props }: any) => {
  return (
    <button
      {...props}
      className={clsx(
        "tab",
        active ? "tab--active" : "",
        className
      )}
    >
      {children}
    </button>
  );
};
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-lg hover:scale-105 data-[state=active]:scale-105",
      className
    )}
    {...props}
  />
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
