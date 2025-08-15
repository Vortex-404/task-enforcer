import React from "react"

import { cn } from "@/lib/utils"

export const Card = ({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      {...props}
      className={`panel-glass rounded-2xl p-0 overflow-hidden shadow-elite ${className}`}
    >
      {children}
    </div>
  )
}

export const CardHeader = ({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      {...props}
      className={`px-4 py-3 border-b border-border ${className}`}
    >
      {children}
    </div>
  )
}

export const CardContent = ({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div {...props} className={`px-4 py-4 ${className}`}>
      {children}
    </div>
  )
}

export const CardTitle = ({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div {...props} className={`font-semibold text-sm ${className}`}>
      {children}
    </div>
  )
}
