import { Link } from "react-router-dom";

export const Logo = ({ light, to = "/" }: { light?: boolean; to?: string }) => (
  <Link to={to} className="inline-flex items-center gap-2.5">
    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-md shadow-primary/30">
      <svg viewBox="0 0 32 32" className="h-5 w-5" fill="none" aria-hidden>
        <path d="M4 22c4-10 8-10 12-10s8 0 12 10" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M9 22v-4M16 22V12M23 22v-4" stroke="#06B6D4" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
    </span>
    <span className={`font-display text-lg font-extrabold tracking-tight ${light ? "text-white" : "text-secondary"}`}>SkillBridge</span>
  </Link>
);
