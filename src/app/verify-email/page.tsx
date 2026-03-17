'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';

function VerifyEmailContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }

    verifyEmail(token);
  }, [token]);

  const verifyEmail = async (token: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email?token=${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage('Email verified successfully! You can now login.');
        toast.success('Email verified successfully!');
      } else {
        setStatus('error');
        setMessage(data.message || 'Verification failed');
        toast.error(data.message || 'Verification failed');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
      toast.error('Something went wrong. Please try again.');
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
            Protocol Verification
          </h2>
          <p className="mt-2 text-xs font-black text-slate-500 uppercase tracking-[0.2em] italic">
            Authenticating identity matrix
          </p>
        </div>
        
        <div className="space-y-8">
          {status === 'loading' && (
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              </div>
              <p className="text-slate-300 font-medium text-sm">Verifying your identity...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/10 rounded-full">
                <div className="text-green-500 text-4xl">✓</div>
              </div>
              <div className="space-y-2">
                <p className="text-green-400 font-bold text-lg">Identity Verified</p>
                <p className="text-slate-300 text-sm">{message}</p>
              </div>
              <Button 
                onClick={() => router.push('/login')}
                variant="glow"
                className="w-full h-12 font-black text-xs uppercase tracking-[0.3em] rounded-2xl"
              >
                Access Nexus
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/10 rounded-full">
                <div className="text-red-500 text-4xl">✗</div>
              </div>
              <div className="space-y-2">
                <p className="text-red-400 font-bold text-lg">Verification Failed</p>
                <p className="text-slate-300 text-sm">{message}</p>
              </div>
              <div className="space-y-3">
                <Button 
                  onClick={() => router.push('/register')}
                  variant="glow"
                  className="w-full h-12 font-black text-xs uppercase tracking-[0.3em] rounded-2xl"
                >
                  Re-establish Identity
                </Button>
                <Button 
                  onClick={() => router.push('/login')}
                  variant="outline"
                  className="w-full h-12 border-white/10 text-white hover:bg-white/5 font-black text-xs uppercase tracking-[0.3em] rounded-2xl"
                >
                  Access Session
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}