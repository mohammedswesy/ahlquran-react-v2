import AppLayout from "@/layouts/AppLayout"
import Header from "@/components/ui/Header"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { DataTable } from "@/components/ui/datatable"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import {
    fetchTeacherDashboard,
    type TeacherDashboard,
    type TeacherAttendancePoint,
} from "@/services/dashboard"
import { Users, BookOpen, LayoutDashboard } from "lucide-react"

type TeacherAssessmentPoint = {
    date: string
    circle: string
    kind?: string | null
    title?: string | null
    avg_score?: number | null
}

export default function TeacherDashboard() {
    const [stats, setStats] = useState<TeacherDashboard["totals"]>({ circles: 0, students: 0 })
    const [recentAttendance, setRecentAttendance] = useState<TeacherAttendancePoint[]>([])
    const [recentAssessments, setRecentAssessments] = useState<TeacherAssessmentPoint[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        (async () => {
            setLoading(true)
            try {
                const res = await fetchTeacherDashboard()
                // دعم أشكال متعددة:
                const totals = (res as any)?.totals ?? { circles: 0, students: 0 }
                const att =
                    (res as any)?.recentAttendance ??
                    (res as any)?.attendance_recent ??
                    []
                const asses =
                    (res as any)?.recentAssessments ??
                    (res as any)?.assessments_recent ??
                    []

                setStats(totals)
                setRecentAttendance(Array.isArray(att) ? att : [])
                // طبيعـة بسيطة للتقييمات
                setRecentAssessments(
                    (Array.isArray(asses) ? asses : []).map((a: any) => ({
                        date: String(a?.date ?? a?.day ?? ""),
                        circle: String(a?.circle ?? a?.circle_name ?? a?.class ?? ""),
                        kind: a?.kind ?? a?.type ?? null,
                        title: a?.title ?? null,
                        avg_score: a?.avg_score ?? a?.average ?? null,
                    }))
                )
            } catch {
                toast.info("سيتم ربط إحصاءات لوحة المعلم حال تجهيز الـ API")
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    const colsAttendance = useMemo(
        () => [
            { key: "date", label: "التاريخ" },
            { key: "circle", label: "الحلقة" },
            { key: "present", label: "حاضر" },
            { key: "absent", label: "غائب" },
            { key: "late", label: "متأخر" },
            { key: "excused", label: "مُعذَّر" },
        ],
        []
    )

    const colsAssessments = useMemo(
        () => [
            { key: "date", label: "التاريخ" },
            { key: "circle", label: "الحلقة" },
            { key: "kind", label: "النوع" },
            { key: "title", label: "العنوان" },
            { key: "avg_score", label: "متوسط الدرجة" },
        ],
        []
    )

    return (
        <AppLayout>
            <Header />

            <div className="space-y-6" dir="rtl">
                {/* العنوان + أكشنز */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-extrabold text-gray-800">لوحة المعلم</h1>
                    <div className="flex gap-2">
                        <Link to="/teacher/circles"><Button variant="outline">حلقاتي</Button></Link>
                        <Link to="/teacher/attendance"><Button variant="outline">تسجيل الحضور</Button></Link>
                        <Link to="/teacher/assessments"><Button variant="outline">التقييمات</Button></Link>
                    </div>
                </div>

                {/* بطاقات سريعة */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        { title: "حلقاتي", value: stats.circles, Icon: BookOpen },
                        { title: "طلابـي", value: stats.students, Icon: Users },
                        { title: "لوحاتي", value: "روابط سريعة", Icon: LayoutDashboard },
                    ].map((s, i) => (
                        <Card key={i} className="overflow-hidden">
                            <CardHeader className="flex items-center justify-between">
                                <div className="text-sm text-gray-600">{s.title}</div>
                                <s.Icon className="text-[var(--primary)]" size={18} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-extrabold">{s.value}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* روابط كبسات كبيرة */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link to="/teacher/circles" className="block">
                        <div className="rounded-2xl p-5 shadow hover:shadow-lg bg-[#b48c43] text-white transition">
                            <div className="text-lg font-semibold">حلقاتي</div>
                            <div className="text-sm opacity-90">عرض وإدارة الحلقات</div>
                        </div>
                    </Link>
                    <Link to="/teacher/attendance" className="block">
                        <div className="rounded-2xl p-5 shadow hover:shadow-lg bg-[#0f5f5c] text-white transition">
                            <div className="text-lg font-semibold">تسجيل الحضور</div>
                            <div className="text-sm opacity-90">تسجيل الحضور/الغياب اليومي</div>
                        </div>
                    </Link>
                    <Link to="/teacher/assessments" className="block">
                        <div className="rounded-2xl p-5 shadow hover:shadow-lg bg-[#b48c43] text-white transition">
                            <div className="text-lg font-semibold">التقييمات</div>
                            <div className="text-sm opacity-90">إضافة/تحديث تقييمات الطلاب</div>
                        </div>
                    </Link>
                </div>

                {/* آخر حضور/غياب */}
                <Card>
                    <CardHeader className="font-bold">آخر حضور/غياب</CardHeader>
                    <CardContent>
                        <DataTable data={recentAttendance} columns={colsAttendance as any} isLoading={loading} />
                    </CardContent>
                </Card>

                {/* آخر التقييمات */}
                <Card>
                    <CardHeader className="font-bold">آخر التقييمات</CardHeader>
                    <CardContent>
                        <DataTable data={recentAssessments} columns={colsAssessments as any} isLoading={loading} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}
