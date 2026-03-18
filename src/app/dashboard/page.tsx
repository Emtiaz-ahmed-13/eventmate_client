"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EventServices } from "@/services/event.service";
import { UserServices } from "@/services/user.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { toast } from "sonner";
import { 
  Users, 
  Calendar, 
  ShieldCheck, 
  ArrowUpRight, 
  Plus, 
  Search,
  Settings,
  Layers,
  BarChart3,
  Clock,
  MapPin,
  LayoutDashboard,
  ArrowRight,
  Edit,
  Trash2,
  XCircle,
  CheckCircle,
  UserX,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Copy,
  QrCode,
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  const deleteMutation = useMutation({
    mutationFn: (eventId: string) => EventServices.deleteEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-events", user?.id] });
      toast.success("Event deleted");
    },
    onError: () => toast.error("Failed to delete event"),
  });

  const cancelMutation = useMutation({
    mutationFn: (eventId: string) => EventServices.cancelEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-events", user?.id] });
      toast.success("Event cancelled");
    },
    onError: () => toast.error("Failed to cancel event"),
  });

  const approveMutation = useMutation({
    mutationFn: ({ eventId, userId }: { eventId: string; userId: string }) =>
      EventServices.approveParticipant(eventId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-events", user?.id] });
      toast.success("Participant approved");
    },
    onError: () => toast.error("Failed to approve participant"),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ eventId, userId }: { eventId: string; userId: string }) =>
      EventServices.rejectParticipant(eventId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-events", user?.id] });
      toast.success("Participant rejected");
    },
    onError: () => toast.error("Failed to reject participant"),
  });

  const duplicateMutation = useMutation({
    mutationFn: (eventId: string) => EventServices.duplicateEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-events", user?.id] });
      toast.success("Event duplicated successfully");
    },
    onError: () => toast.error("Failed to duplicate event"),
  });

  const checkInMutation = useMutation({
    mutationFn: ({ eventId, userId }: { eventId: string; userId: string }) =>
      EventServices.checkInParticipant(eventId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-events", user?.id] });
      toast.success("Checked in");
    },
    onError: () => toast.error("Check-in failed"),
  });

  const undoCheckInMutation = useMutation({
    mutationFn: ({ eventId, userId }: { eventId: string; userId: string }) =>
      EventServices.undoCheckIn(eventId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-events", user?.id] });
      toast.success("Check-in undone");
    },
    onError: () => toast.error("Failed to undo check-in"),
  });

  const { data: userEventsResponse, isLoading: isEventsLoading } = useQuery({
    queryKey: ["dashboard-events", user?.id],
    queryFn: () => UserServices.getUserEvents(user?.id as string),
    enabled: !!user?.id,
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });

  // Extract user events with proper fallback
  const userEvents = React.useMemo(() => {
    if (!userEventsResponse) return { joined: [], hosted: [] };
    
    // If response has the expected structure
    if (userEventsResponse.joined || userEventsResponse.hosted) {
      return {
        joined: Array.isArray(userEventsResponse.joined) ? userEventsResponse.joined : [],
        hosted: Array.isArray(userEventsResponse.hosted) ? userEventsResponse.hosted : [],
      };
    }
    
    return { joined: [], hosted: [] };
  }, [userEventsResponse]);

  const renderUserDashboard = () => (
    <div className="space-y-12">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <Badge variant="emerald" className="mb-4 px-4 py-1.5 text-xs font-bold tracking-widest uppercase bg-primary/5 shadow-sm border-white/5">
          <Users className="w-3 h-3 mr-2 text-primary fill-primary" />
          Participant Dashboard
        </Badge>
        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter">
          Welcome back, <span className="text-primary glow-emerald">{user?.name}</span>
        </h1>
        <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto">
          Your nexus activity center - track experiences and discover new adventures
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { 
            label: "Joined Events", 
            value: userEvents?.joined?.length || 0, 
            icon: <Calendar className="w-5 h-5 text-blue-400" />,
            description: "Active participations"
          },
          { 
            label: "Saved Events", 
            value: <Link href="/saved" className="hover:text-primary transition-colors">View →</Link>, 
            icon: <Bookmark className="w-5 h-5 text-emerald-400" />,
            description: "Bookmarked experiences"
          },
          { 
            label: "Past Experiences", 
            value: "0", 
            icon: <Clock className="w-5 h-5 text-slate-400" />,
            description: "Completed events"
          },
        ].map((stat, i) => (
          <div key={i} className="group p-8 bg-slate-900/40 backdrop-blur-3xl rounded-[2rem] border border-white/5 hover:border-primary/20 transition-all duration-300 hover:bg-slate-900/60">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-slate-800/50 rounded-xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                {stat.icon}
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-primary transition-colors" />
            </div>
            <h4 className="text-3xl font-black text-white tracking-tight mb-1">{stat.value}</h4>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            <p className="text-xs text-slate-600 font-medium">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Upcoming Events Section */}
      <div className="p-8 bg-slate-900/40 backdrop-blur-3xl rounded-[2rem] border border-white/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight mb-2">Upcoming Events</h2>
            <p className="text-slate-400 font-medium">Experiences you've secured a spot for</p>
          </div>
          <Link href="/events">
            <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 font-bold gap-2 group">
              Find more 
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Button>
          </Link>
        </div>

        {isEventsLoading ? (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="h-24 bg-slate-800/30 animate-pulse rounded-2xl border border-white/5" />
            ))}
          </div>
        ) : !userEvents?.joined || userEvents.joined.length === 0 ? (
          <div className="text-center py-16 bg-slate-800/20 rounded-[2rem] border border-white/5">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800/50 rounded-full mb-6">
              <Calendar className="w-8 h-8 text-slate-600" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">The nexus awaits</h4>
            <p className="text-slate-500 font-medium mb-6 max-w-xs mx-auto text-sm">
              You haven't joined any events yet. New experiences are added daily!
            </p>
            <Link href="/events">
              <Button variant="glow" className="rounded-xl px-8 font-black text-xs uppercase tracking-[0.3em]">
                Explore Events
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {userEvents.joined.map((event: any) => (
              <div key={event.id} className="group p-6 rounded-[2rem] bg-slate-800/30 border border-white/5 hover:border-primary/20 hover:bg-slate-800/50 transition-all flex flex-col md:flex-row md:items-center gap-6">
                <div className="w-16 h-16 rounded-xl bg-slate-800/50 flex items-center justify-center font-black text-primary overflow-hidden border border-white/5 shrink-0">
                  {event.image ? (
                    <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl">{event.type[0]}</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="emerald" className="uppercase tracking-widest text-[9px] font-black bg-primary/10 text-primary border-primary/20">
                      {event.type}
                    </Badge>
                    <Badge className="bg-slate-800/50 text-slate-400 border-white/5 uppercase tracking-widest text-[9px] font-bold">
                      CONFIRMED
                    </Badge>
                  </div>
                  <h4 className="font-black text-white text-lg mb-2 group-hover:text-primary transition-colors">
                    {event.name}
                  </h4>
                  <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> 
                      {new Date(event.dateTime).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> 
                      {event.location}
                    </span>
                  </div>
                </div>
                <Link href={`/events/${event.id}`}>
                  <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 rounded-xl font-black text-xs uppercase tracking-[0.3em] group">
                    Details 
                    <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderHostDashboard = () => (
    <div className="space-y-12">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <Badge variant="emerald" className="mb-4 px-4 py-1.5 text-xs font-bold tracking-widest uppercase bg-primary/5 shadow-sm border-white/5">
          <Layers className="w-3 h-3 mr-2 text-primary fill-primary" />
          Host Control Center
        </Badge>
        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter">
          Welcome, <span className="text-primary glow-emerald">Architect</span>
        </h1>
        <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto">
          Manage your events and track performance across the nexus
        </p>
      </div>

      {/* Create Event CTA */}
      <div className="p-8 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-[2rem] border border-primary/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight mb-2">Launch New Experience</h2>
            <p className="text-slate-400 font-medium">Create and manage events that shape the future</p>
          </div>
          <Link href="/events/create">
            <Button variant="glow" className="px-8 h-12 font-black text-xs uppercase tracking-[0.3em] rounded-xl shadow-xl">
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { 
            label: "Active Events", 
            value: userEvents?.hosted?.length || 0, 
            icon: <Layers className="w-5 h-5 text-indigo-400" />, 
            trend: "+2",
            description: "Currently hosting"
          },
          { 
            label: "Participants", 
            value: "0", 
            icon: <Users className="w-5 h-5 text-blue-400" />, 
            trend: "0",
            description: "Total attendees"
          },
          { 
            label: "Total Revenue", 
            value: "$0.00", 
            icon: <BarChart3 className="w-5 h-5 text-emerald-400" />, 
            trend: "$0",
            description: "Earnings to date"
          },
          { 
            label: "Host Rating", 
            value: "4.8", 
            icon: <ShieldCheck className="w-5 h-5 text-amber-400" />, 
            trend: "New",
            description: "Community score"
          },
        ].map((stat, i) => (
          <div key={i} className="group p-6 bg-slate-900/40 backdrop-blur-3xl rounded-[2rem] border border-white/5 hover:border-primary/20 transition-all duration-300 hover:bg-slate-900/60">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-slate-800/50 rounded-xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                {stat.icon}
              </div>
              <Badge className="bg-slate-800/50 text-slate-400 text-[10px] font-black border-white/5">
                {stat.trend}
              </Badge>
            </div>
            <h4 className="text-2xl font-black text-white tracking-tight mb-1">{stat.value}</h4>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            <p className="text-xs text-slate-600 font-medium">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Hosted Events Section */}
      <div className="p-8 bg-slate-900/40 backdrop-blur-3xl rounded-[2rem] border border-white/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight mb-2">Your Hosted Events</h2>
            <p className="text-slate-400 font-medium">Manage your current and upcoming events</p>
          </div>
          <div className="hidden md:block relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search your events..." 
              className="pl-11 pr-4 py-3 bg-slate-800/50 border border-white/5 rounded-xl text-sm w-72 focus:ring-2 focus:ring-primary/20 outline-none font-medium transition-all text-white placeholder:text-slate-600" 
            />
          </div>
        </div>

        {isEventsLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-slate-800/30 animate-pulse rounded-2xl border border-white/5" />
            ))}
          </div>
        ) : !userEvents?.hosted || userEvents.hosted.length === 0 ? (
          <div className="text-center py-16 bg-slate-800/20 rounded-[2rem] border border-white/5">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800/50 rounded-full mb-6">
              <Layers className="w-8 h-8 text-slate-600" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">No events currently being hosted</h4>
            <p className="text-slate-500 font-medium mb-6 text-sm">Start creating experiences that will shape the future</p>
            <Link href="/events/create">
              <Button variant="glow" className="rounded-xl px-8 font-black text-xs uppercase tracking-[0.3em]">
                Start Your Legacy
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {userEvents.hosted.map((event: any) => {
              const pendingParticipants = event.participants?.filter((p: any) => p.status === "PENDING") || [];
              const approvedParticipants = event.participants?.filter((p: any) => p.status === "APPROVED") || [];
              const isExpanded = expandedEvent === event.id;
              return (
                <div key={event.id} className="rounded-[2rem] bg-slate-800/30 border border-white/5 hover:border-primary/20 transition-all overflow-hidden">
                  <div className="p-6 flex flex-col md:flex-row md:items-center gap-6">
                    <div className="w-16 h-16 rounded-xl bg-slate-800/50 flex items-center justify-center font-black text-primary overflow-hidden border border-white/5 shrink-0">
                      {event.image ? (
                        <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl">{event.type[0]}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <Badge variant="emerald" className="uppercase tracking-widest text-[9px] font-black bg-primary/10 text-primary border-primary/20">
                          {event.type}
                        </Badge>
                        {event.status === "CANCELLED" ? (
                          <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-[9px] font-black uppercase">Cancelled</Badge>
                        ) : (
                          <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /> LIVE
                          </span>
                        )}
                        {pendingParticipants.length > 0 && (
                          <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 text-[9px] font-black uppercase">
                            {pendingParticipants.length} Pending
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-black text-white text-lg mb-2 leading-tight">{event.name}</h4>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">
                        <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" />{new Date(event.dateTime).toLocaleDateString()}</span>
                        <span className="flex items-center gap-2"><Users className="w-3.5 h-3.5" />{approvedParticipants.length}/{event.maxParticipants} Participants</span>
                        <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" />{event.location}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-xl border-white/10 hover:bg-primary/10 hover:border-primary/20 hover:text-primary"
                        onClick={() => setExpandedEvent(isExpanded ? null : event.id)}
                        title="Manage participants"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </Button>
                      <Link href={`/events/${event.id}/analytics`}>
                        <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-white/10 hover:bg-emerald-500/10 hover:border-emerald-500/20 hover:text-emerald-400" title="View analytics">
                          <BarChart3 className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-xl border-white/10 hover:bg-indigo-500/10 hover:border-indigo-500/20 hover:text-indigo-400"
                        title="Duplicate event"
                        onClick={() => { if (confirm("Duplicate this event?")) duplicateMutation.mutate(event.id); }}
                        disabled={duplicateMutation.isPending}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Link href={`/events/${event.id}/edit`}>
                        <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-white/10 hover:bg-blue-500/10 hover:border-blue-500/20 hover:text-blue-400" title="Edit event">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      {event.status !== "CANCELLED" && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 rounded-xl border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/10"
                          title="Cancel event"
                          onClick={() => { if (confirm("Cancel this event?")) cancelMutation.mutate(event.id); }}
                          disabled={cancelMutation.isPending}
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-xl border-red-500/20 text-red-400 hover:bg-red-500/10"
                        title="Delete event"
                        onClick={() => { if (confirm("Delete this event permanently?")) deleteMutation.mutate(event.id); }}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Link href={`/events/${event.id}`}>
                        <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 rounded-xl font-black text-xs uppercase tracking-[0.3em] group h-10">
                          View <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Participant Management Panel */}
                  {isExpanded && (
                    <div className="border-t border-white/5 p-6 bg-slate-900/40">
                      <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Participant Management</h5>
                      {event.participants?.length === 0 ? (
                        <p className="text-slate-500 text-sm font-medium italic">No participants yet.</p>
                      ) : (
                        <div className="space-y-3">
                          {event.participants?.map((p: any) => (
                            <div key={p.userId} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl border border-white/5">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-slate-700 flex items-center justify-center font-black text-slate-300 text-sm">
                                  {p.user?.name?.[0] || "U"}
                                </div>
                                <div>
                                  <p className="text-sm font-black text-white">{p.user?.name || "Unknown"}</p>
                                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{p.user?.email}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {p.status === "PENDING" ? (
                                  <>
                                    <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 text-[9px] font-black uppercase">Pending</Badge>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-8 rounded-xl border-primary/20 text-primary hover:bg-primary/10 font-black text-[10px] uppercase tracking-widest"
                                      onClick={() => approveMutation.mutate({ eventId: event.id, userId: p.userId })}
                                      disabled={approveMutation.isPending}
                                    >
                                      <CheckCircle className="w-3.5 h-3.5 mr-1" /> Approve
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-8 rounded-xl border-red-500/20 text-red-400 hover:bg-red-500/10 font-black text-[10px] uppercase tracking-widest"
                                      onClick={() => rejectMutation.mutate({ eventId: event.id, userId: p.userId })}
                                      disabled={rejectMutation.isPending}
                                    >
                                      <UserX className="w-3.5 h-3.5 mr-1" /> Reject
                                    </Button>
                                  </>
                                ) : p.status === "APPROVED" ? (
                                  <div className="flex items-center gap-2">
                                    <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] font-black uppercase">Approved</Badge>
                                    {p.checkedIn ? (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 rounded-xl border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 font-black text-[10px] uppercase tracking-widest"
                                        onClick={() => undoCheckInMutation.mutate({ eventId: event.id, userId: p.userId })}
                                        disabled={undoCheckInMutation.isPending}
                                      >
                                        <QrCode className="w-3.5 h-3.5 mr-1" /> Checked In
                                      </Button>
                                    ) : (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 rounded-xl border-slate-500/20 text-slate-400 hover:bg-slate-500/10 font-black text-[10px] uppercase tracking-widest"
                                        onClick={() => checkInMutation.mutate({ eventId: event.id, userId: p.userId })}
                                        disabled={checkInMutation.isPending}
                                      >
                                        <QrCode className="w-3.5 h-3.5 mr-1" /> Check In
                                      </Button>
                                    )}
                                  </div>
                                ) : (
                                  <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-[9px] font-black uppercase">Rejected</Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="space-y-12">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <Badge variant="emerald" className="mb-4 px-4 py-1.5 text-xs font-bold tracking-widest uppercase bg-primary/5 shadow-sm border-white/5">
          <LayoutDashboard className="w-3 h-3 mr-2 text-primary fill-primary" />
          System OS v2.4
        </Badge>
        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter">
          Ecosystem <span className="text-primary glow-emerald">Intelligence</span>
        </h1>
        <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto">
          Real-time surveillance and management of the EventMate global network
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { 
            label: "Total Network Users", 
            value: "1,280", 
            trend: "+5.2%", 
            icon: <Users className="w-6 h-6 text-blue-400" />,
            description: "Active participants"
          },
          { 
            label: "Host Verifications", 
            value: "12", 
            trend: "Priority", 
            icon: <ShieldCheck className="w-6 h-6 text-amber-400" />,
            description: "Pending approvals"
          },
          { 
            label: "Active Nodes", 
            value: "450", 
            trend: "+12.4%", 
            icon: <Layers className="w-6 h-6 text-emerald-400" />,
            description: "System events"
          },
        ].map((stat, i) => (
          <div key={i} className="group p-8 bg-slate-900/40 backdrop-blur-3xl rounded-[2rem] border border-white/5 hover:border-primary/20 transition-all duration-300 hover:bg-slate-900/60">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-slate-800/50 rounded-xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                {stat.icon}
              </div>
              <Badge className="bg-slate-800/50 text-slate-400 font-black uppercase text-[9px] tracking-widest border-white/5">
                {stat.trend}
              </Badge>
            </div>
            <h4 className="text-3xl font-black text-white tracking-tight mb-2">{stat.value}</h4>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            <p className="text-xs text-slate-600 font-medium">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Control Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Kernel Controls */}
        <div className="p-8 bg-slate-900/40 backdrop-blur-3xl rounded-[2rem] border border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-6 h-6 text-slate-400" />
            <h2 className="text-2xl font-black text-white tracking-tight">Kernel Controls</h2>
          </div>
          <p className="text-slate-400 font-medium mb-8">Direct interface with core platform entities</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: "Manage Users", path: "/admin/users", count: "1,280", icon: <Users className="w-5 h-5" /> },
              { name: "Verify Hosts", path: "/admin/hosts", count: "142", icon: <ShieldCheck className="w-5 h-5" /> },
              { name: "Event Shield", path: "/admin/events", count: "45", icon: <Calendar className="w-5 h-5" /> },
              { name: "System Logs", path: "/admin/logs", count: "890", icon: <BarChart3 className="w-5 h-5" /> },
            ].map((ctrl, i) => (
              <Link key={i} href={ctrl.path}>
                <div className="p-6 rounded-2xl bg-slate-800/30 border border-white/5 hover:border-primary/20 hover:bg-slate-800/50 transition-all cursor-pointer group flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-slate-800/50 rounded-xl flex items-center justify-center mb-4 text-slate-400 group-hover:text-primary group-hover:scale-110 transition-all">
                    {ctrl.icon}
                  </div>
                  <span className="font-black text-white uppercase tracking-widest text-xs mb-1 group-hover:text-primary transition-colors">
                    {ctrl.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">{ctrl.count} items</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Neural Health */}
        <div className="p-8 bg-slate-900/40 backdrop-blur-3xl rounded-[2rem] border border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-slate-400" />
            <h2 className="text-2xl font-black text-white tracking-tight">Neural Health</h2>
          </div>
          <p className="text-slate-400 font-medium mb-8">Real-time infrastructure diagnostic feed</p>
          
          <div className="space-y-6">
            {[
              { label: "Core Processing Load", value: 42, color: "bg-emerald-500", detail: "OPTIMAL" },
              { label: "Global Network Latency", value: 85, color: "bg-emerald-500", detail: "STABLE" },
              { label: "Satellite Node Storage", value: 68, color: "bg-blue-500", detail: "HEALTHY" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest mb-3">
                  <span className="text-slate-500">{stat.label}</span>
                  <div className="flex gap-3">
                    <span className="text-slate-400">{stat.detail}</span>
                    <span className="text-white">{stat.value}%</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-800/50 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className={`h-full ${stat.color} transition-all duration-1000 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]`} 
                    style={{ width: `${stat.value}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-primary/5 via-transparent to-transparent -z-10" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute top-1/2 -left-24 w-72 h-72 bg-primary/10 rounded-full blur-[80px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {!user ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="max-w-md w-full space-y-10 p-12 bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] shadow-premium border border-white/5 box-glow text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
                <ShieldCheck className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white tracking-tight mb-4">Access Restricted</h2>
                <p className="text-slate-400 text-sm font-medium mb-8">Please authenticate your account to enter the nexus dashboard.</p>
                <Link href="/login">
                  <Button variant="glow" className="w-full h-12 font-black text-xs uppercase tracking-[0.3em] rounded-2xl">
                    Initialize Session
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            {user.role === "ADMIN" ? renderAdminDashboard() : 
             user.role === "HOST" ? renderHostDashboard() : 
             renderUserDashboard()}
          </>
        )}
      </div>
    </div>
  );
}
