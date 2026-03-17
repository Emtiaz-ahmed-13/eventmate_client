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
  Activity,
  User,
  Calendar,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Info,
  Download,
  RefreshCw,
  Search,
  Filter,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function SystemLogsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

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

  // Mock system logs - in real app this would come from backend
  const systemLogs = [
    {
      id: 1,
      type: "user_action",
      level: "info",
      message: "User john@example.com logged in successfully",
      timestamp: "2024-03-17T10:45:00Z",
      userId: "user_123",
      details: { ip: "192.168.1.100", userAgent: "Chrome/120.0" }
    },
    {
      id: 2,
      type: "event_action",
      level: "info",
      message: "New event 'Tech Conference 2024' created",
      timestamp: "2024-03-17T10:30:00Z",
      userId: "user_456",
      details: { eventId: "event_789", category: "Technology" }
    },
    {
      id: 3,
      type: "payment",
      level: "success",
      message: "Payment processed successfully for event registration",
      timestamp: "2024-03-17T10:15:00Z",
      userId: "user_789",
      details: { amount: 50.00, eventId: "event_123", paymentId: "pay_abc123" }
    },
    {
      id: 4,
      type: "security",
      level: "warning",
      message: "Multiple failed login attempts detected",
      timestamp: "2024-03-17T10:00:00Z",
      userId: "user_999",
      details: { attempts: 5, ip: "192.168.1.200", blocked: true }
    },
    {
      id: 5,
      type: "system",
      level: "error",
      message: "Database connection timeout",
      timestamp: "2024-03-17T09:45:00Z",
      userId: null,
      details: { service: "postgres", timeout: "30s", retries: 3 }
    },
    {
      id: 6,
      type: "admin_action",
      level: "info",
      message: "Admin user banned user account",
      timestamp: "2024-03-17T09:30:00Z",
      userId: "admin_001",
      details: { targetUserId: "user_555", reason: "Terms violation" }
    }
  ];

  const filteredLogs = systemLogs.filter(log => {
    const matchesFilter = activeFilter === "all" || log.type === activeFilter;
    const matchesSearch = searchTerm === "" || 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getLogIcon = (type: string) => {
    switch (type) {
      case "user_action": return <User className="w-4 h-4" />;
      case "event_action": return <Calendar className="w-4 h-4" />;
      case "payment": return <CreditCard className="w-4 h-4" />;
      case "security": return <Shield className="w-4 h-4" />;
      case "system": return <Activity className="w-4 h-4" />;
      case "admin_action": return <Shield className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error": return "text-red-500 bg-red-500/10 border-red-500/20";
      case "warning": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "success": return "text-green-500 bg-green-500/10 border-green-500/20";
      case "info": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      default: return "text-slate-500 bg-slate-500/10 border-slate-500/20";
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "error": return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "success": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "info": return <Info className="w-4 h-4 text-blue-500" />;
      default: return <Info className="w-4 h-4 text-slate-500" />;
    }
  };

  const logTypeCounts = {
    all: systemLogs.length,
    user_action: systemLogs.filter(l => l.type === 'user_action').length,
    event_action: systemLogs.filter(l => l.type === 'event_action').length,
    payment: systemLogs.filter(l => l.type === 'payment').length,
    security: systemLogs.filter(l => l.type === 'security').length,
    system: systemLogs.filter(l => l.type === 'system').length,
    admin_action: systemLogs.filter(l => l.type === 'admin_action').length,
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="bg-slate-900/40 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-3">
                <Activity className="w-8 h-8 text-blue-500" />
                System Logs
              </h1>
              <p className="text-slate-400 font-medium mt-2">Real-time system activity monitoring</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Badge variant="emerald" className="bg-blue-500/20 text-blue-500 border-none text-xs font-black tracking-[0.2em] px-4 py-2 uppercase">
                <Activity className="w-3 h-3 mr-2" />
                {systemLogs.length} Total Logs
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Log Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-10">
          <Card className="border border-white/5 shadow-premium bg-slate-900/40 backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="text-center">
                <User className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-1">User Actions</p>
                <p className="text-2xl font-black text-white">{logTypeCounts.user_action}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/5 shadow-premium bg-slate-900/40 backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="text-center">
                <Calendar className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Events</p>
                <p className="text-2xl font-black text-white">{logTypeCounts.event_action}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/5 shadow-premium bg-slate-900/40 backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="text-center">
                <CreditCard className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Payments</p>
                <p className="text-2xl font-black text-white">{logTypeCounts.payment}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/5 shadow-premium bg-slate-900/40 backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="text-center">
                <Shield className="w-6 h-6 text-red-500 mx-auto mb-2" />
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Security</p>
                <p className="text-2xl font-black text-white">{logTypeCounts.security}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/5 shadow-premium bg-slate-900/40 backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="text-center">
                <Activity className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-1">System</p>
                <p className="text-2xl font-black text-white">{logTypeCounts.system}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/5 shadow-premium bg-slate-900/40 backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="text-center">
                <Shield className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Admin</p>
                <p className="text-2xl font-black text-white">{logTypeCounts.admin_action}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>
          
          <div className="flex gap-2 p-2 bg-slate-900/40 backdrop-blur-xl rounded-xl border border-white/5">
            {[
              { id: "all", label: "All" },
              { id: "user_action", label: "Users" },
              { id: "event_action", label: "Events" },
              { id: "payment", label: "Payments" },
              { id: "security", label: "Security" },
              { id: "system", label: "System" },
              { id: "admin_action", label: "Admin" },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`py-2 px-4 rounded-lg font-black text-xs uppercase tracking-[0.2em] transition-all ${
                  activeFilter === filter.id
                    ? "bg-primary text-slate-900 shadow-xl shadow-primary/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* System Logs */}
        <Card className="border border-white/5 shadow-premium bg-slate-900/40 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-xl font-black text-white flex items-center gap-3">
              <Activity className="w-5 h-5 text-blue-500" />
              Activity Feed
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-black text-white mb-2">No Logs Found</h3>
                <p className="text-slate-400">No system logs match the current filter and search criteria</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-xl border border-white/5 hover:bg-slate-800/70 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="flex-shrink-0">
                        {getLogIcon(log.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-medium text-white truncate">{log.message}</h4>
                          <Badge className={`text-xs font-black tracking-[0.2em] px-2 py-1 uppercase border ${getLevelColor(log.level)}`}>
                            {log.level}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <span>{new Date(log.timestamp).toLocaleString()}</span>
                          <span className="capitalize">{log.type.replace('_', ' ')}</span>
                          {log.userId && <span>User: {log.userId}</span>}
                        </div>
                        {log.details && (
                          <div className="mt-2 text-xs text-slate-500">
                            {Object.entries(log.details).map(([key, value]) => (
                              <span key={key} className="mr-4">
                                {key}: {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {getLevelIcon(log.level)}
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