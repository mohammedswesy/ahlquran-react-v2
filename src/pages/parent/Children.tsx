import AppLayout from '@/layouts/AppLayout'
import PageHeader from '@/components/ui/Header'
import {Card} from '@/components/ui/card'
export default function Children(){return(<AppLayout><PageHeader /><div className='grid md:grid-cols-2 gap-4'><Card><div className='p-4'><div className='font-semibold'>Khaled</div><div className='text-sm text-gray-500'>Attendance 93%</div></div></Card><Card><div className='p-4'><div className='font-semibold'>Layan</div><div className='text-sm text-gray-500'>Attendance 88%</div></div></Card></div></AppLayout>)}
