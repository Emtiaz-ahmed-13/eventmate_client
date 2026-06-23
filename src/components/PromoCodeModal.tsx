"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Tag, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PromoCodeServices } from "@/services/promoCode.service";
import { toast } from "sonner";

interface Props {
  eventId: string;
  eventName: string;
  onClose: () => void;
}

export function PromoCodeModal({ eventId, eventName, onClose }: Props) {
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    code: "",
    discountType: "PERCENT" as "PERCENT" | "FIXED",
    discountValue: 10,
    maxUses: "",
  });

  const { data: codes = [], isLoading } = useQuery({
    queryKey: ["promo-codes", eventId],
    queryFn: () => PromoCodeServices.getEventPromoCodes(eventId),
  });

  const createMutation = useMutation({
    mutationFn: () =>
      PromoCodeServices.createPromoCode({
        code: form.code,
        eventId,
        discountType: form.discountType,
        discountValue: form.discountValue,
        maxUses: form.maxUses ? Number(form.maxUses) : undefined,
      }),
    onSuccess: () => {
      toast.success("Promo code created!");
      setShowCreate(false);
      setForm({ code: "", discountType: "PERCENT", discountValue: 10, maxUses: "" });
      queryClient.invalidateQueries({ queryKey: ["promo-codes", eventId] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to create promo code");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => PromoCodeServices.deletePromoCode(id),
    onSuccess: () => {
      toast.success("Promo code deactivated");
      queryClient.invalidateQueries({ queryKey: ["promo-codes", eventId] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete promo code");
    },
  });

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Tag className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Promo Codes</h3>
              <p className="text-xs text-slate-500 truncate max-w-[220px]">{eventName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {!showCreate ? (
            <Button
              onClick={() => setShowCreate(true)}
              variant="outline"
              className="w-full rounded-xl border-primary/30 text-primary font-black text-xs uppercase tracking-widest"
            >
              <Plus className="w-4 h-4 mr-2" /> Create Promo Code
            </Button>
          ) : (
            <div className="p-4 bg-slate-800/40 rounded-xl border border-white/5 space-y-3">
              <input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="CODE (e.g. FRIEND20)"
                className="w-full px-4 py-2 bg-slate-900 border border-white/5 rounded-lg text-white text-sm font-black"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={form.discountType}
                  onChange={(e) => setForm({ ...form, discountType: e.target.value as "PERCENT" | "FIXED" })}
                  className="px-3 py-2 bg-slate-900 border border-white/5 rounded-lg text-white text-sm"
                >
                  <option value="PERCENT" className="bg-slate-900">Percent %</option>
                  <option value="FIXED" className="bg-slate-900">Fixed $</option>
                </select>
                <input
                  type="number"
                  value={form.discountValue}
                  onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })}
                  className="px-3 py-2 bg-slate-900 border border-white/5 rounded-lg text-white text-sm"
                />
              </div>
              <input
                type="number"
                value={form.maxUses}
                onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                placeholder="Max uses (optional)"
                className="w-full px-4 py-2 bg-slate-900 border border-white/5 rounded-lg text-white text-sm"
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => createMutation.mutate()}
                  disabled={!form.code || createMutation.isPending}
                  variant="glow"
                  className="flex-1 rounded-xl text-xs font-black uppercase"
                >
                  {createMutation.isPending ? "Creating..." : "Create"}
                </Button>
                <Button onClick={() => setShowCreate(false)} variant="ghost" className="rounded-xl text-xs">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {isLoading ? (
            <p className="text-slate-500 text-sm text-center py-4">Loading...</p>
          ) : codes.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-4">No promo codes yet</p>
          ) : (
            codes.map((code: any) => (
              <div
                key={code.id}
                className="flex items-center justify-between p-4 bg-slate-800/40 rounded-xl border border-white/5"
              >
                <div>
                  <p className="font-black text-white">{code.code}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {code.discountType === "PERCENT" ? `${code.discountValue}% off` : `$${code.discountValue} off`}
                    {" · "}{code.usedCount}{code.maxUses ? `/${code.maxUses}` : ""} used
                    {!code.isActive && " · Inactive"}
                  </p>
                </div>
                {code.isActive && (
                  <button
                    onClick={() => deleteMutation.mutate(code.id)}
                    className="text-slate-500 hover:text-red-400 p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
