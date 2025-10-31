// src/pages/admin/InstitutesList.tsx
import { useEffect, useMemo, useState } from "react"
import { DataTable } from "@/components/ui/datatable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Modal } from "@/components/ui/modal"
import { toast } from "sonner"
import type { ColumnDef } from "@tanstack/react-table"
import ExportMenu from "@/components/app/ExportMenu"
import EmptyState from "@/components/ui/empty-state"
import SkeletonTable from "@/components/ui/skeleton-table"

import {
  listInstitutes,
  createInstitute,
  updateInstitute,
  deleteInstitute,
  type Institute,
} from "@/services/institutes"

import { fetchCountries } from "@/services/countries"
import { listCities } from "@/services/cities"
import { listOrganizations } from "@/services/organizations"

import InstituteForm, { type InstituteFormValues } from "./InstituteForm"

export default function InstitutesList() {
  const [rows, setRows] = useState<Institute[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [perPage] = useState(10)
  const [meta, setMeta] = useState<any>(null)

  const [openCreate, setOpenCreate] = useState(false)
  const [openEdit, setOpenEdit] = useState<Institute | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // ==== خرائط أسماء (id -> name) للدولة/المدينة/المنظمة ====
  const [countryMap, setCountryMap] = useState<Map<number, string>>(new Map())
  const [cityMap, setCityMap] = useState<Map<number, string>>(new Map())
  const [orgMap, setOrgMap] = useState<Map<number, string>>(new Map())

  // حمّل كل القوائم مرة واحدة
  useEffect(() => {
    (async () => {
      try {
        const [countries, cities, orgs] = await Promise.all([
          fetchCountries(),
          listCities(),
          listOrganizations(),
        ])
        setCountryMap(new Map(countries.map((c: any) => [Number(c.id), String(c.name || "")])))
        setCityMap(new Map(cities.map((c: any) => [Number(c.id), String(c.name || "")])))
        setOrgMap(new Map(orgs.map((o: any) => [Number(o.id), String(o.name || "")])))
      } catch {
        // لو فشل التحميل، الجدول سيعرض "—"
      }
    })()
  }, [])

  // ==== الأعمدة ====
  const columns = useMemo<ColumnDef<Institute>[]>(() => [
    { header: "#", cell: ({ row }) => row.index + 1 },
    { accessorKey: "name", header: "اسم المعهد" },

    // الدولة: يدعم علاقة جاهزة (country.name) أو ID فقط (country_id)
    {
      id: "country",
      header: "الدولة",
      cell: ({ row }) => {
        const r: any = row.original
        return r.country?.name || countryMap.get(Number(r.country_id)) || "—"
      },
    },

    // المدينة: يدعم علاقة جاهزة (city.name) أو نص city أو ID فقط
    {
      id: "city",
      header: "المدينة",
      cell: ({ row }) => {
        const r: any = row.original
        return r.city?.name || r.city || cityMap.get(Number(r.city_id)) || "—"
      },
    },

    // المنظمة (اختياري)
    {
      id: "organization",
      header: "المنظمة",
      cell: ({ row }) => {
        const r: any = row.original
        return r.organization?.name || orgMap.get(Number(r.organization_id)) || "—"
      },
    },

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
  ], [countryMap, cityMap, orgMap])

  // ==== التحميل ====
  const load = async () => {
    setLoading(true)
    try {
      const res = await listInstitutes({ page, per_page: perPage, search })
      const next =
        (res && Array.isArray((res as any).rows) && (res as any).rows) ||
        (res && Array.isArray((res as any).data) && (res as any).data) ||
        (Array.isArray(res) ? res : [])
      setRows(next as Institute[])
      setMeta((res as any)?.meta ?? null)
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "تعذر تحميل المعاهد")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const id = setTimeout(() => { load() }, 350)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page])

  // ==== إنشاء ====
  const onCreate = async (v: InstituteFormValues) => {
    setSubmitting(true)
    try {
      const created = await createInstitute(v)
      setRows(prev => [created, ...prev])
      setOpenCreate(false)
      toast.success("تمت الإضافة بنجاح")
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "فشل الإضافة")
    } finally {
      setSubmitting(false)
    }
  }

  // ==== تعديل ====
  const onEdit = async (v: InstituteFormValues) => {
    if (!openEdit) return
    setSubmitting(true)
    try {
      const updated = await updateInstitute(openEdit.id, v)
      setRows(prev => prev.map(r => (r.id === openEdit.id ? updated : r)))
      setOpenEdit(null)
      toast.success("تم التعديل بنجاح")
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "فشل التعديل")
    } finally {
      setSubmitting(false)
    }
  }

  // ==== حذف ====
  async function onDelete(id: number) {
    if (!confirm("هل أنت متأكد من حذف هذا المعهد؟")) return
    try {
      await deleteInstitute(id)
      setRows(prev => prev.filter(r => r.id !== id))
      toast.success("تم الحذف")
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "فشل الحذف")
    }
  }

  // ==== عرض ====
  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex flex-wrap items-end gap-2">
        <Input
          label="بحث"
          placeholder="ابحث باسم المعهد…"
          value={search}
          onChange={(e) => { setPage(1); setSearch(e.target.value) }}
          className="w-64"
        />
        <Button onClick={load} variant="outline">تحديث</Button>
        <Button onClick={() => setOpenCreate(true)}>إضافة معهد</Button>
      </div>
      <div className="flex flex-wrap items-end gap-2">
        {/* ... بحث وأزرار ... */}
        <ExportMenu rows={rows} filename="institutes" />
      </div>
      {loading ? (
  <SkeletonTable rows={8} cols={4} />
) : rows.length === 0 ? (
  <EmptyState
    title="لا توجد معاهد"
    desc="أضف أول معهد للبدء."
    actionLabel="إضافة معهد"
    onAction={() => setOpenCreate(true)}
  />
) : (
  <DataTable columns={columns} data={rows} isLoading={false} />
)}
      <DataTable columns={columns} data={rows} isLoading={loading} />

      {meta && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>صفحة {meta.current_page} من {meta.last_page}</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>السابق</Button>
            <Button variant="outline" size="sm" disabled={meta && page >= meta.last_page} onClick={() => setPage(p => p + 1)}>التالي</Button>
          </div>
        </div>
      )}

      <Modal open={openCreate} onClose={() => setOpenCreate(false)} title="إضافة معهد" footer={null}>
        <InstituteForm submitting={submitting} onSubmit={onCreate} />
      </Modal>

      <Modal open={!!openEdit} onClose={() => setOpenEdit(null)} title="تعديل معهد" footer={null}>
        <InstituteForm submitting={submitting} defaultValues={openEdit ?? undefined} onSubmit={onEdit} />
      </Modal>
    </div>
  )
}
