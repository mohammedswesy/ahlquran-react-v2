import AppLayout from '@/layouts/AppLayout'
import PageHeader from '@/components/ui/Header'
import {Card} from '@/components/ui/card'
import { useToast } from '@/store/toast'
import { useMemo, useState } from 'react'
import clsx from 'clsx'

type Status = 'present' | 'absent'
type Student = { id: number; name: string }

export default function TakeAttendance() {
    const { show } = useToast()

    // بيانات تجريبية — لاحقًا تستبدل بـ fetch من API
    const students: Student[] = useMemo(
        () => [{ id: 1, name: 'Khaled' }, { id: 2, name: 'Layan' }],
        []
    )

    // حالة كل طالب
    const [marks, setMarks] = useState<Record<number, Status | undefined>>({})

    const setStatus = (id: number, status: Status) =>
        setMarks(prev => ({ ...prev, [id]: status }))

    const allMarked = students.every(s => !!marks[s.id])

    const handleSave = () => {
        if (!allMarked) {
            show('يرجى تحديد الحضور/الغياب لجميع الطلاب أولًا ⚠️', 'info')
            return
        }
        // هنا ترسل الطلب للباك إند …
        // await api.post('/attendance', { date, marks })

        show('تم حفظ الحضور بنجاح ✅', 'success')
    }

    const presentCount = Object.values(marks).filter(v => v === 'present').length
    const absentCount = Object.values(marks).filter(v => v === 'absent').length

    return (
        <AppLayout>
            <div dir="rtl" className="space-y-4">
                <PageHeader
                    // title="تسجيل الحضور"
                    // subtitle="حدد حالة كل طالب لليوم"
                />

                {/* شريط إحصائيات صغير */}
                <div className="flex gap-3 text-sm">
                    <span className="rounded-full bg-green-50 text-green-700 px-3 py-1 border border-green-200">
                        حاضر: {presentCount}
                    </span>
                    <span className="rounded-full bg-red-50 text-red-700 px-3 py-1 border border-red-200">
                        غائب: {absentCount}
                    </span>
                    <span className="rounded-full bg-gray-50 text-gray-700 px-3 py-1 border border-gray-200">
                        الكل: {students.length}
                    </span>
                </div>

                <Card>
                    <div className="p-4 space-y-2">
                        {students.map((s) => {
                            const status = marks[s.id]
                            return (
                                <div
                                    key={s.id}
                                    className="flex items-center justify-between border p-3 rounded"
                                >
                                    <div className="font-medium">{s.name}</div>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setStatus(s.id, 'present')}
                                            className={clsx(
                                                'px-3 py-1 rounded border',
                                                status === 'present'
                                                    ? 'bg-green-600 text-white border-green-600'
                                                    : 'bg-green-50 text-green-700 hover:bg-green-100 border-green-200'
                                            )}
                                        >
                                            حاضر
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setStatus(s.id, 'absent')}
                                            className={clsx(
                                                'px-3 py-1 rounded border',
                                                status === 'absent'
                                                    ? 'bg-red-600 text-white border-red-600'
                                                    : 'bg-red-50 text-red-700 hover:bg-red-100 border-red-200'
                                            )}
                                        >
                                            غائب
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="p-4 border-t flex justify-end">
                        <button
                            onClick={handleSave}
                            className={clsx(
                                'rounded-lg px-4 py-2 text-white transition',
                                allMarked ? 'bg-teal-600 hover:bg-teal-700' : 'bg-gray-400 cursor-not-allowed'
                            )}
                        >
                            حفظ الحضور
                        </button>
                    </div>
                </Card>
            </div>
        </AppLayout>
    )
}
