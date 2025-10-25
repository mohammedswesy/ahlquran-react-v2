
import AppLayout from '@/layouts/AppLayout'
import PageHeader from '@/components/PageHeader'
import DataTable from '@/components/DataTable'
const rows=[{id:1,title:'Congrats',recipient:'Teacher Ahmad',created_at:'2025-08-12'},{id:2,title:'Exam Schedule',recipient:'All Students',created_at:'2025-08-10'}]
export default function NotificationsList(){
  return (<AppLayout>
    <PageHeader title="Notifications" />
    <DataTable rows={rows} cols={[
      {key:'title',label:'Title'},{key:'recipient',label:'Recipient'},{key:'created_at',label:'Created At'},
    ]}/>
  </AppLayout>)
}
