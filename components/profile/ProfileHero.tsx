"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ProfileHeroProps {
  locale: string;
  dict: any;
}

export default function ProfileHero({ locale, dict }: ProfileHeroProps) {
  const { hero, back_to_cv } = dict.profile;

  return (
    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-white dark:bg-zinc-950">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           className="mb-8"
        >
          <Link 
            href={`/${locale}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm font-medium border border-zinc-200 dark:border-zinc-800"
          >
            <ArrowLeft className="w-4 h-4" />
            {back_to_cv}
          </Link>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 dark:from-indigo-400 dark:via-violet-400 dark:to-fuchsia-400 mb-6"
        >
          {hero.greeting}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-2xl mx-auto text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed mb-12"
        >
          {hero.bio}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-semibold">
            {hero.scroll_down}
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
