import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Interactive Portfolio",
  description: "A modern interactive portfolio website showcasing creative skills and projects",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950 text-gray-100`}
      >
        <ThemeProvider attribute="class">
          <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-gray-100">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
