"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminServices } from "@/services/admin.service";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Search,
  MapPin,
  Users,
  DollarSign,
  Trash2,
  ArrowLeft,
  Filter,
  Clock,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function EventManagement() {
  const { user } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Check if user is admin
  if (user?.role !== "ADMIN") {
    router.push("/");
    return null;
  }

  const { data: events, isLoading } = useQuery({
    queryKey: ["admin-events", searchTerm, selectedStatus],
    queryFn: () => AdminServices.getAllEvents({ search: searchTerm, status: selectedStatus }),
  });

  const deleteEventMutation = useMutation({
    mutationFn: (eventId: string) => AdminServices.deleteEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast.success("Event deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete event");
    },
  });

  const handleDeleteEvent = (eventId: string, eventName: string) => {
    if (confirm(`Are you sure you want to delete "${eventName}"? This action cannot be undone.`)) {
      deleteEventMutation.mutate(eventId);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-500/20 text-green-400 border-green-500/20";
      case "CANCELLED":
        return "bg-red-500/20 text-red-400 border-red-500/20";
      case "COMPLETED":
        return "bg-blue-500/20 text-blue-400 border-blue-500/20";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/20";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
                <h1 className="text-4xl font-black text-white tracking-tighter">Event Management</h1>
                <p className="text-slate-400 font-medium mt-2">Monitor and manage all platform events</p>
              </div>
            </div>
            <Badge variant="emerald" className="bg-primary/20 text-primary border-none text-xs font-black tracking-[0.2em] px-4 py-2 uppercase">
              <Calendar className="w-3 h-3 mr-2" />
              {events?.length || 0} Events
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
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-white/5 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-slate-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-3 bg-slate-800/50 border border-white/5 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all"
                >
                  <option value="all">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events List */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="border border-white/5 shadow-premium bg-slate-900/40 backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-6 bg-slate-700 rounded mb-4"></div>
                    <div className="h-4 bg-slate-700 rounded mb-2"></div>
                    <div className="h-4 bg-slate-700 rounded mb-4"></div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-slate-700 rounded w-16"></div>
                      <div className="h-6 bg-slate-700 rounded w-16"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {events?.map((event: any) => (
              <Card key={event.id} className="border border-white/5 shadow-premium bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-white font-black text-lg mb-2 line-clamp-2">{event.name}</h3>
                      <p className="text-slate-400 text-sm mb-3 line-clamp-2">{event.description}</p>
                    </div>
                    <Badge className={`text-xs font-black uppercase tracking-[0.1em] ml-4 ${getStatusBadgeColor(event.status)}`}>
                      {event.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>{formatDate(event.dateTime)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Users className="w-4 h-4 text-primary" />
                      <span>{event.participants?.length || 0} / {event.maxParticipants} participants</span>
                    </div>
                    {event.joiningFee > 0 && (
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <DollarSign className="w-4 h-4 text-primary" />
                        <span>${event.joiningFee}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-500">
                      <span>Host: </span>
                      <span className="text-white font-medium">{event.host?.name || "Unknown"}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Link href={`/events/${event.id}`}>
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
                        onClick={() => handleDeleteEvent(event.id, event.name)}
                        disabled={deleteEventMutation.isPending}
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

        {events && events.length === 0 && (
          <Card className="border border-white/5 shadow-premium bg-slate-900/40 backdrop-blur-xl">
            <CardContent className="p-12 text-center">
              <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-black text-white mb-2">No Events Found</h3>
              <p className="text-slate-400">No events match your current filters</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}