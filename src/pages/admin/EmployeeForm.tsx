import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import {
  Popover, PopoverTrigger, PopoverContent,
} from "@/components/ui/popover"
import {
  Command, CommandInput, CommandEmpty, CommandGroup, CommandItem,
} from "@/components/ui/command"
import { ChevronsUpDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

import type { Employee } from "@/services/employees"
import { listInstitutesOptions } from "@/services/institutes"

const schema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  email: z.string().email("بريد غير صالح").nullable().optional(),
  phone: z.string().nullable().optional(),
  role: z.enum(["admin", "teacher", "staff"]).optional(),
  hire_date: z.string().nullable().optional(),
  institute_id: z.coerce.number().int().min(1, "اختر المعهد").optional(),
  status: z.coerce.number().int().optional().default(1),
})

export type EmployeeFormValues = z.infer<typeof schema>

type Props = {
  defaultValues?: Partial<Employee>
  onSubmit: (values: EmployeeFormValues) => Promise<void> | void
  submitting?: boolean
}

export default function EmployeeForm({ defaultValues, onSubmit, submitting }: Props) {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } =
    useForm<EmployeeFormValues>({
      resolver: zodResolver(schema),
      defaultValues: {
        name: "",
        email: null,
        phone: null,
        role: "staff",
        hire_date: null,
        institute_id: undefined,
        status: 1,
        ...defaultValues,
      } as any
    })

  const instituteId = watch("institute_id")

  const [instOptions, setInstOptions] = useState<Array<{ id: number; name: string }>>([])
  const [openInst, setOpenInst] = useState(false)

  useEffect(() => { (async () => setInstOptions(await listInstitutesOptions()))() }, [])
  useEffect(() => { if (defaultValues) reset(defaultValues as any) }, [defaultValues, reset])

  const instName = useMemo(
    () => instOptions.find(i => i.id === instituteId)?.name || "اختر المعهد…",
    [instOptions, instituteId]
  )

  return (
    <form onSubmit={handleSubmit(async v => { await onSubmit(v) })} className="grid sm:grid-cols-2 gap-3" dir="rtl">
      <div className="sm:col-span-2">
        <Input label="اسم الموظف" {...register("name")} />
        {errors.name && <div className="text-red-600 text-xs mt-1">{errors.name.message}</div>}
      </div>

      <div><Input label="البريد" type="email" {...register("email")} /></div>
      <div><Input label="الهاتف" {...register("phone")} /></div>

      <div>
        <label className="block text-sm text-gray-700 mb-1">الدور (Role)</label>
        <select
          className="w-full rounded-md border px-3 py-2 text-right"
          defaultValue={defaultValues?.role || "staff"}
          onChange={(e) => setValue("role", e.target.value as any)}
        >
          <option value="admin">مشرف</option>
          <option value="teacher">معلّم</option>
          <option value="staff">موظّف</option>
        </select>
      </div>

      <div><Input label="تاريخ التعيين" type="date" {...register("hire_date")} /></div>

      {/* المعهد */}
      <div className="sm:col-span-2 md:col-span-1">
        <label className="block text-sm text-gray-700 mb-1">المعهد</label>
        <Popover open={openInst} onOpenChange={setOpenInst}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" className="w-full justify-between">
              {instName}
              <ChevronsUpDown className="opacity-50 size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[260px] p-0" align="end">
            <Command>
              <CommandInput placeholder="ابحث عن معهد…" className="text-right" />
              <CommandEmpty>لا توجد نتائج.</CommandEmpty>
              <CommandGroup>
                {instOptions.map((i) => (
                  <CommandItem
                    key={i.id}
                    value={i.name}
                    onSelect={() => { setValue("institute_id", i.id); setOpenInst(false) }}
                  >
                    <Check className={cn("ml-2 size-4", i.id === instituteId ? "opacity-100" : "opacity-0")} />
                    {i.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        {errors.institute_id && <div className="text-red-600 text-xs mt-1">{errors.institute_id.message}</div>}
      </div>

      <div><Input label="الحالة (1=نشط, 0=موقوف)" type="number" {...register("status", { valueAsNumber: true })} /></div>

      <div className="sm:col-span-2 mt-2 flex gap-2">
        <Button disabled={!!submitting} type="submit">حفظ</Button>
        <Button type="button" variant="outline" onClick={() => reset()}>إعادة ضبط</Button>
      </div>
    </form>
  )
}
