// src/pages/admin/ParentsList.tsx
import AppLayout from '@/layouts/AppLayout'
import Header from '@/components/ui/Header'
import { DataTable } from '@/components/ui/datatable'
import type { ColumnDef } from '@tanstack/react-table'

type Row = {
  id: number
  name: string
  relation: string
  children: number
}

const rows: Row[] = [
  { id: 1, name: 'Abu Khaled', relation: 'Father', children: 1 },
  { id: 2, name: 'Om Layan', relation: 'Mother', children: 1 },
]

const columns: ColumnDef<Row>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'relation', header: 'Relation' },
  { accessorKey: 'children', header: 'Children' },
]

export default function ParentsList() {
  return (
    <AppLayout>
      <Header title="أولياء الأمور" subtitle="إدارة أولياء الأمور" />
      <DataTable columns={columns} data={rows} />
    </AppLayout>
  )
}
