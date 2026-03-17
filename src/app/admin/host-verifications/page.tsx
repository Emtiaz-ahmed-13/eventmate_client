"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminServices } from "@/services/admin.service";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  AlertTriangle,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function HostVerificationsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState("pending");

  // Check if user is admin
  if (user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-12 bg-slate-900/60 backdrop-blur-3xl rounded-[3rem] shadow-premium max-w-md border border-white/5">
          <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-red-500/20">
            <Shield className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">Access Denied</h2>
          <p className="text-slate-400 mb-10 font-medium italic">Admin privileges required</p>
          <Button onClick={() => router.push("/")} variant="glow" size="lg" className="rounded-2xl px-10">
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  const { data: hosts, isLoading } = useQuery({
    queryKey: ["admin-hosts"],
    queryFn: AdminServices.getAllHosts,
  });

  // Mock verification data - in real app this would come from backend
  const verificationRequests = [
    {
      id: 1,
      userId: "user_123",
      name: "John Smith",
      email: "john@example.com",
      phone: "+1234567890",
      location: "New York, NY",
      status: "pending",
      submittedAt: "2024-03-17T10:00:00Z",
      documents: ["ID_verification.pdf", "Business_license.pdf"],
      experience: "5 years organizing tech conferences",
      eventsHosted: 0,
      rating: null,
      verificationNotes: "Initial application submitted"
    },
    {
      id: 2,
      userId: "user_456",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "+1987654321",
      location: "Los Angeles, CA",
      status: "pending",
      submittedAt: "2024-03-17T09:30:00Z",
      documents: ["ID_verification.pdf", "References.pdf"],
      experience: "3 years organizing community events",
      eventsHosted: 0,
      rating: null,
      verificationNotes: "Waiting for document review"
    },
    {
      id: 3,
      userId: "user_789",
      name: "Mike Wilson",
      email: "mike@example.com",
      phone: "+1555666777",
      location: "Chicago, IL",
      status: "approved",
      submittedAt: "2024-03-16T14:00:00Z",
      approvedAt: "2024-03-17T08:00:00Z",
      documents: ["ID_verification.pdf", "Business_license.pdf", "Insurance.pdf"],
      experience: "10 years event management experience",
      eventsHosted: 12,
      rating: 4.8,
      verificationNotes: "Excellent credentials and references"
    },
    {
      id: 4,
      userId: "user_999",
      name: "Lisa Brown",
      email: "lisa@example.com",
      phone: "+1444555666",
      location: "Miami, FL",
      status: "rejected",
      submittedAt: "2024-03-16T12:00:00Z",
      rejectedAt: "2024-03-17T07:00:00Z",
      documents: ["ID_verification.pdf"],
      experience: "New to event hosting",
      eventsHosted: 0,
      rating: null,
      verificationNotes: "Insufficient documentation provided"
    }
  ];

  const filteredRequests = verificationRequests.filter(request => 
    activeFilter === "all" || request.status === activeFilter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "approved": return "text-green-500 bg-green-500/10 border-green-500/20";
      case "rejected": return "text-red-500 bg-red-500/10 border-red-500/20";
      default: return "text-slate-500 bg-slate-500/10 border-slate-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4 text-yellow-500" />;
      case "approved": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "rejected": return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  const statusCounts = {
    all: verificationRequests.length,
    pending: verificationRequests.filter(r => r.status === 'pending').length,
    approved: verificationRequests.filter(r => r.status === 'approved').length,
    rejected: verificationRequests.filter(r => r.status === 'rejected').length,
  };

  const handleApprove = (requestId: number) => {
    // In real app, this would call the API
    console.log("Approving request:", requestId);
  };

  const handleReject = (requestId: number) => {
    // In real app, this would call the API
    console.log("Rejecting request:", requestId);
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="bg-slate-900/40 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-3">
                <UserCheck className="w-8 h-8 text-purple-500" />
                Host Verifications
              </h1>
              <p className="text-slate-400 font-medium mt-2">Review and approve host applications</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="emerald" className="bg-yellow-500/20 text-yellow-500 border-none text-xs font-black tracking-[0.2em] px-4 py-2 uppercase">
                <Clock className="w-3 h-3 mr-2" />
                {statusCounts.pending} Pending
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Verification Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <Card className="border border-white/5 shadow-premium bg-slate-900/40 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Pending</p>
                  <p className="text-3xl font-black text-yellow-500">{statusCounts.pending}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/5 shadow-premium bg-slate-900/40 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Approved</p>
                  <p className="text-3xl font-black text-green-500">{statusCounts.approved}</p>
                </div>
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/5 shadow-premium bg-slate-900/40 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Rejected</p>
                  <p className="text-3xl font-black text-red-500">{statusCounts.rejected}</p>
                </div>
                <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/5 shadow-premium bg-slate-900/40 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Total</p>
                  <p className="text-3xl font-black text-white">{statusCounts.all}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-8 p-2 bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/5">
          {[
            { id: "pending", label: "Pending Review" },
            { id: "approved", label: "Approved" },
            { id: "rejected", label: "Rejected" },
            { id: "all", label: "All Requests" },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex-1 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all ${
                activeFilter === filter.id
                  ? "bg-primary text-slate-900 shadow-xl shadow-primary/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Verification Requests */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="border border-white/5 shadow-premium bg-slate-900/40 backdrop-blur-xl">
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="h-6 bg-slate-700 rounded mb-4"></div>
                      <div className="h-4 bg-slate-700 rounded mb-2"></div>
                      <div className="h-4 bg-slate-700 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredRequests.length === 0 ? (
            <Card className="border border-white/5 shadow-premium bg-slate-900/40 backdrop-blur-xl">
              <CardContent className="p-12 text-center">
                <UserCheck className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-black text-white mb-2">No Verification Requests</h3>
                <p className="text-slate-400">No host verification requests match the current filter</p>
              </CardContent>
            </Card>
          ) : (
            filteredRequests.map((request) => (
              <Card key={request.id} className="border border-white/5 shadow-premium bg-slate-900/40 backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                        <UserCheck className="w-6 h-6 text-purple-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-black text-white">{request.name}</h3>
                          <Badge className={`text-xs font-black tracking-[0.2em] px-2 py-1 uppercase border ${getStatusColor(request.status)}`}>
                            {getStatusIcon(request.status)}
                            <span className="ml-1">{request.status}</span>
                          </Badge>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-slate-400 mb-3">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {request.email}
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {request.phone}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {request.location}
                          </div>
                        </div>
                        <p className="text-slate-300 mb-3">{request.experience}</p>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-400">Events Hosted: </span>
                            <span className="text-white font-bold">{request.eventsHosted}</span>
                          </div>
                          {request.rating && (
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="text-slate-400">Rating: </span>
                              <span className="text-white font-bold">{request.rating}/5</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400 mb-1">Submitted</p>
                      <p className="text-sm text-white">{new Date(request.submittedAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="mb-6">
                    <h4 className="text-sm font-black text-white mb-3 uppercase tracking-[0.2em]">Documents Submitted</h4>
                    <div className="flex flex-wrap gap-2">
                      {request.documents.map((doc, index) => (
                        <Badge key={index} variant="outline" className="border-white/10 text-slate-300">
                          {doc}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Verification Notes */}
                  <div className="mb-6">
                    <h4 className="text-sm font-black text-white mb-2 uppercase tracking-[0.2em]">Notes</h4>
                    <p className="text-slate-400 text-sm bg-slate-800/50 p-3 rounded-lg">
                      {request.verificationNotes}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="sm" className="border-white/10 text-white hover:bg-white/5">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm" className="border-white/10 text-white hover:bg-white/5">
                        <Mail className="w-4 h-4 mr-2" />
                        Contact
                      </Button>
                    </div>
                    
                    {request.status === "pending" && (
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-red-500/20 text-red-500 hover:bg-red-500/10"
                          onClick={() => handleReject(request.id)}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                        <Button 
                          variant="glow" 
                          size="sm"
                          onClick={() => handleApprove(request.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}