"use client";

import { motion, useScroll, useSpring } from "framer-motion";

interface OpinionEssayProps {
  dict: any;
}

export default function OpinionEssay({ dict }: OpinionEssayProps) {
  const { essay } = dict.profile;
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section className="relative py-24 bg-white dark:bg-zinc-950">
      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-indigo-600 origin-left z-[100]" 
        style={{ scaleX }} 
      />

      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-sm uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-bold mb-4">
              {essay.title}
            </h2>
            <h3 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
              {essay.intro}
            </h3>
          </motion.div>

          <div className="space-y-12">
            {essay.paragraphs.map((para: string, index: number) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-lg md:text-xl text-zinc-700 dark:text-zinc-300 leading-relaxed font-serif tracking-normal"
              >
                {para}
              </motion.p>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-24 pt-12 border-t border-zinc-100 dark:border-zinc-900 text-center"
          >
            <div className="inline-block p-1 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500">
              <div className="bg-white dark:bg-zinc-950 rounded-full px-6 py-2">
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Thank you for reading my story.
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
