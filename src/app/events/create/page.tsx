"use client";

import { Button } from "@/components/ui/button";
import { EventServices } from "@/services/event.service";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlignLeft,
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  Image as ImageIcon,
  Layers,
  MapPin,
  Sparkles,
  Tag,
  Users,
  ChevronDown
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const eventSchema = z.object({
  name: z.string().min(5, "Event name must be at least 5 characters"),
  description: z.string().min(20, "Please provide a more detailed description"),
  dateTime: z.string().min(1, "Date and time are required"),
  location: z.string().min(5, "Location is required"),
  type: z.string().min(1, "Event type is required"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  joiningFee: z.number().min(0, "Fee cannot be negative"),
});

type EventFormValues = z.infer<typeof eventSchema>;

export default function CreateEvent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      capacity: 50,
      joiningFee: 0,
    }
  });

  const onSubmit = async (data: EventFormValues) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });

      if (banner) {
        formData.append("image", banner);
      }

      const response = await EventServices.createEvent(formData);
      if (response) {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Back to Dashboard</span>
        </Link>

        <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] shadow-premium border border-white/5 overflow-hidden">
          <div className="bg-slate-900 px-12 py-16 text-white relative overflow-hidden border-b border-white/5">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-6 border border-primary/20">
                <Sparkles className="w-3.5 h-3.5" />
                Experience Architect
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">Launch Your Next <span className="text-primary glow-emerald">Experience</span></h1>
              <p className="text-slate-500 text-lg font-medium italic">Configure the parameters below to broadcast your event to the nexus.</p>
            </div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-12 space-y-12">
            {error && (
              <div className="p-5 bg-red-900/20 border border-red-500/20 text-red-400 text-xs rounded-2xl font-black uppercase tracking-widest">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Left Column */}
              <div className="space-y-10">
                <div>
                  <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                    <Tag className="w-4 h-4 text-primary" />
                    Event Title
                  </label>
                  <input
                    {...register("name")}
                    className="w-full px-6 py-5 bg-slate-900/50 border border-white/5 rounded-2xl text-white focus:ring-1 focus:ring-primary/40 outline-none transition-all placeholder:text-slate-600 font-medium"
                    placeholder="e.g. Midnight Jazz in the Park"
                  />
                  {errors.name && <p className="mt-3 text-[10px] text-red-500 font-black uppercase tracking-widest">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                    <AlignLeft className="w-4 h-4 text-primary" />
                    Description
                  </label>
                  <textarea
                    {...register("description")}
                    rows={5}
                    className="w-full px-6 py-5 bg-slate-900/50 border border-white/5 rounded-2xl text-white focus:ring-1 focus:ring-primary/40 outline-none transition-all placeholder:text-slate-600 font-medium resize-none italic"
                    placeholder="Describe what makes this experience unique..."
                  />
                  {errors.description && <p className="mt-3 text-[10px] text-red-500 font-black uppercase tracking-widest">{errors.description.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                      <DollarSign className="w-4 h-4 text-primary" />
                      Fee ($)
                    </label>
                    <input
                      type="number"
                      {...register("joiningFee", { valueAsNumber: true })}
                      className="w-full px-6 py-5 bg-slate-900/50 border border-white/5 rounded-2xl text-white focus:ring-1 focus:ring-primary/40 outline-none transition-all font-black"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                      <Users className="w-4 h-4 text-primary" />
                      Capacity
                    </label>
                    <input
                      type="number"
                      {...register("capacity", { valueAsNumber: true })}
                      className="w-full px-6 py-5 bg-slate-900/50 border border-white/5 rounded-2xl text-white focus:ring-1 focus:ring-primary/40 outline-none transition-all font-black"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-10">
                <div>
                  <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                    <MapPin className="w-4 h-4 text-primary" />
                    Location
                  </label>
                  <input
                    {...register("location")}
                    className="w-full px-6 py-5 bg-slate-900/50 border border-white/5 rounded-2xl text-white focus:ring-1 focus:ring-primary/40 outline-none transition-all placeholder:text-slate-600 font-medium"
                    placeholder="Full address or Venue name"
                  />
                  {errors.location && <p className="mt-3 text-[10px] text-red-500 font-black uppercase tracking-widest">{errors.location.message}</p>}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                    <Calendar className="w-4 h-4 text-primary" />
                    Date & Time
                  </label>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      {...register("dateTime")}
                      className="w-full px-6 py-5 bg-slate-900/50 border border-white/5 rounded-2xl text-white focus:ring-1 focus:ring-primary/40 outline-none transition-all font-medium appearance-none"
                    />
                    <Clock className="w-4 h-4 absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                  </div>
                  {errors.dateTime && <p className="mt-3 text-[10px] text-red-500 font-black uppercase tracking-widest">{errors.dateTime.message}</p>}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                    <Layers className="w-4 h-4 text-primary" />
                    Category
                  </label>
                  <div className="relative">
                    <select
                      {...register("type")}
                      className="w-full px-6 py-5 bg-slate-900/50 border border-white/5 rounded-2xl text-white focus:ring-1 focus:ring-primary/40 outline-none transition-all font-black appearance-none cursor-pointer"
                    >
                      <option className="bg-slate-900" value="">Select a category</option>
                      <option className="bg-slate-900" value="Concert">Music & Concert</option>
                      <option className="bg-slate-900" value="Tech">Tech & Startup</option>
                      <option className="bg-slate-900" value="Culture">Art & Culture</option>
                      <option className="bg-slate-900" value="Sports">Cricket & Sports</option>
                      <option className="bg-slate-900" value="Food">Food Crawl</option>
                      <option className="bg-slate-900" value="Festival">Traditional Festival</option>
                      <option className="bg-slate-900" value="Workshop">Skills & Workshop</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                  </div>
                  {errors.type && <p className="mt-3 text-[10px] text-red-500 font-black uppercase tracking-widest">{errors.type.message}</p>}
                </div>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-10 border-2 border-dashed border-white/5 rounded-[2.5rem] bg-slate-900/20 text-center group hover:border-primary/20 transition-all cursor-pointer relative overflow-hidden"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => setBanner(e.target.files?.[0] || null)}
                    className="hidden"
                    accept="image/*"
                  />
                  <div className="w-16 h-16 bg-slate-800 rounded-2xl shadow-premium border border-white/5 flex items-center justify-center mx-auto mb-6 text-slate-500 group-hover:text-primary transition-colors">
                    {banner ? <div className="text-secondary text-2xl">⚡</div> : <ImageIcon className="w-8 h-8" />}
                  </div>
                  <p className="text-[10px] font-black text-white uppercase tracking-widest">
                    {banner ? banner.name : "Broadcast Banner"}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-2 font-black uppercase tracking-widest">
                    {banner ? `${(banner.size / 1024).toFixed(1)} KB` : "1200x600px Recommended"}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-10 border-t border-white/5 flex justify-end gap-6">
              <Link href="/dashboard">
                <Button variant="ghost" size="lg" className="rounded-2xl font-black text-[10px] uppercase tracking-widest px-10 text-slate-500 hover:text-white transition-colors">Abort Launch</Button>
              </Link>
              <Button
                type="submit"
                disabled={loading}
                variant="glow"
                className="rounded-2xl h-16 px-14 font-black text-sm uppercase tracking-widest transition-all active:scale-95"
              >
                {loading ? "Initializing..." : "Publish Protocol"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
