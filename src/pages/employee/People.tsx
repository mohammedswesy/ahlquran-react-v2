import AppLayout from '@/layouts/AppLayout'
import PageHeader from '@/components/PageHeader'
import DataTable from '@/components/DataTable'
const rows=[{id:1,name:'Ahmad',role:'Teacher'},{id:2,name:'Mona',role:'Employee'}]
export default function People(){return(<AppLayout><PageHeader title='People Directory'/><DataTable rows={rows} cols={[{key:'name',label:'Name'},{key:'role',label:'Role'}]}/></AppLayout>)}
