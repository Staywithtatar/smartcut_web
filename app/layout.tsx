import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner'
import { LanguageProvider } from '@/lib/i18n/LanguageContext'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.hedcut.online'),
  title: {
    default: "Hedcut - AI ตัดต่อวิดีโอให้คุณอัตโนมัติ 🍄",
    template: "%s | Hedcut"
  },
  description: "เห็ดคัต (Hedcut) - AI ตัดต่อวิดีโอให้คุณอัตโนมัติ เหมาะสำหรับ TikTok, Reels, Shorts ช่วยตัดความเงียบ ใส่ซับไตเติ้ล และเลือกช็อตเด็ดให้ทันที",
  keywords: ["AI ตัดต่อวิดีโอ", "ตัดต่ออัตโนมัติ", "AutoCut", "Hedcut", "TikTok", "Reels", "Shorts", "ตัดต่อคลิปสั้น", "ใส่ซับอัตโนมัติ"],
  authors: [{ name: "Hedcut Team" }],
  creator: "Hedcut Team",
  publisher: "Hedcut",
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'th_TH',
    url: 'https://www.hedcut.online',
    title: "Hedcut - AI ตัดต่อวิดีโอให้คุณอัตโนมัติ 🍄",
    description: "เห็ดคัต - AI ตัดต่อวิดีโอให้คุณอัตโนมัติ เหมาะสำหรับ TikTok, Reels, Shorts",
    siteName: 'Hedcut',
    images: [
      {
        url: '/og-image.jpg', // We might need to create this later or use logo for now
        width: 1200,
        height: 630,
        alt: 'Hedcut AI Video Editor',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Hedcut - AI ตัดต่อวิดีโอให้คุณอัตโนมัติ 🍄",
    description: "เห็ดคัต - AI ตัดต่อวิดีโอให้คุณอัตโนมัติ เหมาะสำหรับ TikTok, Reels, Shorts",
    images: ['/og-image.jpg'],
    creator: '@hedcut',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Toaster
          position="top-right"
          theme="dark"
          richColors
          closeButton
        />
      </body>
    </html>
  );
}
