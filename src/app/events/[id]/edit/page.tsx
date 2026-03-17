"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EventServices } from "@/services/event.service";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Save, X, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const EVENT_TYPES = ["MUSIC", "TECH", "ART", "SPORTS", "FOOD", "BUSINESS", "EDUCATION", "OTHER"];

export default function EditEventPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    name: "",
    description: "",
    location: "",
    dateTime: "",
    maxParticipants: 0,
    joiningFee: 0,
    type: "",
    approvalRequired: false,
  });

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: () => EventServices.getEventById(id as string),
  });

  useEffect(() => {
    if (event) {
      setForm({
        name: event.name || "",
        description: event.description || "",
        location: event.location || "",
        dateTime: event.dateTime ? new Date(event.dateTime).toISOString().slice(0, 16) : "",
        maxParticipants: event.maxParticipants || 0,
        joiningFee: event.joiningFee || 0,
        type: event.type || "",
        approvalRequired: event.approvalRequired || false,
      });
    }
  }, [event]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => EventServices.updateEvent(id as string, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event", id] });
      toast.success("Event updated successfully");
      router.push(`/events/${id}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update event");
    },
  });

  const cancelMutation = useMutation({
    mutationFn: () => EventServices.cancelEvent(id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event", id] });
      toast.success("Event cancelled");
      router.push("/dashboard");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to cancel event");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => EventServices.deleteEvent(id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-events", user?.id] });
      toast.success("Event deleted");
      router.push("/dashboard");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete event");
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  if (!event || (user?.id !== event.hostId && user?.role !== "ADMIN")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-12 bg-slate-900/60 backdrop-blur-3xl rounded-[3rem] border border-white/5 max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">Access Denied</h2>
          <p className="text-slate-400 mb-8">You don't have permission to edit this event.</p>
          <Link href="/dashboard">
            <Button variant="glow" className="rounded-2xl px-10">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const inputClass = "w-full px-5 py-4 bg-slate-800/40 border border-white/5 rounded-2xl text-white text-sm focus:border-primary/30 focus:outline-none placeholder:text-slate-600 font-medium";

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="bg-slate-900/40 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/events/${id}`}>
                <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl gap-2 font-black uppercase tracking-widest text-[10px]">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-black text-white tracking-tighter">Edit Event</h1>
                <p className="text-slate-400 text-sm font-medium mt-1">{event.name}</p>
              </div>
            </div>
            {event.status === "CANCELLED" && (
              <Badge className="bg-red-500/10 text-red-400 border-red-500/20 font-black uppercase tracking-widest text-xs px-4 py-2">
                Cancelled
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <Card className="border border-white/5 bg-slate-900/40 backdrop-blur-xl">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-xl font-black text-white">Event Details</CardTitle>
          </CardHeader>
          <CardContent className="p-8 pt-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block">Event Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className={inputClass}
                  placeholder="Event name"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  className={`${inputClass} h-32 resize-none`}
                  placeholder="Event description"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block">Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                  className={inputClass}
                  placeholder="Event location"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block">Date & Time</label>
                <input
                  type="datetime-local"
                  value={form.dateTime}
                  onChange={(e) => setForm((p) => ({ ...p, dateTime: e.target.value }))}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block">Max Participants</label>
                <input
                  type="number"
                  value={form.maxParticipants}
                  onChange={(e) => setForm((p) => ({ ...p, maxParticipants: Number(e.target.value) }))}
                  className={inputClass}
                  min={1}
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block">Joining Fee ($)</label>
                <input
                  type="number"
                  value={form.joiningFee}
                  onChange={(e) => setForm((p) => ({ ...p, joiningFee: Number(e.target.value) }))}
                  className={inputClass}
                  min={0}
                  step={0.01}
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block">Event Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                  className={inputClass}
                >
                  {EVENT_TYPES.map((t) => (
                    <option key={t} value={t} className="bg-slate-900">{t}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-4 p-5 bg-slate-800/30 rounded-2xl border border-white/5">
                <input
                  type="checkbox"
                  id="approvalRequired"
                  checked={form.approvalRequired}
                  onChange={(e) => setForm((p) => ({ ...p, approvalRequired: e.target.checked }))}
                  className="w-5 h-5 accent-primary"
                />
                <label htmlFor="approvalRequired" className="text-sm font-black text-white uppercase tracking-widest cursor-pointer">
                  Require Approval
                </label>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                variant="glow"
                className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-xs"
                onClick={() => updateMutation.mutate(form)}
                disabled={updateMutation.isPending}
              >
                <Save className="w-4 h-4 mr-2" />
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
              <Link href={`/events/${id}`}>
                <Button variant="outline" className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-xs border-white/10 text-white hover:bg-white/5">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border border-red-500/20 bg-red-500/5 backdrop-blur-xl">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-xl font-black text-red-400 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 pt-4 space-y-4">
            {event.status !== "CANCELLED" && (
              <div className="flex items-center justify-between p-5 bg-slate-900/40 rounded-2xl border border-white/5">
                <div>
                  <p className="font-black text-white text-sm uppercase tracking-widest">Cancel Event</p>
                  <p className="text-slate-400 text-xs font-medium mt-1">Notify all participants and mark as cancelled</p>
                </div>
                <Button
                  variant="outline"
                  className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 rounded-xl font-black uppercase tracking-widest text-xs"
                  onClick={() => {
                    if (confirm("Are you sure you want to cancel this event?")) cancelMutation.mutate();
                  }}
                  disabled={cancelMutation.isPending}
                >
                  {cancelMutation.isPending ? "Cancelling..." : "Cancel Event"}
                </Button>
              </div>
            )}
            <div className="flex items-center justify-between p-5 bg-slate-900/40 rounded-2xl border border-white/5">
              <div>
                <p className="font-black text-white text-sm uppercase tracking-widest">Delete Event</p>
                <p className="text-slate-400 text-xs font-medium mt-1">Permanently remove this event and all its data</p>
              </div>
              <Button
                variant="outline"
                className="border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl font-black uppercase tracking-widest text-xs"
                onClick={() => {
                  if (confirm("Are you sure? This action cannot be undone.")) deleteMutation.mutate();
                }}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete Event"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
