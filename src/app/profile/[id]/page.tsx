"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { UserServices } from "@/services/user.service";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import Link from "next/link";
import { 
  Mail, 
  Info, 
  Sparkles, 
  ChevronRight, 
  MapPin, 
  Calendar 
} from "lucide-react";

export default function ProfilePage() {
  const params = useParams();
  const id = params?.id as string;
  const { user: currentUser } = useAuthStore();
  const isOwnProfile = currentUser?.id === id;

  const { data: profile, isLoading: isProfileLoading, error: profileError } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      if (!id || id === "undefined") return null;
      return UserServices.getUserProfile(id);
    },
    enabled: !!id && id !== "undefined",
    retry: false,
  });

  const { data: events, isLoading: isEventsLoading } = useQuery({
    queryKey: ["user-events", id],
    queryFn: async () => {
      if (!id || id === "undefined") return { joined: [], hosted: [] };
      return UserServices.getUserEvents(id);
    },
    enabled: !!profile && !!id && id !== "undefined",
  });

  if (isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary glow-emerald"></div>
      </div>
    );
  }

  if (!profile) {
     return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">User Not Found</h2>
            <p className="text-slate-500 mb-6">The profile you are looking for does not exist.</p>
            <Link href="/">
              <Button>Go Home</Button>
            </Link>
          </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
         {/* Profile Header */}
         <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] shadow-premium border border-white/5 overflow-hidden mb-12">
           <div className="h-64 bg-slate-800 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/10 opacity-60" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.15),transparent_70%)]" />
             {isOwnProfile && (
                <div className="absolute top-4 right-4">
                   <Button variant="white" size="sm" className="bg-white/90 backdrop-blur-sm">Edit Header</Button>
                </div>
             )}
          </div>
           <div className="px-12 pb-12 flex flex-col md:flex-row items-end gap-8 -mt-24 relative z-10">
            <div className="w-44 h-44 rounded-[2.5rem] bg-slate-900 border-[6px] border-slate-900 shadow-premium flex items-center justify-center text-5xl font-black text-primary overflow-hidden group/avatar relative">
               {profile.profilePhoto ? (
                 <img src={profile.profilePhoto} alt={profile.name} className="w-full h-full object-cover transition-transform duration-700 group-hover/avatar:scale-110" />
               ) : (
                 profile.name[0]
               )}
               <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
            </div>
            <div className="flex-1 mb-4">
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">{profile.name}</h1>
              <div className="flex items-center gap-3 text-slate-500 font-black uppercase tracking-widest text-xs">
                 <Badge variant="emerald" className="bg-primary/10 text-primary border-none">{profile.role}</Badge>
                 <span className="opacity-20">•</span>
                 <span>Joined {new Date(profile.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-4">
               {isOwnProfile ? (
                  <Button variant="glow" className="rounded-2xl px-10 h-14 font-black uppercase tracking-widest text-xs">Edit Portfolio</Button>
               ) : (
                  <Button variant="glow" className="rounded-2xl px-10 h-14 font-black uppercase tracking-widest text-xs">Sync Follow</Button>
               )}
               <Button variant="white" size="icon" className="rounded-2xl w-14 h-14 bg-white/5 border-white/10 text-white hover:bg-white hover:text-slate-900 transition-all border"><Mail className="w-5 h-5" /></Button>
            </div>
          </div>
          <div className="px-12 py-8 border-t border-white/5 bg-slate-900/20 backdrop-blur-md">
             <div className="flex flex-wrap gap-12">
                <div className="flex flex-col">
                   <span className="text-3xl font-black text-white tracking-tighter">{events?.hosted?.length || 0}</span>
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">Experiences Hosted</span>
                </div>
                <div className="w-px h-12 bg-white/5 hidden md:block" />
                <div className="flex flex-col">
                   <span className="text-3xl font-black text-white tracking-tighter">{events?.joined?.length || 0}</span>
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">Nexus Joins</span>
                </div>
                <div className="w-px h-12 bg-white/5 hidden md:block" />
                <div className="flex flex-col">
                   <div className="flex items-center gap-2">
                      <span className="text-3xl font-black text-white tracking-tighter">4.9</span>
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(16,185,129,1)]" />
                   </div>
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">Host Authority</span>
                </div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Sidebar */}
          <div className="space-y-10">
            <Card className="bg-slate-900/40 backdrop-blur-xl border-white/5 rounded-[2.5rem] p-4 shadow-premium">
               <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-xl font-black text-white flex items-center gap-3">
                     <Info className="w-5 h-5 text-primary" />
                     Briefing
                  </CardTitle>
                  <CardDescription className="text-[10px] font-black text-slate-500 uppercase tracking-widest">About this architect</CardDescription>
               </CardHeader>
               <CardContent className="p-8 pt-4">
                  <p className="text-slate-400 text-sm leading-relaxed font-medium italic bg-slate-800/20 p-6 rounded-2xl border border-white/5">
                    "{profile.bio || "This host operates in stealth mode. No bio available yet."}"
                  </p>
                  <div className="mt-8 space-y-4">
                     <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Ecosystem Specializations</h4>
                     <div className="flex flex-wrap gap-2">
                       {(profile.interests || ['Music', 'Art', 'Tech']).map((tag: string) => (
                         <Badge key={tag} variant="emerald" className="bg-primary/5 text-primary border-primary/10 px-3 py-1 font-black text-[9px] uppercase tracking-widest">
                           {tag}
                         </Badge>
                       ))}
                     </div>
                  </div>
               </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-10">
             <Card className="bg-slate-900/40 backdrop-blur-xl border-white/5 rounded-[2.5rem] p-4 shadow-premium">
                <CardHeader className="px-10 py-10 pb-4">
                   <div className="flex justify-between items-center">
                      <div>
                         <CardTitle className="text-2xl font-black text-white flex items-center gap-3">
                            <Sparkles className="w-6 h-6 text-primary" />
                            Recent Protocol Activity
                         </CardTitle>
                         <CardDescription className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Latest interactions with the platform</CardDescription>
                      </div>
                      <Badge variant="emerald" className="bg-primary/20 text-primary border-none px-4 py-2 font-black text-[10px] uppercase tracking-widest">Live Feed</Badge>
                   </div>
                </CardHeader>
                
                <CardContent className="px-10 py-10 pt-4">
                {isEventsLoading ? (
                   <div className="space-y-4 text-center py-20">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary mx-auto mb-4" />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Syncing activity stream...</span>
                   </div>
                ) : events?.length === 0 ? (
                   <div className="text-center py-20 border-2 border-dashed rounded-[2rem] border-white/5 bg-slate-900/20">
                      <p className="text-slate-500 font-medium italic text-sm">No protocol data discovered for this user yet.</p>
                   </div>
                ) : (
                   <div className="space-y-4">
                      {[...(events?.hosted || []), ...(events?.joined || [])].slice(0, 5).map((event: any) => (
                         <div key={event.id} className="group p-6 rounded-[2rem] bg-slate-800/30 hover:bg-slate-800/60 transition-all border border-white/5 hover:border-primary/20 flex gap-8 items-center">
                            <div className="w-20 h-20 rounded-2xl bg-slate-950 border border-white/5 flex items-center justify-center text-primary font-black text-2xl group-hover:scale-110 transition-transform">
                               {event.type[0]}
                            </div>
                            <div className="flex-1">
                               <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-black text-white text-xl tracking-tight group-hover:text-primary transition-colors">{event.name}</h4>
                                  <Badge variant="emerald" className="bg-slate-900 border-white/5 text-[9px] font-black uppercase tracking-widest px-3 py-1">
                                     {events.hosted?.find((e: any) => e.id === event.id) ? 'ARCHITECT' : 'PARTICIPANT'}
                                  </Badge>
                               </div>
                               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                  <MapPin className="w-3 h-3 text-primary" /> {event.location} 
                                  <span className="opacity-20">|</span> 
                                  <Calendar className="w-3 h-3 text-primary" /> {new Date(event.dateTime).toLocaleDateString()}
                               </p>
                               <Link href={`/events/${event.id}`} className="group/link inline-flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-colors">
                                  Access Protocol <ChevronRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                         </div>
                      ))}
                   </div>
                )}
             </CardContent>
          </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
