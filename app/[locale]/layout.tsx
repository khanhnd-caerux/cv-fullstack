import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "../globals.css";
import { Locale } from "@/i18n/get-dictionary";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Duy Khánh | Fullstack Developer CV",
  description: "Professional Fullstack Developer CV built with Next.js, Tailwind CSS 4 and Framer Motion.",
};

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "vi" }];
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  return (
    <html lang={locale} className={`${inter.variable} ${outfit.variable} scroll-smooth`} suppressHydrationWarning>
      <body suppressHydrationWarning className="antialiased selection:bg-accent-indigo selection:text-white dark:bg-midnight-950 bg-slate-50 transition-colors duration-300">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
