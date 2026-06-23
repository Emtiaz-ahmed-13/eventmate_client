"use client";

import { useAuthStore } from "@/store/auth.store";
import { useQuery } from "@tanstack/react-query";
import { UserServices } from "@/services/user.service";
import { PaymentServices } from "@/services/payment.service";
import { TicketDisplay } from "@/components/TicketDisplay";
import { AddToCalendarButtons } from "@/components/AddToCalendarButtons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, MapPin, Ticket, ArrowRight, CreditCard } from "lucide-react";
import { getEventCategory } from "@/lib/event-category";

export default function MyTicketsPage() {
  const { user, isAuthenticated } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ["my-tickets", user?.id],
    queryFn: () => UserServices.getUserEvents(user!.id),
    enabled: !!user?.id,
  });

  const { data: payments = [], isLoading: paymentsLoading } = useQuery({
    queryKey: ["my-payments", user?.id],
    queryFn: () => PaymentServices.getMyPayments(),
    enabled: !!user?.id,
  });

  const tickets = (data?.joined || []).filter(
    (event: any) => event.participantStatus === "APPROVED" && event.ticketId,
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center p-10 bg-slate-900/60 rounded-[2rem] border border-white/5 max-w-md">
          <Ticket className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-black text-white mb-3">My Tickets</h1>
          <p className="text-slate-500 mb-6">Login to view your event tickets.</p>
          <Link href="/login">
            <Button variant="glow" className="rounded-xl font-black text-xs uppercase tracking-widest">Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <Badge variant="emerald" className="mb-4 text-[10px] font-black uppercase tracking-widest">My Tickets</Badge>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
            Your <span className="text-primary">Entry Passes</span>
          </h1>
          <p className="text-slate-500 mt-3 font-medium">All approved event tickets in one place.</p>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-64 bg-slate-800/30 animate-pulse rounded-[2rem] border border-white/5" />
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 rounded-[2rem] border border-white/5">
            <Ticket className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h2 className="text-xl font-black text-white mb-2">No tickets yet</h2>
            <p className="text-slate-500 mb-8">Join an event to get your ticket here.</p>
            <Link href="/events">
              <Button variant="glow" className="rounded-xl font-black text-xs uppercase tracking-widest">
                Explore Events
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {tickets.map((event: any) => (
              <div key={event.id} className="grid lg:grid-cols-2 gap-8 p-8 bg-slate-900/40 rounded-[2rem] border border-white/5">
                <div>
                  <Badge variant="emerald" className="mb-4 text-[9px] font-black uppercase tracking-widest">
                    {getEventCategory(event)}
                  </Badge>
                  <h2 className="text-2xl font-black text-white mb-4">{event.name}</h2>
                  <div className="space-y-3 text-sm text-slate-400 mb-6">
                    <p className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> {new Date(event.dateTime).toLocaleString()}</p>
                    <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> {event.location}</p>
                  </div>
                  <AddToCalendarButtons
                    name={event.name}
                    description={event.description}
                    dateTime={event.dateTime}
                    location={event.location}
                    compact
                  />
                  <div className="mt-4">
                    <Link href={`/events/${event.id}`}>
                      <Button variant="outline" className="rounded-xl border-white/10 text-white font-black text-xs uppercase tracking-widest">
                        View Event <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
                <TicketDisplay
                  eventId={event.id}
                  eventName={event.name}
                  userName={user?.name || "Guest"}
                  date={event.dateTime}
                  location={event.location}
                  ticketId={event.ticketId}
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 pt-12 border-t border-white/5">
          <div className="mb-8">
            <Badge variant="emerald" className="mb-4 text-[10px] font-black uppercase tracking-widest">Payment History</Badge>
            <h2 className="text-2xl font-black text-white">Your <span className="text-primary">Transactions</span></h2>
          </div>

          {paymentsLoading ? (
            <div className="h-32 bg-slate-800/30 animate-pulse rounded-[2rem] border border-white/5" />
          ) : payments.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/40 rounded-[2rem] border border-white/5">
              <CreditCard className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No payments yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {payments.map((payment: any) => (
                <div key={payment.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-900/40 rounded-2xl border border-white/5">
                  <div>
                    <p className="font-black text-white">{payment.event?.name || "Event"}</p>
                    <p className="text-xs text-slate-500 mt-1">{new Date(payment.createdAt).toLocaleString()}</p>
                    {payment.promoCode && (
                      <p className="text-[10px] text-primary font-black uppercase mt-1">Promo: {payment.promoCode.code}</p>
                    )}
                  </div>
                  <div className="text-left sm:text-right">
                    {payment.discountAmount > 0 && (
                      <p className="text-xs text-slate-500 line-through">${payment.amount}</p>
                    )}
                    <p className="text-xl font-black text-primary">${payment.finalAmount}</p>
                    <Badge className={`mt-1 text-[9px] font-black uppercase border-none ${
                      payment.status === "SUCCEEDED" ? "bg-green-500/20 text-green-400" :
                      payment.status === "PENDING" ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-red-500/20 text-red-400"
                    }`}>
                      {payment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
