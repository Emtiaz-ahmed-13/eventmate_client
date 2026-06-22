"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Calendar,
  LayoutDashboard,
  ScrollText,
  Shield,
  UserCheck,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/hosts", label: "Hosts", icon: UserCheck },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/host-verifications", label: "Host Verifications", icon: UserCheck },
  { href: "/admin/event-shield", label: "Event Shield", icon: Shield },
  { href: "/admin/system-logs", label: "System Logs", icon: ScrollText },
] as const;

interface AdminSidebarProps {
  forceVisible?: boolean;
  className?: string;
}

export function AdminSidebar({ forceVisible = false, className }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex-col border-r border-white/5 bg-slate-950/80 backdrop-blur-xl",
        forceVisible ? "flex w-full border-0 bg-transparent" : "hidden lg:flex w-64 shrink-0",
        className
      )}
    >
      {!forceVisible && (
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-black text-white tracking-tight">EventMate</p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Admin</p>
            </div>
          </Link>
        </div>
      )}

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive =
            "exact" in item && item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                isActive
                  ? "bg-primary text-slate-900 shadow-lg shadow-primary/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
