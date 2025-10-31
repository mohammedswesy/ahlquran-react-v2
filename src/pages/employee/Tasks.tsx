import AppLayout from '@/layouts/AppLayout'
import PageHeader from '@/components/ui/Header'
import {DataTable} from '@/components/ui/datatable'
const rows=[{id:1,task:'Prepare monthly financials',due:'2025-08-15',status:'Pending'},{id:2,task:'Verify new student docs',due:'2025-08-14',status:'In progress'}]
export default function Tasks(){return(<AppLayout><PageHeader/><DataTable rows={rows} cols={[{key:'task',label:'Task'},{key:'due',label:'Due'},{key:'status',label:'Status'}]}/></AppLayout>)}
