"use client";

import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="p-2 w-9 h-9 border border-white/10 rounded-full" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full glass-hover border border-white/10 dark:text-white text-slate-900 transition-colors"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === "dark" ? 0 : 180, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
      >
        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      </motion.div>
    </button>
  );
}
