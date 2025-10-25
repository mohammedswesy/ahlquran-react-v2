
import AppLayout from '@/layouts/AppLayout'
import PageHeader from '@/components/PageHeader'
import { useParams, useNavigate } from 'react-router-dom'
export default function CircleForm(){
  const {id}=useParams(); const nav=useNavigate(); const editing=id && id!=='new'
  return (<AppLayout>
    <PageHeader title={editing?'Edit Circle':'New Circle'} />
    <form className="grid gap-4 max-w-xl bg-white p-6 rounded-xl shadow">
      <input className="border rounded px-3 py-2" placeholder="Circle name"/>
      <select className="border rounded px-3 py-2"><option>Type</option><option value="memorization">Memorization</option><option value="tajweed">Tajweed</option><option value="arabic">Arabic</option></select>
      <input className="border rounded px-3 py-2" placeholder="Institute ID"/>
      <div className="grid grid-cols-2 gap-4">
        <input className="border rounded px-3 py-2" type="datetime-local" />
        <input className="border rounded px-3 py-2" type="datetime-local" />
      </div>
      <div className="flex gap-2">
        <button className="bg-black text-white rounded px-3 py-2">Save</button>
        <button type="button" onClick={()=>nav(-1)} className="border rounded px-3 py-2">Cancel</button>
      </div>
    </form>
  </AppLayout>)
}
