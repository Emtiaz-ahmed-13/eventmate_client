"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { EventServices } from "@/services/event.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Users,
  DollarSign,
  CheckCircle,
  Clock,
  ArrowLeft,
  TrendingUp,
  QrCode,
} from "lucide-react";
import Link from "next/link";

export default function EventAnalyticsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["event-analytics", id],
    queryFn: () => EventServices.getEventAnalytics(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
        <p className="text-slate-400 font-medium">Failed to load analytics.</p>
        <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const { event, stats, participants } = data;

  const statCards = [
    {
      label: "Approved",
      value: stats.totalApproved,
      icon: <Users className="w-5 h-5 text-blue-400" />,
      color: "text-blue-400",
    },
    {
      label: "Checked In",
      value: `${stats.totalCheckedIn} / ${stats.totalApproved}`,
      icon: <QrCode className="w-5 h-5 text-emerald-400" />,
      color: "text-emerald-400",
    },
    {
      label: "Revenue",
      value: `$${stats.revenue.toFixed(2)}`,
      icon: <DollarSign className="w-5 h-5 text-amber-400" />,
      color: "text-amber-400",
    },
    {
      label: "Attendance Rate",
      value: `${stats.attendanceRate}%`,
      icon: <TrendingUp className="w-5 h-5 text-indigo-400" />,
      color: "text-indigo-400",
    },
    {
      label: "Check-in Rate",
      value: `${stats.checkInRate}%`,
      icon: <CheckCircle className="w-5 h-5 text-primary" />,
      color: "text-primary",
    },
    {
      label: "Waitlisted",
      value: stats.totalWaitlisted,
      icon: <Clock className="w-5 h-5 text-slate-400" />,
      color: "text-slate-400",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl border-white/10 hover:bg-white/5"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h1 className="text-2xl font-black text-white tracking-tight">{event.name}</h1>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] font-black uppercase">
                {event.status}
              </Badge>
            </div>
            <p className="text-slate-500 text-sm font-medium">
              {new Date(event.dateTime).toLocaleDateString("en-US", {
                weekday: "long", year: "numeric", month: "long", day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {statCards.map((s, i) => (
            <div
              key={i}
              className="p-6 bg-slate-900/40 rounded-[2rem] border border-white/5 hover:border-primary/20 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-slate-800/50 rounded-xl flex items-center justify-center">
                  {s.icon}
                </div>
              </div>
              <p className={`text-2xl font-black tracking-tight mb-1 ${s.color}`}>{s.value}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Progress Bars */}
        <div className="p-8 bg-slate-900/40 rounded-[2rem] border border-white/5 space-y-6">
          <h2 className="text-lg font-black text-white tracking-tight">Capacity Overview</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                <span>Attendance Rate</span>
                <span>{stats.attendanceRate}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                  style={{ width: `${stats.attendanceRate}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                <span>Check-in Rate</span>
                <span>{stats.checkInRate}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                  style={{ width: `${stats.checkInRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Participants Table */}
        <div className="p-8 bg-slate-900/40 rounded-[2rem] border border-white/5">
          <h2 className="text-lg font-black text-white tracking-tight mb-6">Attendees</h2>
          {participants.length === 0 ? (
            <p className="text-slate-500 text-sm font-medium italic">No approved participants yet.</p>
          ) : (
            <div className="space-y-3">
              {participants.map((p: any) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-700 flex items-center justify-center font-black text-slate-300 text-sm overflow-hidden">
                      {p.profile?.profileImage ? (
                        <img src={p.profile.profileImage} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        p.name?.[0] || "U"
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-black text-white">{p.name}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{p.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-[10px] font-bold text-slate-600 hidden md:block">
                      Joined {new Date(p.joinedAt).toLocaleDateString()}
                    </p>
                    {p.checkedIn ? (
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[9px] font-black uppercase">
                        Checked In
                      </Badge>
                    ) : (
                      <Badge className="bg-slate-800/50 text-slate-500 border-white/5 text-[9px] font-black uppercase">
                        Not Checked In
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
