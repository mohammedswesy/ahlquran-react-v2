
import AppLayout from '@/layouts/AppLayout'
import PageHeader from '@/components/PageHeader'
import DataTable from '@/components/DataTable'
import { Link } from 'react-router-dom'
const rows=[{id:1,name:'Ahl Quran - Amman',employees_count:5,circles_count:6},{id:2,name:'Ahl Quran - Gaza',employees_count:4,circles_count:5}]
export default function InstitutesList(){
  return (<AppLayout>
    <PageHeader title="Institutes" actions={<Link to="/admin/institutes/new" className="bg-black text-white px-3 py-2 rounded">New</Link>} />
    <DataTable rows={rows} cols={[
      {key:'name',label:'Name'},
      {key:'employees_count',label:'Employees'},
      {key:'circles_count',label:'Circles'},
      {key:'id',label:'',render:(r)=> <Link to={`/admin/institutes/${r.id}`} className="text-blue-600">Edit</Link>},
    ]}/>
  </AppLayout>)
}
