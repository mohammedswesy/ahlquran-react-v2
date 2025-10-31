import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { getMenuForRole, type Role } from "./menus"
import { useAuth } from "@/store/auth"
import { cn } from "@/lib/utils"
import { LogOut, Menu } from "lucide-react"

export default function Sidebar() {
    const { role, logout } = useAuth()
    const [open, setOpen] = useState(true) // لو بدك سايدبار قابل للطي
    const { pathname } = useLocation()
    const sections = getMenuForRole(role as Role | undefined)

    const isActive = (to: string) =>
        pathname === to || (to !== "/" && pathname.startsWith(to))

    return (
        <aside dir="rtl" className={cn(
            "bg-white border-l w-64 shrink-0 h-screen sticky top-0 overflow-y-auto transition-all",
            open ? "w-64" : "w-20"
        )}>
            {/* Header */}
            <div className="h-14 border-b flex items-center justify-between px-3">
                <button
                    onClick={() => setOpen(o => !o)}
                    className="p-2 rounded hover:bg-gray-100"
                    title={open ? "طيّ" : "توسيع"}
                >
                    <Menu size={18} />
                </button>
                {open && <div className="text-sm font-bold">Ahl-Quran</div>}
                <button
                    onClick={logout}
                    className="p-2 rounded hover:bg-gray-100"
                    title="تسجيل الخروج"
                >
                    <LogOut size={18} />
                </button>
            </div>

            {/* Sections */}
            <nav className="p-3 space-y-4">
                {sections.map((sec, idx) => (
                    <div key={idx} className="space-y-2">
                        {sec.title && open && (
                            <div className="text-xs text-gray-500 font-semibold px-2">{sec.title}</div>
                        )}
                        <ul className="space-y-1">
                            {sec.items.map((it) => {
                                const Active = isActive(it.to)
                                const Icon = it.icon
                                return (
                                    <li key={it.to}>
                                        <Link
                                            to={it.to}
                                            className={cn(
                                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-gray-100",
                                                Active && "bg-gray-100 font-semibold"
                                            )}
                                            title={!open ? it.label : undefined}
                                        >
                                            {Icon && <Icon size={18} className="shrink-0" />}
                                            {open && <span className="truncate">{it.label}</span>}
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                ))}
            </nav>
        </aside>
    )
}
