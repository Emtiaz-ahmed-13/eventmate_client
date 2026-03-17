"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { EventServices } from "@/services/event.service";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { 
  Search, 
  MapPin, 
  Calendar, 
  Filter, 
  ChevronDown,
  ArrowUpDown,
  Laptop,
  Music,
  Palette,
  Trophy,
  Utensils,
  Briefcase
} from "lucide-react";

const CATEGORIES = [
  { name: "Music", icon: <Music className="w-4 h-4" /> },
  { name: "Technology", icon: <Laptop className="w-4 h-4" /> },
  { name: "Art", icon: <Palette className="w-4 h-4" /> },
  { name: "Sports", icon: <Trophy className="w-4 h-4" /> },
  { name: "Food", icon: <Utensils className="w-4 h-4" /> },
  { name: "Business", icon: <Briefcase className="w-4 h-4" /> },
];

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: eventsResponse, isLoading, error } = useQuery({
    queryKey: ["events", searchTerm, selectedCategory],
    queryFn: async () => {
      try {
        const response = await EventServices.getAllEvents({ 
          searchTerm: searchTerm || undefined, 
          type: selectedCategory || undefined 
        });
        return response;
      } catch (error) {
        console.error('Error fetching events:', error);
        throw error;
      }
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
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

  return (
    <div className="min-h-screen bg-background">
      {/* Search Header */}
      <div className="bg-slate-900/60 border-b border-white/5 text-white py-24 relative overflow-hidden backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
           <h1 className="text-5xl md:text-7xl font-black mb-10 tracking-tighter leading-none">Find Your Next <span className="text-primary glow-emerald">Experience</span></h1>
           
           <div className="max-w-3xl mx-auto flex gap-3 p-3 bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl">
              <div className="flex-1 relative">
                 <Search className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
                 <input 
                    type="text" 
                    placeholder="Search for events, workshops, meetups..." 
                    className="w-full pl-16 pr-6 py-5 bg-transparent border-none rounded-2xl outline-none focus:ring-0 transition-all font-medium placeholder:text-slate-600 text-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>
              <Button className="h-16 px-12 rounded-[1.5rem] font-black text-lg bg-primary hover:bg-slate-800 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95">Discover</Button>
           </div>
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
         {/* Categories Filter */}
         <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-20">
            {CATEGORIES.map((cat) => (
               <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
                  className={`flex items-center justify-center gap-3 p-5 rounded-2xl font-black transition-all border shadow-lg ${selectedCategory === cat.name ? 'border-primary bg-primary/10 text-primary glow-emerald translate-y-[-4px] shadow-primary/20' : 'border-white/5 bg-slate-900/40 text-slate-500 hover:border-white/10 hover:text-white hover:bg-slate-800/60'}`}
               >
                  <span className={`${selectedCategory === cat.name ? 'text-primary' : 'text-slate-600'}`}>{cat.icon}</span>
                  {cat.name}
               </button>
            ))}
         </div>

         <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-72 space-y-10">
               <div className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl">
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-10">Refine Search</h3>
                  
                  <div className="space-y-12">
                     <div className="space-y-4">
                        <label className="flex items-center justify-between text-xs font-black text-slate-400 uppercase tracking-widest">
                           Location
                           <MapPin className="w-4 h-4 text-primary" />
                        </label>
                        <select className="w-full p-4 bg-slate-800/50 border border-white/5 rounded-xl text-sm font-bold appearance-none cursor-pointer text-white outline-none focus:ring-1 focus:ring-primary/40">
                           <option className="bg-slate-900">All Locations</option>
                           <option className="bg-slate-900">Online</option>
                           <option className="bg-slate-900">New York</option>
                           <option className="bg-slate-900">London</option>
                           <option className="bg-slate-900">Berlin</option>
                        </select>
                     </div>

                     <div className="space-y-4">
                        <label className="flex items-center justify-between text-xs font-black text-slate-400 uppercase tracking-widest">
                           Date Range
                           <Calendar className="w-4 h-4 text-primary" />
                        </label>
                        <select className="w-full p-4 bg-slate-800/50 border border-white/5 rounded-xl text-sm font-bold appearance-none cursor-pointer text-white outline-none focus:ring-1 focus:ring-primary/40">
                           <option className="bg-slate-900">Anytime</option>
                           <option className="bg-slate-900">Today</option>
                           <option className="bg-slate-900">This Week</option>
                           <option className="bg-slate-900">Next Month</option>
                        </select>
                     </div>

                     <div className="pt-8 border-t border-white/5 space-y-4">
                        <div className="flex items-center justify-between">
                           <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Paid Events</span>
                           <div className="w-12 h-6 bg-slate-800 rounded-full cursor-pointer relative border border-white/5 p-1 transition-colors">
                              <div className="w-4 h-4 bg-slate-600 rounded-full absolute left-1 top-1" />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </aside>

            {/* Event Grid */}
            <div className="flex-1 space-y-10 pb-20">
               <div className="flex justify-between items-center bg-slate-900/40 p-4 rounded-2xl border border-white/5">
                  <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Showing <span className="text-white">{events?.length || 0}</span> events discovered</p>
                  <Button variant="ghost" className="flex gap-2 font-black uppercase tracking-widest text-[10px] text-slate-400 hover:text-white">
                     <ArrowUpDown className="w-4 h-4" />
                     Sort by: Date
                     <ChevronDown className="w-4 h-4" />
                  </Button>
               </div>

               {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-96 bg-slate-800/30 animate-pulse rounded-[2.5rem] border border-white/5" />
                     ))}
                  </div>
               ) : error ? (
                  <div className="text-center py-24 bg-slate-900/20 rounded-[3rem] border-2 border-dashed border-red-500/20">
                     <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-400">
                        <Filter className="w-10 h-10" />
                     </div>
                     <h3 className="text-2xl font-black text-white mb-2 tracking-tighter">Failed to load events</h3>
                     <p className="text-slate-500 mb-10 max-w-sm mx-auto font-medium">
                        There was an error loading events. Please try again.
                     </p>
                     <Button variant="glow" onClick={() => window.location.reload()}>
                        Retry
                     </Button>
                  </div>
               ) : !events || events.length === 0 ? (
                  <div className="text-center py-24 bg-slate-900/20 rounded-[3rem] border-2 border-dashed border-white/5">
                     <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-600 shadow-sm border border-white/5">
                        <Filter className="w-10 h-10" />
                     </div>
                     <h3 className="text-2xl font-black text-white mb-2 tracking-tighter">No experiences discovered</h3>
                     <p className="text-slate-500 mb-10 max-w-sm mx-auto font-medium italic">Try adjusting your filters or search term to find what you're looking for.</p>
                     <Button variant="glow" onClick={() => { setSearchTerm(""); setSelectedCategory(null); }}>Clear All Filters</Button>
                  </div>
               ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {events && Array.isArray(events) && events.map((event: any) => (
                        <div key={event.id} className="group bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/5 hover:border-primary/20 hover:shadow-primary/5 transition-all duration-500 overflow-hidden flex flex-col relative">
                           <div className="aspect-[16/9] bg-slate-800 relative overflow-hidden">
                              <div className="absolute inset-0 bg-slate-900 group-hover:scale-110 transition-transform duration-700 flex items-center justify-center text-slate-700 text-lg font-black uppercase tracking-widest italic opacity-40">
                                 {event.image ? (
                                    <img src={event.image} alt={event.name} className="w-full h-full object-cover opacity-100" />
                                 ) : (
                                    event.type
                                 )}
                              </div>
                              <div className="absolute top-6 left-6 flex gap-2 z-10">
                                 <Badge variant="emerald" className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest bg-slate-900/80 backdrop-blur-md border-white/10">
                                    {event.type}
                                 </Badge>
                                 {event.joiningFee === 0 && (
                                    <Badge variant="emerald" className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest">
                                       Free
                                    </Badge>
                                 )}
                              </div>
                           </div>
                           <div className="p-8 flex-1 flex flex-col">
                              <div className="flex items-center gap-3 mb-5 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                 <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-primary" /> <span>{new Date(event.dateTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span></div>
                                 <span className="opacity-20">|</span>
                                 <div className="flex items-center gap-1.5 truncate max-w-[120px]"><MapPin className="w-3.5 h-3.5 text-primary" /> <span>{event.location}</span></div>
                              </div>
                              <h3 className="text-2xl font-black text-white mb-4 group-hover:text-primary transition-colors leading-tight tracking-tight">
                                 {event.name}
                              </h3>
                              <p className="text-slate-500 text-sm line-clamp-2 mb-10 leading-relaxed font-medium italic">
                                 "{event.description}"
                              </p>
                              <div className="mt-auto pt-8 border-t border-white/5 flex justify-between items-center">
                                 <div className="flex -space-x-3">
                                    {[1, 2, 3].map(i => (
                                       <div key={i} className="w-10 h-10 rounded-xl bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[10px] font-black text-slate-500 hover:text-white transition-colors cursor-default">
                                          {i}
                                       </div>
                                    ))}
                                    <div className="w-10 h-10 rounded-xl bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[10px] font-black text-primary animate-pulse">
                                       +
                                    </div>
                                 </div>
                                 <Link href={`/events/${event.id}`}>
                                    <Button variant="white" className="font-black px-6 rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-white/5 group-hover:bg-primary group-hover:text-slate-900 transition-all active:scale-95 h-12">
                                       Access Nexus
                                    </Button>
                                 </Link>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
