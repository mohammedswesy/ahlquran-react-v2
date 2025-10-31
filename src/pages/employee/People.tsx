// src/pages/employee/People.tsx
import AppLayout from '@/components/ui/AppLayout'
import Header from '@/components/ui/Header'
import { DataTable } from '@/components/ui/datatable'
import type { ColumnDef } from '@tanstack/react-table'

type Person = { id: number; name: string; role: string }

const data: Person[] = [
  { id: 1, name: 'Ahmad', role: 'Teacher' },
  { id: 2, name: 'Mona', role: 'Employee' },
]

const columns: ColumnDef<Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'role', header: 'Role' },
]

export default function People() {
  return (
    <AppLayout>
      <Header title="دليل الموظفين" />
      <div className="p-6">
        <DataTable columns={columns} data={data} />
      </div>
    </AppLayout>
  )
}
