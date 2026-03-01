"use client";

import { motion } from "framer-motion";
import {
  Mail,
  Linkedin,
  Github,
  Phone,
  MapPin,
  Download,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Award,
  Code2,
  Globe,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import { useState, useEffect } from "react";

import Image from "next/image";

export default function CVTemplate({ locale, dict }: { locale: string; dict: any }) {
  const [mounted, setMounted] = useState(false);
  const cv = dict.cv;

  useEffect(() => {
    setMounted(true);
  }, []);


  if (!mounted) {
    return <div className="min-h-screen bg-slate-50 dark:bg-midnight-950 transition-colors duration-300" />;
  }

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const SidebarItem = ({ icon, label, value, href }: { icon: any; label: string; value: string; href?: string }) => (
    <div className="flex items-start gap-4 mb-6">
      <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-accent-indigo dark:text-accent-cyan shrink-0 transition-colors">
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold mb-1">{label}</p>
        {href ? (
          <a href={href} className="text-sm font-bold text-[var(--foreground)] hover:text-accent-indigo dark:hover:text-accent-cyan transition-colors truncate block max-w-[180px]">
            {value}
          </a>
        ) : (
          <p className="text-sm font-bold text-[var(--foreground)]">{value}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen dark:bg-midnight-950 bg-slate-50 transition-colors duration-300">
      {/* Navigation Controls */}
      <nav className="fixed top-0 left-0 right-0 z-50 py-4 px-6 flex justify-between items-center pointer-events-none">
        <div className="container mx-auto flex justify-end gap-3 pointer-events-auto">
          <LanguageSwitcher currentLocale={locale} />
          <ThemeToggle />
        </div>
      </nav>

      <main className="container mx-auto px-4 md:px-0 py-12 md:py-24 max-w-6xl">
        <div className="glass overflow-hidden rounded-[2.5rem] border-white/5 shadow-2xl transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[1000px]">
            {/* Sidebar (4 columns) */}
            <aside className="lg:col-span-4 bg-slate-100/50 dark:bg-midnight-900/50 p-8 md:p-12 border-r border-white/5 transition-colors duration-300">
              <motion.div {...fadeIn}>
                {/* Profile Section */}
                <div className="mb-12">
                  <div className="w-36 h-36 rounded-3xl bg-gradient-to-br from-accent-indigo to-accent-cyan p-1 mb-8 shadow-xl shadow-accent-indigo/10">
                    <div className="w-full h-full rounded-[1.4rem] bg-slate-100 dark:bg-midnight-900 flex items-center justify-center overflow-hidden relative">
                      <Image 
                        src="/avatar.jpg" 
                        alt="Avatar" 
                        width={144}
                        height={144}
                        className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                        priority
                      />
                    </div>
                  </div>
                  <h1 className="text-4xl font-bold font-outfit mb-2 text-[var(--foreground)] transition-colors">
                    {cv.name}
                  </h1>
                  <p className="text-accent-indigo dark:text-accent-cyan font-bold tracking-widest uppercase text-xs">
                    {cv.role}
                  </p>
                </div>

                {/* Contact Section */}
                <div className="mb-12">
                  <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold mb-8 flex items-center gap-2 transition-colors">
                    <MapPin size={14} /> {cv.contact_title}
                  </h2>
                  <SidebarItem icon={<Phone size={18} />} label={cv.phone} value={cv.contact.phone} />
                  <SidebarItem icon={<Mail size={18} />} label={cv.email} value={cv.contact.email} href={`mailto:${cv.contact.email}`} />
                  <SidebarItem icon={<MapPin size={18} />} label={cv.location} value={cv.contact.location} />
                  <SidebarItem icon={<Github size={18} />} label={cv.github} value={cv.contact.github} href={`https://${cv.contact.github}`} />
                  <SidebarItem icon={<Linkedin size={18} />} label={cv.linkedin} value={cv.contact.linkedin} href={`https://${cv.contact.linkedin}`} />
                </div>

                {/* Languages */}
                <div className="mb-12">
                  <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-white/30 font-bold mb-8 flex items-center gap-2">
                    <Globe size={14} /> {cv.languages_title}
                  </h2>
                  <div className="space-y-4">
                    {cv.languages.map((lang: any) => (
                      <div key={lang.name}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-bold text-[var(--foreground)]">{lang.name}</span>
                          <span className="text-[10px] text-[var(--text-muted)] font-bold italic">{lang.level}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: lang.name.includes("Tiếng Việt") || lang.name === "Vietnamese" ? "100%" : lang.name.includes("Tiếng Anh") || lang.name === "English" ? "85%" : "40%" }}
                            className="h-full bg-accent-indigo"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </aside>

            {/* Main Content (8 columns) */}
            <div className="lg:col-span-8 p-8 md:p-16 transition-colors duration-300 dark:bg-transparent bg-white">
              <motion.div {...fadeIn}>
                {/* Professional Summary */}
                <section className="mb-16">
                  <h2 className="text-2xl font-bold font-outfit mb-6 text-slate-900 dark:text-white flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-accent-indigo/10 flex items-center justify-center text-accent-indigo">
                      <Award size={18} />
                    </span>
                    {cv.summary_title}
                  </h2>
                  <p className="text-[var(--foreground)] leading-relaxed text-lg font-medium opacity-80 transition-colors">
                    {cv.summary_text}
                  </p>
                </section>

                {/* Work Experience */}
                <section className="mb-16">
                  <h2 className="text-2xl font-bold font-outfit mb-10 text-slate-900 dark:text-white flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-accent-indigo/10 flex items-center justify-center text-accent-indigo">
                      <Briefcase size={18} />
                    </span>
                    {cv.experience_title}
                  </h2>
                  <div className="space-y-12">
                    {cv.experience.map((exp: any, idx: number) => (
                      <div key={idx} className="relative pl-10 last:pb-0 border-l border-slate-100 dark:border-white/5">
                        <div className="absolute left-[-5px] top-1.5 w-[10px] h-[10px] rounded-full bg-accent-indigo ring-4 ring-slate-100 dark:ring-white/5" />
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                          <h3 className="text-xl font-bold text-[var(--foreground)] leading-tight">
                            {exp.role}
                          </h3>
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-[var(--text-muted)] uppercase tracking-widest whitespace-nowrap">
                            {exp.period}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-accent-indigo dark:text-accent-cyan font-bold text-sm mb-4">
                          {exp.company} <span className="text-slate-400 dark:text-slate-700 font-bold transition-colors">•</span> <span className="text-[var(--text-muted)] font-medium italic">{exp.location}</span>
                        </div>
                        <p className="text-[var(--foreground)] opacity-70 text-base leading-relaxed font-medium transition-colors">
                          {exp.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Education */}
                <section className="mb-16">
                  <h2 className="text-2xl font-bold font-outfit mb-10 text-slate-900 dark:text-white flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-accent-indigo/10 flex items-center justify-center text-accent-indigo">
                      <GraduationCap size={18} />
                    </span>
                    {cv.education_title}
                  </h2>
                  <div className="space-y-10">
                    {cv.education.map((edu: any, idx: number) => (
                      <div key={idx} className="glass p-8 rounded-3xl border-white/5 hover:border-accent-indigo/30 transition-all group">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                          <h3 className="text-xl font-bold text-[var(--foreground)] group-hover:text-accent-indigo transition-colors">{edu.degree}</h3>
                          <span className="text-xs font-bold text-[var(--text-muted)] whitespace-nowrap uppercase tracking-widest font-bold transition-colors">{edu.period}</span>
                        </div>
                        <p className="font-bold text-[var(--foreground)] opacity-80 mb-4 transition-colors">{edu.school}</p>
                        <p className="text-[var(--foreground)] opacity-60 italic font-medium transition-colors">{edu.description}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Technical Skills - Categorized display in main column */}
                <section className="mb-16">
                  <h2 className="text-2xl font-bold font-outfit mb-8 text-slate-900 dark:text-white flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-accent-indigo/10 flex items-center justify-center text-accent-indigo">
                      <Code2 size={18} />
                    </span>
                    {cv.skills_title}
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {[
                      "React", "Next.js", "TypeScript", "Tailwind CSS", "Redux", "Node.js", 
                      "Express", "PostgreSQL", "MongoDB", "PHP - Laravel", "Docker", "Git"
                    ].map((skill) => (
                      <span 
                        key={skill} 
                        className="px-5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-[var(--foreground)] font-bold text-sm transition-all hover:bg-accent-indigo hover:text-white hover:border-accent-indigo hover:-translate-y-1 cursor-default"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>

                {/* Featured Projects */}
                <section>
                  <h2 className="text-2xl font-bold font-outfit mb-8 text-slate-900 dark:text-white flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-accent-indigo/10 flex items-center justify-center text-accent-indigo">
                      <ExternalLink size={18} />
                    </span>
                    {cv.projects_title}
                  </h2>
                  <div className="grid grid-cols-1 gap-6">
                    {cv.projects.map((proj: any, idx: number) => (
                      <div key={idx} className="glass p-8 rounded-[2rem] border-black/5 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-midnight-900/50 transition-all group">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                          <div>
                            <h3 className="text-xl font-bold text-[var(--foreground)] group-hover:text-accent-indigo transition-colors mb-2">
                              {proj.name}
                            </h3>
                            <p className="text-xs text-accent-indigo dark:text-accent-cyan font-bold uppercase tracking-widest">
                              {proj.tech}
                            </p>
                          </div>
                          <div className="px-4 py-2 rounded-xl bg-accent-indigo/10 text-accent-indigo dark:text-accent-cyan text-xs font-bold uppercase tracking-widest whitespace-nowrap">
                            {proj.domain}
                          </div>
                        </div>
                        
                        <p className="text-sm text-[var(--foreground)] opacity-70 mb-8 font-medium leading-relaxed">
                          {proj.description}
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-6 border-y border-black/5 dark:border-white/5">
                          <div>
                            <p className="text-[10px] uppercase text-[var(--text-muted)] font-bold mb-1">{cv.project_headers.role}</p>
                            <p className="text-sm font-bold text-[var(--foreground)]">{proj.role}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase text-[var(--text-muted)] font-bold mb-1">{cv.project_headers.teamsite}</p>
                            <p className="text-sm font-bold text-[var(--foreground)]">{proj.teamsite}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase text-[var(--text-muted)] font-bold mb-1">{cv.project_headers.worktime}</p>
                            <p className="text-sm font-bold text-[var(--foreground)]">{proj.worktime}</p>
                          </div>
                        </div>

                        {proj.responsibility && proj.responsibility.length > 0 && (
                          <div className="mt-8">
                            <p className="text-[10px] uppercase text-[var(--text-muted)] font-bold mb-3">{cv.project_headers.responsibility}</p>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                              {proj.responsibility.map((item: string, i: number) => (
                                <li key={i} className="text-sm text-[var(--foreground)] opacity-80 flex items-start gap-2 font-medium">
                                  <span className="w-1.5 h-1.5 rounded-full bg-accent-indigo mt-1.5 shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              </motion.div>
            </div>
          </div>
        </div>

        <footer className="mt-16 text-center text-slate-400 dark:text-white/20 text-sm">
          <p>© 2025 Duy Khanh. Professionally Built with Next.js 16.</p>
        </footer>
      </main>
    </div>
  );
}
