"use client";

import { Button } from "@/components/ui/button";
import { EventServices } from "@/services/event.service";
import { useAuthStore } from "@/store/auth.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
   ArrowLeft,
   Calendar,
   Clock,
   DollarSign,
   Heart,
   Info,
   MapPin,
   Share2,
   ShieldCheck,
   Users,
   ChevronRight,
   Mail,
   Plus
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function EventDetails() {
   const { id } = useParams();
   const { user, isAuthenticated } = useAuthStore();
   const queryClient = useQueryClient();

   const { data: event, isLoading, error } = useQuery({
      queryKey: ["event", id],
      queryFn: () => EventServices.getEventById(id as string),
   });

   const joinMutation = useMutation({
      mutationFn: async () => {
         if (!event?.id) throw new Error("Event ID not found");
         return EventServices.joinEvent(event.id);
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["event", id] });
         queryClient.invalidateQueries({ queryKey: ["dashboard-events", user?.id] });
      },
      onError: (error: any) => {
         console.error("Failed to join event:", error);
         // You can add toast notification here
      },
   });

   const leaveMutation = useMutation({
      mutationFn: async () => {
         if (!event?.id) throw new Error("Event ID not found");
         return EventServices.leaveEvent(event.id);
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["event", id] });
         queryClient.invalidateQueries({ queryKey: ["dashboard-events", user?.id] });
      },
      onError: (error: any) => {
         console.error("Failed to leave event:", error);
         // You can add toast notification here
      },
   });

   if (isLoading) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
               <span className="text-xs font-black uppercase tracking-widest text-slate-400">Loading Experience...</span>
            </div>
         </div>
      );
   }

   if (!event) {
      return (
         <>
            <div className="min-h-screen flex items-center justify-center bg-background transform scale-x-[-1] blur-3xl opacity-20 -z-10 absolute inset-0" />
            <div className="min-h-screen flex items-center justify-center bg-background">
               <div className="text-center p-12 bg-slate-900/60 backdrop-blur-3xl rounded-[3rem] shadow-premium max-w-md border border-white/5">
                  <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/5">
                     <Info className="w-10 h-10 text-slate-500" />
                  </div>
                  <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">Null Point Detected</h2>
                  <p className="text-slate-400 mb-10 font-medium italic">This experience has been removed or archived from the ecosystem.</p>
                  <Link href="/events">
                     <Button variant="glow" size="lg" className="rounded-2xl px-10">Return to Nexus</Button>
                  </Link>
               </div>
            </div>
         </>
      );
   }

   const isHost = user?.id === event.hostId;
   const isParticipant = event.participants?.some((p: any) => p.userId === user?.id);
   const isEventFull = (event.participants?.length || 0) >= event.maxParticipants;

   return (
      <div className="min-h-screen bg-background pb-32">
         {/* Hero Header */}
         <div className="h-[500px] relative overflow-hidden">
            <div className="absolute inset-0 bg-slate-900 flex items-center justify-center text-slate-800 font-black text-4xl">
               {event.image ? (
                  <img src={event.image} alt={event.name} className="w-full h-full object-cover opacity-80" />
               ) : (
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center border-b border-primary/20">
                     <span className="text-primary/10 text-9xl uppercase tracking-[1em] select-none">{event.type}</span>
                  </div>
               )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
            
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl px-4 flex justify-between items-center z-10">
               <Link href="/events">
                  <Button variant="white" size="sm" className="bg-white/10 backdrop-blur-xl border-white/10 text-white hover:bg-white hover:text-slate-900 rounded-2xl gap-2 font-black uppercase tracking-widest text-[10px] group border">
                     <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                     Back to events
                  </Button>
               </Link>
               <div className="flex gap-4">
                  <Button variant="white" size="icon" className="bg-white/10 backdrop-blur-xl border-white/10 text-white rounded-2xl border"><Share2 className="w-4 h-4" /></Button>
                  <Button variant="white" size="icon" className="bg-white/10 backdrop-blur-xl border-white/10 text-red-400 rounded-2xl border"><Heart className="w-4 h-4" /></Button>
               </div>
            </div>

            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-full max-w-7xl px-4 z-10 text-white">
               <div className="flex items-center gap-4 mb-6">
                  <Badge variant="emerald" className="bg-primary/20 text-primary border-none text-[10px] font-black tracking-[0.2em] px-4 py-1.5 uppercase">
                     {event.type}
                  </Badge>
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-widest">
                     <Clock className="w-4 h-4 text-primary" />
                     <span>{new Date(event.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
               </div>
               <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-none max-w-4xl">{event.name}</h1>
               <div className="flex flex-wrap items-center gap-x-10 gap-y-4 text-sm font-black text-slate-300 uppercase tracking-widest">
                  <div className="flex items-center gap-3">
                     <Calendar className="w-5 h-5 text-primary" />
                     <span>{new Date(event.dateTime).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <MapPin className="w-5 h-5 text-primary" />
                     <span>{event.location}</span>
                  </div>
               </div>
            </div>
         </div>

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
            <div className="flex flex-col lg:flex-row gap-10">
               {/* Content Section */}
               <div className="flex-1 space-y-10">
                  <Card className="border border-white/5 shadow-premium bg-slate-900/40 backdrop-blur-xl p-2">
                     <CardHeader className="p-8 pb-4">
                        <CardTitle className="text-2xl font-black flex items-center gap-3 text-white">
                           <Info className="w-6 h-6 text-primary" />
                           Briefing
                        </CardTitle>
                        <CardDescription className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Information for participants</CardDescription>
                     </CardHeader>
                     <CardContent className="p-8 pt-4">
                        <div className="prose prose-invert max-w-none text-slate-300 leading-[1.8] font-medium text-lg italic bg-slate-800/30 p-8 rounded-[2rem] border border-white/5">
                           "{event.description}"
                        </div>
                     </CardContent>
                  </Card>

                  <Card className="border border-white/5 shadow-premium bg-slate-900/40 backdrop-blur-xl p-2">
                     <CardHeader className="p-8 pb-4">
                        <div className="flex justify-between items-center">
                           <div>
                              <CardTitle className="text-2xl font-black flex items-center gap-3 text-white">
                                 <Users className="w-6 h-6 text-primary" />
                                 Participants
                              </CardTitle>
                              <CardDescription className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Current event capacity</CardDescription>
                           </div>
                           <Badge variant="emerald" className="bg-primary/10 text-primary border-primary/20 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest">
                              {event.participants?.length || 0} / {event.maxParticipants} SECURED
                           </Badge>
                        </div>
                     </CardHeader>
                     <CardContent className="p-8 pt-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                           {event.participants?.map((participant: any, i: number) => (
                              <div key={participant.userId} className="bg-slate-800/40 border border-white/5 rounded-2xl p-4 flex flex-col items-center text-center group hover:bg-slate-800 hover:shadow-lg transition-all">
                                 <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/5 shadow-sm flex items-center justify-center font-black text-slate-400 mb-3 group-hover:text-primary transition-colors">
                                    {participant.user?.name?.[0] || "U"}
                                 </div>
                                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 truncate w-full">{participant.user?.name || `Member ${i + 1}`}</span>
                              </div>
                           ))}
                           {(event.participants?.length || 0) < event.maxParticipants && (
                              <div className="bg-transparent border-2 border-dashed border-white/5 rounded-2xl p-4 flex flex-col items-center text-center justify-center group hover:border-primary/20 transition-all cursor-pointer">
                                 <Plus className="w-6 h-6 text-slate-700 group-hover:text-primary transition-colors" />
                              </div>
                           )}
                        </div>
                     </CardContent>
                  </Card>
               </div>

               {/* Action Sidebar */}
               <aside className="w-full lg:w-96 space-y-6">
                  <Card className="border border-white/5 shadow-2xl bg-slate-900/60 backdrop-blur-xl sticky top-28 overflow-hidden">
                     <div className="h-2 bg-primary w-full shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
                     <CardContent className="p-10">
                        <div className="mb-10">
                           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 block mb-2">Access Fee</span>
                           <div className="text-5xl font-black text-white tracking-tighter flex items-center">
                              <span className="text-primary mr-2 text-3xl font-serif italic">$</span>
                              {event.joiningFee === 0 ? "Free" : event.joiningFee}
                           </div>
                        </div>

                        <div className="space-y-4 mb-10">
                           <div className="flex items-center gap-4 p-5 bg-slate-800/40 rounded-2xl border border-white/5">
                              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 shadow-sm flex items-center justify-center">
                                 <Calendar className="w-5 h-5 text-primary" />
                              </div>
                              <div className="flex flex-col">
                                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Experience Date</span>
                                 <span className="text-sm font-black text-white">{new Date(event.dateTime).toLocaleDateString()}</span>
                              </div>
                           </div>
                           <div className="flex items-center gap-4 p-5 bg-slate-800/40 rounded-2xl border border-white/5">
                              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 shadow-sm flex items-center justify-center">
                                 <MapPin className="w-5 h-5 text-primary" />
                              </div>
                              <div className="flex flex-col">
                                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Nexus Point</span>
                                 <span className="text-sm font-black text-white truncate max-w-[150px]">{event.location}</span>
                              </div>
                           </div>
                        </div>

                        {isAuthenticated ? (
                           isHost ? (
                              <div className="space-y-4">
                                 <Link href={`/dashboard`} className="block w-full">
                                    <Button className="w-full h-16 rounded-2xl font-black uppercase tracking-widest text-xs bg-white text-slate-950 shadow-xl shadow-white/5 hover:bg-slate-100 transition-all">Manage Experience</Button>
                                 </Link>
                                 <div className="flex items-center justify-center gap-2 text-slate-400 font-bold uppercase text-[9px] tracking-widest">
                                    <ShieldCheck className="w-3.5 h-3.5" /> Identity Verified: Host
                                 </div>
                              </div>
                           ) : isParticipant ? (
                              <div className="space-y-4">
                                 <Button
                                    onClick={() => leaveMutation.mutate()}
                                    disabled={leaveMutation.isPending}
                                    variant="ghost"
                                    className="w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-xs border-2 border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 transition-all"
                                 >
                                    {leaveMutation.isPending ? "Processing..." : "Leave Event"}
                                 </Button>
                                 <div className="flex items-center justify-center gap-2 text-primary font-bold uppercase text-[9px] tracking-widest">
                                    <ShieldCheck className="w-3.5 h-3.5" /> You're Registered
                                 </div>
                              </div>
                           ) : isEventFull ? (
                              <div className="space-y-4">
                                 <Button
                                    disabled
                                    className="w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-xs bg-slate-700 text-slate-500 cursor-not-allowed"
                                 >
                                    Event Full
                                 </Button>
                                 <div className="flex items-center justify-center gap-2 text-slate-400 font-bold uppercase text-[9px] tracking-widest">
                                    <Users className="w-3.5 h-3.5" /> Capacity Reached
                                 </div>
                              </div>
                           ) : (
                              <div className="space-y-4">
                                 <Button
                                    onClick={() => joinMutation.mutate()}
                                    disabled={joinMutation.isPending}
                                    variant="glow"
                                    className="w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                                 >
                                    {joinMutation.isPending ? "Joining..." : event.joiningFee > 0 ? `Join for $${event.joiningFee}` : "Join Free Event"}
                                 </Button>
                                 <div className="flex items-center justify-center gap-2 text-slate-400 font-bold uppercase text-[9px] tracking-widest">
                                    <ShieldCheck className="w-3.5 h-3.5" /> Secure Registration
                                 </div>
                              </div>
                           )
                        ) : (
                           <Link href="/login" className="block w-full">
                              <Button variant="glow" className="w-full h-16 rounded-2xl font-black uppercase tracking-widest text-xs">Authorize to Join</Button>
                           </Link>
                        )}

                        <div className="mt-12 pt-10 border-t border-white/5">
                           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-6">Experience Architect</span>
                           <div className="flex items-center gap-5">
                              <div className="w-16 h-16 rounded-2xl bg-white text-slate-900 flex items-center justify-center font-black text-2xl shadow-xl shadow-white/5">
                                 {event.host?.name?.[0] || "H"}
                              </div>
                              <div className="flex-1">
                                 <h4 className="font-black text-white text-lg leading-tight mb-1">{event.host?.name || "Premium Host"}</h4>
                                 <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                    <div className="px-1.5 py-0 rounded animate-pulse w-2 h-2 bg-primary shadow-[0_0_10px_rgba(16,185,129,1)]" />
                                    VERIFIED PRO
                                 </div>
                              </div>
                              <Button variant="ghost" size="icon" className="text-slate-200 hover:text-primary transition-colors">
                                 <Mail className="w-5 h-5" />
                              </Button>
                           </div>
                        </div>
                     </CardContent>
                  </Card>

                  <Card className="bg-slate-900 border-none p-8 text-white relative overflow-hidden group cursor-pointer">
                     <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                           <ShieldCheck className="w-6 h-6 text-primary" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-primary">Protocol Secured</span>
                        </div>
                        <h4 className="text-lg font-black mb-2 flex items-center justify-between">
                           Safety Guarantee <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                        </h4>
                        <p className="text-xs text-slate-500 font-bold leading-relaxed uppercase tracking-wider">Verified hosts and professional oversight for every ecosystem moment.</p>
                     </div>
                     <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[60px]" />
                  </Card>
               </aside>
            </div>
         </div>
      </div>
   );
}
