import type { LucideIcon } from "lucide-react";
import { LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Logo } from "./Logo";

export interface NavItem { to: string; label: string; icon: LucideIcon; end?: boolean }

interface Props { items: NavItem[]; roleLabel: string; onLogout: () => void; onNavigate?: () => void; homePath: string }

export const Sidebar = ({ items, roleLabel, onLogout, onNavigate, homePath }: Props) => (
  <div className="flex h-full flex-col bg-secondary text-slate-300">
    <div className="px-5 py-5"><Logo light to={homePath} /><span className="mt-3 inline-block rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-accent">{roleLabel}</span></div>
    <nav className="flex-1 space-y-1 overflow-y-auto px-3" aria-label="Dashboard">
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink key={to} to={to} end={end} onClick={onNavigate}
          className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${isActive ? "bg-primary text-white shadow-md shadow-primary/30" : "hover:bg-white/10 hover:text-white"}`}>
          <Icon className="h-[18px] w-[18px]" />{label}
        </NavLink>
      ))}
    </nav>
    <button onClick={onLogout} className="m-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-white/10 hover:text-white"><LogOut className="h-[18px] w-[18px]" />Log out</button>
  </div>
);
