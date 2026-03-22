"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AuthServices } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthServices.login(data);
      if (response.success) {
        setAuth(response.data.user, response.data.accessToken);
        router.push("/");
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Something went wrong. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Decorative Blurs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-md w-full space-y-10 p-12 bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] shadow-premium border border-white/5 relative z-10 box-glow">
        <div className="text-center">
          <Link href="/" className="text-4xl font-black text-white tracking-tighter hover:text-primary transition-colors">Event<span className="text-primary glow-emerald">Mate</span></Link>
          <h2 className="mt-8 text-3xl font-black text-white tracking-tight">Access Nexus</h2>
          <p className="mt-2 text-xs font-black text-slate-500 uppercase tracking-[0.2em] italic">Authenticate to continue protocol</p>
        </div>

        {error && (
          <div className="p-4 bg-red-900/20 border border-red-500/20 text-red-400 text-[10px] rounded-2xl font-black uppercase tracking-widest text-center">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Email Protocol</label>
              <input
                {...register("email")}
                type="email"
                className="w-full px-6 py-4 bg-slate-900/50 border border-white/5 rounded-2xl text-white focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-slate-700 font-medium"
                placeholder="architect@nexus.com"
              />
              {errors.email && <p className="mt-2 text-[10px] text-red-500 font-black uppercase tracking-widest ml-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Secure Key</label>
              <input
                {...register("password")}
                type="password"
                className="w-full px-6 py-4 bg-slate-900/50 border border-white/5 rounded-2xl text-white focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-slate-700 font-medium"
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-2 text-[10px] text-red-500 font-black uppercase tracking-widest ml-1">{errors.password.message}</p>}
            </div>
            
            <div className="text-right">
              <Link 
                href="/forgot-password" 
                className="text-[10px] font-black text-slate-400 hover:text-primary transition-colors uppercase tracking-[0.2em]"
              >
                Forgot Key?
              </Link>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={loading}
              variant="glow"
              className="w-full h-14 font-black text-xs uppercase tracking-[0.3em] rounded-2xl shadow-xl transition-all active:scale-[0.98]"
            >
              {loading ? "Syncing..." : "Initialize Session"}
            </Button>
          </div>
        </form>

        <p className="text-center text-[10px] font-black uppercase tracking-widest text-slate-500 italic">
          New to the Nexus?{" "}
          <Link href="/register" className="text-primary hover:text-white transition-colors">
            Establish Identity
          </Link>
        </p>
      </div>
    </div>
  );
}
