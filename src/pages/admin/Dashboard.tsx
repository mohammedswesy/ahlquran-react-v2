import AppLayout from '@/layouts/AppLayout'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/datatable'
import type { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'

// NOTE: لو خدمتك اسمها admin.ts بدل dashboard.ts بدّل هذا السطر:
import { fetchDashboard, type DashboardStats } from '@/services/dashboard'
import type { Institute } from '@/services/institutes'

// Recharts (تأكّد: npm i recharts)
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts'

// lucide-react icons
import {
  Users,
  School,
  BookOpen,
  CalendarCheck2,
  CheckCircle2,
  BarChart3,
  FileText,
  Laptop,
  Star,
  IdCard,
  Settings,
  LibraryBig,
} from 'lucide-react'
import SkeletonTable from '@/components/ui/skeleton-table'
import EmptyState from '@/components/ui/empty-state'

type QuickCard = {
  label: string
  color: 'gold' | 'teal'
  to?: string
  icon: React.ElementType
  count?: number | string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recent, setRecent] = useState<Institute[]>([])
  const [attendance, setAttendance] = useState<
    Array<{ date: string; present: number; absent: number; late: number; excused: number }>
  >([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetchDashboard()
      // دعم شكلين محتملين للاستجابة:
      // 1) { stats, recentInstitutes, attendance_week }
      // 2) { totals, recent_institutes, attendance_week }
      const s: any = (res as any)?.stats ?? (res as any)?.totals ?? res
      const r: any[] =
        (res as any)?.recentInstitutes ??
        (res as any)?.recent_institutes ??
        []

      const a: any[] =
        (res as any)?.attendance_week ??
        (res as any)?.attendance?.week ??
        []

      setStats(s || null)
      setRecent(Array.isArray(r) ? r : [])
      setAttendance(
        Array.isArray(a)
          ? a.map((p: any) => ({
            date: String(p.date ?? p.day ?? ''),
            present: Number(p.present ?? p.p ?? 0),
            absent: Number(p.absent ?? p.a ?? 0),
            late: Number(p.late ?? p.l ?? 0),
            excused: Number(p.excused ?? p.e ?? 0),
          }))
          : []
      )
    } catch (e: any) {
      toast.info('سيتم ربط إحصاءات الداشبورد حال تجهيز الـ API')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const quick: QuickCard[] = [
    { label: 'أولياء أمور', icon: Users, color: 'gold', count: (stats as any)?.parents ?? '—', to: '/admin/parents' },
    { label: 'الحلقات', icon: BookOpen, color: 'gold', count: (stats as any)?.circles ?? '—', to: '/admin/circles' },
    { label: 'المعلمين', icon: School, color: 'gold', count: (stats as any)?.teachers ?? '—', to: '/admin/employees' },
    { label: 'الطلبة', icon: Users, color: 'gold', count: (stats as any)?.students ?? '—', to: '/admin/students' },

    { label: 'مواظبة الموظفين', icon: CalendarCheck2, color: 'teal', to: '#' },
    { label: 'مواظبة المعلمين', icon: CalendarCheck2, color: 'teal', to: '#' },
    { label: 'الحضور والغياب', icon: CheckCircle2, color: 'teal', to: '#' },
    { label: 'الحفظ والمراجعة', icon: BookOpen, color: 'teal', to: '#' },

    { label: 'اختبارات', icon: FileText, color: 'gold', to: '#' },
    { label: 'الخطط والمقررات', icon: BookOpen, color: 'gold', to: '#' },
    { label: 'الإحصاءات', icon: BarChart3, color: 'gold', to: '#' },
    { label: 'التقارير', icon: FileText, color: 'gold', to: '#' },

    { label: 'المكتبة', icon: LibraryBig, color: 'teal', to: '#' },
    { label: 'المقرأة الإلكترونية', icon: Laptop, color: 'teal', to: '#' },
    { label: 'السجل الذهبي', icon: Star, color: 'teal', to: '#' },
    { label: 'إعداد البطاقات', icon: IdCard, color: 'teal', to: '#' },

    { label: 'الإعدادات', icon: Settings, color: 'gold', to: '#' },
  ]

  const goldClass = 'bg-[#b48c43] text-white'
  const tealClass = 'bg-[#0f5f5c] text-white'

  const columns = useMemo<ColumnDef<Institute>[]>(() => [
    { header: '#', cell: ({ row }) => row.index + 1 },
    { accessorKey: 'name', header: 'اسم المعهد' },
    { accessorKey: 'city', header: 'المدينة', cell: ({ getValue }) => getValue() || '—' },
  ], [])

  return (
    <AppLayout>
      <div dir="rtl" className="space-y-6">
        {/* العنوان */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-gray-800">لوحة القيادة</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={load}>تحديث</Button>
            <Link to="/admin/institutes"><Button variant="outline">إدارة المعاهد</Button></Link>
            <Link to="/admin/students"><Button variant="outline">إدارة الطلاب</Button></Link>
          </div>
        </div>

        {/* بطاقات إحصائية */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'المعاهد', value: (stats as any)?.institutes ?? (stats as any)?.parents ?? '—', Icon: School },
            { title: 'الطلاب', value: (stats as any)?.students ?? '—', Icon: Users },
            { title: 'الحلقات', value: (stats as any)?.circles ?? '—', Icon: BookOpen },
            { title: 'المعلمين', value: (stats as any)?.teachers ?? '—', Icon: School },
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

        {/* شبكة روابط سريعة */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {quick.map((c, i) => {
            const Icon = c.icon
            const box = (
              <div
                className={`relative overflow-hidden rounded-2xl p-5 shadow hover:shadow-lg transition ${c.color === 'gold' ? goldClass : tealClass}`}
              >
                <div className="absolute -left-4 -bottom-4 text-white/20 text-[80px]">
                  <Icon />
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-3xl"><Icon /></div>
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold">{c.label}</span>
                    {c.count !== undefined && <span className="text-sm opacity-90">{c.count}</span>}
                  </div>
                </div>
              </div>
            )
            return c.to ? (
              <Link key={i} to={c.to} className="block">{box}</Link>
            ) : (
              <div key={i}>{box}</div>
            )
          })}
        </div>

        {/* مخطط حضور الأسبوع */}
        {attendance.length > 0 && (
          <Card>
            <CardHeader className="font-bold">حضور الأسبوع</CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: 320 }}>
                <ResponsiveContainer>
                  <AreaChart data={attendance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    {/* ملاحظة: لا نحدد ألوان يدويًا حسب تعليمات الرسم */}
                    <Area type="monotone" dataKey="present" name="حاضر" strokeOpacity={1} fillOpacity={0.2} />
                    <Area type="monotone" dataKey="absent" name="غائب" strokeOpacity={1} fillOpacity={0.2} />
                    <Area type="monotone" dataKey="late" name="متأخر" strokeOpacity={1} fillOpacity={0.2} />
                    <Area type="monotone" dataKey="excused" name="مُعذّر" strokeOpacity={1} fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* آخر المعاهد */}
        <Card>
  <CardHeader className="flex items-center justify-between">
    <div className="font-bold">آخر المعاهد</div>
    <Link to="/admin/institutes"><Button size="sm" variant="outline">عرض الكل</Button></Link>
  </CardHeader>
  <CardContent>
    {loading ? (
      <SkeletonTable rows={5} cols={3} />
    ) : recent.length === 0 ? (
      <EmptyState title="لا توجد معاهد حديثة" desc="ابدأ بإضافة معهد جديد." />
    ) : (
      <DataTable columns={columns} data={recent} isLoading={false} />
    )}
  </CardContent>
</Card>

      </div>
    </AppLayout>
  )
}
