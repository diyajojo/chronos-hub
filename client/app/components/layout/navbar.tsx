import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface NavbarProps {
  page?: string;
}

export default function Navbar({ page }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="w-full h-16 backdrop-blur-sm border-b border-blue-500/20 relative z-20">
      <div className=" font-notocontainer h-full mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1 text-xl md:text-2xl text-blue-200 font-semibold hover:text-blue-300 font-noto">
          <Image
            src="/assets/logo.png"
            alt="ChronoHub Logo"
            width={80}
            height={160}
            className="w-auto h-8 md:h-10"
          />
          <span className="inline">ChronosHub</span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4">
          {page !== 'login' && (
            <Link href="/login">
              <Button variant="ghost" className="cursor-pointer text-blue-200 hover:text-blue-300 hover:bg-blue-900/30 font-noto">
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

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-blue-200 hover:text-blue-300 focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-blue-950/90 backdrop-blur-md border-b border-blue-500/20 py-6 px-6 flex flex-col space-y-5 shadow-lg z-10">
          {page !== 'login' && (
            <Link href="/login" onClick={() => setIsMenuOpen(false)} className="block w-full">
              <Button variant="ghost" className="w-full h-12 cursor-pointer text-blue-200 hover:text-blue-300 hover:bg-blue-900/30 font-noto justify-start text-lg">
                Login
              </Button>
            </Link>
          )}
          {page !== 'signup' && (
            <Link href="/signup" onClick={() => setIsMenuOpen(false)} className="block w-full">
              <Button variant="ghost" className="w-full h-12 cursor-pointer text-blue-200 hover:text-blue-300 hover:bg-blue-900/30 font-noto justify-start text-lg">
                Sign Up
              </Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}