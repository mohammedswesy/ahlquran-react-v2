// src/components/ui/Card.tsx (أو حسب مسارك)
import type React from "react"
import { cn } from "@/lib/utils"

export function Card(props: React.HTMLAttributes<HTMLDivElement>) {
    const { className, ...rest } = props
    return (
        <div
            className={cn("bg-white rounded-3xl border shadow-sm", className)}
            {...rest}
        />
    )
}

export function CardHeader(props: React.HTMLAttributes<HTMLDivElement>) {
    const { className, ...rest } = props
    return (
        <div
            className={cn("p-4 border-b flex items-center justify-between", className)}
            {...rest}
        />
    )
}

export function CardContent(props: React.HTMLAttributes<HTMLDivElement>) {
    const { className, ...rest } = props
    return (
        <div
            className={cn("p-4", className)}
            {...rest}
        />
    )
}
