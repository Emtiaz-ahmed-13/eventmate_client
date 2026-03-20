"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { EventServices } from "@/services/event.service";
import { UserServices } from "@/services/user.service";
import { ReviewServices } from "@/services/review.service";
import { useAuthStore } from "@/store/auth.store";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  Calendar,
  Users,
  ArrowRight,
  Zap,
  Trophy,
  Music,
  Laptop,
  Palette,
  Utensils,
  TrendingUp,
  ShieldCheck,
  Rocket,
  MessageSquare,
  Star,
  MapPin,
  Briefcase,
  Heart,
} from "lucide-react";

const CATEGORIES = [
  { name: "Music", icon: Music, color: "bg-blue-500/10 text-blue-400 border-blue-500/20", hover: "hover:bg-blue-500/20" },
  { name: "Technology", icon: Laptop, color: "bg-violet-500/10 text-violet-400 border-violet-500/20", hover: "hover:bg-violet-500/20" },
  { name: "Art", icon: Palette, color: "bg-amber-500/10 text-amber-400 border-amber-500/20", hover: "hover:bg-amber-500/20" },
  { name: "Sports", icon: Trophy, color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", hover: "hover:bg-emerald-500/20" },
  { name: "Food", icon: Utensils, color: "bg-orange-500/10 text-orange-400 border-orange-500/20", hover: "hover:bg-orange-500/20" },
  { name: "Business", icon: Briefcase, color: "bg-sky-500/10 text-sky-400 border-sky-500/20", hover: "hover:bg-sky-500/20" },
  { name: "Lifestyle", icon: Heart, color: "bg-rose-500/10 text-rose-400 border-rose-500/20", hover: "hover:bg-rose-500/20" },
  { name: "All Events", icon: ArrowRight, color: "bg-primary/10 text-primary border-primary/20", hover: "hover:bg-primary/20" },
];

export default function Home() {
  const { isAuthenticated } = useAuthStore();

  const { data: eventsResponse, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: () => EventServices.getAllEvents(),
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });

  const { data: hostsResponse, isLoading: isHostsLoading } = useQuery({
    queryKey: ["hosts"],
    queryFn: () => UserServices.getAllHosts(),
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });

  const { data: reviewsData } = useQuery({
    queryKey: ["home-reviews"],
    queryFn: () => ReviewServices.getAllReviews(6),
    staleTime: 5 * 60 * 1000,
  });

  const reviews = reviewsData?.reviews ?? [];
  const totalReviews = reviewsData?.total ?? 0;

  const events = React.useMemo(() => {
    if (!eventsResponse) return [];
    if (Array.isArray(eventsResponse)) return eventsResponse;
    if (eventsResponse.events && Array.isArray(eventsResponse.events)) return eventsResponse.events;
    return [];
  }, [eventsResponse]);

  const hosts = React.useMemo(() => {
    if (!hostsResponse) return [];
    if (Array.isArray(hostsResponse)) return hostsResponse;
    return [];
  }, [hostsResponse]);

  return (
    <div className="min-h-screen bg-background">

      {/* ── HERO ── */}
      <section className="relative pt-28 pb-36 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08),transparent_60%)] -z-10" />
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute top-1/2 -left-32 w-[400px] h-[400px] bg-primary/8 rounded-full blur-[100px] -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="emerald" className="mb-8 px-5 py-2 text-xs font-bold tracking-widest uppercase bg-primary/5 border-primary/20">
            <Zap className="w-3 h-3 mr-2 text-primary fill-primary" />
            Discover · Connect · Experience
          </Badge>

          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9] text-white">
            Your Next <br />
            <span className="text-gradient">Favorite Memory</span><br />
            <span className="text-slate-400 font-serif italic font-normal text-5xl md:text-6xl">starts here.</span>
          </h1>

          <p className="text-lg text-slate-400 mb-14 max-w-lg mx-auto leading-relaxed font-medium">
            Discover events worth attending. Host experiences worth remembering.
            EventMate is where your city comes alive.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/events">
              <Button size="lg" variant="glow" className="px-10 h-14 rounded-2xl group font-black uppercase tracking-widest text-xs">
                Find Events Near You
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href={isAuthenticated ? "/events/create" : "/register?role=HOST"}>
              <Button size="lg" variant="outline" className="px-10 h-14 rounded-2xl border-white/10 font-black uppercase tracking-widest text-xs text-white hover:bg-white/5">
                Host an Event
              </Button>
            </Link>
          </div>

          {/* Trust bar */}
          <div className="mt-20 flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-600">
            <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-primary" /> Verified Hosts</span>
            <span className="flex items-center gap-2"><Star className="w-4 h-4 text-amber-400 fill-amber-400" /> Top Rated Events</span>
            <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-accent" /> Instant Booking</span>
          </div>
        </div>
      </section>

      {/* ── WHY EVENTMATE ── */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-3 block">Why EventMate</span>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter">Everything you need, nothing you don't</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Zap, color: "text-amber-400 bg-amber-400/10 border-amber-400/20", title: "Instant Booking", desc: "Join free or paid events in one click. No friction, no waiting." },
              { icon: ShieldCheck, color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", title: "Verified Hosts", desc: "Every host is verified. Safe, trusted, and accountable." },
              { icon: Users, color: "text-blue-400 bg-blue-400/10 border-blue-400/20", title: "Real Community", desc: "Meet people who share your interests at local events." },
              { icon: Star, color: "text-violet-400 bg-violet-400/10 border-violet-400/20", title: "Honest Reviews", desc: "Transparent ratings help you pick the best experiences." },
            ].map((f, i) => (
              <div key={i} className="group p-7 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-white/10 hover:bg-slate-900/60 transition-all duration-300">
                <div className={`w-11 h-11 rounded-xl border ${f.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black text-white mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 block">Browse by Interest</span>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Find Events by Category</h2>
            <p className="text-slate-500 mt-4 font-medium">Whatever you're into, there's an event waiting for you</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link key={cat.name} href={cat.name === "All Events" ? "/events" : `/events?type=${cat.name}`}>
                <div className={`group p-6 rounded-2xl bg-slate-900/40 border ${cat.color} ${cat.hover} transition-all duration-300 cursor-pointer flex items-center gap-4 hover:scale-[1.02] hover:shadow-lg`}>
                  <div className={`w-10 h-10 rounded-xl ${cat.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <cat.icon className="w-5 h-5" />
                  </div>
                  <span className="font-black text-white text-sm">{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-28 bg-slate-900/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 block">Simple Process</span>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">How EventMate Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-px bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />
            {[
              { step: "01", title: "Discover Events", desc: "Browse hundreds of local events filtered by category, location, and date.", icon: TrendingUp },
              { step: "02", title: "Book Your Spot", desc: "Join free or paid events instantly. Secure your place with one click.", icon: ShieldCheck },
              { step: "03", title: "Show Up & Enjoy", desc: "Attend the event, meet new people, and leave a review for the host.", icon: Star },
            ].map((item, i) => (
              <div key={i} className="relative group text-center md:text-left">
                <div className="w-16 h-16 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:border-primary/40 transition-all duration-500 relative mx-auto md:mx-0">
                  <item.icon className="w-7 h-7 text-primary" />
                  <div className="absolute -top-3 -right-3 w-7 h-7 bg-primary rounded-full flex items-center justify-center text-[10px] font-black text-slate-950">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-black text-white mb-3 tracking-tight">{item.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRENDING EVENTS ── */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-14 gap-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-3 block flex items-center gap-2">
                <TrendingUp className="w-3 h-3" /> Trending Now
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Featured Events</h2>
            </div>
            <Link href="/events">
              <Button variant="outline" className="border-white/10 text-slate-400 hover:text-white font-black gap-2 group rounded-xl">
                View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => <div key={i} className="h-96 bg-slate-800/30 animate-pulse rounded-[2rem] border border-white/5" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {events.slice(0, 3).map((event: any) => (
                <Card key={event.id} className="group overflow-hidden border-white/5 bg-slate-900/40 hover:border-primary/20 transition-all duration-500">
                  <div className="aspect-[16/10] relative overflow-hidden bg-slate-800">
                    {event.image ? (
                      <img src={event.image} alt={event.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-700 font-black text-xs tracking-widest uppercase">{event.type}</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                    <Badge className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-primary border-white/10 text-[10px] font-black uppercase tracking-widest">
                      {event.type}
                    </Badge>
                    {event.joiningFee === 0 && (
                      <Badge className="absolute top-4 right-4 bg-primary/80 text-slate-950 border-none text-[10px] font-black uppercase tracking-widest">Free</Badge>
                    )}
                  </div>
                  <CardContent className="p-7">
                    <div className="flex items-center gap-3 mb-3 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-primary" /> {new Date(event.dateTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                      <span className="opacity-30">|</span>
                      <span className="flex items-center gap-1 truncate"><MapPin className="w-3 h-3 text-primary" /> {event.location}</span>
                    </div>
                    <h3 className="text-xl font-black text-white mb-3 line-clamp-1 group-hover:text-primary transition-colors">{event.name}</h3>
                    <p className="text-slate-500 text-sm line-clamp-2 mb-6 leading-relaxed">{event.description}</p>
                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <Users className="w-4 h-4" />
                        {event.participants?.length || 0}/{event.maxParticipants} joined
                      </div>
                      <Link href={`/events/${event.id}`}>
                        <Button size="sm" variant="glow" className="rounded-xl font-black text-xs px-5">Join</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {events.length === 0 && (
                <div className="col-span-3 text-center py-16 text-slate-500">No events yet. Be the first to create one!</div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── FEATURED HOSTS ── */}
      <section className="py-28 bg-slate-900/20 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-3 block">Community</span>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Top Event Hosts</h2>
              <p className="text-slate-500 mt-2 font-medium">Meet the people creating amazing experiences</p>
            </div>
            <div className="flex gap-3">
              <Link href="/hosts">
                <Button variant="outline" className="border-white/10 text-slate-400 hover:text-white font-black gap-2 group rounded-xl">
                  All Hosts <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/register?role=HOST">
                <Button variant="glow" className="rounded-xl font-black uppercase tracking-widest text-xs px-6">Become a Host</Button>
              </Link>
            </div>
          </div>

          {isHostsLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => <div key={i} className="h-64 bg-slate-800/30 animate-pulse rounded-[2rem] border border-white/5" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {(hosts.length > 0 ? hosts.slice(0, 4) : [
                { id: "1", name: "Sophia J.", profile: { bio: "Culture Maven" }, hostedEvents: Array(42) },
                { id: "2", name: "Marcus V.", profile: { bio: "Tech Visionary" }, hostedEvents: Array(28) },
                { id: "3", name: "Elena R.", profile: { bio: "Art Curator" }, hostedEvents: Array(35) },
                { id: "4", name: "David K.", profile: { bio: "Music Director" }, hostedEvents: Array(51) },
              ]).map((host: any) => (
                <Link key={host.id} href={`/profile/${host.id}`}>
                  <div className="group p-7 rounded-[2rem] bg-slate-900/40 border border-white/5 hover:border-primary/20 transition-all duration-500 text-center relative overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-primary/5">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-20 h-20 rounded-2xl mx-auto mb-5 border-2 border-white/5 overflow-hidden relative z-10 group-hover:scale-105 transition-transform">
                      {host.profile?.profileImage ? (
                        <img src={host.profile.profileImage} alt={host.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-black text-2xl">
                          {host.name?.[0]}
                        </div>
                      )}
                    </div>
                    <h4 className="text-base font-black text-white mb-1 relative z-10">{host.name}</h4>
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-4 relative z-10">
                      {host.profile?.bio ? host.profile.bio.slice(0, 20) : 'Event Host'}
                    </p>
                    <div className="flex items-center justify-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest relative z-10 pt-4 border-t border-white/5">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      {host.hostedEvents?.length || 0} Events
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-28 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="text-center md:text-left">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 block flex items-center gap-2">
                <MessageSquare className="w-3 h-3" /> Reviews
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">What People Say</h2>
            </div>
            {totalReviews > 6 && (
              <Link href="/reviews">
                <Button variant="outline" className="border-white/10 text-slate-400 hover:text-white font-black gap-2 group rounded-xl">
                  View All ({totalReviews}) <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.length > 0 ? reviews.slice(0, 6).map((review: any) => (
              <div key={review.id} className="p-8 rounded-[2rem] bg-slate-900/60 border border-white/5 hover:border-white/10 transition-all duration-500 group flex flex-col justify-between">
                {/* Stars + comment */}
                <div>
                  <div className="flex gap-1 mb-5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? "text-amber-400 fill-amber-400" : "text-slate-700"}`} />
                    ))}
                  </div>
                  <p className="text-slate-300 font-medium mb-6 leading-relaxed text-sm">"{review.comment || "Great experience!"}"</p>
                </div>

                {/* Reviewer info */}
                <div className="pt-5 border-t border-white/5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-sm overflow-hidden flex-shrink-0">
                      {review.reviewer?.profile?.profileImage ? (
                        <img src={review.reviewer.profile.profileImage} alt={review.reviewer.name} className="w-full h-full object-cover" />
                      ) : (
                        review.reviewer?.name?.[0] || "U"
                      )}
                    </div>
                    <div>
                      <h5 className="text-sm font-black text-white">{review.reviewer?.name || "EventMate User"}</h5>
                      <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">Reviewer</p>
                    </div>
                  </div>

                  {/* Host + Event info */}
                  <div className="space-y-2">
                    {review.host && (
                      <Link href={`/profile/${review.host.id}`} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/60 border border-white/5 hover:border-primary/20 transition-all group/host">
                        <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black text-[10px] flex-shrink-0">
                          {review.host.name?.[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Host</p>
                          <p className="text-xs font-black text-primary truncate group-hover/host:text-white transition-colors">{review.host.name}</p>
                        </div>
                      </Link>
                    )}
                    {review.event && (
                      <Link href={`/events/${review.event.id}`} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/60 border border-white/5 hover:border-amber-400/20 transition-all group/event">
                        <div className="w-6 h-6 rounded-lg bg-amber-400/10 flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-3 h-3 text-amber-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Event</p>
                          <p className="text-xs font-black text-amber-400 truncate group-hover/event:text-white transition-colors">{review.event.name}</p>
                        </div>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-3 text-center py-16 text-slate-600 text-sm font-medium">
                No reviews yet — be the first to leave one after attending an event.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto p-16 bg-gradient-to-br from-primary/15 via-slate-900 to-slate-950 border border-primary/20 rounded-[3rem] text-center relative overflow-hidden shadow-[0_0_60px_rgba(16,185,129,0.08)]">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <Badge variant="emerald" className="mb-6 bg-primary/10 border-primary/20 text-primary font-black uppercase tracking-widest text-[10px]">
              <Rocket className="w-3 h-3 mr-2" /> Get Started Free
            </Badge>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 leading-tight">
              Join EventMate Today
            </h2>
            <p className="text-slate-400 mb-10 max-w-md mx-auto font-medium">
              Create your account and start discovering or hosting events in your city.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register">
                <Button size="lg" variant="glow" className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-xs">
                  Create Free Account
                </Button>
              </Link>
              <Link href="/events">
                <Button size="lg" variant="outline" className="h-14 px-10 rounded-2xl border-white/10 font-black uppercase tracking-widest text-xs text-white hover:bg-white/5">
                  Browse Events
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-2xl font-black text-primary">EventMate</div>
            <div className="flex gap-8 text-xs font-black uppercase tracking-widest text-slate-500">
              <Link href="#" className="hover:text-white transition-colors">About</Link>
              <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms</Link>
              <Link href="#" className="hover:text-white transition-colors">Contact</Link>
            </div>
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">© 2026 EventMate</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
