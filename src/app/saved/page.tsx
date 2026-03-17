"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EventServices } from "@/services/event.service";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bookmark, Calendar, MapPin, ArrowRight, BookmarkX } from "lucide-react";
import { toast } from "sonner";

export default function SavedEventsPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: savedEvents, isLoading } = useQuery({
    queryKey: ["saved-events"],
    queryFn: EventServices.getSavedEvents,
    enabled: isAuthenticated,
  });

  const unsaveMutation = useMutation({
    mutationFn: (eventId: string) => EventServices.unsaveEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-events"] });
      toast.success("Event removed from saved");
    },
    onError: () => toast.error("Failed to remove event"),
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-12 bg-slate-900/60 backdrop-blur-3xl rounded-[3rem] border border-white/5 max-w-md">
          <Bookmark className="w-16 h-16 text-slate-600 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">Sign In Required</h2>
          <p className="text-slate-400 mb-8 font-medium">Login to view your saved events</p>
          <Link href="/login">
            <Button variant="glow" size="lg" className="rounded-2xl px-10">Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="bg-slate-900/40 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Bookmark className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white tracking-tighter">Saved Events</h1>
              <p className="text-slate-400 font-medium mt-1">Your bookmarked experiences</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-slate-900/40 animate-pulse rounded-[2rem] border border-white/5" />
            ))}
          </div>
        ) : !savedEvents || savedEvents.length === 0 ? (
          <div className="text-center py-32 bg-slate-900/40 backdrop-blur-xl rounded-[3rem] border border-white/5">
            <Bookmark className="w-20 h-20 text-slate-700 mx-auto mb-6" />
            <h3 className="text-2xl font-black text-white mb-2 tracking-tighter">No Saved Events</h3>
            <p className="text-slate-400 font-medium mb-8">Bookmark events you're interested in to find them here</p>
            <Link href="/events">
              <Button variant="glow" className="rounded-2xl px-10 font-black uppercase tracking-widest text-xs">
                Explore Events
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-slate-500 font-black uppercase tracking-widest text-xs mb-6">
              {savedEvents.length} saved {savedEvents.length === 1 ? "event" : "events"}
            </p>
            {savedEvents.map((item: any) => {
              const event = item.event || item;
              return (
                <Card key={item.id || event.id} className="border border-white/5 bg-slate-900/40 backdrop-blur-xl hover:border-primary/20 transition-all">
                  <CardContent className="p-6 flex flex-col md:flex-row md:items-center gap-6">
                    <div className="w-16 h-16 rounded-xl bg-slate-800/50 flex items-center justify-center font-black text-primary overflow-hidden border border-white/5 shrink-0">
                      {event.image ? (
                        <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl">{event.type?.[0]}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="emerald" className="uppercase tracking-widest text-[9px] font-black bg-primary/10 text-primary border-primary/20">
                          {event.type}
                        </Badge>
                        {event.status === "CANCELLED" && (
                          <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-[9px] font-black uppercase">Cancelled</Badge>
                        )}
                      </div>
                      <h4 className="font-black text-white text-lg mb-2">{event.name}</h4>
                      <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(event.dateTime).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          {event.location}
                        </span>
                        <span className="text-primary font-black">
                          {event.joiningFee === 0 ? "Free" : `$${event.joiningFee}`}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-xl border-red-500/20 text-red-400 hover:bg-red-500/10"
                        onClick={() => unsaveMutation.mutate(event.id)}
                        disabled={unsaveMutation.isPending}
                        title="Remove from saved"
                      >
                        <BookmarkX className="w-4 h-4" />
                      </Button>
                      <Link href={`/events/${event.id}`}>
                        <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 rounded-xl font-black text-xs uppercase tracking-[0.3em] group h-10">
                          View
                          <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
