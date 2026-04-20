"use client";

import { motion } from "framer-motion";
import { Camera, Dumbbell, BookOpen, Map, LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Camera,
  Dumbbell,
  BookOpen,
  Map,
};

interface HobbySectionProps {
  dict: any;
}

export default function HobbySection({ dict }: HobbySectionProps) {
  const { hobbies } = dict.profile;

  return (
    <section className="py-24 bg-zinc-50 dark:bg-zinc-900/50">
      <div className="container mx-auto px-6">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold mb-12 text-zinc-900 dark:text-zinc-100"
        >
          {hobbies.title}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {hobbies.items.map((item: any, index: number) => {
            const Icon = iconMap[item.icon] || BookOpen;
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/30 transition-all shadow-sm hover:shadow-xl hover:shadow-indigo-500/5"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-zinc-100">
                  {item.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
