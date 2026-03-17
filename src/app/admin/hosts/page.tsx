"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminServices } from "@/services/admin.service";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  UserCheck,
  Search,
  Calendar,
  Users,
  Ban,
  Trash2,
  ArrowLeft,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function HostManagement() {
  const { user } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  // Check if user is admin
  if (user?.role !== "ADMIN") {
    router.push("/");
    return null;
  }

  const { data: hosts, isLoading } = useQuery({
    queryKey: ["admin-hosts", searchTerm],
    queryFn: () => AdminServices.getAllHosts({ search: searchTerm }),
  });

  const changeRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      AdminServices.changeUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-hosts"] });
      toast.success("Host role updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update host role");
    },
  });

  const banUserMutation = useMutation({
    mutationFn: (userId: string) => AdminServices.toggleUserBan(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-hosts"] });
      toast.success("Host status updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update host status");
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => AdminServices.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-hosts"] });
      toast.success("Host deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete host");
    },
  });

  const handleDemoteToUser = (userId: string) => {
    if (confirm("Are you sure you want to demote this host to a regular user?")) {
      changeRoleMutation.mutate({ userId, role: "USER" });
    }
  };

  const handleBanHost = (userId: string) => {
    if (confirm("Are you sure you want to toggle this host's ban status?")) {
      banUserMutation.mutate(userId);
    }
  };

  const handleDeleteHost = (userId: string) => {
    if (confirm("Are you sure you want to delete this host? This action cannot be undone.")) {
      deleteUserMutation.mutate(userId);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="bg-slate-900/40 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="outline" size="icon" className="border-white/10 text-white hover:bg-white/5">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-4xl font-black text-white tracking-tighter">Host Management</h1>
                <p className="text-slate-400 font-medium mt-2">Manage event hosts and their permissions</p>
              </div>
            </div>
            <Badge variant="emerald" className="bg-primary/20 text-primary border-none text-xs font-black tracking-[0.2em] px-4 py-2 uppercase">
              <UserCheck className="w-3 h-3 mr-2" />
              {hosts?.length || 0} Hosts
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search */}
        <Card className="border border-white/5 shadow-premium bg-slate-900/40 backdrop-blur-xl mb-8">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search hosts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-white/5 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-slate-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Hosts List */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="border border-white/5 shadow-premium bg-slate-900/40 backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-slate-700 rounded-xl"></div>
                      <div>
                        <div className="h-4 bg-slate-700 rounded w-32 mb-2"></div>
                        <div className="h-3 bg-slate-700 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="h-4 bg-slate-700 rounded mb-2"></div>
                    <div className="flex gap-2">
                      <div className="h-8 bg-slate-700 rounded w-16"></div>
                      <div className="h-8 bg-slate-700 rounded w-16"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {hosts?.map((host: any) => (
              <Card key={host.id} className="border border-white/5 shadow-premium bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center border border-white/5">
                        <span className="text-white font-black text-lg">
                          {host.name?.[0]?.toUpperCase() || "H"}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-white font-black text-lg">{host.name}</h3>
                        <p className="text-slate-400 text-sm">{host.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/20 text-xs font-black uppercase tracking-[0.1em]">
                            HOST
                          </Badge>
                          {host.isVerified ? (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/20 text-xs">
                              Verified
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/20 text-xs">
                              Unverified
                            </Badge>
                          )}
                          {host.isBanned && (
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/20 text-xs">
                              Banned
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Host Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-slate-800/30 rounded-xl border border-white/5">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
                        <Calendar className="w-3 h-3" />
                        Events
                      </div>
                      <div className="text-white font-black text-lg">{host.hostedEvents?.length || 0}</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
                        <Users className="w-3 h-3" />
                        Total Participants
                      </div>
                      <div className="text-white font-black text-lg">
                        {host.hostedEvents?.reduce((total: number, event: any) => 
                          total + (event.participants?.length || 0), 0) || 0}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-500">
                      <span>Joined: </span>
                      <span className="text-white font-medium">
                        {new Date(host.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Link href={`/profile/${host.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-blue-500/20 text-blue-400 hover:bg-blue-500/10 text-xs"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      </Link>
                      
                      <Button
                        onClick={() => handleDemoteToUser(host.id)}
                        disabled={changeRoleMutation.isPending}
                        variant="outline"
                        size="sm"
                        className="border-orange-500/20 text-orange-400 hover:bg-orange-500/10 text-xs"
                      >
                        <Users className="w-3 h-3 mr-1" />
                        Demote
                      </Button>
                      
                      <Button
                        onClick={() => handleBanHost(host.id)}
                        disabled={banUserMutation.isPending}
                        variant="outline"
                        size="sm"
                        className="border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/10"
                      >
                        <Ban className="w-3 h-3" />
                      </Button>
                      
                      <Button
                        onClick={() => handleDeleteHost(host.id)}
                        disabled={deleteUserMutation.isPending}
                        variant="outline"
                        size="sm"
                        className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {hosts && hosts.length === 0 && (
          <Card className="border border-white/5 shadow-premium bg-slate-900/40 backdrop-blur-xl">
            <CardContent className="p-12 text-center">
              <UserCheck className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-black text-white mb-2">No Hosts Found</h3>
              <p className="text-slate-400">No hosts match your current search</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}