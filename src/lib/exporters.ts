// لا يحتاج حزم خارجية للـ CSV
export function toCSV<T extends Record<string, any>>(rows: T[], filename = "export.csv") {
    if (!rows?.length) {
        const blob = new Blob([""], { type: "text/csv;charset=utf-8;" })
        triggerDownload(blob, filename)
        return
    }
    const headers = Object.keys(rows[0])
    const escape = (val: any) => {
        const s = (val ?? "").toString().replace(/"/g, '""')
        if (s.includes(",") || s.includes("\n") || s.includes('"')) return `"${s}"`
        return s
    }
    const lines = [
        headers.join(","),
        ...rows.map(r => headers.map(h => escape(r[h])).join(",")),
    ]
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" })
    triggerDownload(blob, filename)
}

export async function toXLSX<T extends Record<string, any>>(rows: T[], filename = "export.xlsx") {
    // يتطلب تثبيت sheetjs:  npm i xlsx
    const XLSX = await import("xlsx")
    const ws = XLSX.utils.json_to_sheet(rows || [])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1")
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" })
    const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
    triggerDownload(blob, filename)
}

function triggerDownload(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
}
