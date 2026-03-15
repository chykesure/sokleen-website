import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SOKLEEN NIGERIA LTD - Professional Cleaning Services",
  description: "Transform your space with Nigeria's leading cleaning experts. Professional deep cleaning, commercial cleaning, residential cleaning, upholstery cleaning, fumigation, and post-construction cleaning services.",
  keywords: ["cleaning services", "Nigeria", "professional cleaning", "deep cleaning", "commercial cleaning", "residential cleaning", "upholstery cleaning", "fumigation", "post-construction cleaning", "SOKLEEN"],
  authors: [{ name: "SOKLEEN NIGERIA LTD" }],
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "SOKLEEN NIGERIA LTD - Professional Cleaning Services",
    description: "Transform your space with Nigeria's leading cleaning experts",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SOKLEEN NIGERIA LTD - Professional Cleaning Services",
    description: "Transform your space with Nigeria's leading cleaning experts",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
