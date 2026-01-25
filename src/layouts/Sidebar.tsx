// src/layouts/Sidebar.tsx  (أو SidebarPro.tsx حسب اسم ملفك)
import { useEffect, useMemo, useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { NAV_SECTIONS, type NavSection } from "@/config/nav"

import { cn } from "@/lib/utils"
import { PiListBold, PiSignOutBold, PiCaretDownBold } from "react-icons/pi"
import { useAuth } from "@/store/auth"

type Props = {
  brand?: { name: string }
}

const LS_COLLAPSED = "qc_sidebar_collapsed"
const LS_OPEN_SECTIONS = "qc_sidebar_open_sections"

export default function SidebarPro({ brand = { name: "QCircle" } }: Props) {
  const { pathname } = useLocation()
  const { logout } = useAuth()

  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(LS_COLLAPSED) === "1"
    } catch {
      return false
    }
  })

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem(LS_OPEN_SECTIONS)
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(LS_COLLAPSED, collapsed ? "1" : "0")
    } catch { }
  }, [collapsed])

  useEffect(() => {
    try {
      localStorage.setItem(LS_OPEN_SECTIONS, JSON.stringify(openSections))
    } catch { }
  }, [openSections])

  const sections = useMemo(() => {
    // لاحقاً فلترة حسب role/permission
    return NAV_SECTIONS
  }, [])

  useEffect(() => {
    const s = findSectionByPath(sections, pathname)
    if (!s) return
    setOpenSections((prev) => {
      if (prev[s.key] === undefined) return { ...prev, [s.key]: true }
      return prev
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <aside
      dir="rtl"
      className={cn("h-screen sticky top-0 border-l overflow-hidden", "bg-[#fefefe]", "text-[var(--text)]")}
      style={{
        width: collapsed ? 86 : 290,
        boxShadow: "var(--shadow2)",
        borderColor: "var(--border)",
      }}
    >
      {/* Header */}
      <div className="px-4 py-4 flex items-center gap-3 border-b" style={{ borderColor: "var(--border)" }}>
        <div
          className="h-10 w-10 rounded-2xl grid place-items-center font-black"
          style={{
            background: "rgba(0,61,53,.10)",
            border: "1px solid rgba(0,61,53,.18)",
            color: "rgba(0,61,53,.95)",
          }}
          title={brand.name}
        >
          Q
        </div>

        {!collapsed && (
          <div className="flex-1">
            <div className="font-extrabold leading-5 text-[var(--text)]">{brand.name}</div>
            <div className="text-xs text-[var(--muted)]">Admin Panel</div>
          </div>
        )}

        <button
          onClick={() => setCollapsed((v) => !v)}
          className="h-10 w-10 rounded-2xl border grid place-items-center hover:opacity-90 transition"
          style={{
            borderColor: "var(--border)",
            background: "rgba(0,61,53,.04)",
            color: "rgba(0,61,53,.95)",
          }}
          title={collapsed ? "توسيع" : "تصغير"}
        >
          <PiListBold />
        </button>
      </div>

      {/* Content */}
      <div className="px-3 py-3 overflow-y-auto h-[calc(100vh-160px)]">
        {sections.map((sec) => (
          <Section
            key={sec.key}
            section={sec}
            collapsed={collapsed}
            open={openSections[sec.key] ?? true}
            onToggle={() => setOpenSections((p) => ({ ...p, [sec.key]: !(p[sec.key] ?? true) }))}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="px-3 py-3 border-t" style={{ borderColor: "var(--border)" }}>
        <button
          onClick={logout}
          className={cn("w-full flex items-center gap-3 rounded-2xl px-3 py-3 transition", "border hover:opacity-90")}
          style={{
            borderColor: "var(--border)",
            background: "rgba(0,61,53,.04)",
            color: "rgba(0,61,53,.95)",
          }}
          title="خروج"
        >
          <span className="text-lg">
            <PiSignOutBold />
          </span>
          {!collapsed && <span className="font-semibold">خروج</span>}
        </button>
      </div>
    </aside>
  )
}

function Section({
  section,
  collapsed,
  open,
  onToggle,
}: {
  section: NavSection
  collapsed: boolean
  open: boolean
  onToggle: () => void
}) {
  return (
    <div className="mb-3">
      {/* Section Header */}
      <button
        type="button"
        onClick={onToggle}
        className={cn("w-full flex items-center justify-between rounded-2xl px-3 py-2 transition", "hover:opacity-95")}
        style={{
          background: "rgba(0,61,53,.03)",
          border: "1px solid rgba(0,61,53,.10)",
          color: "var(--muted)",
        }}
        title={collapsed ? section.label : ""}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs opacity-70">{!collapsed ? section.label : "•"}</span>
        </div>

        {!collapsed && (
          <span className={cn("transition", open ? "rotate-0" : "-rotate-90")} style={{ color: "rgba(0,61,53,.75)" }}>
            <PiCaretDownBold />
          </span>
        )}
      </button>

      {/* Items */}
      {open && (
        <div className="mt-2 space-y-1">
          {section.items.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.key}
                to={item.to}
                className={({ isActive }) =>
                  cn("group flex items-center gap-3 rounded-2xl px-3 py-3 transition", "border", isActive ? "active" : "")
                }
                style={({ isActive }) => ({
                  borderColor: isActive ? "rgba(0,61,53,.22)" : "rgba(0,61,53,.10)",
                  background: isActive ? "rgba(0,61,53,.08)" : "rgba(254,254,254,.80)",
                  color: isActive ? "rgba(0,61,53,.95)" : "var(--text)",
                })}
                title={collapsed ? item.label : ""}
                end={false}
              >
                {/* ✅ FIX: render icon as a component */}
                <span className="text-lg opacity-90" style={{ color: "rgba(0,61,53,.85)" }}>
                  <Icon />
                </span>

                {!collapsed && <span className="font-semibold">{item.label}</span>}
              </NavLink>
            )
          })}
        </div>
      )}
    </div>
  )
}

function findSectionByPath(sections: NavSection[], path: string) {
  for (const s of sections) {
    if (s.items.some((i) => path === i.to || path.startsWith(i.to + "/"))) return s
  }
  return null
}
