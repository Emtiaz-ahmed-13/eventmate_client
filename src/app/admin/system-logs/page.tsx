"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminServices } from "@/services/admin.service";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield, Activity, User, Calendar, CreditCard, Bell, RefreshCw, Search,
} from "lucide-react";
import { useRouter } from "next/navigation";

const TYPE_META: Record<string, { label: string; color: string; icon: any }> = {
  EVENT_JOIN:       { label: "Join",        color: "text-green-400 bg-green-500/10 border-green-500/20",   icon: Calendar },
  EVENT_LEAVE:      { label: "Leave",       color: "text-red-400 bg-red-500/10 border-red-500/20",         icon: Calendar },
  EVENT_CANCEL:     { label: "Cancel",      color: "text-red-400 bg-red-500/10 border-red-500/20",         icon: Calendar },
  PAYMENT_SUCCESS:  { label: "Payment",     color: "text-purple-400 bg-purple-500/10 border-purple-500/20", icon: CreditCard },
  NEW_REVIEW:       { label: "Review",      color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20", icon: User },
  APPROVAL:         { label: "Approval",    color: "text-blue-400 bg-blue-500/10 border-blue-500/20",      icon: User },
  REJECTION:        { label: "Rejection",   color: "text-red-400 bg-red-500/10 border-red-500/20",         icon: User },
  WAITLIST:         { label: "Waitlist",    color: "text-orange-400 bg-orange-500/10 border-orange-500/20", icon: Bell },
};

const getMeta = (type: string) =>
  TYPE_META[type] || { label: type, color: "text-slate-400 bg-slate-500/10 border-slate-500/20", icon: Activity };

export default function SystemLogsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  if (user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-12 bg-slate-900/60 rounded-[3rem] max-w-md border border-white/5">
          <Shield className="w-10 h-10 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white mb-2">Access Denied</h2>
          <Button onClick={() => router.push("/")} variant="glow" className="mt-6 rounded-2xl">Return Home</Button>
        </div>
      </div>
    );
  }

  const { data: logs = [], isLoading, refetch } = useQuery({
    queryKey: ["admin-system-logs"],
    queryFn: () => AdminServices.getSystemLogs(100),
    refetchInterval: 30000, // auto-refresh every 30s
  });

  const filtered = logs.filter((log: any) => {
    const matchType = activeFilter === "all" || log.type === activeFilter;
    const matchSearch = !searchTerm || log.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchType && matchSearch;
  });

  const uniqueTypes = [...new Set(logs.map((l: any) => l.type))] as string[];

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="bg-slate-900/40 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-3">
                <Activity className="w-8 h-8 text-blue-500" />
                System Logs
              </h1>
              <p className="text-slate-400 font-medium mt-2">Real-time platform activity</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="border-white/10 text-white hover:bg-white/5 rounded-xl font-black text-xs uppercase tracking-widest"
                onClick={() => refetch()}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Badge className="bg-blue-500/20 text-blue-400 border-none text-xs font-black px-4 py-2 uppercase tracking-widest">
                {logs.length} total
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search + Filter */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-900/40 border border-white/5 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary/30 text-sm"
            />
          </div>
          <div className="flex gap-2 p-1.5 bg-slate-900/40 rounded-xl border border-white/5 flex-wrap">
            <button
              onClick={() => setActiveFilter("all")}
              className={`py-2 px-4 rounded-lg font-black text-xs uppercase tracking-widest transition-all ${activeFilter === "all" ? "bg-primary text-slate-900" : "text-slate-400 hover:text-white"}`}
            >
              All
            </button>
            {uniqueTypes.map((type) => {
              const meta = getMeta(type);
              return (
                <button
                  key={type}
                  onClick={() => setActiveFilter(type)}
                  className={`py-2 px-4 rounded-lg font-black text-xs uppercase tracking-widest transition-all ${activeFilter === type ? "bg-primary text-slate-900" : "text-slate-400 hover:text-white"}`}
                >
                  {meta.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Logs */}
        <Card className="border border-white/5 bg-slate-900/40 backdrop-blur-xl">
          <CardHeader className="px-6 py-5 border-b border-white/5">
            <CardTitle className="text-lg font-black text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              Activity Feed
              <span className="text-slate-500 font-medium text-sm ml-2">({filtered.length} entries)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-14 bg-slate-800/50 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-16 text-center">
                <Activity className="w-14 h-14 text-slate-700 mx-auto mb-4" />
                <h3 className="text-lg font-black text-white mb-2">No Logs Found</h3>
                <p className="text-slate-500 text-sm">
                  {logs.length === 0
                    ? "No activity recorded yet. Logs appear as users interact with the platform."
                    : "No logs match your current filter."}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {filtered.map((log: any) => {
                  const meta = getMeta(log.type);
                  const Icon = meta.icon;
                  return (
                    <div key={log.id} className="flex items-start gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${meta.color.split(" ").slice(1).join(" ")}`}>
                        <Icon className={`w-4 h-4 ${meta.color.split(" ")[0]}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium leading-snug">{log.message}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                          {log.user && <span>{log.user.name} ({log.user.role})</span>}
                          <span>{new Date(log.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                      <Badge className={`text-[10px] font-black px-2 py-0.5 border uppercase tracking-widest flex-shrink-0 ${meta.color}`}>
                        {meta.label}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
