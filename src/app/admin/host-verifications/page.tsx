"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminServices } from "@/services/admin.service";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield, UserCheck, Clock, CheckCircle, XCircle, Star, Calendar, Mail,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function HostVerificationsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState("all");

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

  const { data: hosts = [], isLoading } = useQuery({
    queryKey: ["admin-pending-hosts"],
    queryFn: AdminServices.getPendingHosts,
  });

  const approveMutation = useMutation({
    mutationFn: (userId: string) => AdminServices.approveHost(userId),
    onSuccess: () => {
      toast.success("Host approved successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-pending-hosts"] });
    },
    onError: () => toast.error("Failed to approve host"),
  });

  const revokeMutation = useMutation({
    mutationFn: (userId: string) => AdminServices.revokeHost(userId),
    onSuccess: () => {
      toast.success("Host role revoked");
      queryClient.invalidateQueries({ queryKey: ["admin-pending-hosts"] });
    },
    onError: () => toast.error("Failed to revoke host"),
  });

  // isVerified=true means admin approved, false means pending review
  const filtered = hosts.filter((h: any) => {
    if (activeFilter === "verified") return h.isVerified;
    if (activeFilter === "pending") return !h.isVerified;
    return true;
  });

  const pendingCount = hosts.filter((h: any) => !h.isVerified).length;
  const verifiedCount = hosts.filter((h: any) => h.isVerified).length;

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="bg-slate-900/40 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-3">
                <UserCheck className="w-8 h-8 text-purple-500" />
                Host Verifications
              </h1>
              <p className="text-slate-400 font-medium mt-2">Review and manage host accounts</p>
            </div>
            <Badge className="bg-yellow-500/20 text-yellow-500 border-none text-xs font-black tracking-[0.2em] px-4 py-2 uppercase">
              <Clock className="w-3 h-3 mr-2" />
              {pendingCount} Unverified
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          {[
            { label: "Total Hosts", value: hosts.length, color: "text-white", icon: UserCheck, bg: "bg-blue-500/10", ic: "text-blue-500" },
            { label: "Verified", value: verifiedCount, color: "text-green-500", icon: CheckCircle, bg: "bg-green-500/10", ic: "text-green-500" },
            { label: "Pending", value: pendingCount, color: "text-yellow-500", icon: Clock, bg: "bg-yellow-500/10", ic: "text-yellow-500" },
          ].map((s) => (
            <Card key={s.label} className="border border-white/5 bg-slate-900/40 backdrop-blur-xl">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-2">{s.label}</p>
                  <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                </div>
                <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center`}>
                  <s.icon className={`w-6 h-6 ${s.ic}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-8 p-2 bg-slate-900/40 rounded-2xl border border-white/5">
          {[
            { id: "all", label: "All Hosts" },
            { id: "pending", label: "Unverified" },
            { id: "verified", label: "Verified" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`flex-1 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all ${
                activeFilter === f.id
                  ? "bg-primary text-slate-900 shadow-xl shadow-primary/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Host List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border border-white/5 bg-slate-900/40">
                <CardContent className="p-6 animate-pulse">
                  <div className="h-5 bg-slate-700 rounded mb-3 w-1/3" />
                  <div className="h-4 bg-slate-700 rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card className="border border-white/5 bg-slate-900/40">
            <CardContent className="p-12 text-center">
              <UserCheck className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-black text-white mb-2">No Hosts Found</h3>
              <p className="text-slate-400">No hosts match the current filter</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filtered.map((host: any) => {
              const avgRating = host.reviewsReceived?.length > 0
                ? (host.reviewsReceived.reduce((s: number, r: any) => s + r.rating, 0) / host.reviewsReceived.length).toFixed(1)
                : null;

              return (
                <Card key={host.id} className="border border-white/5 bg-slate-900/40 backdrop-blur-xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center font-black text-purple-400 text-lg">
                          {host.name?.[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-lg font-black text-white">{host.name}</h3>
                            <Badge className={`text-xs font-black px-2 py-0.5 border ${host.isVerified ? "text-green-500 bg-green-500/10 border-green-500/20" : "text-yellow-500 bg-yellow-500/10 border-yellow-500/20"}`}>
                              {host.isVerified ? <><CheckCircle className="w-3 h-3 mr-1 inline" />Verified</> : <><Clock className="w-3 h-3 mr-1 inline" />Unverified</>}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-5 text-xs text-slate-400">
                            <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{host.email}</span>
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{host.hostedEvents?.length || 0} events hosted</span>
                            {avgRating && <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400" />{avgRating} avg rating</span>}
                            <span className="text-slate-600">Joined {new Date(host.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {host.isVerified ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-xl font-black text-xs uppercase tracking-widest"
                            onClick={() => revokeMutation.mutate(host.id)}
                            disabled={revokeMutation.isPending}
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Revoke
                          </Button>
                        ) : (
                          <Button
                            variant="glow"
                            size="sm"
                            className="rounded-xl font-black text-xs uppercase tracking-widest"
                            onClick={() => approveMutation.mutate(host.id)}
                            disabled={approveMutation.isPending}
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verify
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
