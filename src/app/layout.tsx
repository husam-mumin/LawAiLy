import type { Metadata } from "next";
import { Geist, Geist_Mono, Cairo } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/app/context/UserContext";
import TokenRefresher from "@/components/TokenRefresher";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "مستشاري",
  description:
    "مستشاري هو تطبيق يهدف إلى تسهيل الوصول إلى المعلومات القانونية.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/miniLogo.png" type="image/png" />
      </head>
      <body
        className={`
font-cairo
          ${geistSans.variable} ${geistMono.variable} antialiased
          ${cairo.variable} font-sans
          `}
      >
        <TokenRefresher />
        <AppProvider>
          <div dir="ltr">{children}</div>
        </AppProvider>
      </body>
    </html>
  );
}
