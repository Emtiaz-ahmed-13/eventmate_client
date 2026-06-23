"use client";

import { useState } from "react";
import { X, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReportServices } from "@/services/report.service";
import { toast } from "sonner";

interface Props {
  targetType: "EVENT" | "USER" | "REVIEW";
  targetId: string;
  targetLabel: string;
  onClose: () => void;
}

const REASONS = [
  "Spam or misleading",
  "Inappropriate content",
  "Harassment or abuse",
  "Safety concern",
  "Fraud or scam",
  "Other",
];

export function ReportModal({ targetType, targetId, targetLabel, onClose }: Props) {
  const [reason, setReason] = useState(REASONS[0]);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await ReportServices.createReport({
        targetType,
        targetId,
        reason,
        description: description.trim() || undefined,
      });
      toast.success("Report submitted. Our team will review it.");
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <Flag className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Report</h3>
              <p className="text-xs text-slate-500 truncate max-w-[200px]">{targetLabel}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
              Reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800/50 border border-white/5 rounded-xl text-white text-sm"
            >
              {REASONS.map((r) => (
                <option key={r} value={r} className="bg-slate-900">{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
              Details (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Tell us more..."
              className="w-full px-4 py-3 bg-slate-800/50 border border-white/5 rounded-xl text-white text-sm resize-none placeholder:text-slate-600"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-xs bg-red-500 hover:bg-red-600"
          >
            {loading ? "Submitting..." : "Submit Report"}
          </Button>
        </form>
      </div>
    </div>
  );
}
