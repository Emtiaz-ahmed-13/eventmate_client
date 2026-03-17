"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuthStore();

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
            <Button variant="ghost" className="text-xs font-black uppercase tracking-widest">Login</Button>
          </Link>
          <Link href="/register">
            <Button className="rounded-xl px-6 h-10 text-xs font-black uppercase tracking-widest bg-slate-900 border-none">Join Now</Button>
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
          </div>
          {/* Mobile menu button could go here */}
        </div>
      </div>
    </nav>
  );
};
