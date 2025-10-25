
import AppLayout from '@/layouts/AppLayout'
import PageHeader from '@/components/PageHeader'
import DataTable from '@/components/DataTable'
const rows=[{id:1,name:'Abu Khaled',relation:'Father',children:1},{id:2,name:'Om Layan',relation:'Mother',children:1}]
export default function ParentsList(){
  return (<AppLayout>
    <PageHeader title="Parents" />
    <DataTable rows={rows} cols={[
      {key:'name',label:'Name'},{key:'relation',label:'Relation'},{key:'children',label:'Children'},
    ]}/>
  </AppLayout>)
}
