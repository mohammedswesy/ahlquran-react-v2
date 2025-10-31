// src/pages/admin/CirclesList.tsx
import AppLayout from '@/layouts/AppLayout'
import Header from '@/components/ui/Header'
import { DataTable } from '@/components/ui/datatable'
import type { ColumnDef } from '@tanstack/react-table'
import { Link } from 'react-router-dom'

type Row = {
  id: number
  name: string
  type: string
  institute: string
  students: number
  teachers: number
}

const rows: Row[] = [
  { id: 1, name: 'Hifz - Juz 1', type: 'memorization', institute: 'Amman', students: 12, teachers: 1 },
  { id: 2, name: 'Tajweed Basics', type: 'tajweed', institute: 'Gaza', students: 18, teachers: 2 },
]

const columns: ColumnDef<Row>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'type', header: 'Type' },
  { accessorKey: 'institute', header: 'Institute' },
  { accessorKey: 'students', header: 'Students' },
  { accessorKey: 'teachers', header: 'Teachers' },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <Link to={`/admin/circles/${row.original.id}`} className="text-blue-600">
        Edit
      </Link>
    ),
  },
]

export default function CirclesList() {
  return (
    <AppLayout>
      <Header title="الحلقات" subtitle="إدارة الحلقات" />
      <DataTable columns={columns} data={rows} />
    </AppLayout>
  )
}
