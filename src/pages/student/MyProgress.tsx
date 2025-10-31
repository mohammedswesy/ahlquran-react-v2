import AppLayout from '@/layouts/AppLayout'
import PageHeader from '@/components/ui/Header'
import Stat from '@/components/Stat'
export default function MyProgress(){return(<AppLayout><PageHeader  /><div className='grid md:grid-cols-3 gap-4'><Stat label='Juz Completed' value={3}/><Stat label='Attendance %' value='92%'/><Stat label='Badges' value={4}/></div></AppLayout>)}
