type CardsProps = { totals: Record<string, number> }

export default function DashboardCards({ totals }: CardsProps) {
    const items = [
        { label: "المعاهد", value: totals?.institutes ?? 0 },
        { label: "المعلمون", value: totals?.teachers ?? 0 },
        { label: "الطلبة", value: totals?.students ?? 0 },
        { label: "الحلقات", value: totals?.circles ?? 0 },
    ]

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3" dir="rtl">
            {items.map((c, i) => (
                <div key={i} className="rounded-2xl p-4 bg-white shadow">
                    <div className="text-gray-500 text-sm">{c.label}</div>
                    <div className="text-2xl font-bold">{c.value}</div>
                </div>
            ))}
        </div>
    )
}
