'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { AuthServices } from '@/services/auth.service';
import Link from 'next/link';
import { toast } from 'sonner';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setLoading(true);
    try {
      const response = await AuthServices.forgotPassword(data.email);
      if (response.success) {
        setSuccess(true);
        toast.success('Password reset email sent!');
      } else {
        toast.error(response.message || 'Failed to send reset email');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

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
              Reset Transmitted
            </h2>
            <p className="mt-2 text-xs font-black text-slate-500 uppercase tracking-[0.2em] italic">
              Security protocol initiated
            </p>
          </div>

          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/10 rounded-full">
              <div className="text-green-500 text-4xl">✓</div>
            </div>
            <div className="space-y-2">
              <p className="text-green-400 font-bold text-lg">Reset Link Sent</p>
              <p className="text-slate-300 text-sm">
                Check your email for password reset instructions.
              </p>
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
            Recover access credentials
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
              Email Protocol
            </label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-6 py-4 bg-slate-900/50 border border-white/5 rounded-2xl text-white focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-slate-700 font-medium"
              placeholder="architect@nexus.com"
            />
            {errors.email && (
              <p className="mt-2 text-[10px] text-red-500 font-black uppercase tracking-widest ml-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            variant="glow"
            className="w-full h-14 font-black text-xs uppercase tracking-[0.3em] rounded-2xl shadow-xl transition-all active:scale-[0.98]"
          >
            {loading ? 'Transmitting...' : 'Send Reset Protocol'}
          </Button>
        </form>

        <p className="text-center text-[10px] font-black uppercase tracking-widest text-slate-500 italic">
          Remember credentials?{" "}
          <Link href="/login" className="text-primary hover:text-white transition-colors">
            Access Session
          </Link>
        </p>
      </div>
    </div>
  );
}