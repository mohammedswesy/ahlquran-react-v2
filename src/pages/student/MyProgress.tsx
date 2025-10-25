import AppLayout from '@/layouts/AppLayout'
import PageHeader from '@/components/PageHeader'
import Stat from '@/components/Stat'
export default function MyProgress(){return(<AppLayout><PageHeader title='My Progress' subtitle='Your memorization and attendance stats'/><div className='grid md:grid-cols-3 gap-4'><Stat label='Juz Completed' value={3}/><Stat label='Attendance %' value='92%'/><Stat label='Badges' value={4}/></div></AppLayout>)}
