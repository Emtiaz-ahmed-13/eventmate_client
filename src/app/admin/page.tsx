"use client";

import { useQuery } from "@tanstack/react-query";
import { AdminServices } from "@/services/admin.service";
import { AnalyticsServices } from "@/services/analytics.service";
import { Card, CardContent } from "@/components/ui/card";
import { AdminCharts } from "@/components/admin/AdminCharts";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Calendar, TrendingUp, UserCheck, Users } from "lucide-react";

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: AdminServices.getAdminStats,
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: AnalyticsServices.getOverview,
  });

  const overview = analytics?.overview;
  const isLoading = statsLoading || analyticsLoading;

  const statCards = [
    {
      label: "Total Users",
      value: overview?.totalUsers ?? stats?.totalUsers ?? "—",
      hint: "Registered accounts",
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Verified Hosts",
      value: stats?.totalHosts ?? "—",
      hint: "Active hosts",
      icon: UserCheck,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      label: "Total Events",
      value: overview?.totalEvents ?? stats?.totalEvents ?? "—",
      hint: "Platform events",
      icon: Calendar,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: "Total Revenue",
      value: `$${overview?.totalRevenue ?? 0}`,
      hint: "Platform earnings",
      icon: TrendingUp,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <AdminPageHeader
        title="Dashboard Overview"
        description="Real-time analytics and platform health at a glance"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border border-white/5 shadow-premium bg-slate-900/40 backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-3">
                    <div className="h-3 bg-slate-700 rounded w-24" />
                    <div className="h-8 bg-slate-700 rounded w-16" />
                  </div>
                </CardContent>
              </Card>
            ))
          : statCards.map((card) => (
              <Card key={card.label} className="border border-white/5 shadow-premium bg-slate-900/40 backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-2">
                        {card.label}
                      </p>
                      <p className="text-3xl font-black text-white">{card.value}</p>
                      <p className="text-xs text-slate-400 font-medium mt-1">{card.hint}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.bg}`}>
                      <card.icon className={`w-6 h-6 ${card.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      <AdminCharts
        stats={stats}
        overview={overview}
        trendingCategories={analytics?.trendingCategories}
        isLoading={isLoading}
      />
    </div>
  );
}
