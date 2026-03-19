"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Sun, Moon, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { useNotifications } from "@/hooks/useNotifications";

export const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  useEffect(() => setMounted(true), []);

  const { notifications, unreadCount, markAllRead } = useNotifications(user?.id);

  const renderNavLinks = () => {
    if (!isAuthenticated) {
      return (
        <>
          <Link href="/events" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
            Explore
          </Link>
          <Link href="/register?role=HOST" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
            Become Host
          </Link>
          <div className="h-4 w-px bg-slate-100 hidden md:block" />
          <Link href="/login">
            <Button variant="ghost" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white">Login</Button>
          </Link>
          <Link href="/register">
            <Button variant="glow" className="rounded-xl px-6 h-10 text-xs font-black uppercase tracking-widest">Join Now</Button>
          </Link>
        </>
      );
    }

    const commonLinks = (
      <>
        <Link href="/events" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
          Explore
        </Link>
        <Link href="/dashboard" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
          Dashboard
        </Link>
        <Link href="/saved" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
          Saved
        </Link>
        {user?.role === "HOST" && (
           <Link href="/events/create" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
              Create
           </Link>
        )}
        {user?.role === "ADMIN" && (
           <Link href="/admin" className="text-xs font-black uppercase tracking-widest text-primary hover:text-white transition-colors">
              Admin
           </Link>
        )}
      </>
    );

    return (
      <>
        {commonLinks}
        <div className="h-4 w-px bg-white/10 mx-2 hidden md:block" />
        <Link href={`/profile/${user?.id}`} className="group flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-black text-slate-400 text-[10px] group-hover:bg-primary group-hover:text-white transition-all border border-white/5">
             {user?.name?.[0] || "U"}
          </div>
          <span className="text-xs font-black text-white uppercase tracking-widest hidden lg:block">{user?.name?.split(' ')[0]}</span>
        </Link>
        <Button variant="ghost" size="sm" onClick={logout} className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-red-400 transition-colors">Logout</Button>
      </>
    );
  };

  return (
    <nav className="sticky top-0 z-[100] bg-slate-950/50 backdrop-blur-xl border-b border-white/5 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] group-hover:scale-110 transition-transform">
                 <span className="text-slate-950 text-xl font-black">E</span>
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">
                Event<span className="text-primary italic">Mate</span>
              </span>
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-6 lg:gap-10">
            {renderNavLinks()}
            {isAuthenticated && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-9 h-9 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 relative"
                  onClick={() => { setShowNotifications(!showNotifications); markAllRead(); }}
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-[9px] font-black text-slate-950 flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Button>

                {showNotifications && (
                  <div className="absolute right-0 top-12 w-80 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
                    <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                      <span className="text-xs font-black text-white uppercase tracking-widest">Notifications</span>
                      <button onClick={() => setShowNotifications(false)} className="text-slate-500 hover:text-white text-xs">✕</button>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-5 py-8 text-center text-slate-500 text-xs font-medium">No notifications yet</div>
                      ) : (
                        notifications.map((n) => (
                          <div key={n.id} className="px-5 py-4 border-b border-white/5 hover:bg-white/5 transition-colors">
                            <p className="text-sm text-white font-medium leading-snug">{n.message}</p>
                            <p className="text-[10px] text-slate-500 mt-1 font-black uppercase tracking-widest">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-9 h-9 rounded-xl text-slate-400 hover:text-white hover:bg-white/5"
                title="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            )}
          </div>
          {/* Mobile menu button could go here */}
        </div>
      </div>
    </nav>
  );
};
