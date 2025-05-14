import type { Metadata } from "next";
import {Josefin_Sans,Urbanist,Oswald,Roboto,Noto_Sans_Cuneiform} from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const oswald=Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["200","300","400", "500", "600", "700"], 
});


const josefinSans=Josefin_Sans({
  variable: "--font-josefinsans",
  subsets: ["latin"],
  weight: ["100","200","300","400", "500", "600", "700"], 
});

const urbanist=Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["100","200","300","400", "500", "600", "700","800","900"], 
});

const roboto=Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: [ "700","400"], 
});

const noto=Noto_Sans_Cuneiform({
  variable: "--font-noto",
  subsets: ["latin"],
  weight: ["400"], 
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
    <html lang="en" className="dark">
      <body
            className={`  ${josefinSans.variable} ${urbanist.variable} ${noto.variable} ${roboto.variable} ${oswald.variable}antialiased`}
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