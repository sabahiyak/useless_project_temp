import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Is My Coco Losing Hair?? 🥥 | Coconut Hair Counter",
  description:
    "AI-assisted Computer Vision application for estimating visible coconut fibres and diagnosing coconut hair density patterns.",
  keywords: [
    "coconut",
    "coconut hair counter",
    "computer vision",
    "fibre counter",
    "opencv",
    "coconut baldness",
  ],
  authors: [{ name: "CocoLocks Research & Co." }],
  openGraph: {
    title: "Is My Coco Losing Hair?? 🥥",
    description: "Upload a coconut image to analyze visible fibres using computer vision.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
