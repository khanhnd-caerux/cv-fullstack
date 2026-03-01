"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Languages, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const locales = [
    { code: "en", label: "English" },
    { code: "vi", label: "Tiếng Việt" },
  ];

  const redirectedPathname = (locale: string) => {
    if (!pathname) return "/";
    const segments = pathname.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLabel = locales.find(l => l.code === currentLocale)?.label || "English";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 glass px-4 py-2 rounded-xl border border-black/5 dark:border-white/5 shadow-lg group hover:border-black/10 dark:hover:border-white/20 transition-all text-sm font-medium"
      >
        <Languages size={16} className="text-accent-indigo dark:text-accent-cyan group-hover:scale-110 transition-transform" />
        <span className="text-slate-700 dark:text-white/80 transition-colors uppercase tracking-widest text-[10px] font-bold">{currentLocale}</span>
        <ChevronDown 
          size={14} 
          className={`text-slate-400 dark:text-white/40 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-48 glass border border-black/5 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[100] p-1.5 backdrop-blur-xl transition-all"
          >
            {locales.map((locale) => (
              <Link
                key={locale.code}
                href={redirectedPathname(locale.code)}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                  currentLocale === locale.code
                    ? "bg-accent-indigo/10 dark:bg-accent-indigo/20 text-accent-indigo dark:text-white"
                    : "text-slate-500 dark:text-white/60 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{locale.code === "en" ? "🇺🇸" : "🇻🇳"}</span>
                  <span className="text-xs font-bold uppercase tracking-widest">{locale.label}</span>
                </div>
                {currentLocale === locale.code && (
                  <Check size={14} className="text-accent-indigo dark:text-accent-cyan" />
                )}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
