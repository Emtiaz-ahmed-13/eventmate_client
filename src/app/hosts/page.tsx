"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserServices } from "@/services/user.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { 
  Search,
  Filter,
  Star,
  MapPin,
  Calendar,
  Users,
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function HostsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const { data: hostsResponse, isLoading, error } = useQuery({
    queryKey: ["hosts"],
    queryFn: () => UserServices.getAllHosts(),
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });

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

  // Filter hosts based on search term
  const filteredHosts = React.useMemo(() => {
    return hosts.filter((host: any) => {
      const matchesSearch = searchTerm === "" || 
        host.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (host.profile?.bio && host.profile.bio.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesSearch;
    });
  }, [hosts, searchTerm]);

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-primary" />
            <Badge variant="emerald" className="px-4 py-1.5 text-xs font-bold tracking-widest uppercase bg-primary/5 shadow-sm border-white/5">
              Architect Directory
            </Badge>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 uppercase">
            Meet Our <span className="text-gradient">Architects</span>
          </h1>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            Discover the visionary hosts shaping the local ecosystem and creating unforgettable experiences.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search architects by name or expertise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            {[
              { id: "all", label: "All Architects" },
              { id: "top", label: "Top Rated" },
              { id: "new", label: "New Hosts" },
            ].map((filter) => (
              <Button
                key={filter.id}
                variant={selectedFilter === filter.id ? "glow" : "outline"}
                className={`rounded-xl font-black text-xs uppercase tracking-widest ${
                  selectedFilter === filter.id 
                    ? "" 
                    : "border-white/10 text-white hover:bg-white/5"
                }`}
                onClick={() => setSelectedFilter(filter.id)}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="bg-slate-900/40 backdrop-blur-xl border-white/5 rounded-2xl p-6 text-center">
            <CardContent className="p-0">
              <div className="text-3xl font-black text-primary mb-2">{hosts.length}</div>
              <div className="text-xs font-black text-slate-500 uppercase tracking-widest">Total Architects</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/40 backdrop-blur-xl border-white/5 rounded-2xl p-6 text-center">
            <CardContent className="p-0">
              <div className="text-3xl font-black text-emerald-400 mb-2">
                {hosts.reduce((total: number, host: any) => total + (host.hostedEvents?.length || 0), 0)}
              </div>
              <div className="text-xs font-black text-slate-500 uppercase tracking-widest">Events Created</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/40 backdrop-blur-xl border-white/5 rounded-2xl p-6 text-center">
            <CardContent className="p-0">
              <div className="text-3xl font-black text-yellow-400 mb-2">4.9</div>
              <div className="text-xs font-black text-slate-500 uppercase tracking-widest">Average Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Hosts Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-slate-900/40 animate-pulse h-[400px] rounded-[2.5rem] border border-white/5" />
            ))}
          </div>
        ) : filteredHosts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12 text-slate-600" />
            </div>
            <h3 className="text-2xl font-black text-white mb-4">No Architects Found</h3>
            <p className="text-slate-400 mb-8">
              {searchTerm ? "Try adjusting your search terms" : "No architects are available at the moment"}
            </p>
            <Link href="/register?role=HOST">
              <Button variant="glow" className="rounded-2xl px-8">
                Become an Architect
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredHosts.map((host: any) => (
              <Link key={host.id} href={`/profile/${host.id}`}>
                <Card className="group h-full bg-slate-900/40 backdrop-blur-xl border-white/5 hover:border-primary/20 transition-all duration-500 overflow-hidden rounded-[2.5rem] cursor-pointer">
                  <div className="relative">
                    {/* Header background */}
                    <div className="h-32 bg-gradient-to-br from-primary/20 via-slate-800 to-slate-900 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/50" />
                      {host.profile?.headerPhoto && (
                        <img 
                          src={host.profile.headerPhoto} 
                          alt="Header" 
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    
                    {/* Profile Image */}
                    <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                      <div className="w-24 h-24 rounded-[2rem] border-4 border-slate-900 overflow-hidden group-hover:scale-105 transition-transform">
                        {host.profile?.profileImage ? (
                          <img src={host.profile.profileImage} alt={host.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-black text-2xl">
                            {host.name?.[0]}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="pt-16 pb-8 px-8 text-center">
                    <h3 className="text-xl font-black text-white mb-2 group-hover:text-primary transition-colors">
                      {host.name}
                    </h3>
                    
                    <p className="text-xs font-black text-primary uppercase tracking-widest mb-4">
                      {host.profile?.bio ? host.profile.bio.slice(0, 30) + '...' : 'Event Architect'}
                    </p>
                    
                    {host.profile?.location && (
                      <div className="flex items-center justify-center gap-1 text-xs text-slate-400 mb-4">
                        <MapPin className="w-3 h-3" />
                        <span>{host.profile.location}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-center gap-4 text-xs font-black text-slate-500 uppercase tracking-widest pt-4 border-t border-white/5">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{host.hostedEvents?.length || 0} Events</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span>4.9</span>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full border-white/10 text-white hover:bg-white/5 rounded-xl group-hover:border-primary/30 group-hover:text-primary transition-colors"
                      >
                        View Profile
                        <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-20 pt-16 border-t border-white/5">
          <h2 className="text-3xl font-black text-white mb-4 uppercase">Ready to Join the Nexus?</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Become an architect and start creating unforgettable experiences for your community.
          </p>
          <Link href="/register?role=HOST">
            <Button variant="glow" size="lg" className="rounded-2xl px-12 h-16 font-black uppercase tracking-widest text-xs">
              Become an Architect
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}