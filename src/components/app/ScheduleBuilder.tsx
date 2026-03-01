import React from "react"
import { cn } from "@/lib/utils"

export type DayKey = "sat" | "sun" | "mon" | "tue" | "wed" | "thu" | "fri"

export type Schedule = {
    days: DayKey[]
    from: string // "HH:mm"
    to: string   // "HH:mm"
}

const DAYS: { key: DayKey; label: string }[] = [
    { key: "sat", label: "السبت" },
    { key: "sun", label: "الأحد" },
    { key: "mon", label: "الإثنين" },
    { key: "tue", label: "الثلاثاء" },
    { key: "wed", label: "الأربعاء" },
    { key: "thu", label: "الخميس" },
    { key: "fri", label: "الجمعة" },
]

type Props = {
    value: Schedule | null
    onChange: (v: Schedule | null) => void
    disabled?: boolean
}

function ensure(value: Schedule | null): Schedule {
    return {
        days: value?.days ?? [],
        from: value?.from ?? "",
        to: value?.to ?? "",
    }
}

export default function ScheduleBuilder({ value, onChange, disabled }: Props) {
    const v = ensure(value)

    const toggleDay = (d: DayKey) => {
        const exists = v.days.includes(d)
        const nextDays = exists ? v.days.filter((x) => x !== d) : [...v.days, d]
        const next = { ...v, days: nextDays }
        onChange(next.days.length === 0 && !next.from && !next.to ? null : next)
    }

    const setFrom = (from: string) => {
        const next = { ...v, from }
        onChange(next.days.length === 0 && !next.from && !next.to ? null : next)
    }

    const setTo = (to: string) => {
        const next = { ...v, to }
        onChange(next.days.length === 0 && !next.from && !next.to ? null : next)
    }

    const clear = () => onChange(null)

    return (
        <div className="rounded-2xl border p-4 bg-white">
            <div className="flex items-center justify-between">
                <div className="font-semibold text-[var(--text)]">جدول الحلقة</div>
                <button
                    type="button"
                    onClick={clear}
                    disabled={disabled}
                    className="text-xs px-3 py-1 rounded-xl border hover:opacity-90"
                >
                    مسح
                </button>
            </div>

            <div className="mt-3">
                <div className="text-xs text-[var(--muted)] mb-2">الأيام</div>
                <div className="flex flex-wrap gap-2">
                    {DAYS.map((d) => {
                        const active = v.days.includes(d.key)
                        return (
                            <button
                                key={d.key}
                                type="button"
                                disabled={disabled}
                                onClick={() => toggleDay(d.key)}
                                className={cn(
                                    "px-3 py-2 rounded-2xl border text-sm transition",
                                    active ? "bg-[rgba(0,61,53,.10)] border-[rgba(0,61,53,.25)]" : "bg-white"
                                )}
                                style={{ color: active ? "rgba(0,61,53,.95)" : "var(--text)" }}
                            >
                                {d.label}
                            </button>
                        )
                    })}
                </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs text-[var(--muted)] mb-1">من</label>
                    <input
                        type="time"
                        value={v.from}
                        onChange={(e) => setFrom(e.target.value)}
                        disabled={disabled}
                        className="w-full rounded-2xl border px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-xs text-[var(--muted)] mb-1">إلى</label>
                    <input
                        type="time"
                        value={v.to}
                        onChange={(e) => setTo(e.target.value)}
                        disabled={disabled}
                        className="w-full rounded-2xl border px-3 py-2"
                    />
                </div>
            </div>

            <div className="text-xs text-[var(--muted)] mt-3">
                مثال: السبت، الإثنين — 05:00 - 06:00
            </div>
        </div>
    )
}
