"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ReportServices } from "@/services/report.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Flag, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-400",
  REVIEWED: "bg-blue-500/20 text-blue-400",
  RESOLVED: "bg-green-500/20 text-green-400",
  DISMISSED: "bg-slate-500/20 text-slate-400",
};

const FILTERS = ["all", "PENDING", "REVIEWED", "RESOLVED", "DISMISSED"];

export default function AdminReportsPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all");

  const { data: reports = [], isLoading, refetch } = useQuery({
    queryKey: ["admin-reports", filter],
    queryFn: () => ReportServices.getAllReports(filter === "all" ? undefined : filter),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      ReportServices.updateReportStatus(id, status),
    onSuccess: () => {
      toast.success("Report status updated");
      queryClient.invalidateQueries({ queryKey: ["admin-reports"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update report");
    },
  });

  return (
    <div className="max-w-7xl mx-auto">
      <AdminPageHeader
        title="Reports"
        description="Safety and moderation reports from users"
        actions={
          <>
            <Button
              variant="outline"
              className="border-white/10 text-white hover:bg-white/5 rounded-xl font-black text-xs uppercase tracking-widest"
              onClick={() => refetch()}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Badge className="bg-red-500/20 text-red-400 border-none text-xs font-black px-4 py-2 uppercase tracking-widest">
              {reports.length} reports
            </Badge>
          </>
        }
      />

      <div className="flex gap-2 mb-8 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              filter === f
                ? "bg-primary text-slate-900"
                : "bg-slate-900/40 text-slate-400 border border-white/5 hover:text-white"
            }`}
          >
            {f === "all" ? "All" : f}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-slate-800/30 animate-pulse rounded-2xl border border-white/5" />
          ))}
        </div>
      ) : reports.length === 0 ? (
        <Card className="border-white/5 bg-slate-900/40">
          <CardContent className="py-16 text-center">
            <Flag className="w-10 h-10 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500">No reports found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reports.map((report: any) => (
            <Card key={report.id} className="border-white/5 bg-slate-900/40">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className={`${STATUS_COLORS[report.status]} border-none text-[10px] font-black uppercase`}>
                        {report.status}
                      </Badge>
                      <Badge variant="outline" className="border-white/10 text-slate-400 text-[10px] font-black uppercase">
                        {report.targetType}
                      </Badge>
                    </div>
                    <p className="font-black text-white mb-1">{report.reason}</p>
                    {report.description && (
                      <p className="text-sm text-slate-400 mb-3">{report.description}</p>
                    )}
                    <p className="text-xs text-slate-600">
                      Reported by {report.reporter?.name} ({report.reporter?.email}) ·{" "}
                      {new Date(report.createdAt).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-slate-600 mt-1 font-mono">Target: {report.targetId}</p>
                  </div>

                  {report.status === "PENDING" && (
                    <div className="flex flex-wrap gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-lg text-xs font-black border-green-500/30 text-green-400"
                        onClick={() => updateMutation.mutate({ id: report.id, status: "RESOLVED" })}
                      >
                        Resolve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-lg text-xs font-black border-slate-500/30 text-slate-400"
                        onClick={() => updateMutation.mutate({ id: report.id, status: "DISMISSED" })}
                      >
                        Dismiss
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-lg text-xs font-black border-blue-500/30 text-blue-400"
                        onClick={() => updateMutation.mutate({ id: report.id, status: "REVIEWED" })}
                      >
                        Mark Reviewed
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
