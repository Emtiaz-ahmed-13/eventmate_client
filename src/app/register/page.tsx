"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { toast } from "sonner";
import { AuthServices } from "@/services/auth.service";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["USER", "HOST"]),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get("role") as "USER" | "HOST") || "USER";

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: initialRole,
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    try {
      const response = await AuthServices.register(data);
      if (response.success) {
        toast.success("Registration successful! You can now login.");
        router.push("/login");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
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
          <Link
            href="/"
            className="text-4xl font-black text-white tracking-tighter hover:text-primary transition-colors"
          >
            Event<span className="text-primary glow-emerald">Mate</span>
          </Link>
          <h2 className="mt-8 text-3xl font-black text-white tracking-tight">
            Create Account
          </h2>
          <p className="mt-2 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">
            Join the EventMate community
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            {/* Role Selection */}
            <div className="flex p-1.5 bg-slate-900/60 rounded-2xl mb-8 border border-white/5">
              <button
                type="button"
                onClick={() => setValue("role", "USER")}
                className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all uppercase tracking-[0.2em] ${
                  selectedRole === "USER"
                    ? "bg-slate-800 text-primary shadow-lg border border-white/5"
                    : "text-slate-600 hover:text-slate-400"
                }`}
              >
                Participant
              </button>
              <button
                type="button"
                onClick={() => setValue("role", "HOST")}
                className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all uppercase tracking-[0.2em] ${
                  selectedRole === "HOST"
                    ? "bg-primary text-slate-900 shadow-xl shadow-primary/20"
                    : "text-slate-600 hover:text-slate-400"
                }`}
              >
                Architect
              </button>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
                Identity Name
              </label>
              <input
                {...register("name")}
                type="text"
                className="w-full px-6 py-4 bg-slate-900/50 border border-white/5 rounded-2xl text-white focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-slate-700 font-medium"
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-2 text-[10px] text-red-500 font-black uppercase tracking-widest ml-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
                Email Protocol
              </label>
              <input
                {...register("email")}
                type="email"
                className="w-full px-6 py-4 bg-slate-900/50 border border-white/5 rounded-2xl text-white focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-slate-700 font-medium"
                placeholder="you@nexus.com"
              />
              {errors.email && (
                <p className="mt-2 text-[10px] text-red-500 font-black uppercase tracking-widest ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
                Secure Key
              </label>
              <input
                {...register("password")}
                type="password"
                className="w-full px-6 py-4 bg-slate-900/50 border border-white/5 rounded-2xl text-white focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-slate-700 font-medium"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-2 text-[10px] text-red-500 font-black uppercase tracking-widest ml-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            variant="glow"
            className="w-full h-14 font-black text-xs uppercase tracking-[0.3em] rounded-2xl shadow-xl transition-all active:scale-[0.98]"
          >
            {loading
              ? "Creating account..."
              : `Sign up as ${selectedRole === "USER" ? "Participant" : "Host"}`}
          </Button>
        </form>

        <p className="text-center text-[10px] font-black uppercase tracking-widest text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:text-white transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    }>
      <RegisterContent />
    </Suspense>
  );
}