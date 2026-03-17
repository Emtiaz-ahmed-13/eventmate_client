'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { AuthServices } from '@/services/auth.service';
import Link from 'next/link';
import { toast } from 'sonner';

const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) {
      toast.error('Invalid reset link');
      return;
    }

    setLoading(true);
    try {
      const response = await AuthServices.resetPassword(token, data.newPassword);
      if (response.success) {
        setSuccess(true);
        toast.success('Password reset successfully!');
      } else {
        toast.error(response.message || 'Reset failed');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
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
              Invalid Protocol
            </h2>
            <p className="mt-2 text-xs font-black text-slate-500 uppercase tracking-[0.2em] italic">
              Reset link compromised
            </p>
          </div>

          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/10 rounded-full">
              <div className="text-red-500 text-4xl">✗</div>
            </div>
            <div className="space-y-2">
              <p className="text-red-400 font-bold text-lg">Invalid Link</p>
              <p className="text-slate-300 text-sm">This reset password link is invalid or expired.</p>
            </div>
            <Button 
              onClick={() => router.push('/login')}
              variant="glow"
              className="w-full h-12 font-black text-xs uppercase tracking-[0.3em] rounded-2xl"
            >
              Access Session
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
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
              Protocol Updated
            </h2>
            <p className="mt-2 text-xs font-black text-slate-500 uppercase tracking-[0.2em] italic">
              Security credentials renewed
            </p>
          </div>

          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/10 rounded-full">
              <div className="text-green-500 text-4xl">✓</div>
            </div>
            <div className="space-y-2">
              <p className="text-green-400 font-bold text-lg">Password Reset Successful</p>
              <p className="text-slate-300 text-sm">Your password has been reset successfully.</p>
            </div>
            <Button 
              onClick={() => router.push('/login')}
              variant="glow"
              className="w-full h-12 font-black text-xs uppercase tracking-[0.3em] rounded-2xl"
            >
              Access Nexus
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
            Reset Protocol
          </h2>
          <p className="mt-2 text-xs font-black text-slate-500 uppercase tracking-[0.2em] italic">
            Configure new credentials
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
              New Secure Key
            </label>
            <input
              {...register('newPassword')}
              type="password"
              className="w-full px-6 py-4 bg-slate-900/50 border border-white/5 rounded-2xl text-white focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-slate-700 font-medium"
              placeholder="••••••••"
            />
            {errors.newPassword && (
              <p className="mt-2 text-[10px] text-red-500 font-black uppercase tracking-widest ml-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
              Confirm Secure Key
            </label>
            <input
              {...register('confirmPassword')}
              type="password"
              className="w-full px-6 py-4 bg-slate-900/50 border border-white/5 rounded-2xl text-white focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-slate-700 font-medium"
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="mt-2 text-[10px] text-red-500 font-black uppercase tracking-widest ml-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            variant="glow"
            className="w-full h-14 font-black text-xs uppercase tracking-[0.3em] rounded-2xl shadow-xl transition-all active:scale-[0.98]"
          >
            {loading ? 'Updating...' : 'Update Protocol'}
          </Button>
        </form>

        <div className="text-center">
          <Button
            onClick={() => router.push('/login')}
            variant="outline"
            className="border-white/10 text-white hover:bg-white/5 font-black text-xs uppercase tracking-[0.3em]"
          >
            Cancel Reset
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}