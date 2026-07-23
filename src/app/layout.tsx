import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";
import SplashCursor from "@/components/SplashCursor";
import AmbientBackground from "@/components/AmbientBackground";
import ParticleField from "@/components/ParticleField";
import Footer from "@/components/Footer";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-flap",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "FlashBook — the drop starts now",
  description: "High-concurrency slot booking, built to survive a stampede.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${plexMono.variable} ${inter.variable} antialiased`}
      >
        <AmbientBackground />
        <ParticleField />
        <SplashCursor />
        {children}
        <Footer />
      </body>
    </html>
  );
}
