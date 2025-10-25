import { ReactNode } from 'react'
export default function Card({children,className}:{children:ReactNode;className?:string}){return <div className={'bg-white rounded-xl shadow border '+(className||'')}>{children}</div>}
