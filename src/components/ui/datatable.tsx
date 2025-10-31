import * as React from "react"
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    type ColumnDef,
} from "@tanstack/react-table"

type Props<T> = {
    columns: ColumnDef<T, any>[]
    data: T[]
    isLoading?: boolean
}

export function DataTable<T>({ columns, data, isLoading }: Props<T>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    if (isLoading) {
        // Skeleton بسيط
        return (
            <div className="w-full border rounded-xl overflow-hidden">
                <div className="animate-pulse space-y-2 p-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-4 bg-gray-200 rounded" />
                    ))}
                </div>
            </div>
        )
    }

    if (!data || data.length === 0) {
        // Empty state
        return (
            <div className="w-full border rounded-xl p-8 text-center text-sm text-gray-600">
                لا توجد بيانات لعرضها.
            </div>
        )
    }

    return (
        <div className="w-full border rounded-xl overflow-x-auto">
            <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id} className="px-3 py-2 text-right font-semibold">
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id} className="border-t">
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className="px-3 py-2">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
