
import AppLayout from '@/layouts/AppLayout'
import PageHeader from '@/components/PageHeader'
import DataTable from '@/components/DataTable'
import { Link } from 'react-router-dom'
const rows=[{id:1,name:'Ahmad Ali',job_title:'Accountant',institute:'Amman'},{id:2,name:'Sara Yousef',job_title:'HR',institute:'Gaza'}]
export default function EmployeesList(){
  return (<AppLayout>
    <PageHeader title="Employees" actions={<Link to="/admin/employees/new" className="bg-black text-white px-3 py-2 rounded">New</Link>} />
    <DataTable rows={rows} cols={[
      {key:'name',label:'Name'},
      {key:'job_title',label:'Job Title'},
      {key:'institute',label:'Institute'},
      {key:'id',label:'',render:(r)=> <Link to={`/admin/employees/${r.id}`} className="text-blue-600">Edit</Link>},
    ]}/>
  </AppLayout>)
}
