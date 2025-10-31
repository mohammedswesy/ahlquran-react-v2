import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts"
import type { AttendancePoint } from "@/services/dashboard"

export default function AttendanceChart({ data }: { data: AttendancePoint[] }) {
    return (
        <div className="rounded-2xl p-4 bg-white shadow" dir="rtl">
            <h3 className="font-semibold mb-2">حضور الأسبوع</h3>
            <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                    <AreaChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        {/* بدون تحديد ألوان يدوياً حسب المطلوب */}
                        <Area type="monotone" dataKey="present" name="حاضر" strokeOpacity={1} fillOpacity={0.2} />
                        <Area type="monotone" dataKey="absent" name="غائب" strokeOpacity={1} fillOpacity={0.2} />
                        <Area type="monotone" dataKey="late" name="متأخر" strokeOpacity={1} fillOpacity={0.2} />
                        <Area type="monotone" dataKey="excused" name="مُعذّر" strokeOpacity={1} fillOpacity={0.2} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
