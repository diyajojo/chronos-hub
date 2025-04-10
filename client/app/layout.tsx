import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CHRONOSHUB",
  description: "A Time Travel Adventure",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster 
          richColors 
          position="top-right" 
          duration={5000} 
          closeButton={true}
          theme="dark" 
          className="toaster-container"
          toastOptions={{
            style: { 
              background: 'rgba(0, 0, 0, 0.8)',
              border: '1px solid rgba(59, 130, 246, 0.3)', 
              color: 'white',
              padding: '16px',
              fontSize: '14px'
            },
          }}
        />
      </body>
    </html>
  );
}