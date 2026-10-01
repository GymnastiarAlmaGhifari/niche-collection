"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Tags, Palette, Image as ImageIcon, BarChart3, History, Settings, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { AuthProvider } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produk", label: "Kelola Produk", icon: Package },
  { href: "/admin/kategori", label: "Kategori", icon: Tags },
  { href: "/admin/konten", label: "Konfigurasi", icon: Palette },
  { href: "/admin/media", label: "Galeri Media", icon: ImageIcon },
  { href: "/admin/statistik", label: "Statistik Klik", icon: BarChart3 },
  { href: "/admin/riwayat", label: "Riwayat Perubahan", icon: History },
  { href: "/admin/pengaturan", label: "Pengaturan", icon: Settings },
];

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (pathname === '/admin/login') {
    return <AuthProvider><div className="min-h-screen bg-background">{children}</div></AuthProvider>;
  }

  return (
    <AuthProvider>
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:shrink-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center px-6 border-b">
          <Link href="/admin" className="font-heading font-bold text-xl text-primary">
            Niche Collection
          </Link>
        </div>
        
        <div className="py-4 flex flex-col gap-1 px-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}>
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                  <Icon className="h-5 w-5" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </div>
        
        <div className="absolute bottom-4 left-0 w-full px-4">
          <Button variant="outline" className="w-full justify-start text-muted-foreground" onClick={() => signOut({ callbackUrl: '/' })}>
            <LogOut className="mr-2 h-4 w-4" /> Keluar
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b bg-card flex items-center justify-between px-4 md:px-6 shrink-0">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="hidden md:flex text-sm font-medium text-muted-foreground">
              {menuItems.find(m => pathname === m.href || pathname.startsWith(`${m.href}/`))?.label || "Admin"}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs bg-muted px-3 py-1.5 rounded-full text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Deploy: 2 jam lalu
            </div>
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
              AD
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
    </AuthProvider>
  );
}
