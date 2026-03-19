import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "sonner";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EventMate — Your Next Favorite Memory Starts Here",
  description: "Discover and host unforgettable local events. Connect with people who share your passions through EventMate.",
  keywords: ["events", "local events", "event hosting", "community", "eventmate"],
  authors: [{ name: "EventMate" }],
  openGraph: {
    type: "website",
    url: "https://eventmate-client.onrender.com",
    title: "EventMate — Your Next Favorite Memory Starts Here",
    description: "Discover and host unforgettable local events. Connect with people who share your passions.",
    siteName: "EventMate",
    images: [
      {
        url: "https://eventmate-client.onrender.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "EventMate — Discover Local Events",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EventMate — Your Next Favorite Memory Starts Here",
    description: "Discover and host unforgettable local events.",
    images: ["https://eventmate-client.onrender.com/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider>
          <QueryProvider>
            <Navbar />
            {children}
            <Toaster position="top-right" />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
