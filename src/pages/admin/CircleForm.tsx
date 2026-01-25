// src/pages/admin/CircleForm.tsx
import { useEffect, useState } from "react"
import AppLayout from "@/layouts/AppLayout"
import Header from "@/components/ui/Header"
import { useNavigate, useParams } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

import { createCircle, getCircle, updateCircle } from "@/services/circles"

type FormState = {
  name: string
  type: string
  institute_id: number | ""
  start_time: string
  end_time: string
}

export default function CircleForm() {
  const { id } = useParams()
  const nav = useNavigate()
  const editing = !!id && id !== "new"

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState<FormState>({
    name: "",
    type: "hifz",
    institute_id: "",
    start_time: "",
    end_time: "",
  })

  useEffect(() => {
    if (!editing) return
      ; (async () => {
        setLoading(true)
        try {
          const c = await getCircle(Number(id))
          setForm({
            name: c.name ?? "",
            type: (c.type ?? "hifz") as any,
            institute_id: (c.institute_id ?? "") as any,
            start_time: c.start_time ? String(c.start_time).slice(0, 16) : "",
            end_time: c.end_time ? String(c.end_time).slice(0, 16) : "",
          })
        } catch (e: any) {
          toast.error(e?.response?.data?.message || "تعذر جلب بيانات الحلقة")
        } finally {
          setLoading(false)
        }
      })()
  }, [editing, id])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return toast.error("اسم الحلقة مطلوب")
    if (form.institute_id === "" || Number(form.institute_id) <= 0) return toast.error("رقم المعهد مطلوب")

    setSaving(true)
    try {
      const payload = {
        name: form.name,
        type: form.type,
        institute_id: Number(form.institute_id),
        start_time: form.start_time ? form.start_time.replace("T", " ") + ":00" : null,
        end_time: form.end_time ? form.end_time.replace("T", " ") + ":00" : null,
      }

      if (editing) {
        await updateCircle(Number(id), payload as any)
        toast.success("تم التعديل")
      } else {
        await createCircle(payload as any)
        toast.success("تمت الإضافة")
      }

      nav("/admin/circles")
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "فشل الحفظ")
    } finally {
      setSaving(false)
    }
  }

  return (
    <AppLayout>
      <Header title={editing ? "تعديل حلقة" : "إضافة حلقة"} subtitle="بيانات الحلقة" />

      <form dir="rtl" onSubmit={onSubmit} className="grid gap-4 max-w-xl bg-white p-6 rounded-xl shadow">
        <Input
          label="اسم الحلقة"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          disabled={loading}
        />

        <div>
          <label className="block text-sm text-gray-700 mb-1">Type</label>
          <select
            className="w-full rounded-2xl border px-3 py-2"
            value={form.type}
            onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
            disabled={loading}
          >
            <option value="hifz">Hifz</option>
            <option value="tajweed">Tajweed</option>
            <option value="arabic">Arabic</option>
          </select>
        </div>

        <Input
          label="Institute ID"
          type="number"
          value={form.institute_id as any}
          onChange={(e) => setForm((p) => ({ ...p, institute_id: e.target.value as any }))}
          disabled={loading}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Start time</label>
            <input
              className="border rounded-2xl px-3 py-2 w-full"
              type="datetime-local"
              value={form.start_time}
              onChange={(e) => setForm((p) => ({ ...p, start_time: e.target.value }))}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">End time</label>
            <input
              className="border rounded-2xl px-3 py-2 w-full"
              type="datetime-local"
              value={form.end_time}
              onChange={(e) => setForm((p) => ({ ...p, end_time: e.target.value }))}
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button disabled={saving || loading} type="submit">
            {saving ? "جاري الحفظ..." : "حفظ"}
          </Button>
          <Button type="button" variant="outline" onClick={() => nav(-1)}>
            إلغاء
          </Button>
        </div>
      </form>
    </AppLayout>
  )
}
