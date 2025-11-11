import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import AlertBar from "@/components/ui/alert-bar";

const sohneBreitSemibold = localFont({
  src: "../public/fonts/sohne-breit-semibold.otf",
  variable: "--font-sohne-breit-semibold",
});

const inter = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OStack",
  description: "Created with OStack.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sohneBreitSemibold.variable} ${inter.variable} ${geistMono.variable} antialiased`}
      >
        <AlertBar />
        {children}
      </body>
    </html>
  );
}
