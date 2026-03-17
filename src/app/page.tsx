"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { EventServices } from "@/services/event.service";
import { UserServices } from "@/services/user.service";
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
  Globe,
  Star,
  Sparkles as SparklesIcon
} from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuthStore();

  const { data: eventsResponse, isLoading, error } = useQuery({
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

  // Extract events array from response with proper fallback
  const events = React.useMemo(() => {
    if (!eventsResponse) return [];
    
    // If response is already an array
    if (Array.isArray(eventsResponse)) return eventsResponse;
    
    // If response has events property
    if (eventsResponse.events && Array.isArray(eventsResponse.events)) {
      return eventsResponse.events;
    }
    
    // If response has data.events property
    if (eventsResponse.data?.events && Array.isArray(eventsResponse.data.events)) {
      return eventsResponse.data.events;
    }
    
    return [];
  }, [eventsResponse]);

  // Extract hosts array from response with proper fallback
  const hosts = React.useMemo(() => {
    if (!hostsResponse) return [];
    
    // If response is already an array
    if (Array.isArray(hostsResponse)) return hostsResponse;
    
    // If response has hosts property
    if (hostsResponse.hosts && Array.isArray(hostsResponse.hosts)) {
      return hostsResponse.hosts;
    }
    
    // If response has data.hosts property
    if (hostsResponse.data?.hosts && Array.isArray(hostsResponse.data.hosts)) {
      return hostsResponse.data.hosts;
    }
    
    return [];
  }, [hostsResponse]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-primary/5 via-transparent to-transparent -z-10" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-1/2 -left-24 w-72 h-72 bg-primary/10 rounded-full blur-[80px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <Badge variant="emerald" className="mb-6 px-4 py-1.5 text-xs font-bold tracking-widest uppercase bg-primary/5 shadow-sm border-white/5">
              <Zap className="w-3 h-3 mr-2 text-primary fill-primary" />
              The Future of Experiences
            </Badge>

            <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9] text-white">
              Create <span className="text-gradient">Memories.</span> <br />
              Find Your <span className="italic font-serif">Tribe.</span>
            </h1>

            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
              Join the elite network of event creators and experience seekers. 
              Discover local gatherings that actually matter.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/events">
                <Button size="lg" variant="glow" className="px-10 h-16 rounded-2xl group">
                  Explore Events
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href={isAuthenticated ? "/events/create" : "/register?role=HOST"}>
                <Button size="lg" variant="outline" className="px-10 h-16 rounded-2xl border-2">
                  Launch Your Event
                </Button>
              </Link>
            </div>

            <div className="mt-24 pt-12 border-t border-white/5 flex flex-wrap justify-center gap-12 opacity-60 group hover:opacity-100 transition-all duration-700">
               <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  <span className="font-black text-sm tracking-widest uppercase text-slate-400">Award Winning Experience</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Proof Section */}
      <section className="py-20 relative px-4">
         <div className="max-w-5xl mx-auto p-12 bg-slate-900/50 border border-white/5 backdrop-blur-3xl rounded-[3rem] shadow-premium text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[100px]" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative z-10">
               <div>
                  <h4 className="text-5xl font-black mb-2 text-accent">2.4k+</h4>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Events Hosted</p>
               </div>
               <div>
                  <h4 className="text-5xl font-black mb-2 text-emerald-400">12k</h4>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Community Members</p>
               </div>
               <div>
                  <h4 className="text-5xl font-black mb-2 text-blue-400">98%</h4>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Satisfaction Rate</p>
               </div>
            </div>
         </div>
      </section>

      {/* Protocol Flow (How it Works) */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 uppercase">The <span className="text-primary glow-emerald">Protocol</span></h2>
            <p className="text-slate-400 font-medium italic max-w-xl mx-auto">A seamless orchestration of discovery, authentication, and execution.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
            {/* Connection Lines (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent -translate-y-1/2 -z-10" />
            
            {[
              { 
                step: "01", 
                title: "Initialize Discovery", 
                desc: "Filter through the global nexus of experiences to find your perfect match.",
                icon: <Globe className="w-8 h-8 text-primary" />
              },
              { 
                step: "02", 
                title: "Secure Access", 
                desc: "Establish your identity and claim your spot in the protocol with one click.",
                icon: <ShieldCheck className="w-8 h-8 text-primary" />
              },
              { 
                step: "03", 
                title: "Execute Experience", 
                desc: "Attend, engage, and leave your mark on the community ecosystem.",
                icon: <Rocket className="w-8 h-8 text-primary" />
              }
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="w-20 h-20 bg-slate-900 border border-white/5 rounded-3xl flex items-center justify-center mb-8 shadow-premium group-hover:border-primary/40 transition-all duration-500 relative z-10 mx-auto md:mx-0">
                  {item.icon}
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-[10px] font-black text-slate-950 shadow-lg glow-emerald">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-2xl font-black text-white mb-4 tracking-tight text-center md:text-left uppercase">{item.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed italic text-center md:text-left">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                 <TrendingUp className="w-5 h-5 text-accent" />
                 <span className="font-black text-xs uppercase tracking-widest text-slate-400">Curated Experiences</span>
              </div>
              <h2 className="text-5xl font-black text-white tracking-tighter">Trending Now</h2>
            </div>
            <Link href="/events">
              <Button variant="link" className="font-black gap-2 group">
                 See More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-slate-900/50 animate-pulse h-[450px] rounded-[2rem] border border-white/5" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.isArray(events) ? events.slice(0, 3).map((event: any) => (
                <Card key={event.id} className="h-full flex flex-col group">
                  <div className="aspect-[16/10] relative overflow-hidden">
                    {event.image ? (
                      <img src={event.image} alt={event.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center font-black text-slate-700 text-xs tracking-widest uppercase">
                        {event.type}
                      </div>
                    )}
                    <Badge className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-primary border-white/10 shadow-sm">
                      {event.type}
                    </Badge>
                  </div>
                  <CardContent className="p-8 flex flex-col flex-1 pt-6">
                    <div className="flex items-center gap-2 mb-4 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                       <Calendar className="w-3 h-3" />
                       <span>{new Date(event.dateTime).toLocaleDateString()}</span>
                       <span className="mx-2 opacity-30">|</span>
                       <span className="truncate">{event.location}</span>
                    </div>
                    <h3 className="text-2xl font-black text-white mb-4 line-clamp-1 group-hover:text-primary transition-colors leading-tight">
                      {event.name}
                    </h3>
                    <p className="text-slate-400 text-sm line-clamp-2 mb-8 font-medium">
                      {event.description}
                    </p>
                    <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                         <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                            <Users className="w-4 h-4 text-slate-500" />
                         </div>
                         <span className="text-xs font-bold text-slate-400">0/20 Joined</span>
                      </div>
                      <Link href={`/events/${event.id}`}>
                        <Button size="sm" variant="secondary" className="rounded-xl font-bold">Details</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-slate-400">No events available</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Architect Nexus (Featured Hosts) */}
      <section className="py-32 bg-slate-900/20 backdrop-blur-3xl relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-8 text-center md:text-left">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 uppercase">Architect <span className="text-accent">Nexus</span></h2>
              <p className="text-slate-500 font-medium italic">Meet the visionary hosts shaping the local ecosystem.</p>
            </div>
            <div className="flex gap-4">
              <Link href="/hosts">
                <Button variant="link" className="font-black gap-2 group">
                   See More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/register?role=HOST">
                <Button variant="white" className="rounded-2xl px-8 font-black uppercase tracking-widest text-[10px]">Become an Architect</Button>
              </Link>
            </div>
          </div>

          {isHostsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-slate-900/40 animate-pulse h-[280px] rounded-[2.5rem] border border-white/5" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.isArray(hosts) && hosts.length > 0 ? hosts.slice(0, 4).map((host: any) => (
                <Link key={host.id} href={`/profile/${host.id}`}>
                  <div className="group p-8 rounded-[2.5rem] bg-slate-900/40 border border-white/5 hover:border-primary/20 transition-all duration-500 text-center relative overflow-hidden cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-24 h-24 rounded-[2rem] mx-auto mb-6 border-4 border-slate-800 overflow-hidden relative z-10 group-hover:scale-105 transition-transform">
                      {host.profile?.profileImage ? (
                        <img src={host.profile.profileImage} alt={host.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-black text-2xl">
                          {host.name?.[0]}
                        </div>
                      )}
                    </div>
                    <h4 className="text-lg font-black text-white mb-1 relative z-10">{host.name}</h4>
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-4 relative z-10">
                      {host.profile?.bio ? host.profile.bio.slice(0, 20) + '...' : 'Event Architect'}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest relative z-10 pt-4 border-t border-white/5">
                      <Star className="w-3 h-3 text-accent fill-accent" /> 
                      {host.hostedEvents?.length || 0} Events
                    </div>
                  </div>
                </Link>
              )) : (
                // Fallback to mock data if no real hosts
                [
                  { name: "Sophiya J.", role: "Culture Maven", stats: "42 Exp.", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" },
                  { name: "Marcus V.", role: "Tech Visionary", stats: "28 Exp.", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop" },
                  { name: "Elena R.", role: "Art Curator", stats: "35 Exp.", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop" },
                  { name: "David K.", role: "Music Director", stats: "51 Exp.", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop" }
                ].map((host, i) => (
                  <div key={i} className="group p-8 rounded-[2.5rem] bg-slate-900/40 border border-white/5 hover:border-primary/20 transition-all duration-500 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-24 h-24 rounded-[2rem] mx-auto mb-6 border-4 border-slate-800 overflow-hidden relative z-10 group-hover:scale-105 transition-transform">
                      <img src={host.img} alt={host.name} className="w-full h-full object-cover" />
                    </div>
                    <h4 className="text-lg font-black text-white mb-1 relative z-10">{host.name}</h4>
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-4 relative z-10">{host.role}</p>
                    <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest relative z-10 pt-4 border-t border-white/5">
                      <Star className="w-3 h-3 text-accent fill-accent" /> {host.stats}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </section>

      {/* Member Broadcasts (Testimonials) */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
             <div className="flex justify-center mb-6">
                <MessageSquare className="w-12 h-12 text-primary" />
             </div>
             <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase mb-4">Member <span className="text-primary glow-emerald">Broadcasts</span></h2>
             <p className="text-slate-500 font-medium italic">Direct feedback from the community hub.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                name: "Alex Thorne", 
                body: "EventMate changed how I view local community. No more boring meetups, just pure, high-quality experiences.",
                role: "Experience Designer"
              },
              { 
                name: "Maya Chen", 
                body: "The Architect interface is incredibly powerful. As a host, I have total control over my protocol and audience.",
                role: "Tech Lead"
              },
              { 
                name: "Julian Brooks", 
                body: "Finally, a platform that values premium design and user experience over generic listing noise.",
                role: "Visual Artist"
              }
            ].map((item, i) => (
              <div key={i} className="p-10 rounded-[2.5rem] bg-slate-900/60 border border-white/5 relative group hover:bg-slate-900 transition-all duration-500">
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-3 h-3 text-accent fill-accent" />)}
                </div>
                <p className="text-white font-medium italic mb-8 leading-relaxed">"{item.body}"</p>
                <div>
                   <h5 className="text-sm font-black text-white uppercase tracking-widest">{item.name}</h5>
                   <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="py-32 relative overflow-hidden bg-primary/5">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
               <h2 className="text-4xl font-black text-white mb-4 tracking-tight uppercase">Categories</h2>
               <p className="text-slate-400 font-medium">Find experiences based on your passion</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "Music", icon: <Music />, color: "bg-blue-500/10 text-blue-400" },
                  { name: "Tech", icon: <Laptop />, color: "bg-indigo-500/10 text-indigo-400" },
                  { name: "Art", icon: <Palette />, color: "bg-amber-500/10 text-amber-400" },
                  { name: "Sports", icon: <Trophy />, color: "bg-emerald-500/10 text-emerald-400" },
                  { name: "Food", icon: <Utensils />, color: "bg-orange-500/10 text-orange-400" }
               ].map((cat, i) => (
                  <div key={i} className="p-8 rounded-[2rem] bg-slate-900/40 backdrop-blur-xl border border-white/5 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all text-center group cursor-pointer">
                     <div className={`w-12 h-12 rounded-2xl ${cat.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                        {cat.icon}
                     </div>
                     <span className="font-black text-white uppercase tracking-widest text-xs">{cat.name}</span>
                  </div>
               ))}
                <div className="p-8 rounded-[2rem] bg-slate-950/40 backdrop-blur-xl border border-white/5 text-white flex items-center justify-center text-center cursor-pointer hover:bg-primary hover:text-slate-950 transition-all group">
                  <span className="font-black uppercase tracking-widest text-[10px] group-hover:scale-105 transition-transform">Explore Full Nexus Directory</span>
               </div>
            </div>
         </div>
      </section>

      {/* Launch Protocol (Final CTA) */}
      <section className="py-32 relative px-4">
         <div className="max-w-5xl mx-auto p-16 md:p-24 bg-gradient-to-br from-primary/20 via-slate-900 to-slate-950 border border-primary/20 rounded-[4rem] text-center relative overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.1)]">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
               <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-950 border border-white/10 text-[10px] font-black text-white uppercase tracking-[0.3em] mb-8">
                  <Rocket className="w-3.5 h-3.5 text-primary" /> Ready to initialize?
               </div>
               <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-10 leading-none uppercase">Start Your <br /><span className="text-gradient">Legacy</span> Today</h2>
               <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <Link href="/register">
                    <Button size="lg" variant="glow" className="h-16 px-12 rounded-2xl font-black uppercase tracking-widest text-xs">Join the Nexus</Button>
                  </Link>
                  <Link href="/events">
                    <Button size="lg" variant="white" className="h-16 px-12 rounded-2xl font-black uppercase tracking-widest text-xs">Explore Directory</Button>
                  </Link>
               </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="text-3xl font-black text-primary drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">EventMate</div>
            <div className="flex gap-10 text-xs font-black uppercase tracking-widest text-slate-500">
              <Link href="#" className="hover:text-white transition-colors">About</Link>
              <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms</Link>
              <Link href="#" className="hover:text-white transition-colors">Contact</Link>
            </div>
            <div className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">
              © 2026 EVENTMATE ECOSYSTEM
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

