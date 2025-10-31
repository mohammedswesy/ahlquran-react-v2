// src/components/ui/Header.tsx
import type { ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { LogOut } from "lucide-react"
import { Button } from "./button"
import { logout } from "@/services/auth"

type Props = {
    title?: string
    subtitle?: string
    right?: ReactNode         // عناصر إضافية يمين الهيدر (أزرار، فلاتر..)
    hideLogout?: boolean      // إخفاء زر الخروج عند الحاجة
    className?: string
}

export default function Header({
    title = "لوحة إدارة نظام القرآن",
    subtitle,
    right,
    hideLogout = false,
    className = "",
}: Props) {
    const nav = useNavigate()

    const onLogout = async () => {
        await logout()
        nav("/login", { replace: true })
    }

    return (
        <header
            dir="rtl"
            className={`h-16 bg-white border-b flex items-center justify-between px-4 ${className}`}
        >
            <div className="flex flex-col">
                <div className="font-semibold text-gray-700">{title}</div>
                {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
            </div>

            <div className="flex items-center gap-2">
                {right}
                {!hideLogout && (
                    <Button variant="outline" onClick={onLogout}>
                        <LogOut className="ml-2" size={16} />
                        خروج
                    </Button>
                )}
            </div>
        </header>
    )
}
