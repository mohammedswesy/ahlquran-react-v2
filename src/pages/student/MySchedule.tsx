import { useEffect, useMemo, useState } from "react"
import AppLayout from "@/layouts/AppLayout"
import Header from "@/components/ui/Header"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/datatable"
import api from "@/services/api"
import { toast } from "sonner"

type Row = {
    date: string
    time?: string | null
    circle?: string
    teacher?: string | null
    location?: string | null
}

export default function MySchedule() {
    const [rows, setRows] = useState<Row[]>([])
    const [loading, setLoading] = useState(true)

    const columns = useMemo(
        () => [
            { key: "date", label: "التاريخ" },
            { key: "time", label: "الوقت" },
            { key: "circle", label: "الحلقة" },
            { key: "teacher", label: "المعلم" },
            { key: "location", label: "المكان" },
        ],
        []
    )

    async function load() {
        setLoading(true)
        try {
            // عدّل المسار إذا كان مختلف عندك
            const { data } = await api.get("/student/schedule", { params: { days: 14 } })
            const src: any[] = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
            const next: Row[] = src.map((x) => ({
                date: String(x?.date ?? x?.day ?? ""),
                time: x?.time ?? x?.slot ?? null,
                circle: x?.circle ?? x?.circle_name ?? "",
                teacher: x?.teacher ?? x?.teacher_name ?? null,
                location: x?.location ?? null,
            }))
            setRows(next)
        } catch (e: any) {
            toast.info("سيتم ربط جدول الطالب حال تجهيز الـ API")
            setRows([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        load()
    }, [])

    return (
        <AppLayout>
            <Header />
            <div className="p-4 space-y-4" dir="rtl">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold">جدولي</h1>
                    <Button variant="outline" onClick={load}>تحديث</Button>
                </div>

                <DataTable data={rows} columns={columns as any} isLoading={loading} />
            </div>
        </AppLayout>
    )
}
