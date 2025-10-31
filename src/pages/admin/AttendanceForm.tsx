import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronsUpDown, Check } from "lucide-react"

import {
    Popover, PopoverTrigger, PopoverContent,
} from "@/components/ui/popover"
import {
    Command, CommandInput, CommandEmpty, CommandGroup, CommandItem,
} from "@/components/ui/command"

import { listInstitutesOptions } from "@/services/institutes"
import { listCirclesByInstitute, type Circle } from "@/services/circles"
import { listStudentsOptions } from "@/services/students"
import type { Attendance } from "@/services/attendances"

const schema = z.object({
    date: z.string().min(10, "التاريخ مطلوب"),
    start_time: z.string().nullable().optional(),
    end_time: z.string().nullable().optional(),
    status: z.enum(["present", "absent", "late", "excused"]).optional().default("present"),
    notes: z.string().nullable().optional(),

    institute_id: z.coerce.number().int().min(1, "اختر المعهد"),
    circle_id: z.coerce.number().int().min(1, "اختر الحلقة"),
    student_id: z.coerce.number().int().min(1, "اختر الطالب"),
})

export type AttendanceFormValues = z.infer<typeof schema>

type Props = {
    defaultValues?: Partial<Attendance>
    onSubmit: (values: AttendanceFormValues) => Promise<void> | void
    submitting?: boolean
}

export default function AttendanceForm({ defaultValues, onSubmit, submitting }: Props) {
    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } =
        useForm<AttendanceFormValues>({
            resolver: zodResolver(schema),
            defaultValues: {
                date: new Date().toISOString().slice(0, 10),
                start_time: null,
                end_time: null,
                status: "present",
                notes: null,
                institute_id: (defaultValues?.institute_id as any) ?? undefined,
                circle_id: (defaultValues?.circle_id as any) ?? undefined,
                student_id: (defaultValues?.student_id as any) ?? undefined,
                ...defaultValues,
            } as any
        })

    const instId = watch("institute_id")
    const circleId = watch("circle_id")
    const studentId = watch("student_id")

    const [instOptions, setInstOptions] = useState<Array<{ id: number; name: string }>>([])
    const [circles, setCircles] = useState<Circle[]>([])
    const [students, setStudents] = useState<Array<{ id: number; name: string }>>([])

    const [openInst, setOpenInst] = useState(false)
    const [openCircle, setOpenCircle] = useState(false)
    const [openStudent, setOpenStudent] = useState(false)

    useEffect(() => { (async () => setInstOptions(await listInstitutesOptions()))() }, [])

    useEffect(() => {
        if (!instId) { setCircles([]); setValue("circle_id", undefined); return }
        (async () => {
            const list = await listCirclesByInstitute(instId)
            setCircles(list)
            // reset circle/student if not in list
            if (!list.some(c => c.id === circleId)) setValue("circle_id", undefined)
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [instId])

    useEffect(() => {
        if (!circleId) { setStudents([]); setValue("student_id", undefined); return }
        (async () => {
            const opts = await listStudentsOptions({ circle_id: circleId })
            setStudents(opts)
            if (!opts.some(s => s.id === studentId)) setValue("student_id", undefined)
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [circleId])

    useEffect(() => { if (defaultValues) reset(defaultValues as any) }, [defaultValues, reset])

    const labelOf = (arr: Array<{ id: number; name: string }>, id?: number) =>
        arr.find(x => x.id === id)?.name || "—"

    return (
        <form onSubmit={handleSubmit(async v => { await onSubmit(v) })} className="grid sm:grid-cols-2 gap-3" dir="rtl">

            {/* التاريخ والأوقات */}
            <div><Input label="التاريخ" type="date" {...register("date")} />{errors.date && <p className="text-xs text-red-600 mt-1">{errors.date.message}</p>}</div>
            <div><Input label="بداية" type="time" {...register("start_time")} /></div>
            <div><Input label="نهاية" type="time" {...register("end_time")} /></div>

            <div className="sm:col-span-2">
                <label className="block text-sm text-gray-700 mb-1">الحالة</label>
                <select
                    className="w-full rounded-md border px-3 py-2 text-right"
                    defaultValue={defaultValues?.status || "present"}
                    onChange={(e) => setValue("status", e.target.value as any)}
                >
                    <option value="present">حاضر</option>
                    <option value="absent">غائب</option>
                    <option value="late">متأخر</option>
                    <option value="excused">مُعذّر</option>
                </select>
            </div>

            {/* المعهد */}
            <div>
                <label className="block text-sm text-gray-700 mb-1">المعهد</label>
                <Popover open={openInst} onOpenChange={setOpenInst}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" role="combobox" className="w-full justify-between">
                            {labelOf(instOptions, instId) || "اختر المعهد…"} <ChevronsUpDown className="opacity-50 size-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[260px] p-0" align="end">
                        <Command>
                            <CommandInput placeholder="ابحث عن معهد…" className="text-right" />
                            <CommandEmpty>لا توجد نتائج.</CommandEmpty>
                            <CommandGroup>
                                {instOptions.map(i => (
                                    <CommandItem key={i.id} value={i.name} onSelect={() => { setValue("institute_id", i.id); setOpenInst(false) }}>
                                        <Check className={cn("ml-2 size-4", instId === i.id ? "opacity-100" : "opacity-0")} />
                                        {i.name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </Command>
                    </PopoverContent>
                </Popover>
                {errors.institute_id && <p className="text-xs text-red-600 mt-1">{errors.institute_id.message}</p>}
            </div>

            {/* الحلقة */}
            <div>
                <label className="block text-sm text-gray-700 mb-1">الحلقة</label>
                <Popover open={openCircle} onOpenChange={setOpenCircle}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" role="combobox" className="w-full justify-between" disabled={!instId}>
                            {circles.find(c => c.id === circleId)?.name || "اختر الحلقة…"} <ChevronsUpDown className="opacity-50 size-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[260px] p-0" align="end">
                        <Command>
                            <CommandInput placeholder="ابحث عن حلقة…" className="text-right" />
                            <CommandEmpty>لا توجد نتائج.</CommandEmpty>
                            <CommandGroup>
                                {circles.map(c => (
                                    <CommandItem key={c.id} value={c.name} onSelect={() => { setValue("circle_id", c.id); setOpenCircle(false) }}>
                                        <Check className={cn("ml-2 size-4", circleId === c.id ? "opacity-100" : "opacity-0")} />
                                        {c.name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </Command>
                    </PopoverContent>
                </Popover>
                {errors.circle_id && <p className="text-xs text-red-600 mt-1">{errors.circle_id.message}</p>}
            </div>

            {/* الطالب */}
            <div className="sm:col-span-2">
                <label className="block text-sm text-gray-700 mb-1">الطالب</label>
                <Popover open={openStudent} onOpenChange={setOpenStudent}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" role="combobox" className="w-full justify-between" disabled={!circleId}>
                            {labelOf(students, studentId) || "اختر الطالب…"} <ChevronsUpDown className="opacity-50 size-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[360px] p-0" align="end">
                        <Command>
                            <CommandInput placeholder="ابحث عن طالب…" className="text-right" />
                            <CommandEmpty>لا توجد نتائج.</CommandEmpty>
                            <CommandGroup>
                                {students.map(s => (
                                    <CommandItem key={s.id} value={s.name} onSelect={() => { setValue("student_id", s.id); setOpenStudent(false) }}>
                                        <Check className={cn("ml-2 size-4", studentId === s.id ? "opacity-100" : "opacity-0")} />
                                        {s.name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </Command>
                    </PopoverContent>
                </Popover>
                {errors.student_id && <p className="text-xs text-red-600 mt-1">{errors.student_id.message}</p>}
            </div>

            <div className="sm:col-span-2">
                <Input label="ملاحظات" {...register("notes")} />
            </div>

            <div className="sm:col-span-2 mt-2 flex gap-2">
                <Button disabled={!!submitting} type="submit">حفظ</Button>
                <Button type="button" variant="outline" onClick={() => reset()}>إعادة ضبط</Button>
            </div>
        </form>
    )
}
