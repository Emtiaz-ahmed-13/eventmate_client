"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Home, LogOut, Menu, Shield, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!hydrated) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "ADMIN") {
      router.replace("/");
    }
  }, [hydrated, user, router]);

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-slate-400 text-sm font-medium animate-pulse">Loading admin console...</div>
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-slate-400 text-sm font-medium">Checking access...</div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 border-r border-white/5 transform transition-transform lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
          <span className="text-sm font-black text-white">Admin Menu</span>
          <Button
            variant="outline"
            size="icon"
            className="border-white/10 text-white hover:bg-white/5"
            onClick={() => setMobileOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="p-2 overflow-y-auto">
          <AdminSidebar forceVisible />
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 shrink-0 border-b border-white/5 bg-slate-900/40 backdrop-blur-xl flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden border-white/10 text-white hover:bg-white/5"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-4 h-4" />
            </Button>
            <div>
              <p className="text-sm font-black text-white">Admin Console</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black hidden sm:block">
                Platform management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Badge className="bg-primary/20 text-primary border-none text-[10px] font-black tracking-[0.15em] px-3 py-1.5 uppercase hidden sm:flex">
              <Shield className="w-3 h-3 mr-1.5" />
              {user.name || user.email}
            </Badge>
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="border-white/10 text-white hover:bg-white/5 text-[10px] font-black uppercase tracking-widest"
              >
                <Home className="w-3.5 h-3.5 mr-1.5" />
                Site
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="border-white/10 text-white hover:bg-white/5 text-[10px] font-black uppercase tracking-widest"
              onClick={handleLogout}
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" />
              Logout
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
