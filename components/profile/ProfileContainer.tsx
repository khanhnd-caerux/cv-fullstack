"use client";

import { useEffect, useState } from "react";
import ProfileHero from "./ProfileHero";
import HobbySection from "./HobbySection";
import OpinionEssay from "./OpinionEssay";
import ThemeToggle from "../ThemeToggle";
import LanguageSwitcher from "../LanguageSwitcher";

interface ProfileContainerProps {
  locale: string;
  dict: any;
}

export default function ProfileContainer({ locale, dict }: ProfileContainerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-white dark:bg-zinc-950" />;
  }

  return (
    <div className="relative min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
      {/* Navigation Controls */}
      <nav className="fixed top-0 left-0 right-0 z-[110] py-4 px-6 flex justify-between items-center pointer-events-none">
        <div className="container mx-auto flex justify-end gap-3 pointer-events-auto">
          <LanguageSwitcher currentLocale={locale} />
          <ThemeToggle />
        </div>
      </nav>

      <main>
        <ProfileHero locale={locale} dict={dict} />
        <HobbySection dict={dict} />
        <OpinionEssay dict={dict} />
      </main>

      <footer className="py-12 text-center text-zinc-400 dark:text-zinc-600 text-sm border-t border-zinc-100 dark:border-zinc-900">
        <p>© 2025 {dict.cv.name}. Built with Passion & Next.js 16.</p>
      </footer>
    </div>
  );
}
