"use client";

import React, { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { UserServices } from "@/services/user.service";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import Link from "next/link";
import { 
  Mail, 
  Info, 
  Sparkles, 
  ChevronRight, 
  MapPin, 
  Calendar,
  Edit,
  Save,
  X,
  Camera,
  Upload,
  Plus
} from "lucide-react";

export default function ProfilePage() {
  const params = useParams();
  const id = params?.id as string;
  const { user: currentUser } = useAuthStore();
  const isOwnProfile = currentUser?.id === id;
  const queryClient = useQueryClient();
  
  // Edit states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    bio: "",
    interests: [] as string[],
    location: "",
    profilePhoto: "",
    headerPhoto: ""
  });
  const [newInterest, setNewInterest] = useState("");
  
  // File upload refs
  const profilePhotoRef = useRef<HTMLInputElement>(null);
  const headerPhotoRef = useRef<HTMLInputElement>(null);

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      if (!id || id === "undefined") return null;
      return UserServices.getUserProfile(id);
    },
    enabled: !!id && id !== "undefined",
    retry: false,
  });

  const { data: events, isLoading: isEventsLoading } = useQuery({
    queryKey: ["user-events", id],
    queryFn: async () => {
      if (!id || id === "undefined") return { joined: [], hosted: [] };
      return UserServices.getUserEvents(id);
    },
    enabled: !!profile && !!id && id !== "undefined",
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => UserServices.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", id] });
      setIsEditingProfile(false);
      setIsEditingHeader(false);
      // You can add a toast notification here
      console.log("Profile updated successfully!");
    },
    onError: (error) => {
      console.error("Failed to update profile:", error);
      // You can add an error toast notification here
    }
  });

  // Update profile image mutation
  const updateProfileImageMutation = useMutation({
    mutationFn: (file: File) => UserServices.updateProfileImage(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", id] });
      console.log("Profile image updated successfully!");
    },
    onError: (error) => {
      console.error("Failed to update profile image:", error);
    }
  });

  // Update edit form when profile changes
  React.useEffect(() => {
    if (profile) {
      setEditForm({
        name: profile.name || "",
        bio: profile.profile?.bio || "",
        interests: profile.profile?.interests || [],
        location: profile.profile?.location || "",
        profilePhoto: profile.profile?.profileImage || "",
        headerPhoto: profile.profile?.headerPhoto || ""
      });
    }
  }, [profile]);

  // Handle file upload
  const handleFileUpload = async (file: File, type: 'profile' | 'header') => {
    if (!file) return;
    
    if (type === 'profile') {
      // Upload profile image to backend
      updateProfileImageMutation.mutate(file);
    } else {
      // For header photo, create a local URL for now
      // In a real app, you'd upload to a file service
      const imageUrl = URL.createObjectURL(file);
      setEditForm(prev => ({ ...prev, headerPhoto: imageUrl }));
    }
  };

  // Handle save profile
  const handleSaveProfile = () => {
    updateProfileMutation.mutate({
      bio: editForm.bio,
      interests: editForm.interests,
      location: editForm.location || null
    });
  };

  // Handle save header
  const handleSaveHeader = () => {
    // In a real app, you would upload the header photo to a file service
    // For now, we'll just close the edit mode
    setIsEditingHeader(false);
  };

  // Handle add interest
  const handleAddInterest = () => {
    if (newInterest.trim() && !editForm.interests.includes(newInterest.trim())) {
      setEditForm(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest("");
    }
  };

  // Handle remove interest
  const handleRemoveInterest = (interest: string) => {
    setEditForm(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  if (isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary glow-emerald"></div>
      </div>
    );
  }

  if (!profile) {
     return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">User Not Found</h2>
            <p className="text-slate-500 mb-6">The profile you are looking for does not exist.</p>
            <Link href="/">
              <Button>Go Home</Button>
            </Link>
          </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
         {/* Profile Header */}
         <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] shadow-premium border border-white/5 overflow-hidden mb-12">
           <div className="h-64 bg-slate-800 relative group overflow-hidden">
              {/* Default background gradients */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/10 opacity-60" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.15),transparent_70%)]" />
              
              {/* Animated background pattern when no header image */}
              {!(editForm.headerPhoto || profile?.profile?.headerPhoto) && (
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900" />
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse" />
                    <div className="absolute top-20 right-20 w-24 h-24 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-1000" />
                    <div className="absolute bottom-10 left-1/3 w-40 h-40 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-2000" />
                  </div>
                </div>
              )}
              
              {/* Header Image */}
              {(editForm.headerPhoto || profile?.profile?.headerPhoto) && (
                <img 
                  src={editForm.headerPhoto || profile?.profile?.headerPhoto} 
                  alt="Header" 
                  className="w-full h-full object-cover transition-all duration-300"
                />
              )}
              
              {/* Edit overlay when in edit mode */}
              {isEditingHeader && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto border border-white/20">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-white font-medium">Click "Upload Header" to change your cover photo</p>
                    <p className="text-slate-300 text-sm">Recommended size: 1200x300px</p>
                  </div>
                </div>
              )}
              
              {isOwnProfile && (
                <div className="absolute top-6 right-6 flex gap-3">
                  {isEditingHeader ? (
                    <div className="flex gap-2 bg-slate-900/80 backdrop-blur-xl rounded-2xl p-2 border border-white/10">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl"
                        onClick={() => headerPhotoRef.current?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Header
                      </Button>
                      <Button 
                        variant="glow" 
                        size="sm"
                        className="rounded-xl"
                        onClick={handleSaveHeader}
                        disabled={updateProfileMutation.isPending}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-xl"
                        onClick={() => {
                          setIsEditingHeader(false);
                          // Reset header photo to original
                          setEditForm(prev => ({ ...prev, headerPhoto: profile?.profile?.headerPhoto || "" }));
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="white" 
                      size="sm" 
                      className="bg-slate-900/80 backdrop-blur-xl border-white/10 text-white hover:bg-slate-800/90 rounded-xl shadow-lg"
                      onClick={() => setIsEditingHeader(true)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Header
                    </Button>
                  )}
                </div>
              )}
              
              {/* Hidden file inputs */}
              <input
                ref={headerPhotoRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'header');
                }}
              />
          </div>
           <div className="px-12 pb-12 flex flex-col md:flex-row items-end gap-8 -mt-24 relative z-10">
            <div className="w-44 h-44 rounded-[2.5rem] bg-slate-900 border-[6px] border-slate-900 shadow-premium flex items-center justify-center text-5xl font-black text-primary overflow-hidden group/avatar relative cursor-pointer">
               {(editForm.profilePhoto || profile?.profile?.profileImage) ? (
                 <img 
                   src={editForm.profilePhoto || profile?.profile?.profileImage} 
                   alt={profile?.name} 
                   className="w-full h-full object-cover transition-transform duration-700 group-hover/avatar:scale-110" 
                 />
               ) : (
                 <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
                   {profile?.name?.[0]}
                 </div>
               )}
               
               {/* Profile photo edit overlay */}
               {isOwnProfile && (
                 <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all duration-300 cursor-pointer"
                      onClick={() => profilePhotoRef.current?.click()}>
                   <div className="text-center space-y-2">
                     <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto">
                       <Camera className="w-6 h-6 text-white" />
                     </div>
                     <p className="text-white text-xs font-medium">Change Photo</p>
                   </div>
                 </div>
               )}
               
               {/* Upload indicator */}
               {updateProfileImageMutation.isPending && (
                 <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                   <div className="text-center space-y-2">
                     <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
                     <p className="text-white text-xs">Uploading...</p>
                   </div>
                 </div>
               )}
               
               {/* Hidden file input for profile photo */}
               <input
                 ref={profilePhotoRef}
                 type="file"
                 accept="image/*"
                 className="hidden"
                 onChange={(e) => {
                   const file = e.target.files?.[0];
                   if (file) handleFileUpload(file, 'profile');
                 }}
               />
            </div>
            
            <div className="flex-1 mb-4">
              {isEditingProfile ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2 bg-transparent border-b-2 border-primary/30 focus:border-primary outline-none w-full"
                    placeholder="Your name"
                  />
                  <div className="flex items-center gap-3 text-slate-500 font-black uppercase tracking-widest text-xs">
                     <Badge variant="emerald" className="bg-primary/10 text-primary border-none">{profile?.role}</Badge>
                     <span className="opacity-20">•</span>
                     <span>Joined {new Date(profile?.createdAt || '').toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">{profile?.name}</h1>
                  <div className="flex items-center gap-3 text-slate-500 font-black uppercase tracking-widest text-xs">
                     <Badge variant="emerald" className="bg-primary/10 text-primary border-none">{profile?.role}</Badge>
                     <span className="opacity-20">•</span>
                     <span>Joined {new Date(profile?.createdAt || '').toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                  </div>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-4 mb-4">
               {isOwnProfile ? (
                  isEditingProfile ? (
                    <div className="flex gap-2">
                      <Button 
                        variant="glow" 
                        className="rounded-2xl px-10 h-14 font-black uppercase tracking-widest text-xs"
                        onClick={handleSaveProfile}
                        disabled={updateProfileMutation.isPending}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button 
                        variant="outline" 
                        className="rounded-2xl px-6 h-14 font-black uppercase tracking-widest text-xs border-white/20 text-white hover:bg-white/10"
                        onClick={() => setIsEditingProfile(false)}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="glow" 
                      className="rounded-2xl px-10 h-14 font-black uppercase tracking-widest text-xs"
                      onClick={() => setIsEditingProfile(true)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Portfolio
                    </Button>
                  )
               ) : (
                  <Button variant="glow" className="rounded-2xl px-10 h-14 font-black uppercase tracking-widest text-xs">Sync Follow</Button>
               )}
               <Button variant="white" size="icon" className="rounded-2xl w-14 h-14 bg-white/5 border-white/10 text-white hover:bg-white hover:text-slate-900 transition-all border"><Mail className="w-5 h-5" /></Button>
            </div>
          </div>
          <div className="px-12 py-8 border-t border-white/5 bg-slate-900/20 backdrop-blur-md">
             <div className="flex flex-wrap gap-12">
                <div className="flex flex-col">
                   <span className="text-3xl font-black text-white tracking-tighter">{events?.hosted?.length || 0}</span>
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">Experiences Hosted</span>
                </div>
                <div className="w-px h-12 bg-white/5 hidden md:block" />
                <div className="flex flex-col">
                   <span className="text-3xl font-black text-white tracking-tighter">{events?.joined?.length || 0}</span>
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">Nexus Joins</span>
                </div>
                <div className="w-px h-12 bg-white/5 hidden md:block" />
                <div className="flex flex-col">
                   <div className="flex items-center gap-2">
                      <span className="text-3xl font-black text-white tracking-tighter">4.9</span>
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(16,185,129,1)]" />
                   </div>
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">Host Authority</span>
                </div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Sidebar */}
          <div className="space-y-10">
            <Card className="bg-slate-900/40 backdrop-blur-xl border-white/5 rounded-[2.5rem] p-4 shadow-premium">
               <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-xl font-black text-white flex items-center gap-3">
                     <Info className="w-5 h-5 text-primary" />
                     Briefing
                  </CardTitle>
                  <CardDescription className="text-[10px] font-black text-slate-500 uppercase tracking-widest">About this architect</CardDescription>
               </CardHeader>
               <CardContent className="p-8 pt-4">
                  {isEditingProfile ? (
                    <div className="space-y-6">
                      <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 block">Bio</label>
                        <textarea
                          value={editForm.bio}
                          onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                          className="w-full h-32 text-slate-400 text-sm leading-relaxed font-medium bg-slate-800/20 p-6 rounded-2xl border border-white/5 focus:border-primary/30 outline-none resize-none"
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                      
                      <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 block">Location</label>
                        <input
                          type="text"
                          value={editForm.location}
                          onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                          className="w-full px-4 py-3 bg-slate-800/20 border border-white/5 rounded-xl text-white text-sm focus:border-primary/30 outline-none"
                          placeholder="Your location..."
                        />
                      </div>
                      
                      <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 block">Ecosystem Specializations</label>
                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-2">
                            {editForm.interests.map((interest) => (
                              <Badge 
                                key={interest} 
                                variant="emerald" 
                                className="bg-primary/5 text-primary border-primary/10 px-3 py-1 font-black text-[9px] uppercase tracking-widest cursor-pointer hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-colors group"
                                onClick={() => handleRemoveInterest(interest)}
                              >
                                {interest}
                                <X className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newInterest}
                              onChange={(e) => setNewInterest(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleAddInterest()}
                              className="flex-1 px-4 py-2 bg-slate-800/20 border border-white/5 rounded-xl text-white text-sm focus:border-primary/30 outline-none"
                              placeholder="Add new interest..."
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleAddInterest}
                              className="border-primary/20 text-primary hover:bg-primary/10"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-slate-400 text-sm leading-relaxed font-medium italic bg-slate-800/20 p-6 rounded-2xl border border-white/5">
                        "{profile?.profile?.bio || "This host operates in stealth mode. No bio available yet."}"
                      </p>
                      <div className="mt-8 space-y-4">
                         <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Ecosystem Specializations</h4>
                         <div className="flex flex-wrap gap-2">
                           {(profile?.profile?.interests || ['Music', 'Art', 'Tech']).map((tag: string) => (
                             <Badge key={tag} variant="emerald" className="bg-primary/5 text-primary border-primary/10 px-3 py-1 font-black text-[9px] uppercase tracking-widest">
                               {tag}
                             </Badge>
                           ))}
                         </div>
                      </div>
                    </>
                  )}
               </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-10">
             <Card className="bg-slate-900/40 backdrop-blur-xl border-white/5 rounded-[2.5rem] p-4 shadow-premium">
                <CardHeader className="px-10 py-10 pb-4">
                   <div className="flex justify-between items-center">
                      <div>
                         <CardTitle className="text-2xl font-black text-white flex items-center gap-3">
                            <Sparkles className="w-6 h-6 text-primary" />
                            Recent Protocol Activity
                         </CardTitle>
                         <CardDescription className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Latest interactions with the platform</CardDescription>
                      </div>
                      <Badge variant="emerald" className="bg-primary/20 text-primary border-none px-4 py-2 font-black text-[10px] uppercase tracking-widest">Live Feed</Badge>
                   </div>
                </CardHeader>
                
                <CardContent className="px-10 py-10 pt-4">
                {isEventsLoading ? (
                   <div className="space-y-4 text-center py-20">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary mx-auto mb-4" />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Syncing activity stream...</span>
                   </div>
                ) : events?.length === 0 ? (
                   <div className="text-center py-20 border-2 border-dashed rounded-[2rem] border-white/5 bg-slate-900/20">
                      <p className="text-slate-500 font-medium italic text-sm">No protocol data discovered for this user yet.</p>
                   </div>
                ) : (
                   <div className="space-y-4">
                      {[...(events?.hosted || []), ...(events?.joined || [])].slice(0, 5).map((event: any) => (
                         <div key={event.id} className="group p-6 rounded-[2rem] bg-slate-800/30 hover:bg-slate-800/60 transition-all border border-white/5 hover:border-primary/20 flex gap-8 items-center">
                            <div className="w-20 h-20 rounded-2xl bg-slate-950 border border-white/5 flex items-center justify-center text-primary font-black text-2xl group-hover:scale-110 transition-transform">
                               {event.type[0]}
                            </div>
                            <div className="flex-1">
                               <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-black text-white text-xl tracking-tight group-hover:text-primary transition-colors">{event.name}</h4>
                                  <Badge variant="emerald" className="bg-slate-900 border-white/5 text-[9px] font-black uppercase tracking-widest px-3 py-1">
                                     {events.hosted?.find((e: any) => e.id === event.id) ? 'ARCHITECT' : 'PARTICIPANT'}
                                  </Badge>
                               </div>
                               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                  <MapPin className="w-3 h-3 text-primary" /> {event.location} 
                                  <span className="opacity-20">|</span> 
                                  <Calendar className="w-3 h-3 text-primary" /> {new Date(event.dateTime).toLocaleDateString()}
                               </p>
                               <Link href={`/events/${event.id}`} className="group/link inline-flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-colors">
                                  Access Protocol <ChevronRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                         </div>
                      ))}
                   </div>
                )}
             </CardContent>
          </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
