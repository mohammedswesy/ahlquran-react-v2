import AppLayout from '@/layouts/AppLayout'
import { Link } from 'react-router-dom'
import { useToast } from '@/store/toast'
import { FaBook, FaCalendarCheck, FaClipboardList, FaUsers } from 'react-icons/fa'

type Card = {
    label: string
    color: 'gold' | 'teal'
    to?: string
    icon: JSX.Element
    count?: number | string
}

export default function TeacherDashboard() {
    const { show } = useToast()

    const cards: Card[] = [
        { label: 'حلقاتي', icon: <FaBook />, color: 'gold', to: '/teacher/circles', count: 2 },
        { label: 'الحضور والغياب', icon: <FaCalendarCheck />, color: 'teal', to: '/teacher/attendance' },
        { label: 'الاختبارات', icon: <FaClipboardList />, color: 'gold', to: '/teacher/assessments' },
        { label: 'طلابي', icon: <FaUsers />, color: 'teal', to: '/teacher/circles' },
    ]

    const gold = 'bg-[#b48c43] text-white'
    const teal = 'bg-[#0f5f5c] text-white'

    return (
        <AppLayout>
            <div dir="rtl" className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-800">لوحة المعلّم</h1>

                    {/* زر تجريبي لعرض التوست */}
                    <button
                        onClick={() => show('تم حفظ الحضور بنجاح ✅', 'success')}
                        className="bg-[#0f5f5c] hover:bg-[#0d4c49] text-white rounded-lg px-4 py-2 text-sm"
                    >
                        تجربة إشعار
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {cards.map((c, i) => {
                        const Card = (
                            <div
                                className={`relative overflow-hidden rounded-2xl p-5 shadow hover:shadow-lg transition ${c.color === 'gold' ? gold : teal}`}
                            >
                                <div className="absolute -left-4 -bottom-4 text-white/20 text-[80px]">
                                    {c.icon}
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-3xl">{c.icon}</div>
                                    <div className="flex flex-col">
                                        <span className="text-lg font-semibold">{c.label}</span>
                                        {c.count !== undefined && (
                                            <span className="text-sm opacity-90">{c.count}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )

                        return c.to ? (
                            <Link key={i} to={c.to}>
                                {Card}
                            </Link>
                        ) : (
                            <div key={i}>{Card}</div>
                        )
                    })}
                </div>
            </div>
        </AppLayout>
    )
}
