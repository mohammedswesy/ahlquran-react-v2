// src/pages/admin/TeachersList.tsx
import { useEffect, useMemo, useState } from "react"
import { DataTable } from "@/components/ui/datatable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Modal } from "@/components/ui/modal"
import { toast } from "sonner"
import type { ColumnDef } from "@tanstack/react-table"

import {
  listTeachers, createTeacher, updateTeacher, deleteTeacher, type Teacher,
} from "@/services/teachers"

import { listInstitutesOptions } from "@/services/institutes"
import { listCirclesByInstitute, type Circle } from "@/services/circles"

import {
  Popover, PopoverTrigger, PopoverContent,
} from "@/components/ui/popover"
import {
  Command, CommandInput, CommandEmpty, CommandGroup, CommandItem,
} from "@/components/ui/command"
import { ChevronsUpDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

import TeacherForm, { type TeacherFormValues } from "./TeacherForm"
import SkeletonTable from "@/components/ui/skeleton-table"
import EmptyState from "@/components/ui/empty-state"

export default function TeachersList() {
  // ====== State ======
  const [rows, setRows] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [perPage] = useState(10)
  const [meta, setMeta] = useState<any>(null)

  const [openCreate, setOpenCreate] = useState(false)
  const [openEdit, setOpenEdit] = useState<Teacher | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // ====== Filters ======
  const [filterInstituteId, setFilterInstituteId] = useState<number | undefined>(undefined)
  const [filterCircleId, setFilterCircleId] = useState<number | undefined>(undefined)

  // ====== Lookups ======
  const [instOptions, setInstOptions] = useState<Array<{ id: number; name: string }>>([])
  const [circleOptions, setCircleOptions] = useState<Circle[]>([])
  const [instOpen, setInstOpen] = useState(false)
  const [circleOpen, setCircleOpen] = useState(false)

  // load institutes once
  useEffect(() => {
    (async () => {
      try {
        const insts = await listInstitutesOptions()
        setInstOptions(insts)
      } catch {}
    })()
  }, [])

  // load circles when institute filter changes
  useEffect(() => {
    (async () => {
      try {
        if (!filterInstituteId) { setCircleOptions([]); setFilterCircleId(undefined); return }
        const circles = await listCirclesByInstitute(filterInstituteId)
        setCircleOptions(circles)
        if (!circles.some(c => c.id === filterCircleId)) setFilterCircleId(undefined)
      } catch {}
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterInstituteId])

  // ====== Columns ======
  const columns = useMemo<ColumnDef<Teacher>[]>(() => [
    { header: "#", cell: ({ row }) => row.index + 1 },
    { accessorKey: "name", header: "اسم المعلّم" },
    {
      id: "gender",
      header: "النوع",
      cell: ({ row }) => ((row.original.gender || "") === "female" ? "أنثى" : "ذكر"),
    },
    { accessorKey: "email", header: "البريد", cell: ({ getValue }) => getValue() || "—" },
    { accessorKey: "phone", header: "الهاتف", cell: ({ getValue }) => getValue() || "—" },
    { id: "institute", header: "المعهد", cell: ({ row }) => row.original.institute?.name || "—" },
    { id: "circle", header: "الحلقة", cell: ({ row }) => row.original.circle?.name || "—" },
    {
      id: "actions",
      header: "إجراءات",
      cell: ({ row }) => {
        const r = row.original
        return (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setOpenEdit(r)}>تعديل</Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(r.id)}>حذف</Button>
          </div>
        )
      },
    },
  ], [])

  // ====== Load ======
  const load = async () => {
    setLoading(true)
    try {
      const res = await listTeachers({
        page, per_page: perPage, search,
        ...(filterInstituteId ? { institute_id: filterInstituteId } : {}),
        ...(filterCircleId ? { circle_id: filterCircleId } : {}),
      } as any)

      const next =
        (res && Array.isArray((res as any).data) && (res as any).data) ||
        (Array.isArray(res) ? res : [])

      setRows(next as Teacher[])
      setMeta((res as any)?.meta ?? null)
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "تعذر تحميل المعلّمين")
    } finally {
      setLoading(false)
    }
  }

  // debounce: search + filters + page
  useEffect(() => {
    const id = setTimeout(() => load(), 350)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page, filterInstituteId, filterCircleId])

  // ====== CRUD handlers ======
  const onCreate = async (v: TeacherFormValues) => {
    setSubmitting(true)
    try {
      const created = await createTeacher(v)
      setRows(prev => [created, ...prev])
      setOpenCreate(false)
      toast.success("تمت الإضافة بنجاح")
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "فشل الإضافة")
    } finally {
      setSubmitting(false)
    }
  }

  const onEdit = async (v: TeacherFormValues) => {
    if (!openEdit) return
    setSubmitting(true)
    try {
      const updated = await updateTeacher(openEdit.id, v)
      setRows(prev => prev.map(r => r.id === openEdit.id ? updated : r))
      setOpenEdit(null)
      toast.success("تم التعديل بنجاح")
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "فشل التعديل")
    } finally {
      setSubmitting(false)
    }
  }

  async function onDelete(id: number) {
    if (!confirm("متأكد من حذف هذا المعلّم؟")) return
    try {
      await deleteTeacher(id)
      setRows(prev => prev.filter(r => r.id !== id))
      toast.success("تم الحذف")
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "فشل الحذف")
    }
  }

  // ====== helpers for filter display ======
  const instName = (id?: number) =>
    instOptions.find(i => i.id === id)?.name || "اختر المعهد…"
  const circleName = (id?: number) =>
    circleOptions.find(c => c.id === id)?.name || "اختر الحلقة…"

  // ====== Render ======
  return (
    <div className="space-y-4" dir="rtl">
      {/* Filters + actions */}
      <div className="flex flex-wrap items-end gap-2">
        <Input
          label="بحث"
          placeholder="ابحث باسم المعلّم…"
          value={search}
          onChange={(e) => { setPage(1); setSearch(e.target.value) }}
          className="w-64"
        />
{loading ? (
  <SkeletonTable rows={8} cols={7} />
) : rows.length === 0 ? (
  <EmptyState
    title="لا توجد بيانات معلّمين"
    desc="أضف أول معلّم للبدء."
    actionLabel="إضافة معلّم"
    onAction={() => setOpenCreate(true)}
  />
) : (
  <DataTable columns={columns} data={rows} isLoading={false} />
)}

        {/* Filter: Institute */}
        <div className="min-w-[220px]">
          <label className="block text-sm text-gray-700 mb-1">المعهد</label>
          <Popover open={instOpen} onOpenChange={setInstOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" className="w-full justify-between">
                {instName(filterInstituteId)}
                <ChevronsUpDown className="opacity-50 size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[260px] p-0" align="end">
              <Command>
                <CommandInput placeholder="ابحث عن معهد…" className="text-right" />
                <CommandEmpty>لا توجد نتائج.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    key={0}
                    value="الكل"
                    onSelect={() => { setFilterInstituteId(undefined); setFilterCircleId(undefined); setInstOpen(false); setPage(1) }}
                  >
                    <Check className={cn("ml-2 size-4", !filterInstituteId ? "opacity-100" : "opacity-0")} />
                    الكل
                  </CommandItem>
                  {instOptions.map((i) => (
                    <CommandItem
                      key={i.id}
                      value={i.name}
                      onSelect={() => { setFilterInstituteId(i.id); setInstOpen(false); setPage(1) }}
                    >
                      <Check className={cn("ml-2 size-4", i.id === filterInstituteId ? "opacity-100" : "opacity-0")} />
                      {i.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Filter: Circle */}
        <div className="min-w-[220px]">
          <label className="block text-sm text-gray-700 mb-1">الحلقة</label>
          <Popover open={circleOpen} onOpenChange={setCircleOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between"
                disabled={!filterInstituteId}
              >
                {circleName(filterCircleId)}
                <ChevronsUpDown className="opacity-50 size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[260px] p-0" align="end">
              <Command>
                <CommandInput placeholder="ابحث عن حلقة…" className="text-right" />
                <CommandEmpty>لا توجد نتائج.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    key={0}
                    value="الكل"
                    onSelect={() => { setFilterCircleId(undefined); setCircleOpen(false); setPage(1) }}
                  >
                    <Check className={cn("ml-2 size-4", !filterCircleId ? "opacity-100" : "opacity-0")} />
                    الكل
                  </CommandItem>
                  {circleOptions.map((c) => (
                    <CommandItem
                      key={c.id}
                      value={c.name}
                      onSelect={() => { setFilterCircleId(c.id); setCircleOpen(false); setPage(1) }}
                    >
                      <Check className={cn("ml-2 size-4", c.id === filterCircleId ? "opacity-100" : "opacity-0")} />
                      {c.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <Button onClick={load} variant="outline">تحديث</Button>
        <Button onClick={() => setOpenCreate(true)}>إضافة معلّم</Button>
      </div>

      {/* Table */}
      <DataTable columns={columns} data={rows} isLoading={loading} />

      {/* Pagination */}
      {meta && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>صفحة {meta.current_page} من {meta.last_page}</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
              السابق
            </Button>
            <Button variant="outline" size="sm" disabled={meta && page >= meta.last_page} onClick={() => setPage(p => p + 1)}>
              التالي
            </Button>
          </div>
        </div>
      )}

      {/* Create */}
      <Modal open={openCreate} onClose={() => setOpenCreate(false)} title="إضافة معلّم" footer={null}>
        <TeacherForm submitting={submitting} onSubmit={onCreate} />
      </Modal>

      {/* Edit */}
      <Modal open={!!openEdit} onClose={() => setOpenEdit(null)} title="تعديل معلّم" footer={null}>
        <TeacherForm submitting={submitting} defaultValues={openEdit ?? undefined} onSubmit={onEdit} />
      </Modal>
    </div>
  )
}
