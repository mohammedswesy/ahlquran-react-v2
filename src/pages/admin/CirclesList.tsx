// src/pages/admin/CirclesList.tsx
import { useEffect, useMemo, useState } from "react"
import AppLayout from "@/layouts/AppLayout"
import Header from "@/components/ui/Header"
import { DataTable } from "@/components/ui/datatable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { ColumnDef } from "@tanstack/react-table"
import { Link } from "react-router-dom"
import { toast } from "sonner"

import { listCircles, deleteCircle, type Circle } from "@/services/circles"

export default function CirclesList() {
  const [rows, setRows] = useState<Circle[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [perPage] = useState(10)
  const [meta, setMeta] = useState<any>(null)

  const load = async () => {
    setLoading(true)
    try {
      const res: any = await listCircles({
        page,
        per_page: perPage,
        search: search || undefined,
      } as any)

      // ✅ يدعم شكلين: Array أو Paginated
      if (Array.isArray(res)) {
        setRows(res as Circle[])
        setMeta(null)
      } else {
        const dataArr = Array.isArray(res?.data) ? res.data : []
        setRows(dataArr as Circle[])
        setMeta(res?.meta ?? null)
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "تعذر تحميل الحلقات")
      setRows([])
      setMeta(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const t = setTimeout(() => load(), 300)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page])

  const onDelete = async (id: number) => {
    if (!confirm("متأكد من حذف الحلقة؟")) return
    try {
      await deleteCircle(id)
      setRows((p) => p.filter((x) => x.id !== id))
      toast.success("تم الحذف")
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "فشل الحذف")
    }
  }

  const columns = useMemo<ColumnDef<Circle>[]>(() => [
    { id: "idx", header: "#", cell: ({ row }) => row.index + 1 },

    { accessorKey: "name", header: "Name" },

    { accessorKey: "type", header: "Type", cell: ({ getValue }) => (getValue() as any) || "—" },

    {
      id: "institute",
      header: "Institute",
      cell: ({ row }) =>
        row.original.institute?.name ??
        row.original.institute_name ??
        row.original.institute_id ??
        "—",
    },

    {
      id: "students",
      header: "Students",
      cell: ({ row }) =>
        row.original.students_count ??
        (Array.isArray(row.original.students) ? row.original.students.length : undefined) ??
        "—",
    },

    {
      id: "teachers",
      header: "Teachers",
      cell: ({ row }) =>
        row.original.teachers_count ??
        (Array.isArray(row.original.teachers) ? row.original.teachers.length : undefined) ??
        "—",
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Link to={`/admin/circles/${row.original.id}`}>
            <Button size="sm" variant="outline">Edit</Button>
          </Link>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(row.original.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ], []) // onDelete ثابت وما بيحتاج dependencies

  return (
    <AppLayout>
      <Header title="الحلقات" subtitle="إدارة الحلقات" />

      <div dir="rtl" className="space-y-3">
        <div className="flex flex-wrap items-end gap-2">
          <Input
            label="بحث"
            placeholder="ابحث باسم الحلقة…"
            value={search}
            onChange={(e) => {
              setPage(1)
              setSearch(e.target.value)
            }}
            className="w-72"
          />

          <Button variant="outline" onClick={load}>تحديث</Button>

          <Link to="/admin/circles/new">
            <Button>إضافة حلقة</Button>
          </Link>
        </div>

        <DataTable columns={columns} data={rows} isLoading={loading} searchKey="name" />

        {meta && (
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>صفحة {meta.current_page} من {meta.last_page}</div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                السابق
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= meta.last_page}
                onClick={() => setPage((p) => p + 1)}
              >
                التالي
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
