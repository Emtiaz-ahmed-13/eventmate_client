"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { EventServices } from "@/services/event.service";
import { PaymentServices } from "@/services/payment.service";
import { ReviewServices } from "@/services/review.service";
import { useAuthStore } from "@/store/auth.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
   ArrowLeft,
   Calendar,
   Clock,
   Info,
   MapPin,
   Share2,
   ShieldCheck,
   Users,
   Mail,
   Plus,
   X,
   Bookmark,
   BookmarkCheck,
   Star
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import StripeProvider from "@/components/providers/StripeProvider";
import PaymentForm from "@/components/PaymentForm";

export default function EventDetails() {
   const { id } = useParams();
   const { user, isAuthenticated } = useAuthStore();
   const queryClient = useQueryClient();
   const [showPaymentModal, setShowPaymentModal] = useState(false);
   const [clientSecret, setClientSecret] = useState<string | null>(null);
   const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
   const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
   const [showReviewForm, setShowReviewForm] = useState(false);

   const { data: event, isLoading, error } = useQuery({
      queryKey: ["event", id],
      queryFn: () => EventServices.getEventById(id as string),
   });

   const joinMutation = useMutation({
      mutationFn: async () => {
         if (!event?.id) throw new Error("Event ID not found");
         return EventServices.joinEvent(event.id);
      },
      onSuccess: (data) => {
         queryClient.invalidateQueries({ queryKey: ["event", id] });
         queryClient.invalidateQueries({ queryKey: ["dashboard-events", user?.id] });
         
         if (event?.approvalRequired) {
            toast.success("Join request sent! Waiting for host approval.");
         } else {
            toast.success("Successfully joined the event!");
         }
         setShowPaymentModal(false);
         setClientSecret(null);
         setPaymentIntentId(null);
      },
      onError: (error: any) => {
         console.error("Failed to join event:", error);
         toast.error(error.response?.data?.message || "Failed to join event");
      },
   });

   const createPaymentIntentMutation = useMutation({
      mutationFn: async () => {
         if (!event?.id) throw new Error("Event ID not found");
         return PaymentServices.createPaymentIntent(event.id, event.joiningFee);
      },
      onSuccess: (data) => {
         setClientSecret(data.clientSecret);
         setPaymentIntentId(data.paymentIntentId);
      },
      onError: (error: any) => {
         console.error("Failed to create payment intent:", error);
         toast.error(error.response?.data?.message || "Failed to initialize payment");
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
         toast.success("Left the event successfully");
      },
      onError: (error: any) => {
         console.error("Failed to leave event:", error);
         toast.error("Failed to leave event");
      },
   });

   const saveMutation = useMutation({
      mutationFn: async () => {
         if (!event?.id) throw new Error("Event ID not found");
         return EventServices.saveEvent(event.id);
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["event", id] });
         toast.success("Event saved!");
      },
      onError: (error: any) => {
         console.error("Failed to save event:", error);
         toast.error("Failed to save event");
      },
   });

   const unsaveMutation = useMutation({
      mutationFn: async () => {
         if (!event?.id) throw new Error("Event ID not found");
         return EventServices.unsaveEvent(event.id);
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["event", id] });
         toast.success("Event removed from saved");
      },
      onError: (error: any) => {
         console.error("Failed to unsave event:", error);
         toast.error("Failed to unsave event");
      },
   });

   const reviewMutation = useMutation({
      mutationFn: (data: { rating: number; comment: string }) => {
         if (!event?.hostId || !event?.id) throw new Error("Event data not loaded");
         return ReviewServices.createReview({
            hostId: event.hostId,
            eventId: event.id,
            rating: data.rating,
            comment: data.comment,
         });
      },
      onSuccess: () => {
         toast.success("Review submitted!");
         setShowReviewForm(false);
         setReviewForm({ rating: 5, comment: "" });
      },
      onError: (error: any) => {
         toast.error(error.response?.data?.message || "Failed to submit review");
      },
   });

   const handleJoinClick = () => {
      const fee = Number(event?.joiningFee ?? 0);
      if (fee > 0) {
         setShowPaymentModal(true);
         createPaymentIntentMutation.mutate();
      } else {
         joinMutation.mutate();
      }
   };

   const handlePaymentSuccess = () => {
      // confirmPayment already added participant in DB — just refresh UI
      queryClient.invalidateQueries({ queryKey: ["event", id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-events", user?.id] });
      setShowPaymentModal(false);
      setClientSecret(null);
      setPaymentIntentId(null);
      toast.success("Payment successful! You've joined the event.");
   };

   const handlePaymentError = (error: string) => {
      toast.error(error);
      setShowPaymentModal(false);
      setClientSecret(null);
      setPaymentIntentId(null);
   };

   const handleClosePaymentModal = () => {
      setShowPaymentModal(false);
      setClientSecret(null);
      setPaymentIntentId(null);
   };

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
         <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center p-12 bg-slate-900/60 backdrop-blur-3xl rounded-[3rem] shadow-premium max-w-md border border-white/5">
               <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/5">
                  <Info className="w-10 h-10 text-slate-500" />
               </div>
               <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">Event Not Found</h2>
               <p className="text-slate-400 mb-10 font-medium italic">This event has been removed or archived.</p>
               <Link href="/events">
                  <Button variant="glow" size="lg" className="rounded-2xl px-10">Return to Events</Button>
               </Link>
            </div>
         </div>
      );
   }

   const isHost = user?.id === event.hostId;
   const isParticipant = event.participants?.some((p: any) => p.userId === user?.id);
   const isSaved = event.savedBy?.some((s: any) => s.userId === user?.id);
   const isEventFull = (event.participants?.length || 0) >= event.maxParticipants;
   const participantStatus = event.participants?.find((p: any) => p.userId === user?.id)?.status;

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
                  <Button variant="outline" size="sm" className="bg-white/10 backdrop-blur-xl border-white/10 text-white hover:bg-white hover:text-slate-900 rounded-2xl gap-2 font-black uppercase tracking-widest text-[10px] group border">
                     <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                     Back to events
                  </Button>
               </Link>
               <div className="flex gap-4">
                  <Button
                     variant="outline"
                     size="icon"
                     className="bg-white/10 backdrop-blur-xl border-white/10 text-white rounded-2xl border"
                     onClick={async () => {
                        const url = window.location.href;
                        if (navigator.share) {
                           try {
                              await navigator.share({ title: event.name, text: event.description, url });
                           } catch {}
                        } else {
                           await navigator.clipboard.writeText(url);
                           toast.success("Link copied to clipboard!");
                        }
                     }}
                  >
                     <Share2 className="w-4 h-4" />
                  </Button>
                  {isAuthenticated && (
                     <Button 
                        variant="outline" 
                        size="icon" 
                        className="bg-white/10 backdrop-blur-xl border-white/10 text-white rounded-2xl border"
                        onClick={() => isSaved ? unsaveMutation.mutate() : saveMutation.mutate()}
                        disabled={saveMutation.isPending || unsaveMutation.isPending}
                     >
                        {isSaved ? <BookmarkCheck className="w-4 h-4 text-primary" /> : <Bookmark className="w-4 h-4" />}
                     </Button>
                  )}
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
                           Event Details
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

                  {/* Review Form — shown to approved participants */}
                  {isAuthenticated && !isHost && participantStatus === "APPROVED" && (
                     <Card className="border border-white/5 shadow-premium bg-slate-900/40 backdrop-blur-xl p-2">
                        <CardHeader className="p-8 pb-4">
                           <CardTitle className="text-2xl font-black flex items-center gap-3 text-white">
                              <Star className="w-6 h-6 text-primary" />
                              Leave a Review
                           </CardTitle>
                           <CardDescription className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Rate your experience with the host</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-4">
                           {!showReviewForm ? (
                              <Button
                                 variant="outline"
                                 className="border-primary/20 text-primary hover:bg-primary/10 rounded-2xl font-black uppercase tracking-widest text-xs"
                                 onClick={() => setShowReviewForm(true)}
                              >
                                 <Star className="w-4 h-4 mr-2" />
                                 Write a Review
                              </Button>
                           ) : (
                              <div className="space-y-6">
                                 <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 block">Rating</label>
                                    <div className="flex gap-2">
                                       {[1, 2, 3, 4, 5].map((star) => (
                                          <button key={star} onClick={() => setReviewForm((p) => ({ ...p, rating: star }))} className="transition-transform hover:scale-110">
                                             <Star className={`w-8 h-8 ${star <= reviewForm.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-700"}`} />
                                          </button>
                                       ))}
                                    </div>
                                 </div>
                                 <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 block">Comment</label>
                                    <textarea
                                       value={reviewForm.comment}
                                       onChange={(e) => setReviewForm((p) => ({ ...p, comment: e.target.value }))}
                                       className="w-full h-28 px-5 py-4 bg-slate-800/40 border border-white/5 rounded-2xl text-white text-sm focus:border-primary/30 focus:outline-none placeholder:text-slate-600 font-medium resize-none"
                                       placeholder="Share your experience..."
                                    />
                                 </div>
                                 <div className="flex gap-3">
                                    <Button
                                       variant="glow"
                                       className="rounded-2xl font-black uppercase tracking-widest text-xs px-8"
                                       onClick={() => reviewMutation.mutate(reviewForm)}
                                       disabled={reviewMutation.isPending}
                                    >
                                       {reviewMutation.isPending ? "Submitting..." : "Submit Review"}
                                    </Button>
                                    <Button
                                       variant="outline"
                                       className="rounded-2xl font-black uppercase tracking-widest text-xs border-white/10 text-white hover:bg-white/5"
                                       onClick={() => setShowReviewForm(false)}
                                    >
                                       Cancel
                                    </Button>
                                 </div>
                              </div>
                           )}
                        </CardContent>
                     </Card>
                  )}
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
                                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Location</span>
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
                                 {participantStatus === 'PENDING' ? (
                                    <div className="space-y-4">
                                       <Button
                                          disabled
                                          className="w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/20"
                                       >
                                          Awaiting Approval
                                       </Button>
                                       <Button
                                          onClick={() => leaveMutation.mutate()}
                                          disabled={leaveMutation.isPending}
                                          variant="outline"
                                          className="w-full h-12 rounded-xl font-black uppercase tracking-[0.2em] text-xs border border-red-500/20 text-red-400 hover:bg-red-500/10"
                                       >
                                          Cancel Request
                                       </Button>
                                    </div>
                                 ) : participantStatus === 'APPROVED' ? (
                                    <div className="space-y-4">
                                       <Button
                                          onClick={() => leaveMutation.mutate()}
                                          disabled={leaveMutation.isPending}
                                          variant="outline"
                                          className="w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-xs border-2 border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 transition-all"
                                       >
                                          {leaveMutation.isPending ? "Processing..." : "Leave Event"}
                                       </Button>
                                       <div className="flex items-center justify-center gap-2 text-primary font-bold uppercase text-[9px] tracking-widest">
                                          <ShieldCheck className="w-3.5 h-3.5" /> You're Registered
                                       </div>
                                    </div>
                                 ) : (
                                    <div className="space-y-4">
                                       <Button
                                          disabled
                                          className="w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-xs bg-red-500/20 text-red-400 border border-red-500/20"
                                       >
                                          Request Rejected
                                       </Button>
                                       <div className="flex items-center justify-center gap-2 text-red-400 font-bold uppercase text-[9px] tracking-widest">
                                          <X className="w-3.5 h-3.5" /> Access Denied
                                       </div>
                                    </div>
                                 )}
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
                                    onClick={handleJoinClick}
                                    disabled={joinMutation.isPending || createPaymentIntentMutation.isPending}
                                    variant="glow"
                                    className="w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                                 >
                                    {joinMutation.isPending || createPaymentIntentMutation.isPending ? "Processing..." : 
                                     event.joiningFee > 0 ? `Join for $${event.joiningFee}` : 
                                     event.approvalRequired ? "Request to Join" : "Join Free Event"}
                                 </Button>
                                 <div className="flex items-center justify-center gap-2 text-slate-400 font-bold uppercase text-[9px] tracking-widest">
                                    <ShieldCheck className="w-3.5 h-3.5" /> 
                                    {event.approvalRequired ? "Host Approval Required" : "Secure Registration"}
                                 </div>
                              </div>
                           )
                        ) : (
                           <Link href="/login" className="block w-full">
                              <Button variant="glow" className="w-full h-16 rounded-2xl font-black uppercase tracking-widest text-xs">Authorize to Join</Button>
                           </Link>
                        )}

                        <div className="mt-12 pt-10 border-t border-white/5">
                           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-6">Experience Host</span>
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
                              <Button variant="outline" size="icon" className="text-slate-200 hover:text-primary transition-colors border-white/10">
                                 <Mail className="w-5 h-5" />
                              </Button>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               </aside>
            </div>
         </div>

         {/* Payment Modal */}
         {showPaymentModal && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
               <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden my-auto">
                  
                  {/* Header */}
                  <div className="h-1.5 w-full bg-gradient-to-r from-primary via-primary/60 to-transparent" />
                  <div className="flex items-center justify-between px-8 pt-7 pb-5 border-b border-white/5">
                     <div>
                        <h3 className="text-xl font-black text-white tracking-tight">Complete Payment</h3>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-0.5">Secure checkout</p>
                     </div>
                     <button
                        onClick={handleClosePaymentModal}
                        className="w-9 h-9 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                     >
                        <X className="w-4 h-4" />
                     </button>
                  </div>

                  {/* Event Info */}
                  <div className="px-8 py-5 border-b border-white/5 flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-lg flex-shrink-0">
                        {event?.type?.[0]}
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="text-white font-black text-sm truncate">{event?.name}</p>
                        <p className="text-slate-500 text-xs mt-0.5">{new Date(event?.dateTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                     </div>
                     <div className="text-right flex-shrink-0">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fee</p>
                        <p className="text-2xl font-black text-primary">${event?.joiningFee}</p>
                     </div>
                  </div>

                  {/* Body */}
                  <div className="px-8 py-6">
                     {event?.approvalRequired && (
                        <div className="mb-5 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-center gap-3">
                           <span className="text-lg">⚠️</span>
                           <p className="text-yellow-400 text-xs font-medium">Host approval required before payment is charged</p>
                        </div>
                     )}

                     {clientSecret ? (
                        <StripeProvider clientSecret={clientSecret}>
                           <PaymentForm
                              onSuccess={handlePaymentSuccess}
                              onError={handlePaymentError}
                              amount={event?.joiningFee || 0}
                              eventName={event?.name || ""}
                              isLoading={joinMutation.isPending}
                           />
                        </StripeProvider>
                     ) : (
                        <div className="flex flex-col items-center justify-center py-10 gap-4">
                           <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                           <span className="text-slate-500 text-xs font-black uppercase tracking-widest">Initializing payment...</span>
                        </div>
                     )}
                  </div>

                  {/* Footer */}
                  <div className="px-8 pb-6 flex items-center justify-center gap-2 text-slate-600 text-[10px] font-black uppercase tracking-widest">
                     <ShieldCheck className="w-3 h-3" />
                     Secured by Stripe
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}