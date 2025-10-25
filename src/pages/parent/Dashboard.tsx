import AppLayout from '@/layouts/AppLayout'
import { Link } from 'react-router-dom'
import { FaUsers, FaFileAlt, FaChartBar, FaUserShield } from 'react-icons/fa'

type Card = { label: string; color: 'gold' | 'teal'; to?: string; icon: JSX.Element; count?: number | string }
export default function ParentDashboard() {
    const cards: Card[] = [
        { label: 'أبنائي', icon: <FaUsers />, color: 'gold', to: '/parent/children', count: 2 },
        { label: 'التقارير والشهادات', icon: <FaFileAlt />, color: 'teal', to: '/parent/reports' },
        { label: 'ملخص الأداء', icon: <FaChartBar />, color: 'gold', to: '/parent/reports' },
        { label: 'التواصل مع المعلم', icon: <FaUserShield />, color: 'teal', to: '/parent/reports' },
    ]
    const gold = 'bg-[#b48c43] text-white', teal = 'bg-[#0f5f5c] text-white'
    return (
        <AppLayout>
            <div dir="rtl" className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-800">لوحة وليّ الأمر</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {cards.map((c, i) => {
                        const Card = (
                            <div className={`relative overflow-hidden rounded-2xl p-5 shadow hover:shadow-lg transition ${c.color === 'gold' ? gold : teal}`}>
                                <div className="absolute -left-4 -bottom-4 text-white/20 text-[80px]">{c.icon}</div>
                                <div className="flex items-center gap-3">
                                    <div className="text-3xl">{c.icon}</div>
                                    <div className="flex flex-col">
                                        <span className="text-lg font-semibold">{c.label}</span>
                                        {c.count !== undefined && <span className="text-sm opacity-90">{c.count}</span>}
                                    </div>
                                </div>
                            </div>
                        )
                        return c.to ? <Link key={i} to={c.to}>{Card}</Link> : <div key={i}>{Card}</div>
                    })}
                </div>
            </div>
        </AppLayout>
    )
}
