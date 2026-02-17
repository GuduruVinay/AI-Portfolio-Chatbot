import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget"; // Import here

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
    <html lang="en">
      <body className={inter.className}>
        {children}
        <ChatWidget /> {/* Add the widget here */}
      </body>
    </html>
  );
}