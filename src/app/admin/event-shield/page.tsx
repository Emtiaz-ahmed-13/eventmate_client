"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminServices } from "@/services/admin.service";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield, AlertTriangle, CheckCircle, XCircle, Eye, Trash2, RefreshCw, Users, Calendar, MapPin,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

type FlagReason = "cancelled" | "empty" | "overdue" | "ok";

function flagEvent(event: any): { reason: FlagReason; label: string; color: string } {
  if (event.status === "CANCELLED") {
    return { reason: "cancelled", label: "Cancelled", color: "text-red-400 bg-red-500/10 border-red-500/20" };
  }
  const now = new Date();
  const eventDate = new Date(event.dateTime);
  const isPast = eventDate < now;
  if (isPast && event.status === "OPEN") {
    return { reason: "overdue", label: "Overdue", color: "text-orange-400 bg-orange-500/10 border-orange-500/20" };
  }
  const participantCount = event.participants?.length || 0;
  if (participantCount === 0 && !isPast) {
    return { reason: "empty", label: "No Participants", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" };
  }
  return { reason: "ok", label: "Healthy", color: "text-green-400 bg-green-500/10 border-green-500/20" };
}

export default function EventShieldPage() {
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState("flagged");

  const { data: events = [], isLoading, refetch } = useQuery({
    queryKey: ["admin-events-shield"],
    queryFn: AdminServices.getAllEvents,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => AdminServices.deleteEvent(id),
    onSuccess: () => {
      toast.success("Event deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-events-shield"] });
    },
    onError: () => toast.error("Failed to delete event"),
  });

  const flagged = events.filter((e: any) => flagEvent(e).reason !== "ok");
  const cancelled = events.filter((e: any) => flagEvent(e).reason === "cancelled");
  const overdue = events.filter((e: any) => flagEvent(e).reason === "overdue");
  const empty = events.filter((e: any) => flagEvent(e).reason === "empty");

  const displayed = activeFilter === "flagged"
    ? flagged
    : activeFilter === "cancelled"
    ? cancelled
    : activeFilter === "overdue"
    ? overdue
    : activeFilter === "empty"
    ? empty
    : events;

  return (
    <div className="max-w-7xl mx-auto">
      <AdminPageHeader
        title="Event Shield"
        description="Monitor and moderate platform events"
        actions={
          <>
            <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 rounded-xl font-black text-xs uppercase tracking-widest" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Badge className="bg-red-500/20 text-red-400 border-none text-xs font-black px-4 py-2 uppercase tracking-widest">
              <AlertTriangle className="w-3 h-3 mr-2" />
              {flagged.length} Flagged
            </Badge>
          </>
        }
      />
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Total Events", value: events.length, color: "text-white", bg: "bg-blue-500/10", ic: "text-blue-400", Icon: Shield },
            { label: "Flagged", value: flagged.length, color: "text-red-400", bg: "bg-red-500/10", ic: "text-red-400", Icon: AlertTriangle },
            { label: "Overdue", value: overdue.length, color: "text-orange-400", bg: "bg-orange-500/10", ic: "text-orange-400", Icon: Calendar },
            { label: "No Participants", value: empty.length, color: "text-yellow-400", bg: "bg-yellow-500/10", ic: "text-yellow-400", Icon: Users },
          ].map((s) => (
            <Card key={s.label} className="border border-white/5 bg-slate-900/40 backdrop-blur-xl">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-2">{s.label}</p>
                  <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                </div>
                <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center`}>
                  <s.Icon className={`w-6 h-6 ${s.ic}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-8 p-2 bg-slate-900/40 rounded-2xl border border-white/5">
          {[
            { id: "flagged", label: `Flagged (${flagged.length})` },
            { id: "cancelled", label: `Cancelled (${cancelled.length})` },
            { id: "overdue", label: `Overdue (${overdue.length})` },
            { id: "empty", label: `Empty (${empty.length})` },
            { id: "all", label: `All (${events.length})` },
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

        {/* Events */}
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
        ) : displayed.length === 0 ? (
          <Card className="border border-white/5 bg-slate-900/40">
            <CardContent className="p-16 text-center">
              <CheckCircle className="w-14 h-14 text-green-500/40 mx-auto mb-4" />
              <h3 className="text-xl font-black text-white mb-2">All Clear</h3>
              <p className="text-slate-400 text-sm">No events match this filter.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {displayed.map((event: any) => {
              const flag = flagEvent(event);
              return (
                <Card key={event.id} className="border border-white/5 bg-slate-900/40 backdrop-blur-xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center font-black text-slate-400 flex-shrink-0">
                          {event.name?.[0]}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-3 mb-1 flex-wrap">
                            <h3 className="text-base font-black text-white truncate">{event.name}</h3>
                            <Badge className={`text-[10px] font-black px-2 py-0.5 border uppercase tracking-widest ${flag.color}`}>
                              {flag.label}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-5 text-xs text-slate-500 flex-wrap">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(event.dateTime).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location}</span>
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{event.participants?.length || 0}/{event.maxParticipants}</span>
                            <span>Host: <span className="text-slate-300">{event.host?.name}</span></span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                        <Link href={`/events/${event.id}`}>
                          <Button variant="outline" size="sm" className="border-white/10 text-slate-300 hover:bg-white/5 rounded-xl font-black text-xs">
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-xl font-black text-xs"
                          onClick={() => {
                            if (confirm(`Delete "${event.name}"?`)) deleteMutation.mutate(event.id);
                          }}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
    </div>
  );
}
