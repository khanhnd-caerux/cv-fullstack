"use client";

import { motion } from "framer-motion";
import {
  Mail,
  Linkedin,
  Github,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Code2,
  Globe,
  FileDown,
  ExternalLink,
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
    <div className="flex items-start gap-4 mb-6 print:mb-4 break-inside-avoid">
      <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-accent-indigo dark:text-accent-cyan shrink-0 transition-colors print:bg-slate-200">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold mb-1 print:text-slate-500">{label}</p>
        {href ? (
          <a href={href} className="text-sm font-bold text-[var(--foreground)] hover:text-accent-indigo dark:hover:text-accent-cyan transition-colors truncate block max-w-[180px] print:max-w-none">
            {value}
          </a>
        ) : (
          <p className="text-sm font-bold text-[var(--foreground)] truncate print:whitespace-normal">{value}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen dark:bg-midnight-950 bg-slate-50 transition-colors duration-300 print:bg-white">
      {/* Navigation Controls */}
      <nav className="fixed top-0 left-0 right-0 z-50 py-4 px-6 flex justify-between items-center pointer-events-none print:hidden">
        <div className="container mx-auto flex justify-end gap-3 pointer-events-auto" data-print="hidden">
          <button
            id="btn-export-pdf"
            onClick={() => window.print()}
            aria-label={dict.nav.export_pdf}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-indigo text-white text-sm font-bold shadow-lg shadow-accent-indigo/20 hover:bg-accent-indigo/90 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <FileDown size={16} />
            {dict.nav.export_pdf}
          </button>
          <LanguageSwitcher currentLocale={locale} />
          <ThemeToggle />
        </div>
      </nav>

      <main className="container mx-auto px-4 md:px-0 py-12 md:py-24 max-w-6xl print:max-w-none print:py-0 print:px-0">
        <div className="glass overflow-hidden rounded-[2.5rem] border-white/5 shadow-2xl transition-all duration-300 print:rounded-none print:shadow-none print:border-none">
          {/* Ép layout grid 12 cột khi in */}
          <div className="grid grid-cols-1 lg:grid-cols-12 print:grid-cols-12 min-h-[1000px] print:min-h-screen">
            
            {/* Sidebar (4 columns) */}
            <aside className="lg:col-span-4 print:col-span-4 bg-slate-100/50 dark:bg-midnight-900/50 p-8 md:p-12 border-r border-white/5 transition-colors duration-300 print:bg-slate-100 print:p-10">
              <div className="print:opacity-100"> {/* Dùng div thay motion khi in để tránh lỗi mờ hình */}
                {/* Profile Section */}
                <div className="mb-12 print:mb-8">
                  <div className="w-36 h-36 rounded-3xl bg-gradient-to-br from-accent-indigo to-accent-cyan p-1 mb-8 shadow-xl shadow-accent-indigo/10 print:shadow-none print:bg-accent-indigo">
                    <div className="w-full h-full rounded-[1.4rem] bg-slate-100 dark:bg-midnight-900 flex items-center justify-center overflow-hidden relative">
                      <Image 
                        src="/avatar.jpg" 
                        alt="Avatar" 
                        width={144}
                        height={144}
                        className="w-full h-full object-cover"
                        priority
                      />
                    </div>
                  </div>
                  <h1 className="text-4xl font-bold font-outfit mb-2 text-[var(--foreground)] print:text-slate-900">
                    {cv.name}
                  </h1>
                  <p className="text-accent-indigo dark:text-accent-cyan font-bold tracking-widest uppercase text-xs print:text-accent-indigo">
                    {cv.role}
                  </p>
                </div>

                {/* Contact Section */}
                <div className="mb-12 print:mb-8">
                  <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold mb-8 print:mb-6 flex items-center gap-2">
                    <MapPin size={14} /> {cv.contact_title}
                  </h2>
                  <SidebarItem icon={<Phone size={18} />} label={cv.phone} value={cv.contact.phone} />
                  <SidebarItem icon={<Mail size={18} />} label={cv.email} value={cv.contact.email} href={`mailto:${cv.contact.email}`} />
                  <SidebarItem icon={<MapPin size={18} />} label={cv.location} value={cv.contact.location} />
                  <SidebarItem icon={<Github size={18} />} label={cv.github} value={cv.contact.github} href={`https://${cv.contact.github}`} />
                  <SidebarItem icon={<Linkedin size={18} />} label={cv.linkedin} value={cv.contact.linkedin} href={`https://${cv.contact.linkedin}`} />
                  <SidebarItem icon={<Globe size={18} />} label={cv.vercel} value={cv.contact.vercel} href={`https://${cv.contact.vercel}`} />
                </div>

                {/* Languages */}
                <div className="mb-12">
                  <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-white/30 font-bold mb-8 print:mb-6 flex items-center gap-2">
                    <Globe size={14} /> {cv.languages_title}
                  </h2>
                  <div className="space-y-4">
                    {cv.languages.map((lang: any) => (
                      <div key={lang.name} className="break-inside-avoid">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-bold text-[var(--foreground)]">{lang.name}</span>
                          <span className="text-[10px] text-[var(--text-muted)] font-bold italic">{lang.level}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent-indigo print:bg-accent-indigo"
                            style={{ width: lang.name.includes("Tiếng Việt") || lang.name === "Vietnamese" ? "100%" : lang.name.includes("Tiếng Anh") || lang.name === "English" ? "85%" : "40%" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content (8 columns) */}
            <div className="lg:col-span-8 print:col-span-8 p-8 md:p-16 transition-colors duration-300 dark:bg-transparent bg-white print:bg-white print:p-12">
              <div className="print:opacity-100">
                {/* Professional Summary */}
                <section className="mb-16 print:mb-10 break-inside-avoid">
                  <h2 className="text-2xl font-bold font-outfit mb-6 text-slate-900 dark:text-white flex items-center gap-3 print:text-slate-900">
                    <span className="w-8 h-8 rounded-lg bg-accent-indigo/10 flex items-center justify-center text-accent-indigo print:bg-slate-100">
                      <Award size={18} />
                    </span>
                    {cv.summary_title}
                  </h2>
                  <p className="text-[var(--foreground)] leading-relaxed text-lg font-medium opacity-80 print:opacity-100 print:text-slate-700">
                    {cv.summary_text}
                  </p>
                </section>

                {/* Work Experience */}
                <section className="mb-16 print:mb-10">
                  <h2 className="text-2xl font-bold font-outfit mb-10 text-slate-900 dark:text-white flex items-center gap-3 print:mb-6">
                    <span className="w-8 h-8 rounded-lg bg-accent-indigo/10 flex items-center justify-center text-accent-indigo print:bg-slate-100">
                      <Briefcase size={18} />
                    </span>
                    {cv.experience_title}
                  </h2>
                  <div className="space-y-12 print:space-y-8">
                    {cv.experience.map((exp: any, idx: number) => (
                      <div key={idx} className="relative pl-10 last:pb-0 border-l border-slate-100 dark:border-white/5 print:border-slate-200 break-inside-avoid">
                        <div className="absolute left-[-5px] top-1.5 w-[10px] h-[10px] rounded-full bg-accent-indigo" />
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                          <h3 className="text-xl font-bold text-[var(--foreground)] leading-tight print:text-slate-900">
                            {exp.role}
                          </h3>
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-[var(--text-muted)] uppercase tracking-widest whitespace-nowrap print:bg-slate-50 print:text-slate-500">
                            {exp.period}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-accent-indigo dark:text-accent-cyan font-bold text-sm mb-4 print:text-accent-indigo">
                          {exp.company} <span className="text-slate-400 dark:text-slate-700 font-bold">•</span> <span className="text-[var(--text-muted)] font-medium italic">{exp.location}</span>
                        </div>
                        <p className="text-[var(--foreground)] opacity-70 text-base leading-relaxed font-medium print:opacity-100 print:text-slate-600">
                          {exp.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Education */}
                <section className="mb-16 print:mb-10">
                  <h2 className="text-2xl font-bold font-outfit mb-10 text-slate-900 dark:text-white flex items-center gap-3 print:mb-6">
                    <span className="w-8 h-8 rounded-lg bg-accent-indigo/10 flex items-center justify-center text-accent-indigo print:bg-slate-100">
                      <GraduationCap size={18} />
                    </span>
                    {cv.education_title}
                  </h2>
                  <div className="space-y-10 print:space-y-6">
                    {cv.education.map((edu: any, idx: number) => (
                      <div key={idx} className="glass p-8 rounded-3xl border-white/5 hover:border-accent-indigo/30 transition-all group print:p-6 print:border-slate-200 break-inside-avoid">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                          <h3 className="text-xl font-bold text-[var(--foreground)] group-hover:text-accent-indigo transition-colors print:text-slate-900">{edu.degree}</h3>
                          <span className="text-xs font-bold text-[var(--text-muted)] whitespace-nowrap uppercase tracking-widest transition-colors">{edu.period}</span>
                        </div>
                        <p className="font-bold text-[var(--foreground)] opacity-80 mb-4 print:text-slate-800">{edu.school}</p>
                        <p className="text-[var(--foreground)] opacity-60 italic font-medium print:opacity-100 print:text-slate-500">{edu.description}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Technical Skills */}
                <section className="mb-16 print:mb-10 break-inside-avoid">
                  <h2 className="text-2xl font-bold font-outfit mb-8 text-slate-900 dark:text-white flex items-center gap-3 print:mb-6">
                    <span className="w-8 h-8 rounded-lg bg-accent-indigo/10 flex items-center justify-center text-accent-indigo print:bg-slate-100">
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
                        className="px-5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-[var(--foreground)] font-bold text-sm transition-all print:bg-white print:border-slate-300 print:text-slate-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>

                {/* Featured Projects */}
                <section className="print:mt-10">
                  <h2 className="text-2xl font-bold font-outfit mb-8 text-slate-900 dark:text-white flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-accent-indigo/10 flex items-center justify-center text-accent-indigo print:bg-slate-100">
                      <ExternalLink size={18} />
                    </span>
                    {cv.projects_title}
                  </h2>
                  <div className="grid grid-cols-1 gap-6">
                    {cv.projects.map((proj: any, idx: number) => (
                      <div key={idx} className="glass p-8 rounded-[2rem] border-black/5 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-midnight-900/50 transition-all group print:p-6 print:border-slate-200 break-inside-avoid">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                          <div>
                            <h3 className="text-xl font-bold text-[var(--foreground)] group-hover:text-accent-indigo transition-colors mb-2 print:text-slate-900">
                              {proj.name}
                            </h3>
                            <p className="text-xs text-accent-indigo dark:text-accent-cyan font-bold uppercase tracking-widest">
                              {proj.tech}
                            </p>
                          </div>
                          <div className="px-4 py-2 rounded-xl bg-accent-indigo/10 text-accent-indigo dark:text-accent-cyan text-xs font-bold uppercase tracking-widest whitespace-nowrap print:bg-slate-100 print:text-accent-indigo">
                            {proj.domain}
                          </div>
                        </div>
                        
                        <p className="text-sm text-[var(--foreground)] opacity-70 mb-8 font-medium leading-relaxed print:opacity-100 print:text-slate-600">
                          {proj.description}
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-6 border-y border-black/5 dark:border-white/5 print:border-slate-200">
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
                                <li key={i} className="text-sm text-[var(--foreground)] opacity-80 flex items-start gap-2 font-medium print:opacity-100">
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
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-16 text-center text-slate-400 dark:text-white/20 text-sm print:hidden">
          <p>© 2025 Duy Khanh. Professionally Built with Next.js 16.</p>
        </footer>
      </main>
    </div>
  );
}