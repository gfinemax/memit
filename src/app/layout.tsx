import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Memit - Digital Memory Palace",
  description: "Your second brain for instant encoding and recall.",
  openGraph: {
    title: "Memit - 나만의 기억법",
    description: "암호 생성부터 학습까지, 쉽고 오래 남는 나만의 기억법",
    url: "https://memit.vercel.app", // Adjust if there's a specific domain
    siteName: "Memit",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "https://memit.vercel.app/og-image.png", // Ensure this image exists or use a placeholder
        width: 1200,
        height: 630,
        alt: "Memit Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Memit - Digital Memory Palace",
    description: "Your second brain for instant encoding and recall.",
  }
};

import AppUrlListener from "@/components/AppUrlListener";
import PushInit from "@/components/PushInit";
import Providers from "@/components/Providers";
import AppInitializer from "@/components/AppInitializer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
              document.documentElement.classList.toggle('dark', theme === 'dark');
            })()
          `
        }} />
      </head>
      <body
        className={`${spaceGrotesk.variable} antialiased bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display`}
      >
        <Providers>
          <AppUrlListener />
          <PushInit />
          <AppInitializer />
          {children}
        </Providers>
      </body>
    </html>
  );
}
