"use client";

import { useQuery } from "@tanstack/react-query";
import { X, Mail, CheckCircle, Clock } from "lucide-react";
import { EventServices } from "@/services/event.service";

interface Props {
  eventId: string;
  eventName: string;
  onClose: () => void;
}

const STATUS_STYLE: Record<string, string> = {
  SENT: "text-yellow-400 bg-yellow-500/10",
  ACCEPTED: "text-green-400 bg-green-500/10",
  EXPIRED: "text-slate-400 bg-slate-500/10",
};

export function InviteHistoryModal({ eventId, eventName, onClose }: Props) {
  const { data: invites = [], isLoading } = useQuery({
    queryKey: ["event-invites", eventId],
    queryFn: () => EventServices.getEventInvites(eventId),
  });

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Invite History</h3>
              <p className="text-xs text-slate-500 truncate max-w-[220px]">{eventName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {isLoading ? (
            <p className="text-slate-500 text-sm text-center py-8">Loading invites...</p>
          ) : invites.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-8">No invites sent yet</p>
          ) : (
            invites.map((invite: any) => (
              <div
                key={invite.id}
                className="p-4 bg-slate-800/40 rounded-xl border border-white/5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-white">{invite.email}</p>
                    {invite.message && (
                      <p className="text-xs text-slate-500 mt-1 italic">&quot;{invite.message}&quot;</p>
                    )}
                    <p className="text-[10px] text-slate-600 mt-2">
                      {new Date(invite.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${STATUS_STYLE[invite.status] || STATUS_STYLE.SENT}`}>
                    {invite.status === "ACCEPTED" ? (
                      <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Joined</span>
                    ) : invite.status === "SENT" ? (
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Sent</span>
                    ) : (
                      invite.status
                    )}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
