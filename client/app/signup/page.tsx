'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../components/layout/navbar';
import StarBackground from '../components/design/starbackground';
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import { MagicCard } from "@/components/magicui/magic-card";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_BASE_URL } from '@/lib/config';

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 429) {
        setError('Too many signup attempts. Please try again in 10 minutes.');
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      // Show OTP form instead of redirecting
      setShowOTPForm(true);
    } 
    catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          otp: otp
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'OTP verification failed');
      }

      // Only redirect to login after successful OTP verification
      window.location.href = '/login';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  // For animated beams
  const containerRef = useRef<HTMLDivElement>(null);
  const spaceshipRef = useRef<HTMLDivElement>(null);
  const rocketRef = useRef<HTMLDivElement>(null);
  const alienRef = useRef<HTMLDivElement>(null);
  const planetRef = useRef<HTMLDivElement>(null);
  const robotRef = useRef<HTMLDivElement>(null);
  const crystalRef = useRef<HTMLDivElement>(null);
  const cometRef = useRef<HTMLDivElement>(null);
  const astronautRef = useRef<HTMLDivElement>(null);

  // Custom component for space emoji icons
  const SpaceEmoji = ({ emoji, size, ref, className }: 
    { emoji: string; size: string; ref: React.RefObject<HTMLDivElement | null>; className?: string }) => {
    return (
      <div
        ref={ref}
        className={cn(
          `flex items-center justify-center rounded-full bg-blue-950/60 border border-blue-500/30 
           backdrop-blur-sm shadow-lg shadow-blue-500/20 ${size}`,
          className
        )}
      >
        <span className="text-xl sm:text-2xl">{emoji}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-indigo-950 overflow-hidden relative">
      <StarBackground />
      <Navbar page="signup" />
      
      <div className="flex items-center justify-center w-full min-h-[calc(100vh-64px)] py-6 md:py-0 overflow-y-auto">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            {/* Animated Beam Container - Left side */}
            <div 
              ref={containerRef}
              className="relative h-96 sm:h-[28rem] w-full md:w-1/2 flex items-center justify-center overflow-hidden"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <SpaceEmoji emoji="👨‍🚀" size="w-20 h-20" ref={astronautRef} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20" />
                
                <SpaceEmoji emoji="🛸" size="w-16 h-16" ref={spaceshipRef} className="absolute left-[15%] top-[10%] sm:left-[20%] sm:top-[20%]" />
                <SpaceEmoji emoji="🚀" size="w-14 h-14" ref={rocketRef} className="absolute right-[15%] top-[10%] sm:right-[25%] sm:top-[15%]" />
                <SpaceEmoji emoji="👽" size="w-12 h-12" ref={alienRef} className="absolute left-[10%] bottom-[15%] sm:left-[15%] sm:bottom-[25%]" />
                <SpaceEmoji emoji="🤖" size="w-12 h-12" ref={robotRef} className="absolute right-[10%] bottom-[15%] sm:right-[20%] sm:bottom-[20%]" />
                <SpaceEmoji emoji="🪐" size="w-16 h-16" ref={planetRef} className="absolute left-[25%] top-[45%] sm:left-[30%] sm:top-[50%]" />
                <SpaceEmoji emoji="💎" size="w-10 h-10" ref={crystalRef} className="absolute right-[25%] top-[40%] sm:right-[30%] sm:top-[45%]" />
                <SpaceEmoji emoji="☄️" size="w-14 h-14" ref={cometRef} className="absolute left-[35%] bottom-[10%] sm:left-[40%] sm:bottom-[15%]" />
              </div>

              {/* Beams connecting to the astronaut (center) */}
              <AnimatedBeam containerRef={containerRef} fromRef={spaceshipRef} toRef={astronautRef} curvature={-30} />
              <AnimatedBeam containerRef={containerRef} fromRef={rocketRef} toRef={astronautRef} curvature={30} />
              <AnimatedBeam containerRef={containerRef} fromRef={alienRef} toRef={astronautRef} curvature={45} />
              <AnimatedBeam containerRef={containerRef} fromRef={robotRef} toRef={astronautRef} curvature={-45} />
              <AnimatedBeam containerRef={containerRef} fromRef={planetRef} toRef={astronautRef} curvature={15} />
              <AnimatedBeam containerRef={containerRef} fromRef={crystalRef} toRef={astronautRef} curvature={-15} />
              <AnimatedBeam containerRef={containerRef} fromRef={cometRef} toRef={astronautRef} curvature={60} />
            </div>

            {/* Magic Card Signup Form - Right side */}
            <div className="flex items-center justify-center w-full md:w-1/2">
              <Card className="p-0 w-full max-w-md shadow-none border-none bg-transparent">
                <MagicCard
                  gradientColor="#0f172a"
                  gradientFrom="#1e3a8a"
                  gradientTo="#312e81"
                  gradientOpacity={0.3}
                  className="font-urbanist p-0 bg-blue-950/30 backdrop-blur-sm border-blue-500/20 min-h-[500px]"
                >
                  <CardHeader className="border-b border-blue-500/20 p-6 [.border-b]:pb-6 space-y-4">
                    <CardTitle className="font-urbanist text-blue-200 text-2xl">
                      {showOTPForm ? 'Verify Your Email' : 'Create Your Account'}
                    </CardTitle>
                    <CardDescription className="font-urbanist text-blue-300/70">
                      {showOTPForm 
                        ? 'Enter the OTP sent to your email'
                        : 'Join ChronosHub and start your journey'
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {showOTPForm ? (
                      <form onSubmit={handleOTPSubmit} className="space-y-6">
                        <div className="grid gap-5">
                          {error && (
                            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-md">
                              <p className="font-urbanist text-red-200 text-sm">{error}</p>
                            </div>
                          )}
                          <div className="grid gap-3">
                            <Label htmlFor="otp" className="font-urbanist text-blue-200">Enter OTP</Label>
                            <Input 
                              id="otp" 
                              type="text" 
                              placeholder="Enter the OTP sent to your email"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                              required
                              className="font-urbanist bg-blue-950/40 border-blue-500/30 text-blue-200 placeholder:text-blue-400/50"
                            />
                          </div>
                        </div>
                        <Button 
                          type="submit" 
                          className="font-urbanist w-full cursor-pointer bg-blue-800/30 hover:bg-blue-800/50 text-blue-200 border border-blue-500/30"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-4 h-4 border-2 border-blue-200 border-t-transparent rounded-full animate-spin"></div>
                              <span>Processing...</span>
                            </div>
                          ) : (
                            'Verify OTP'
                          )}
                        </Button>
                      </form>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-5">
                          {error && (
                            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-md">
                              <p className="font-urbanist text-red-200 text-sm">{error}</p>
                            </div>
                          )}
                          <div className="grid gap-3">
                            <Label htmlFor="name" className="font-urbanist text-blue-200">Full Name</Label>
                            <Input 
                              id="name" 
                              name="name"
                              type="text" 
                              placeholder="enter your full name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              className="font-urbanist bg-blue-950/40 border-blue-500/30 text-blue-200 placeholder:text-blue-400/50"
                            />
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="email" className="font-urbanist text-blue-200">Email Address</Label>
                            <Input 
                              id="email" 
                              name="email"
                              type="email" 
                              placeholder="enter your email id"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              className="font-urbanist bg-blue-950/40 border-blue-500/30 text-blue-200 placeholder:text-blue-400/50"
                            />
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="password" className="font-urbanist text-blue-200">Password</Label>
                            <Input 
                              id="password" 
                              name="password"
                              type="password"
                              placeholder="create a password"
                              value={formData.password}
                              onChange={handleChange}
                              required
                              className="font-urbanist bg-blue-950/40 border-blue-500/30 text-blue-200"
                            />
                          </div>
                        </div>
                        <Button 
                          type="submit" 
                          className="font-urbanist w-full cursor-pointer bg-blue-800/30 hover:bg-blue-800/50 text-blue-200 border border-blue-500/30"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-4 h-4 border-2 border-blue-200 border-t-transparent rounded-full animate-spin"></div>
                              <span>Processing...</span>
                            </div>
                          ) : (
                            'Create Account'
                          )}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                  <CardFooter className="p-6 border-t border-blue-500/20">
                    <p className="font-urbanist text-center text-blue-300/70 text-sm w-full pb-3 sm:pb-0">
                      Already have an account?{' '}
                      <Link href="/login" className="text-blue-400 hover:text-blue-300">
                        Sign in
                      </Link>
                    </p>
                  </CardFooter>
                </MagicCard>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}