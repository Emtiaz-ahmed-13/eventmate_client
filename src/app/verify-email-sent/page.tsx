'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AuthServices } from '@/services/auth.service';
import Link from 'next/link';
import { toast } from 'sonner';

function VerifyEmailSentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleResendEmail = async () => {
    if (!email) return;
    
    setIsResending(true);
    try {
      const response = await AuthServices.resendVerificationEmail(email);
      if (response.success) {
        setCountdown(60);
        setCanResend(false);
        toast.success('Verification email sent again!');
      } else {
        toast.error(response.message || 'Failed to resend email. Please try again.');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsResending(false);
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
            Check Your Email
          </h2>
          <p className="mt-2 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">
            Verification link sent
          </p>
        </div>

        <div className="space-y-8">
          {/* Email Icon */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
              <div className="text-primary text-3xl">📧</div>
            </div>
          </div>

          {/* Email Address */}
          <div className="text-center space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Verification sent to
            </p>
            <p className="text-primary font-bold text-lg break-all">
              {email || 'your email address'}
            </p>
          </div>

          {/* Warning */}
          <div className="p-4 bg-yellow-900/20 border border-yellow-500/20 rounded-2xl">
            <p className="text-yellow-400 text-[10px] font-black uppercase tracking-[0.2em] text-center">
              ⚠️ Please verify before logging in
            </p>
          </div>

          {/* Instructions */}
          <div className="space-y-4">
            <p className="text-slate-300 text-sm text-center font-medium">
              Click the verification link in your email to activate your account.
            </p>
            
            {/* Action Buttons */}
            <div className="space-y-3">
              {canResend ? (
                <Button 
                  onClick={handleResendEmail}
                  disabled={isResending}
                  variant="glow"
                  className="w-full h-12 font-black text-xs uppercase tracking-[0.3em] rounded-2xl"
                >
                  {isResending ? "Transmitting..." : "Resend Verification"}
                </Button>
              ) : (
                <Button 
                  disabled
                  className="w-full h-12 bg-slate-700 text-slate-400 font-black text-xs uppercase tracking-[0.3em] rounded-2xl cursor-not-allowed"
                >
                  Resend in {countdown}s
                </Button>
              )}
              
              <Button 
                onClick={() => router.push('/login')}
                variant="outline"
                className="w-full h-12 border-white/10 text-white hover:bg-white/5 font-black text-xs uppercase tracking-[0.3em] rounded-2xl"
              >
                Go to Login
              </Button>
            </div>
          </div>

          {/* Help Section */}
          <div className="p-4 bg-slate-800/30 rounded-2xl border border-white/5">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 text-center">
              Transmission Issues?
            </p>
            <ul className="text-[9px] text-slate-500 space-y-1 font-medium">
              <li>• Check spam/junk folder</li>
              <li>• Verify email address accuracy</li>
              <li>• Wait 2-3 minutes for delivery</li>
              <li>• Use resend function above</li>
            </ul>
          </div>
        </div>

        <p className="text-center text-[10px] font-black uppercase tracking-widest text-slate-500">
          Wrong email?{" "}
          <Link href="/register" className="text-primary hover:text-white transition-colors">
            Register again
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function VerifyEmailSent() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    }>
      <VerifyEmailSentContent />
    </Suspense>
  );
}