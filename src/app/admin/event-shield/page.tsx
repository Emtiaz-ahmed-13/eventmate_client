"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminServices } from "@/services/admin.service";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Ban,
  RefreshCw,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function EventShieldPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("all");

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

  const { data: events, isLoading } = useQuery({
    queryKey: ["admin-events"],
    queryFn: AdminServices.getAllEvents,
  });

  const securityAlerts = [
    {
      id: 1,
      type: "suspicious_activity",
      severity: "high",
      message: "Multiple failed login attempts detected",
      timestamp: "2024-03-17T10:30:00Z",
      status: "active"
    },
    {
      id: 2,
      type: "event_flagged",
      severity: "medium", 
      message: "Event reported by multiple users",
      timestamp: "2024-03-17T09:15:00Z",
      status: "investigating"
    },
    {
      id: 3,
      type: "payment_anomaly",
      severity: "low",
      message: "Unusual payment pattern detected",
      timestamp: "2024-03-17T08:45:00Z",
      status: "resolved"
    }
  ];

  const filteredAlerts = activeFilter === "all" 
    ? securityAlerts 
    : securityAlerts.filter(alert => alert.severity === activeFilter);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "text-red-500 bg-red-500/10 border-red-500/20";
      case "medium": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "low": return "text-green-500 bg-green-500/10 border-green-500/20";
      default: return "text-slate-500 bg-slate-500/10 border-slate-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "investigating": return <Eye className="w-4 h-4 text-yellow-500" />;
      case "resolved": return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <XCircle className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="bg-slate-900/40 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-3">
                <Shield className="w-8 h-8 text-red-500" />
                Event Shield
              </h1>
              <p className="text-slate-400 font-medium mt-2">Security monitoring and threat detection</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Badge variant="emerald" className="bg-red-500/20 text-red-500 border-none text-xs font-black tracking-[0.2em] px-4 py-2 uppercase">
                <AlertTriangle className="w-3 h-3 mr-2" />
                {securityAlerts.filter(a => a.status === 'active').length} Active Alerts
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Security Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <Card className="border border-white/5 shadow-premium bg-slate-900/40 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Active Threats</p>
                  <p className="text-3xl font-black text-red-500">
                    {securityAlerts.filter(a => a.status === 'active').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/5 shadow-premium bg-slate-900/40 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Investigating</p>
                  <p className="text-3xl font-black text-yellow-500">
                    {securityAlerts.filter(a => a.status === 'investigating').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/5 shadow-premium bg-slate-900/40 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Resolved</p>
                  <p className="text-3xl font-black text-green-500">
                    {securityAlerts.filter(a => a.status === 'resolved').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/5 shadow-premium bg-slate-900/40 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Total Events</p>
                  <p className="text-3xl font-black text-white">{events?.length || 0}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-8 p-2 bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/5">
          {[
            { id: "all", label: "All Alerts" },
            { id: "high", label: "High Priority" },
            { id: "medium", label: "Medium Priority" },
            { id: "low", label: "Low Priority" },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex-1 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all ${
                activeFilter === filter.id
                  ? "bg-primary text-slate-900 shadow-xl shadow-primary/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Security Alerts */}
        <Card className="border border-white/5 shadow-premium bg-slate-900/40 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-xl font-black text-white flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Security Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-slate-700 rounded-xl"></div>
                  </div>
                ))}
              </div>
            ) : filteredAlerts.length === 0 ? (
              <div className="text-center py-12">
                <Shield className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-black text-white mb-2">No Alerts</h3>
                <p className="text-slate-400">No security alerts match the current filter</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-white/5"
                  >
                    <div className="flex items-center gap-4">
                      {getStatusIcon(alert.status)}
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-black text-white">{alert.message}</h4>
                          <Badge className={`text-xs font-black tracking-[0.2em] px-2 py-1 uppercase border ${getSeverityColor(alert.severity)}`}>
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-400">
                          {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="border-white/10 text-white hover:bg-white/5">
                        <Eye className="w-4 h-4 mr-2" />
                        Investigate
                      </Button>
                      {alert.status === "active" && (
                        <Button variant="outline" size="sm" className="border-red-500/20 text-red-500 hover:bg-red-500/10">
                          <Ban className="w-4 h-4 mr-2" />
                          Block
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}