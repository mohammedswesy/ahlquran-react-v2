import { useEffect, useMemo, useState } from "react"
import AppLayout from "@/layouts/AppLayout"
import Header from "@/components/ui/Header"
import { DataTable } from "@/components/ui/datatable"
import type { ColumnDef } from "@tanstack/react-table"
import { fetchParents, type ParentRow } from "@/services/parents"

function relToAr(rel?: string | null) {
  const v = (rel || "").toLowerCase()
  if (v === "father") return "أب"
  if (v === "mother") return "أم"
  if (v === "guardian") return "ولي"
  return rel || "—"
}

export default function ParentsList() {
  const [rows, setRows] = useState<ParentRow[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState<{ total: number; last_page: number }>({ total: 0, last_page: 1 })

  const columns: ColumnDef<ParentRow>[] = useMemo(
    () => [
      {
        header: "الاسم",
        cell: ({ row }) => row.original.user?.name ?? "—",
      },
      {
        header: "صلة القرابة",
        cell: ({ row }) => relToAr(row.original.relation_type),
      },
      {
        header: "عدد الأبناء",
        cell: ({ row }) => Number(row.original.children_count ?? 0),
      },
      {
        header: "التواصل",
        cell: ({ row }) => {
          const u = row.original.user
          const mobile = u?.mobile ? `📱 ${u.mobile}` : ""
          const email = u?.email ? `✉️ ${u.email}` : ""
          return (
            <div className="flex flex-col gap-1">
              {mobile ? <span>{mobile}</span> : <span className="text-gray-400">—</span>}
              {email ? <span className="text-gray-500">{email}</span> : null}
            </div>
          )
        },
      },
      {
        header: "إجراءات",
        cell: ({ row }) => {
          // لاحقًا: View / Edit / Link Children
          return (
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 rounded-lg border text-sm hover:bg-gray-50">
                عرض
              </button>
              <button className="px-3 py-1 rounded-lg border text-sm hover:bg-gray-50">
                تعديل
              </button>
            </div>
          )
        },
      },
    ],
    []
  )

  useEffect(() => {
    let cancel = false
    setIsLoading(true)

    const t = setTimeout(async () => {
      try {
        const res = await fetchParents({ search, page, per_page: 15 })
        if (cancel) return
        setRows(res.data || [])
        setMeta({ total: res.meta?.total ?? 0, last_page: res.meta?.last_page ?? 1 })
      } finally {
        if (!cancel) setIsLoading(false)
      }
    }, 350) // debounce صغير للبحث

    return () => {
      cancel = true
      clearTimeout(t)
    }
  }, [search, page])

  return (
    <AppLayout>
      <Header title="أولياء الأمور" subtitle="إدارة أولياء الأمور" />

      <div className="mb-4 flex flex-col md:flex-row md:items-center gap-3">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          placeholder="ابحث بالاسم / الإيميل / رقم الجوال..."
          className="w-full md:w-96 px-3 py-2 rounded-xl border outline-none focus:ring-2 focus:ring-gray-200"
        />

        <div className="text-sm text-gray-600 md:mr-auto">
          الإجمالي: {meta.total}
        </div>
      </div>

      <DataTable columns={columns} data={rows} isLoading={isLoading} />

      <div className="mt-4 flex items-center justify-between">
        <button
          className="px-3 py-2 rounded-xl border text-sm disabled:opacity-50"
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          السابق
        </button>

        <div className="text-sm text-gray-600">
          صفحة {page} من {meta.last_page}
        </div>

        <button
          className="px-3 py-2 rounded-xl border text-sm disabled:opacity-50"
          disabled={page >= meta.last_page}
          onClick={() => setPage((p) => p + 1)}
        >
          التالي
        </button>
      </div>
    </AppLayout>
  )
}
