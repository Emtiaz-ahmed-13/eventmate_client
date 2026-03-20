"use client";

import { useQuery } from "@tanstack/react-query";
import { ReviewServices } from "@/services/review.service";
import { Star, MessageSquare, Calendar } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ReviewsPage() {
  const [limit, setLimit] = useState(12);

  const { data, isLoading } = useQuery({
    queryKey: ["all-reviews", limit],
    queryFn: () => ReviewServices.getAllReviews(limit),
    staleTime: 2 * 60 * 1000,
  });

  const reviews = data?.reviews ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 block flex items-center justify-center gap-2">
            <MessageSquare className="w-3 h-3" /> Community Reviews
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">What People Say</h1>
          <p className="text-slate-500 mt-3 font-medium">{total} reviews from our community</p>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-slate-800/30 animate-pulse rounded-[2rem] border border-white/5" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-24 text-slate-600 font-medium">
            No reviews yet — be the first to leave one after attending an event.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review: any) => (
              <div key={review.id} className="p-8 rounded-[2rem] bg-slate-900/60 border border-white/5 hover:border-white/10 transition-all duration-500 flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 mb-5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? "text-amber-400 fill-amber-400" : "text-slate-700"}`} />
                    ))}
                  </div>
                  <p className="text-slate-300 font-medium mb-6 leading-relaxed text-sm">"{review.comment || "Great experience!"}"</p>
                </div>

                <div className="pt-5 border-t border-white/5 space-y-3">
                  {/* Reviewer */}
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

                  {/* Host */}
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

                  {/* Event */}
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
            ))}
          </div>
        )}

        {/* Load More */}
        {reviews.length < total && (
          <div className="text-center mt-12">
            <button
              onClick={() => setLimit((prev) => prev + 12)}
              className="px-10 h-12 rounded-2xl border border-white/10 text-slate-400 hover:text-white hover:border-white/20 font-black text-xs uppercase tracking-widest transition-all"
            >
              Load More ({total - reviews.length} remaining)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
