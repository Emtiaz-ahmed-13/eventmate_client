"use client";

import { useState } from "react";
import { X, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventServices } from "@/services/event.service";
import { toast } from "sonner";

type Props = {
  eventId: string;
  eventName: string;
  onClose: () => void;
};

export function InviteFriendModal({ eventId, eventName, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await EventServices.inviteFriend(eventId, { email, message });
      toast.success(`Invite sent to ${email}`);
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send invite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div>
            <h3 className="text-lg font-black text-white">Invite Friend</h3>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">{eventName}</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
              Friend&apos;s Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="friend@email.com"
                className="w-full pl-11 pr-4 py-4 bg-slate-800/50 border border-white/5 rounded-2xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary/40"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
              Personal Message (optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Join me at this event!"
              className="w-full px-4 py-3 bg-slate-800/50 border border-white/5 rounded-2xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary/40 resize-none"
            />
          </div>
          <Button type="submit" disabled={loading} variant="glow" className="w-full h-12 rounded-2xl font-black text-xs uppercase tracking-widest">
            <Send className="w-4 h-4 mr-2" />
            {loading ? "Sending..." : "Send Invite"}
          </Button>
        </form>
      </div>
    </div>
  );
}
