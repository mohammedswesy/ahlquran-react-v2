
import AppLayout from '@/layouts/AppLayout'
import PageHeader from '@/components/PageHeader'
import DataTable from '@/components/DataTable'
import { Link } from 'react-router-dom'
const rows=[{id:1,name:'Hifz - Juz 1',type:'memorization',institute:'Amman',students:12,teachers:1},{id:2,name:'Tajweed Basics',type:'tajweed',institute:'Gaza',students:18,teachers:2}]
export default function CirclesList(){
  return (<AppLayout>
    <PageHeader title="Circles" actions={<Link to="/admin/circles/new" className="bg-black text-white px-3 py-2 rounded">New</Link>} />
    <DataTable rows={rows} cols={[
      {key:'name',label:'Name'},
      {key:'type',label:'Type'},
      {key:'institute',label:'Institute'},
      {key:'students',label:'Students'},
      {key:'teachers',label:'Teachers'},
      {key:'id',label:'',render:(r)=> <Link to={`/admin/circles/${r.id}`} className="text-blue-600">Edit</Link>},
    ]}/>
  </AppLayout>)
}
