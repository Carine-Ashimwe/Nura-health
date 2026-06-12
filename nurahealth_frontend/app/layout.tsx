import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import TopControls from "@/components/TopControls";
import FeedbackProvider from "@/components/Feedback";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nura Health",
  description: "Child malnutrition screening for Community Health Workers in Rwanda.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Nura Health" },
};

export const viewport: Viewport = {
  themeColor: "#2f6f64",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// Set the theme class before paint to avoid a flash of the wrong theme.
const themeInit = `try{var t=localStorage.getItem('nura_theme');if(t==='dark'){document.documentElement.classList.add('dark')}}catch(e){}`;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="font-sans">
        <NextIntlClientProvider messages={messages}>
          <FeedbackProvider>
            <TopControls />
            {children}
          </FeedbackProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
