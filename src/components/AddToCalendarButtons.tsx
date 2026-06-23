"use client";

import { CalendarPlus, Apple } from "lucide-react";
import { buildGoogleCalendarUrl, downloadAppleCalendarIcs } from "@/lib/calendar";
import { toast } from "sonner";

type Props = {
  name: string;
  description?: string;
  dateTime: string;
  location: string;
  compact?: boolean;
};

export function AddToCalendarButtons({ name, description, dateTime, location, compact }: Props) {
  const event = { name, description, dateTime, location };

  const handleGoogle = () => {
    window.open(buildGoogleCalendarUrl(event), "_blank", "noopener,noreferrer");
  };

  const handleApple = () => {
    downloadAppleCalendarIcs(event);
    toast.success("Calendar file downloaded");
  };

  const btnClass = compact
    ? "flex-1 flex items-center justify-center gap-2 h-10 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 text-[10px] font-black uppercase tracking-widest transition-colors"
    : "flex items-center justify-center gap-2 h-12 px-4 rounded-2xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 text-[10px] font-black uppercase tracking-widest transition-colors";

  return (
    <div className={`flex gap-3 ${compact ? "" : "flex-col sm:flex-row"}`}>
      <button type="button" onClick={handleGoogle} className={btnClass}>
        <CalendarPlus className="w-4 h-4 text-primary" />
        Google Calendar
      </button>
      <button type="button" onClick={handleApple} className={btnClass}>
        <Apple className="w-4 h-4 text-primary" />
        Apple / Outlook
      </button>
    </div>
  );
}
