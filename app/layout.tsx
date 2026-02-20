import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";
import Navbar from "@/components/Navbar";
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
          <Navbar /> 
          <div className="pt-16">
            {children}
          </div>
          
          {/* CRITICAL: Place the widget here, outside of all other layout constraints */}
          <ChatWidget />
          
        </Providers>
      </body>
    </html>
  );
}