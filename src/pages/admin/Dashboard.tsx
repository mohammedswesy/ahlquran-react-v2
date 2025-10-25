import AppLayout from '@/layouts/AppLayout'
import { Link } from 'react-router-dom'
import {
    FaUsers,
    FaChalkboardTeacher,
    FaList,
    FaBook,
    FaCalendarAlt,
    FaCheckCircle,
    FaChartBar,
    FaFileAlt,
    FaLaptop,
    FaStar,
    FaIdCard,
    FaCogs,
    FaBookOpen
} from 'react-icons/fa'

type Card = {
    label: string
    color: 'gold' | 'teal'
    to?: string
    count?: number | string
    icon: JSX.Element
}

export default function AdminDashboard() {
    // نفس الترتيب والعدد الموجود بالصورة
    const cards: Card[] = [
        { label: 'أولياء أمور', icon: <FaUsers />, color: 'gold', count: 1, to: '/admin/parents' },
        { label: 'الحلقات', icon: <FaList />, color: 'gold', count: 2, to: '/admin/circles' },
        { label: 'المعلمين', icon: <FaChalkboardTeacher />, color: 'gold', count: 2, to: '/admin/employees' },
        { label: 'الطلبة', icon: <FaUsers />, color: 'gold', count: 1, to: '/admin/students' },

        { label: 'مواظبة الموظفين', icon: <FaCalendarAlt />, color: 'teal', to: '#' },
        { label: 'مواظبة المعلمين', icon: <FaCalendarAlt />, color: 'teal', to: '#' },
        { label: 'الحضور والغياب', icon: <FaCalendarAlt />, color: 'teal', to: '#' },
        { label: 'الحفظ والمراجعة', icon: <FaCheckCircle />, color: 'teal', to: '#' },

        { label: 'اختبارات', icon: <FaFileAlt />, color: 'gold', to: '#' },
        { label: 'الخطط والمقررات', icon: <FaBook />, color: 'gold', to: '#' },
        { label: 'الإحصاءات', icon: <FaChartBar />, color: 'gold', to: '#' },
        { label: 'التقارير', icon: <FaFileAlt />, color: 'gold', to: '#' },

        { label: 'المكتبة', icon: <FaBookOpen />, color: 'teal', to: '#' },
        { label: 'المقرأة الإلكترونية', icon: <FaLaptop />, color: 'teal', to: '#' },
        { label: 'السجل الذهبي', icon: <FaStar />, color: 'teal', to: '#' },
        { label: 'إعداد البطاقات', icon: <FaIdCard />, color: 'teal', to: '#' },

        { label: 'الإعدادات', icon: <FaCogs />, color: 'gold', to: '#' },
    ]

    const goldClass = 'bg-[#b48c43] text-white'
    const tealClass = 'bg-[#0f5f5c] text-white'

    return (
        <AppLayout>
            <div dir="rtl" className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-800">لوحة القيادة</h1>
                </div>

                {/* شبكة البطاقات */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {cards.map((c, i) => {
                        const Content = (
                            <div
                                className={`relative overflow-hidden rounded-2xl p-5 shadow hover:shadow-lg transition ${c.color === 'gold' ? goldClass : tealClass}`}
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
                            <Link key={i} to={c.to} className="block">
                                {Content}
                            </Link>
                        ) : (
                            <div key={i}>{Content}</div>
                        )
                    })}
                </div>
            </div>
        </AppLayout>
    )
}
