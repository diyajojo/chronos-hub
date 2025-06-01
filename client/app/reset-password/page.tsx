'use client';
import { useState, Suspense } from 'react';

// Force dynamic rendering to prevent prerendering issues with useSearchParams
export const dynamic = 'force-dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../components/layout/navbar';
import StarBackground from '../components/design/starbackground';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { API_BASE_URL } from '@/lib/config';

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-indigo-950 overflow-hidden relative">
    <StarBackground />
    <Navbar page="reset-password" />
    <div className="flex items-center justify-center w-full min-h-[calc(100vh-64px)] py-6 sm:py-0">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col items-center justify-center gap-8">
          <div className="flex items-center justify-center w-full md:w-1/2">
            <Card className="p-0 w-full max-w-md shadow-none border-none bg-transparent">
              <CardHeader className="border-b border-blue-500/20 p-6 space-y-4">
                <CardTitle className="font-urbanist text-blue-200 text-2xl">Reset Password</CardTitle>
                <CardDescription className="font-urbanist text-blue-300/70">
                  Loading...
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Reset Password Content component
const ResetPasswordContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      if (response.status === 429) {
        throw new Error('Too many password reset attempts. Please try again in 24 hours.');
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to reset password');
      }
      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-indigo-950 overflow-hidden relative">
      <StarBackground />
      <Navbar page="reset-password" />
      <div className="flex items-center justify-center w-full min-h-[calc(100vh-64px)] py-6 sm:py-0">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center gap-8">
            <div className="flex items-center justify-center w-full md:w-1/2">
              <Card className="p-0 w-full max-w-md shadow-none border-none bg-transparent">
                <CardHeader className="border-b border-blue-500/20 p-6 space-y-4">
                  <CardTitle className="font-urbanist text-blue-200 text-2xl">Reset Password</CardTitle>
                  <CardDescription className="font-urbanist text-blue-300/70">
                    Enter your new password below
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {success ? (
                    <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-md">
                      <p className="font-urbanist text-green-200 text-sm">
                        Password reset successful! Redirecting to login...
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid gap-5">
                        {error && (
                          <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-md">
                            <p className="font-urbanist text-red-200 text-sm">{error}</p>
                          </div>
                        )}
                        <div className="grid gap-3">
                          <Label htmlFor="password" className="font-urbanist text-blue-200">New Password</Label>
                          <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter new password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            className="font-urbanist bg-blue-950/40 border-blue-500/30 text-blue-200"
                          />
                        </div>
                      </div>
                      <Button type="submit" className="font-urbanist w-full cursor-pointer bg-blue-800/30 hover:bg-blue-800/50 text-blue-200 border border-blue-500/30" disabled={isLoading}>
                        {isLoading ? "Resetting..." : "Reset Password"}
                      </Button>
                    </form>
                  )}
                </CardContent>
                <CardFooter className="p-6 border-t border-blue-500/20">
                  <p className="font-urbanist text-center text-blue-300/70 text-sm w-full">
                    <Link href="/login" className="text-blue-400 hover:text-blue-300">Back to Login</Link>
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ResetPassword() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResetPasswordContent />
    </Suspense>
  );
}