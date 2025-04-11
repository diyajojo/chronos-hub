import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  page?: string;
}

export default function Navbar({ page }: NavbarProps) {
  return (
    <nav className=" w-full h-16 backdrop-blur-sm border-b border-blue-500/20">
      <div className="container h-full mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-0 text-2xl text-blue-200 font-semibold hover:text-blue-300 font-noto">
          <Image
            src="/assets/logo.png"
            alt="ChronoHub Logo"
            width={100}
            height={200}
          />
          ChronosHub
        </Link>
        <div className="space-x-4">
          {page !== 'login' && (
            <Link href="/login">
              <Button variant="ghost"  className="cursor-pointer text-blue-200 hover:text-blue-300 hover:bg-blue-900/30 font-noto">
                Login
              </Button>
            </Link>
          )}
          {page !== 'signup' && (
            <Link href="/signup">
              <Button variant="ghost" className="cursor-pointer text-blue-200 hover:text-blue-300 hover:bg-blue-900/30 font-noto">
                Sign Up
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}