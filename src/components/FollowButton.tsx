"use client";

import { useState } from "react";
import { UserPlus, UserMinus, Loader2 } from "lucide-react";
import { FollowServices } from "@/services/follow.service";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";

export const FollowButton = ({ hostId, initialIsFollowing }: { hostId: string; initialIsFollowing?: boolean }) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing || false);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, user } = useAuthStore();

  const handleFollow = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to follow hosts");
      return;
    }
    
    setIsLoading(true);
    try {
      if (isFollowing) {
        await FollowServices.unfollowHost(hostId);
        setIsFollowing(false);
        toast.success("Unfollowed host");
      } else {
        await FollowServices.followHost(hostId);
        setIsFollowing(true);
        toast.success("Following host");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Action failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (user?.id === hostId) return null;

  return (
    <button
      onClick={handleFollow}
      disabled={isLoading}
      className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
        isFollowing
          ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:bg-red-50 hover:text-red-600 hover:border-red-100"
          : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20"
      }`}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isFollowing ? (
        <>
          <UserMinus className="w-4 h-4" />
          Following
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4" />
          Follow Host
        </>
      )}
    </button>
  );
};
