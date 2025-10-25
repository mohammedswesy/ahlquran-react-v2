import AppLayout from '@/layouts/AppLayout'
import PageHeader from '@/components/PageHeader'
import Card from '@/components/Card'
export default function MyCircles(){return(<AppLayout><PageHeader title='My Circles' subtitle='Circles you manage and teach'/><div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'><Card><div className='p-4'><div className='font-semibold'>Hifz - Juz 1</div><div className='text-sm text-gray-500'>12 students</div></div></Card><Card><div className='p-4'><div className='font-semibold'>Tajweed Basics</div><div className='text-sm text-gray-500'>18 students</div></div></Card></div></AppLayout>)}
