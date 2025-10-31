import { cn } from "../../lib/cn"
import * as React from "react"

type Props = React.InputHTMLAttributes<HTMLInputElement> & { label?: string }

export function Input({ className, label, id, ...props }: Props) {
    const input = (
        <input
            id={id}
            className={cn(
                "w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]",
                className
            )}
            {...props}
        />
    )
    if (!label) return input
    return (
        <label className="block space-y-1">
            <span className="text-sm text-gray-700">{label}</span>
            {input}
        </label>
    )
}
