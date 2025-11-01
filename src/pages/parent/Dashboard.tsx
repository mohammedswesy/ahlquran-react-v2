import { useEffect, useMemo, useState } from "react"
import AppLayout from "@/layouts/AppLayout"
import Header from "@/components/ui/Header"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { DataTable } from "@/components/ui/datatable"
import api from "@/services/api"
import { toast } from "sonner"
import { Users, Bell, CalendarDays } from "lucide-react"

type AttendanceRow = { date: string; child: string; circle?: string | null; status: string }
type AssessmentRow = { date: string; child: string; kind?: string; title?: string | null; score?: number | null; grade?: string | null }

export default function ParentDashboard() {
    const [loading, setLoading] = useState(true)
    const [totals, setTotals] = useState<any>({})
    const [recentAttendance, setRecentAttendance] = useState<AttendanceRow[]>([])
    const [recentAssessments, setRecentAssessments] = useState<AssessmentRow[]>([])

    useEffect(() => {
        (async () => {
            setLoading(true)
            try {
                // غيّر المسار لو مختلف عندك في الباك
                const { data } = await api.get("/parent/dashboard")
                const t = data?.totals || {}
                const ra: any[] = Array.isArray(data?.recentAttendance) ? data.recentAttendance : []
                const rs: any[] = Array.isArray(data?.recentAssessments) ? data.recentAssessments : []

                setTotals(t)
                setRecentAttendance(
                    ra.map(x => ({
                        date: String(x?.date ?? x?.day ?? ""),
                        child: String(x?.child ?? x?.student_name ?? ""),
                        circle: x?.circle ?? x?.circle_name ?? null,
                        status: String(x?.status ?? ""),
                    }))
                )
                setRecentAssessments(
                    rs.map(x => ({
                        date: String(x?.date ?? x?.created_at ?? ""),
                        child: String(x?.child ?? x?.student_name ?? ""),
                        kind: x?.kind ?? x?.type ?? "",
                        title: x?.title ?? null,
                        score: x?.score ?? x?.mark ?? null,
                        grade: x?.grade ?? null,
                    }))
                )
            } catch {
                toast.info("سيتم ربط لوحة وليّ الأمر حال تجهيز الـ API")
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    const attCols = useMemo(() => [
        { key: "date", label: "التاريخ" },
        { key: "child", label: "الابن" },
        { key: "circle", label: "الحلقة" },
        { key: "status", label: "الحالة" },
    ], [])

    const asCols = useMemo(() => [
        { key: "date", label: "التاريخ" },
        { key: "child", label: "الابن" },
        { key: "kind", label: "النوع" },
        { key: "title", label: "العنوان" },
        { key: "score", label: "الدرجة" },
        { key: "grade", label: "التقدير" },
    ], [])

    return (
        <AppLayout>
            <Header />
            <div className="space-y-6" dir="rtl">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-extrabold text-gray-800">لوحة وليّ الأمر</h1>
                    <div className="flex gap-2">
                        <Link to="/parent/children"><Button variant="outline">أبنائي</Button></Link>
                        <Link to="/parent/reports"><Button variant="outline">التقارير</Button></Link>
                    </div>
                </div>

                {/* بطاقات سريعة */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        { title: "عدد الأبناء", value: totals?.children ?? "—", Icon: Users },
                        { title: "إشعارات غير مقروءة", value: totals?.unread_notifications ?? "—", Icon: Bell },
                        { title: "حصص قادمة", value: totals?.upcoming_sessions ?? "—", Icon: CalendarDays },
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

                {/* آخر حضور */}
                <Card>
                    <CardHeader className="font-bold">آخر حضور/غياب</CardHeader>
                    <CardContent>
                        <DataTable data={recentAttendance} columns={attCols as any} isLoading={loading} />
                    </CardContent>
                </Card>

                {/* آخر تقييمات */}
                <Card>
                    <CardHeader className="font-bold">آخر التقييمات</CardHeader>
                    <CardContent>
                        <DataTable data={recentAssessments as any[]} columns={asCols as any} isLoading={loading} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}
