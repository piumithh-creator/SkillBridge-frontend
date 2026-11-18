import { GraduationCap, ShieldCheck, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "../../components/layout/Logo";

export const AuthShell = ({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) => (
  <div className="grid min-h-screen lg:grid-cols-2">
    <div className="relative hidden overflow-hidden bg-secondary p-12 text-white lg:flex lg:flex-col lg:justify-between">
      <div className="bridge-grid absolute inset-0 opacity-40" aria-hidden />
      <div className="absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-primary/40 blur-3xl" aria-hidden />
      <div className="relative"><Logo light /></div>
      <div className="relative max-w-md">
        <h2 className="text-4xl font-extrabold leading-tight">Where skills meet <span className="text-accent">opportunity</span>.</h2>
        <ul className="mt-8 space-y-4 text-slate-300">
          <li className="flex gap-3"><GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-accent" />Find internships that match your skills and track every application.</li>
          <li className="flex gap-3"><Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-accent" />Get an AI review of your CV with concrete ways to improve it.</li>
          <li className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent" />Companies review candidates in one secure, organised place.</li>
        </ul>
      </div>
      <p className="relative text-xs text-slate-500">© {new Date().getFullYear()} SkillBridge</p>
    </div>
    <div className="flex items-center justify-center px-4 py-12 sm:px-8">
      <div className="w-full max-w-md">
        <div className="mb-8 lg:hidden"><Logo /></div>
        <h1 className="text-3xl font-extrabold">{title}</h1>
        <p className="mb-8 mt-1 text-slate-500">{subtitle}</p>
        {children}
      </div>
    </div>
  </div>
);
