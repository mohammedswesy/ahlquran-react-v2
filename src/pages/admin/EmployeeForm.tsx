
import AppLayout from '@/layouts/AppLayout'
import PageHeader from '@/components/PageHeader'
import { useParams, useNavigate } from 'react-router-dom'
export default function EmployeeForm(){
  const {id}=useParams(); const nav=useNavigate(); const editing=id && id!=='new'
  return (<AppLayout>
    <PageHeader title={editing?'Edit Employee':'New Employee'} />
    <form className="grid gap-4 max-w-xl bg-white p-6 rounded-xl shadow">
      <input className="border rounded px-3 py-2" placeholder="Full Name"/>
      <input className="border rounded px-3 py-2" placeholder="Job Title"/>
      <input className="border rounded px-3 py-2" placeholder="Institute ID"/>
      <div className="flex gap-2">
        <button className="bg-black text-white rounded px-3 py-2">Save</button>
        <button type="button" onClick={()=>nav(-1)} className="border rounded px-3 py-2">Cancel</button>
      </div>
    </form>
  </AppLayout>)
}
