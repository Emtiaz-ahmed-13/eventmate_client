"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminServices } from "@/services/admin.service";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Search,
  MoreVertical,
  Shield,
  Ban,
  Trash2,
  UserCheck,
  ArrowLeft,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function UserManagement() {
  const { user } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");

  // Check if user is admin
  if (user?.role !== "ADMIN") {
    router.push("/");
    return null;
  }

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users", searchTerm, selectedRole],
    queryFn: () => AdminServices.getAllUsers({ search: searchTerm, role: selectedRole }),
  });

  const changeRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      AdminServices.changeUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User role updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update user role");
    },
  });

  const banUserMutation = useMutation({
    mutationFn: (userId: string) => AdminServices.toggleUserBan(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User status updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update user status");
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => AdminServices.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete user");
    },
  });

  const handleRoleChange = (userId: string, newRole: string) => {
    if (confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      changeRoleMutation.mutate({ userId, role: newRole });
    }
  };

  const handleBanUser = (userId: string) => {
    if (confirm("Are you sure you want to toggle this user's ban status?")) {
      banUserMutation.mutate(userId);
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      deleteUserMutation.mutate(userId);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-500/20 text-red-400 border-red-500/20";
      case "HOST":
        return "bg-purple-500/20 text-purple-400 border-purple-500/20";
      case "USER":
        return "bg-blue-500/20 text-blue-400 border-blue-500/20";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/20";
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
                <h1 className="text-4xl font-black text-white tracking-tighter">User Management</h1>
                <p className="text-slate-400 font-medium mt-2">Manage users, roles, and permissions</p>
              </div>
            </div>
            <Badge variant="emerald" className="bg-primary/20 text-primary border-none text-xs font-black tracking-[0.2em] px-4 py-2 uppercase">
              <Users className="w-3 h-3 mr-2" />
              {users?.length || 0} Users
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <Card className="border border-white/5 shadow-premium bg-slate-900/40 backdrop-blur-xl mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-white/5 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-slate-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="px-4 py-3 bg-slate-800/50 border border-white/5 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all"
                >
                  <option value="all">All Roles</option>
                  <option value="USER">Users</option>
                  <option value="HOST">Hosts</option>
                  <option value="ADMIN">Admins</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="border border-white/5 shadow-premium bg-slate-900/40 backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="animate-pulse flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-700 rounded-xl"></div>
                      <div>
                        <div className="h-4 bg-slate-700 rounded w-32 mb-2"></div>
                        <div className="h-3 bg-slate-700 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-8 bg-slate-700 rounded w-16"></div>
                      <div className="h-8 bg-slate-700 rounded w-8"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {users?.map((userData: any) => (
              <Card key={userData.id} className="border border-white/5 shadow-premium bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center border border-white/5">
                        <span className="text-white font-black text-lg">
                          {userData.name?.[0]?.toUpperCase() || "U"}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-white font-black text-lg">{userData.name}</h3>
                        <p className="text-slate-400 text-sm">{userData.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={`text-xs font-black uppercase tracking-[0.1em] ${getRoleBadgeColor(userData.role)}`}>
                            {userData.role}
                          </Badge>
                          {userData.isVerified ? (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/20 text-xs">
                              Verified
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/20 text-xs">
                              Unverified
                            </Badge>
                          )}
                          {userData.isBanned && (
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/20 text-xs">
                              Banned
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {/* Role Change Buttons */}
                      {userData.role !== "ADMIN" && (
                        <div className="flex gap-1">
                          {userData.role !== "HOST" && (
                            <Button
                              onClick={() => handleRoleChange(userData.id, "HOST")}
                              disabled={changeRoleMutation.isPending}
                              variant="outline"
                              size="sm"
                              className="border-purple-500/20 text-purple-400 hover:bg-purple-500/10 text-xs"
                            >
                              <UserCheck className="w-3 h-3 mr-1" />
                              Make Host
                            </Button>
                          )}
                          {userData.role !== "USER" && (
                            <Button
                              onClick={() => handleRoleChange(userData.id, "USER")}
                              disabled={changeRoleMutation.isPending}
                              variant="outline"
                              size="sm"
                              className="border-blue-500/20 text-blue-400 hover:bg-blue-500/10 text-xs"
                            >
                              <Users className="w-3 h-3 mr-1" />
                              Make User
                            </Button>
                          )}
                        </div>
                      )}
                      
                      {/* Action Buttons */}
                      <Button
                        onClick={() => handleBanUser(userData.id)}
                        disabled={banUserMutation.isPending}
                        variant="outline"
                        size="sm"
                        className="border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/10"
                      >
                        <Ban className="w-3 h-3 mr-1" />
                        {userData.isBanned ? "Unban" : "Ban"}
                      </Button>
                      
                      <Button
                        onClick={() => handleDeleteUser(userData.id)}
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

        {users && users.length === 0 && (
          <Card className="border border-white/5 shadow-premium bg-slate-900/40 backdrop-blur-xl">
            <CardContent className="p-12 text-center">
              <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-black text-white mb-2">No Users Found</h3>
              <p className="text-slate-400">No users match your current filters</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}