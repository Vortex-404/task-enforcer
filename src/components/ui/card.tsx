import React from "react"

export const Card = ({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      {...props}
      className={`card ${className}`}
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
    <div {...props} className={`card__header ${className}`}>
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
    <div {...props} className={`${className}`}>
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
    <div {...props} className={`card__title ${className}`}>
      {children}
    </div>
  )
}
    <div {...props} className={`font-semibold text-sm ${className}`}>
      {children}
    </div>

