"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminServices } from "@/services/admin.service";
import { EventServices } from "@/services/event.service";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  BarChart3,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function WaitlistPanel({ eventId }: { eventId: string }) {
  const { data: waitlist = [], isLoading } = useQuery({
    queryKey: ["waitlist", eventId],
    queryFn: () => EventServices.getEventWaitlist(eventId),
  });

  if (isLoading) {
    return (
      <div className="px-6 pb-4 text-xs text-slate-500 animate-pulse">
        Loading waitlist...
      </div>
    );
  }

  if (waitlist.length === 0) {
    return (
      <div className="px-6 pb-4 text-xs text-slate-500 italic">
        No one on waitlist.
      </div>
    );
  }

  return (
    <div className="px-6 pb-5 border-t border-white/5 pt-4">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">
        Waitlist ({waitlist.length})
      </p>
      <div className="space-y-2">
        {waitlist.map((w: any, i: number) => (
          <div
            key={w.userId}
            className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-xl border border-white/5"
          >
            <span className="text-xs font-black text-slate-500 w-5">
              #{i + 1}
            </span>
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
              {w.user?.name?.[0] || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-white truncate">
                {w.user?.name}
              </p>
              <p className="text-[10px] text-slate-500">{w.user?.email}</p>
            </div>
            <p className="text-[10px] text-slate-600">
              {new Date(w.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EventManagement() {
  const { user } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [expandedWaitlist, setExpandedWaitlist] = useState<string | null>(null);

  if (user?.role !== "ADMIN") {
    router.push("/");
    return null;
  }

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["admin-events", searchTerm, selectedStatus],
    queryFn: () =>
      AdminServices.getAllEvents({ search: searchTerm, status: selectedStatus }),
  });

  const deleteEventMutation = useMutation({
    mutationFn: (eventId: string) => AdminServices.deleteEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast.success("Event deleted successfully");
    },
    onError: () => toast.error("Failed to delete event"),
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-green-500/20 text-green-400 border-green-500/20";
      case "CANCELLED":
        return "bg-red-500/20 text-red-400 border-red-500/20";
      case "COMPLETED":
        return "bg-blue-500/20 text-blue-400 border-blue-500/20";
      case "FULL":
        return "bg-orange-500/20 text-orange-400 border-orange-500/20";
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
                <Button
                  variant="outline"
                  size="icon"
                  className="border-white/10 text-white hover:bg-white/5"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-4xl font-black text-white tracking-tighter">
                  Event Management
                </h1>
                <p className="text-slate-400 font-medium mt-2">
                  Monitor and manage all platform events
                </p>
              </div>
            </div>
            <Badge className="bg-primary/20 text-primary border-none text-xs font-black tracking-[0.2em] px-4 py-2 uppercase">
              <Calendar className="w-3 h-3 mr-2" />
              {events.length} Events
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <Card className="border border-white/5 bg-slate-900/40 backdrop-blur-xl mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-white/5 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary/40 placeholder:text-slate-500 text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-3 bg-slate-800/50 border border-white/5 rounded-xl text-white focus:outline-none text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="OPEN">Open</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="FULL">Full</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Event List */}
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
        ) : events.length === 0 ? (
          <Card className="border border-white/5 bg-slate-900/40">
            <CardContent className="p-12 text-center">
              <Calendar className="w-14 h-14 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-black text-white mb-2">
                No Events Found
              </h3>
              <p className="text-slate-400">
                No events match your current filters
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {events.map((ev: any) => (
              <Card
                key={ev.id}
                className="border border-white/5 bg-slate-900/40 backdrop-blur-xl overflow-hidden"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-base font-black text-white">
                          {ev.name}
                        </h3>
                        <Badge
                          className={`text-[10px] font-black uppercase tracking-widest border ${getStatusColor(ev.status)}`}
                        >
                          {ev.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(ev.dateTime).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {ev.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {ev.participants?.length || 0}/{ev.maxParticipants}
                        </span>
                        {ev.joiningFee > 0 && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />${ev.joiningFee}
                          </span>
                        )}
                        <span>
                          Host:{" "}
                          <span className="text-slate-300">{ev.host?.name}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
                      <Link href={`/events/${ev.id}/analytics`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-primary/20 text-primary hover:bg-primary/10 rounded-xl font-black text-xs"
                        >
                          <BarChart3 className="w-3 h-3 mr-1" />
                          Analytics
                        </Button>
                      </Link>
                      <Link href={`/events/${ev.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-blue-500/20 text-blue-400 hover:bg-blue-500/10 rounded-xl font-black text-xs"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-700 text-slate-400 hover:bg-white/5 rounded-xl font-black text-xs"
                        onClick={() =>
                          setExpandedWaitlist(
                            expandedWaitlist === ev.id ? null : ev.id
                          )
                        }
                      >
                        <Users className="w-3 h-3 mr-1" />
                        Waitlist
                        {expandedWaitlist === ev.id ? (
                          <ChevronUp className="w-3 h-3 ml-1" />
                        ) : (
                          <ChevronDown className="w-3 h-3 ml-1" />
                        )}
                      </Button>
                      <Button
                        onClick={() => {
                          if (confirm(`Delete "${ev.name}"?`))
                            deleteEventMutation.mutate(ev.id);
                        }}
                        disabled={deleteEventMutation.isPending}
                        variant="outline"
                        size="sm"
                        className="border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-xl"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
                {expandedWaitlist === ev.id && (
                  <WaitlistPanel eventId={ev.id} />
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
