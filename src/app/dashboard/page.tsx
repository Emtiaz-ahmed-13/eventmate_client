"use client";

import { useAuthStore } from "@/store/auth.store";
import { useQuery } from "@tanstack/react-query";
import { EventServices } from "@/services/event.service";
import { UserServices } from "@/services/user.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { 
  Users, 
  Calendar, 
  ShieldCheck, 
  ArrowUpRight, 
  Plus, 
  Search,
  Settings,
  MoreVertical,
  Layers,
  BarChart3,
  Clock,
  MapPin,
  TrendingUp,
  LayoutDashboard,
  ArrowRight
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuthStore();

  const { data: userEvents, isLoading: isEventsLoading } = useQuery({
    queryKey: ["dashboard-events", user?.id],
    queryFn: () => UserServices.getUserEvents(user?.id as string),
    enabled: !!user?.id,
  });

  const renderUserDashboard = () => (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Joined Events", value: userEvents?.joined?.length || 0, icon: <Calendar className="w-5 h-5 text-blue-500" /> },
          { label: "Saved Events", value: "0", icon: <ShieldCheck className="w-5 h-5 text-emerald-500" /> },
          { label: "Past Experiences", value: "0", icon: <Clock className="w-5 h-5 text-slate-500" /> },
        ].map((stat, i) => (
          <Card key={i} className="border border-white/5 bg-slate-900/40 backdrop-blur-xl">
            <CardContent className="p-8 flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                <h4 className="text-3xl font-black text-white tracking-tight">{stat.value}</h4>
              </div>
              <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center">{stat.icon}</div>
            </CardContent>
          </Card>
        ))}
</div>

      <Card className="border border-white/5 bg-slate-900/40 backdrop-blur-xl overflow-visible">
        <CardHeader className="flex flex-row items-center justify-between pb-8">
           <div>
              <CardTitle className="text-2xl font-black text-white">Upcoming Events</CardTitle>
              <CardDescription className="text-slate-400">Experiences you've secured a spot for</CardDescription>
           </div>
           <Link href="/events"><Button variant="ghost" className="font-bold gap-2 group text-slate-400 hover:text-white">Find more <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" /></Button></Link>
        </CardHeader>
        <CardContent>
          {isEventsLoading ? (
            <div className="space-y-4">
              {[1, 2].map(i => <div key={i} className="h-24 bg-slate-800 animate-pulse rounded-2xl" />)}
            </div>
          ) : !userEvents?.joined || userEvents.joined.length === 0 ? (
            <div className="text-center py-20 bg-slate-800/20 rounded-[2.5rem] border border-white/5">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-600 shadow-sm border border-white/5">
                 <Calendar className="w-10 h-10" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">The stage is empty</h4>
              <p className="text-slate-500 font-medium mb-8 max-w-xs mx-auto text-sm italic">You haven't joined any events yet. New experiences are added daily!</p>
              <Link href="/events"><Button variant="glow" className="rounded-xl px-8">Explore Events</Button></Link>
            </div>
          ) : (
            <div className="space-y-4">
              {userEvents.joined.map((event: any) => (
                <div key={event.id} className="group p-6 rounded-[2rem] bg-slate-800/30 border border-white/5 hover:border-primary/20 hover:bg-slate-800/50 transition-all flex flex-col md:flex-row md:items-center gap-6">
                   <div className="w-20 h-20 rounded-2xl bg-slate-800 shadow-sm flex items-center justify-center font-black text-primary overflow-hidden border border-white/5">
                      {event.image ? (
                        <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl">{event.type[0]}</span>
                      )}
                   </div>
                   <div className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="emerald" className="uppercase tracking-widest text-[9px] font-black">{event.type}</Badge>
                        <Badge variant="secondary" className="bg-slate-800 text-slate-400 border-white/5 uppercase tracking-widest text-[9px]">CONFIRMED</Badge>
                      </div>
                      <h4 className="font-black text-white text-xl mb-1 group-hover:text-primary transition-colors">{event.name}</h4>
                      <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                         <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(event.dateTime).toLocaleDateString()}</span>
                         <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {event.location}</span>
                      </div>
                   </div>
                   <Link href={`/events/${event.id}`}>
                      <Button variant="white" className="rounded-xl font-black text-xs uppercase tracking-widest group">
                        Details <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                   </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderHostDashboard = () => (
    <div className="space-y-10">
      <Card className="border-none shadow-premium bg-slate-900 text-white overflow-hidden p-2">
         <CardContent className="p-10 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
            <div className="relative z-10 text-center md:text-left">
               <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
                  <Badge variant="emerald" className="bg-primary/20 text-primary border-none text-[10px] font-black tracking-widest px-3 py-1">HOST DASHBOARD</Badge>
               </div>
               <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">Host Control Center</h1>
               <p className="text-slate-400 text-lg font-medium">Manage your events and track performance</p>
            </div>
            <Link href="/events/create" className="shrink-0 relative z-10 w-full md:w-auto">
               <Button className="rounded-2xl h-16 px-10 bg-primary hover:bg-slate-800 shadow-2xl shadow-primary/40 flex items-center gap-3 w-full font-black text-lg">
                  <Plus className="w-6 h-6" />
                  Launch New Event
               </Button>
            </Link>
         </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Active Events", value: userEvents?.hosted?.length || 0, icon: <Layers className="w-5 h-5 text-indigo-500" />, trend: "+2" },
          { label: "Participants", value: "0", icon: <Users className="w-5 h-5 text-blue-500" />, trend: "0" },
          { label: "Total Revenue", value: "$0.00", icon: <BarChart3 className="w-5 h-5 text-emerald-500" />, trend: "$0" },
          { label: "Host Rating", value: "4.8", icon: <ShieldCheck className="w-5 h-5 text-amber-500" />, trend: "New" },
        ].map((stat, i) => (
          <Card key={i} className="border border-white/5 bg-slate-900/40 backdrop-blur-xl">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                 <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center">{stat.icon}</div>
                 <Badge variant="secondary" className="bg-slate-800 text-slate-500 text-[10px] font-black border-white/5">{stat.trend}</Badge>
              </div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-[0.1em] mb-1">{stat.label}</p>
              <h4 className="text-3xl font-black text-white tracking-tight">{stat.value}</h4>
            </CardContent>
          </Card>
        ))}
</div>

      <Card className="border border-white/5 bg-slate-900/40 backdrop-blur-xl">
         <CardHeader className="flex flex-row items-center justify-between pb-8">
            <div>
               <CardTitle className="text-2xl font-black text-white">Your Hosted Events</CardTitle>
               <CardDescription className="text-slate-400">Manage your current and upcoming events</CardDescription>
            </div>
            <div className="hidden md:block relative">
               <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
               <input type="text" placeholder="Search your events..." className="pl-11 pr-4 py-3 bg-slate-800 border-none rounded-2xl text-sm w-72 focus:ring-2 focus:ring-primary/20 outline-none font-medium transition-all text-white" />
            </div>
         </CardHeader>
         <CardContent>
           {isEventsLoading ? (
             <div className="space-y-4">
               {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-50 animate-pulse rounded-2xl" />)}
             </div>
           ) : !userEvents?.hosted || userEvents.hosted.length === 0 ? (
             <div className="text-center py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
                <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
                  <Layers className="w-10 h-10 text-slate-200" />
                </div>
                <p className="text-slate-400 font-bold mb-8 italic">No events currently being hosted.</p>
                <Link href="/events/create"><Button variant="glow" className="rounded-xl px-10">Start Your Legacy</Button></Link>
             </div>
           ) : (
             <div className="grid gap-6">
               {userEvents.hosted.map((event: any) => (
                 <div key={event.id} className="group p-6 rounded-3xl bg-slate-50/50 border border-slate-100 hover:border-primary/20 hover:bg-white hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col md:flex-row md:items-center gap-8">
                    <div className="w-24 h-24 rounded-2xl bg-white shadow-md flex items-center justify-center font-black text-slate-300 overflow-hidden border border-slate-100 shrink-0">
                       {event.image ? (
                          <img src={event.image} alt={event.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                       ) : (
                          <span className="text-3xl">{event.type[0]}</span>
                       )}
                    </div>
                    <div className="flex-1">
                       <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                               <Badge variant="emerald" className="uppercase tracking-widest text-[9px] font-black">{event.type}</Badge>
                               <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]"><span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> LIVE</span>
                            </div>
                            <h4 className="font-black text-slate-900 text-2xl group-hover:text-primary transition-colors leading-tight">{event.name}</h4>
                          </div>
                          <div className="flex gap-2">
                             <Link href={`/events/edit/${event.id}`}>
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-white border border-slate-100 hover:bg-slate-50"><Settings className="w-4 h-4 text-slate-400" /></Button>
                             </Link>
                             <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-white border border-slate-100 hover:bg-slate-50"><MoreVertical className="w-4 h-4 text-slate-400" /></Button>
                          </div>
                       </div>
                       <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                          <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> {new Date(event.dateTime).toLocaleDateString()}</span>
                          <span className="flex items-center gap-2"><Users className="w-3.5 h-3.5" /> 0 PARTICIPANTS</span>
                          <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {event.location}</span>
                       </div>
                    </div>
                    <Link href={`/events/${event.id}`}>
                       <Button variant="white" className="h-12 px-8 rounded-xl font-black text-xs uppercase tracking-widest border border-slate-100 group shadow-sm hover:shadow-md transition-all">
                          Manage Event <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                       </Button>
                    </Link>
                 </div>
               ))}
             </div>
           )}
         </CardContent>
      </Card>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="space-y-10">
      <Card className="bg-slate-900 border-none shadow-premium text-white overflow-hidden p-2 relative">
         <CardContent className="p-12 relative z-10">
            <div className="flex items-center gap-3 mb-6">
                <LayoutDashboard className="w-6 h-6 text-primary" />
                <Badge className="bg-white/10 text-white border-white/20 uppercase tracking-[0.3em] font-black text-[9px] py-1 px-3">System OS v2.4</Badge>
            </div>
            <h1 className="text-5xl font-black tracking-tighter mb-4">Ecosystem Intelligence</h1>
            <p className="text-slate-400 text-xl font-medium max-w-2xl italic">Real-time surveillance and management of the EventMate global network.</p>
         </CardContent>
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -mr-48 -mt-48" />
         <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {[
            { label: "Total Network Users", value: "1,280", trend: "+5.2%", icon: <Users className="w-6 h-6 text-blue-400" />, color: "bg-blue-500/10" },
            { label: "Host Verifications", value: "12", trend: "Priority", icon: <ShieldCheck className="w-6 h-6 text-amber-400" />, color: "bg-amber-500/10" },
            { label: "Active Nodes", value: "450", trend: "+12.4%", icon: <Layers className="w-6 h-6 text-emerald-400" />, color: "bg-emerald-500/10" },
         ].map((stat, i) => (
            <Card key={i} className="border-none shadow-sm bg-white">
               <CardContent className="p-10">
                  <div className="flex justify-between items-start mb-8">
                     <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center`}>{stat.icon}</div>
                     <Badge variant="secondary" className="bg-slate-50 text-slate-500 font-black uppercase text-[9px] tracking-widest">{stat.trend}</Badge>
                  </div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                  <h4 className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</h4>
               </CardContent>
            </Card>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <Card className="border-none shadow-premium bg-white">
            <CardHeader className="p-10 pb-6">
               <CardTitle className="text-2xl font-black flex items-center gap-3">
                  <Settings className="w-6 h-6 text-slate-300" />
                  Kernel Controls
               </CardTitle>
               <CardDescription>Direct interface with core platform entities</CardDescription>
            </CardHeader>
            <CardContent className="p-10 pt-0">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {[
                     { name: "Manage Users", path: "/admin/users", count: "1,280", icon: <Users /> },
                     { name: "Verify Hosts", path: "/admin/hosts", count: "142", icon: <ShieldCheck /> },
                     { name: "Event Shield", path: "/admin/events", count: "45", icon: <Calendar /> },
                     { name: "System Logs", path: "/admin/logs", count: "890", icon: <BarChart3 /> },
                  ].map((ctrl, i) => (
                     <Link key={i} href={ctrl.path}>
                        <div className="p-6 rounded-3xl bg-slate-50/50 border border-slate-100 hover:border-primary/20 hover:bg-white hover:shadow-xl hover:shadow-primary/5 transition-all cursor-pointer group flex flex-col items-center text-center">
                           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 text-slate-300 shadow-sm group-hover:text-primary group-hover:scale-110 transition-all">{ctrl.icon}</div>
                           <span className="font-black text-slate-900 uppercase tracking-widest text-xs mb-1">{ctrl.name}</span>
                           <span className="text-[10px] text-slate-400 font-bold uppercase">{ctrl.count} items</span>
                        </div>
                     </Link>
                  ))}
               </div>
            </CardContent>
         </Card>

         <Card className="border-none shadow-premium bg-white">
            <CardHeader className="p-10 pb-6">
               <CardTitle className="text-2xl font-black flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 text-slate-300" />
                  Neural Health
               </CardTitle>
               <CardDescription>Real-time infrastructure diagnostic feed</CardDescription>
            </CardHeader>
            <CardContent className="p-10 pt-0">
               <div className="space-y-8 mt-6">
                  {[
                     { label: "Core Processing Load", value: 42, color: "bg-emerald-500", detail: "OPTIONAL" },
                     { label: "Global Network Latency", value: 85, color: "bg-emerald-500", detail: "STABLE" },
                     { label: "Satellite Node Storage", value: 68, color: "bg-blue-500", detail: "HEALTHY" },
                  ].map((stat, i) => (
                     <div key={i}>
                        <div className="flex justify-between text-[11px] font-black uppercase tracking-widest mb-3">
                           <span className="text-slate-500">{stat.label}</span>
                           <div className="flex gap-3">
                              <span className="text-slate-300 italic">{stat.detail}</span>
                              <span className="text-slate-900">{stat.value}%</span>
                           </div>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-50 shadow-inner">
                           <div className={`h-full ${stat.color} transition-all duration-1000 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]`} style={{ width: `${stat.value}%` }} />
                        </div>
                     </div>
                  ))}
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!user ? (
          <Card className="border-none shadow-premium bg-white">
            <CardContent className="p-20 text-center">
              <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-bounce">
                <ShieldCheck className="w-12 h-12 text-slate-300" />
              </div>
              <h2 className="text-3xl font-black mb-4 tracking-tight">Restricted Access</h2>
              <p className="text-slate-500 mb-10 max-w-sm mx-auto font-medium">Please authenticate your account to enter the ecosystem dashboard.</p>
              <Link href="/login"><Button variant="glow" size="lg" className="rounded-2xl px-12 h-16 font-black tracking-widest uppercase text-xs">Login to Proceed</Button></Link>
            </CardContent>
          </Card>
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
