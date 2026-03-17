"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminServices } from "@/services/admin.service";
import { AnalyticsServices } from "@/services/analytics.service";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Calendar,
  TrendingUp,
  Shield,
  Settings,
  BarChart3,
  UserCheck,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  // Check if user is admin
  if (user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-12 bg-slate-900/60 backdrop-blur-3xl rounded-[3rem] shadow-premium max-w-md border border-white/5">
          <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-red-500/20">
            <Shield className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">Access Denied</h2>
          <p className="text-slate-400 mb-10 font-medium italic">Admin privileges required</p>
          <Button onClick={() => router.push("/")} variant="glow" size="lg" className="rounded-2xl px-10">
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: AdminServices.getAdminStats,
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: AnalyticsServices.getOverview,
  });

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="bg-slate-900/40 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tighter">Ecosystem Intelligence</h1>
              <p className="text-slate-400 font-medium mt-2">Real-time surveillance and management of the EventMate global network</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="emerald" className="bg-primary/20 text-primary border-none text-xs font-black tracking-[0.2em] px-4 py-2 uppercase">
                <Shield className="w-3 h-3 mr-2" />
                Administrator
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-10 p-2 bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/5">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "users", label: "Users", icon: Users },
            { id: "events", label: "Events", icon: Calendar },
            { id: "settings", label: "Settings", icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-slate-900 shadow-xl shadow-primary/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsLoading || analyticsLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="border border-white/5 shadow-premium bg-slate-900/40 backdrop-blur-xl">
                    <CardContent className="p-6">
                      <div className="animate-pulse">
                        <div className="h-4 bg-slate-700 rounded mb-2"></div>
                        <div className="h-8 bg-slate-700 rounded"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <>
                  <Card className="border border-white/5 shadow-premium bg-slate-900/40 backdrop-blur-xl">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Total Network Users</p>
                          <p className="text-3xl font-black text-white">{analytics?.totalUsers ?? stats?.totalUsers ?? "—"}</p>
                          <p className="text-xs text-green-500 font-bold">Active participants</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                          <Users className="w-6 h-6 text-blue-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-white/5 shadow-premium bg-slate-900/40 backdrop-blur-xl">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Host Verifications</p>
                          <p className="text-3xl font-black text-white">{analytics?.totalHosts ?? stats?.totalHosts ?? "—"}</p>
                          <p className="text-xs text-yellow-500 font-bold">Verified hosts</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                          <UserCheck className="w-6 h-6 text-purple-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-white/5 shadow-premium bg-slate-900/40 backdrop-blur-xl">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Active Nodes</p>
                          <p className="text-3xl font-black text-white">{analytics?.totalEvents ?? stats?.totalEvents ?? "—"}</p>
                          <p className="text-xs text-blue-500 font-bold">System events</p>
                        </div>
                        <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-green-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-white/5 shadow-premium bg-slate-900/40 backdrop-blur-xl">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Total Revenue</p>
                          <p className="text-3xl font-black text-white">${analytics?.totalRevenue ?? stats?.totalRevenue ?? 0}</p>
                          <p className="text-xs text-green-500 font-bold">Platform earnings</p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-yellow-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            {/* Kernel Controls */}
            <Card className="border border-white/5 shadow-premium bg-slate-900/40 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-xl font-black text-white flex items-center gap-3">
                  <Settings className="w-5 h-5 text-primary" />
                  Kernel Controls
                </CardTitle>
                <p className="text-slate-400 text-sm mt-2">Direct interface with core platform entities</p>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Link href="/admin/users">
                    <Button
                      variant="outline"
                      className="h-20 w-full border-white/10 text-white hover:bg-white/5 flex flex-col gap-2"
                    >
                      <Users className="w-6 h-6" />
                      <span className="text-xs font-black uppercase tracking-[0.2em]">Manage Users</span>
                      <span className="text-xs text-slate-400">{analytics?.totalUsers ?? stats?.totalUsers ?? "—"} items</span>
                    </Button>
                  </Link>
                  
                  <Link href="/admin/host-verifications">
                    <Button
                      variant="outline"
                      className="h-20 w-full border-white/10 text-white hover:bg-white/5 flex flex-col gap-2"
                    >
                      <UserCheck className="w-6 h-6" />
                      <span className="text-xs font-black uppercase tracking-[0.2em]">Verify Hosts</span>
                      <span className="text-xs text-slate-400">{analytics?.totalHosts ?? stats?.totalHosts ?? "—"} items</span>
                    </Button>
                  </Link>
                  
                  <Link href="/admin/event-shield">
                    <Button
                      variant="outline"
                      className="h-20 w-full border-white/10 text-white hover:bg-white/5 flex flex-col gap-2"
                    >
                      <Shield className="w-6 h-6" />
                      <span className="text-xs font-black uppercase tracking-[0.2em]">Event Shield</span>
                      <span className="text-xs text-slate-400">{analytics?.totalEvents ?? stats?.totalEvents ?? "—"} items</span>
                    </Button>
                  </Link>
                  
                  <Link href="/admin/system-logs">
                    <Button
                      variant="outline"
                      className="h-20 w-full border-white/10 text-white hover:bg-white/5 flex flex-col gap-2"
                    >
                      <BarChart3 className="w-6 h-6" />
                      <span className="text-xs font-black uppercase tracking-[0.2em]">System Logs</span>
                      <span className="text-xs text-slate-400">890 items</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-white">User Management</h2>
              <div className="flex gap-3">
                <Link href="/admin/users">
                  <Button variant="glow" className="rounded-xl font-black text-xs uppercase tracking-[0.2em]">
                    <Users className="w-4 h-4 mr-2" />
                    View All Users
                  </Button>
                </Link>
                <Link href="/admin/hosts">
                  <Button variant="outline" className="rounded-xl font-black text-xs uppercase tracking-[0.2em] border-white/10 text-white hover:bg-white/5">
                    <UserCheck className="w-4 h-4 mr-2" />
                    View All Hosts
                  </Button>
                </Link>
              </div>
            </div>
            
            <Card className="border border-white/5 shadow-premium bg-slate-900/40 backdrop-blur-xl">
              <CardContent className="p-8 text-center">
                <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-black text-white mb-2">User Management</h3>
                <p className="text-slate-400 mb-6">Manage users, roles, and permissions from dedicated pages</p>
                <div className="flex gap-4 justify-center">
                  <Link href="/admin/users">
                    <Button variant="glow" size="lg" className="rounded-2xl">Manage Users</Button>
                  </Link>
                  <Link href="/admin/hosts">
                    <Button variant="outline" size="lg" className="rounded-2xl border-white/10 text-white hover:bg-white/5">Manage Hosts</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === "events" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-white">Event Management</h2>
              <Link href="/admin/events">
                <Button variant="glow" className="rounded-xl font-black text-xs uppercase tracking-[0.2em]">
                  <Calendar className="w-4 h-4 mr-2" />
                  View All Events
                </Button>
              </Link>
            </div>
            
            <Card className="border border-white/5 shadow-premium bg-slate-900/40 backdrop-blur-xl">
              <CardContent className="p-8 text-center">
                <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-black text-white mb-2">Event Management</h3>
                <p className="text-slate-400 mb-6">Monitor and manage all events on the platform</p>
                <Link href="/admin/events">
                  <Button variant="glow" size="lg" className="rounded-2xl">Manage Events</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white">System Settings</h2>
            
            <Card className="border border-white/5 shadow-premium bg-slate-900/40 backdrop-blur-xl">
              <CardContent className="p-8 text-center">
                <Settings className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-black text-white mb-2">System Configuration</h3>
                <p className="text-slate-400 mb-6">Advanced system settings and configurations</p>
                <Button variant="outline" size="lg" className="rounded-2xl border-white/10 text-white hover:bg-white/5">
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}