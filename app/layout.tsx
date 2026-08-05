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
  title: "西部智车 | 智能运载研发与测试解决方案",
  description:
    "西部智车提供覆盖仿真、在环、台架与道路实车的 wivSPACE 模块化研发测试平台与实验室解决方案。",
  icons: {
    icon: "/assets/logo/wivspace.png",
    shortcut: "/assets/logo/wivspace.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
