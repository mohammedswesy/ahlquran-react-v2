
import AppLayout from '@/layouts/AppLayout'
import PageHeader from '@/components/PageHeader'
import DataTable from '@/components/DataTable'
const rows=[{id:1,name:'Khaled',level:'Juz 3',institute:'Amman'},{id:2,name:'Layan',level:'Juz 1',institute:'Gaza'}]
export default function StudentsList(){
  return (<AppLayout>
    <PageHeader title="Students" />
    <DataTable rows={rows} cols={[
      {key:'name',label:'Name'},{key:'level',label:'Level'},{key:'institute',label:'Institute'},
    ]}/>
  </AppLayout>)
}
