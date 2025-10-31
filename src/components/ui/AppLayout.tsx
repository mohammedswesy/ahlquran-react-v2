import Sidebar from "./Sidebar"
import Header from "./Header"

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex bg-[var(--bg)]">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="p-4 max-w-7xl mx-auto w-full">{children}</main>
            </div>
        </div>
    )
}
