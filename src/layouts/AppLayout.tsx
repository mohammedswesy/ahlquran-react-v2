import React from "react"
import Sidebar from "./Sidebar"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div dir="rtl" className="min-h-screen">
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1100px 700px at 20% 0%, rgba(0,61,53,.28), transparent 60%)," +
            "radial-gradient(900px 600px at 90% 10%, rgba(220,203,160,.16), transparent 60%)," +
            "linear-gradient(180deg, #04110f, var(--bg))",
        }}
      />

      <div className="flex min-h-screen">
        <Sidebar />

        <main className="flex-1 min-w-0 h-screen overflow-y-auto">
          <div className="p-4 md:p-6">
            <div
              className="mx-auto w-full max-w-7xl rounded-[28px]"
              style={{
                background: "#ffffff",
                border: "1px solid rgba(0,61,53,.18)",
                boxShadow: "0 20px 60px rgba(0,0,0,.08)",
              }}
            >
              <div className="p-4 md:p-6">{children}</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
