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
};

import AppUrlListener from "@/components/AppUrlListener";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} antialiased bg-background-dark text-slate-100 font-display`}
      >
        <AppUrlListener />
        {children}
      </body>
    </html>
  );
}
