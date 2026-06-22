"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CHART_COLORS = ["#10b981", "#3b82f6", "#a855f7", "#f59e0b", "#ef4444", "#06b6d4"];

interface TrendingCategory {
  category: string;
  count: number;
}

interface AdminStats {
  totalUsers?: number;
  totalHosts?: number;
  totalEvents?: number;
  openEvents?: number;
  cancelledEvents?: number;
  totalParticipants?: number;
}

interface AnalyticsOverview {
  totalUsers?: number;
  totalEvents?: number;
  totalParticipants?: number;
  totalRevenue?: number;
}

interface AdminChartsProps {
  stats?: AdminStats;
  overview?: AnalyticsOverview;
  trendingCategories?: TrendingCategory[];
  isLoading?: boolean;
}

function ChartSkeleton() {
  return (
    <div className="h-[280px] flex items-center justify-center">
      <div className="w-full h-48 bg-slate-800/50 rounded-xl animate-pulse" />
    </div>
  );
}

export function AdminCharts({
  stats,
  overview,
  trendingCategories = [],
  isLoading,
}: AdminChartsProps) {
  const platformData = [
    {
      name: "Users",
      value: overview?.totalUsers ?? stats?.totalUsers ?? 0,
    },
    {
      name: "Hosts",
      value: stats?.totalHosts ?? 0,
    },
    {
      name: "Events",
      value: overview?.totalEvents ?? stats?.totalEvents ?? 0,
    },
    {
      name: "Participants",
      value: overview?.totalParticipants ?? stats?.totalParticipants ?? 0,
    },
  ];

  const eventStatusData = [
    { name: "Open", value: stats?.openEvents ?? 0 },
    { name: "Cancelled", value: stats?.cancelledEvents ?? 0 },
  ].filter((item) => item.value > 0);

  const categoryData = trendingCategories.slice(0, 6).map((item) => ({
    name: item.category,
    count: item.count,
  }));

  const hasEventStatus = eventStatusData.length > 0;
  const hasCategoryData = categoryData.length > 0;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <Card className="border border-white/5 shadow-premium bg-slate-900/40 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-lg font-black text-white">Platform Overview</CardTitle>
          <p className="text-sm text-slate-400">Users, hosts, events, and participants</p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <ChartSkeleton />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={platformData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {platformData.map((_, index) => (
                    <Cell key={`platform-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card className="border border-white/5 shadow-premium bg-slate-900/40 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-lg font-black text-white">Event Status</CardTitle>
          <p className="text-sm text-slate-400">Open vs cancelled events</p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <ChartSkeleton />
          ) : hasEventStatus ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={eventStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={4}
                >
                  {eventStatusData.map((_, index) => (
                    <Cell key={`status-${index}`} fill={index === 0 ? "#10b981" : "#ef4444"} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Legend wrapperStyle={{ color: "#94a3b8", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-slate-500 text-sm">
              No event status data yet
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border border-white/5 shadow-premium bg-slate-900/40 backdrop-blur-xl xl:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg font-black text-white">Trending Categories</CardTitle>
          <p className="text-sm text-slate-400">Most popular event categories by participation</p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <ChartSkeleton />
          ) : hasCategoryData ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={categoryData}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={110}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-500 text-sm">
              No category analytics yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
