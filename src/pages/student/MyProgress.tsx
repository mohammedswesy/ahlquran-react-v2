import { useEffect, useMemo, useState } from "react"
import AppLayout from "@/layouts/AppLayout"
import Header from "@/components/ui/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/ui/datatable"
import { toast } from "sonner"
import api from "@/services/api"
import {
    Popover, PopoverTrigger, PopoverContent
} from "@/components/ui/popover"
import {
    Command, CommandInput, CommandEmpty, CommandGroup, CommandItem
} from "@/components/ui/command"
import { ChevronsUpDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

type Row = {
    date: string
    kind?: string
    title?: string | null
    score?: number | null
    grade?: string | null
    notes?: string | null
}

const KINDS = [
    { value: "", label: "الكل" },
    { value: "memorization", label: "حفظ" },
    { value: "revision", label: "مراجعة" },
    { value: "tajweed", label: "تجويد" },
    { value: "custom", label: "مخصّص" },
]

export default function MyProgress() {
    const [rows, setRows] = useState<Row[]>([])
    const [loading, setLoading] = useState(true)

    const [openKind, setOpenKind] = useState(false)
    const [kind, setKind] = useState<string>("")
    const [dateFrom, setDateFrom] = useState<string>("")
    const [dateTo, setDateTo] = useState<string>("")

    const columns = useMemo(
        () => [
            { key: "date", label: "التاريخ" },
            { key: "kind", label: "النوع" },
            { key: "title", label: "العنوان" },
            { key: "score", label: "الدرجة" },
            { key: "grade", label: "التقدير" },
            { key: "notes", label: "ملاحظات" },
        ],
        []
    )

    async function load() {
        setLoading(true)
        try {
            // عدّل المسار إذا كان مختلف عندك
            const { data } = await api.get("/student/assessments", {
                params: {
                    kind: kind || undefined,
                    date_from: dateFrom || undefined,
                    date_to: dateTo || undefined,
                    per_page: 100,
                },
            })
            const src: any[] = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
            const next: Row[] = src.map((x) => ({
                date: String(x?.date ?? x?.created_at ?? ""),
                kind: x?.kind ?? x?.type ?? "",
                title: x?.title ?? null,
                score: x?.score ?? x?.mark ?? null,
                grade: x?.grade ?? null,
                notes: x?.notes ?? null,
            }))
            setRows(next)
        } catch (e: any) {
            toast.info("سيتم ربط تقدّم الطالب حال تجهيز الـ API")
            setRows([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const id = setTimeout(load, 250)
        return () => clearTimeout(id)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [kind, dateFrom, dateTo])

    return (
        <AppLayout>
            <Header />
            <div className="p-4 space-y-4" dir="rtl">
                <div className="flex flex-wrap items-end gap-3">
                    {/* النوع */}
                    <div className="min-w-[200px]">
                        <label className="block text-sm text-gray-700 mb-1">نوع التقييم</label>
                        <Popover open={openKind} onOpenChange={setOpenKind}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-between">
                                    {KINDS.find(k => k.value === kind)?.label || "الكل"}
                                    <ChevronsUpDown className="opacity-50 size-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[220px] p-0" align="end">
                                <Command>
                                    <CommandInput placeholder="ابحث عن نوع…" className="text-right" />
                                    <CommandEmpty>لا توجد نتائج.</CommandEmpty>
                                    <CommandGroup>
                                        {KINDS.map(k => (
                                            <CommandItem
                                                key={k.value || "all"}
                                                value={k.label}
                                                onSelect={() => { setKind(k.value); setOpenKind(false) }}
                                            >
                                                <Check className={cn("ml-2 size-4", k.value === kind ? "opacity-100" : "opacity-0")} />
                                                {k.label}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* التاريخ من/إلى */}
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">من</label>
                        <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">إلى</label>
                        <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
                    </div>

                    <div className="ml-auto">
                        <Button variant="outline" onClick={load}>تحديث</Button>
                    </div>
                </div>

                <DataTable data={rows} columns={columns as any} isLoading={loading} />
            </div>
        </AppLayout>
    )
}
