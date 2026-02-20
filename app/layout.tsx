import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";
import Navbar from "@/components/Navbar"; // <-- Import Navbar
import { Providers } from "./providers"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Co-Browsing Portfolio",
  description: "A portfolio you can talk to.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={inter.className}>
        <Providers>
          <Navbar /> {/* <-- Add Navbar here above children */}
          <div className="pt-16"> {/* Add padding so nav doesn't overlap content */}
            {children}
          </div>
          <ChatWidget />
        </Providers>
      </body>
    </html>
  );
}