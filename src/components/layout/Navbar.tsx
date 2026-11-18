import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { Button } from "../common/Button";
import { Logo } from "./Logo";

export const dashboardPath = (role?: string) => (role === "ADMIN" ? "/admin" : role === "COMPANY" ? "/company" : "/student");

export const Navbar = () => {
  const user = useAppSelector((s) => s.auth.user);
  const [open, setOpen] = useState(false);
  const link = ({ isActive }: { isActive: boolean }) => `text-sm font-semibold transition ${isActive ? "text-primary" : "text-slate-600 hover:text-secondary"}`;
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          <NavLink to="/" end className={link}>Home</NavLink>
          <NavLink to="/internships" className={link}>Internships</NavLink>
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <Link to={dashboardPath(user.role)}><Button size="sm">Go to dashboard</Button></Link>
          ) : (
            <>
              <Link to="/login"><Button variant="ghost" size="sm">Log in</Button></Link>
              <Link to="/register"><Button size="sm">Get started</Button></Link>
            </>
          )}
        </div>
        <button className="rounded-lg p-2 md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="space-y-1 border-t border-slate-200 bg-surface px-4 py-3 md:hidden" onClick={() => setOpen(false)}>
          <NavLink to="/" end className="block rounded-lg px-3 py-2 text-sm font-semibold hover:bg-slate-50">Home</NavLink>
          <NavLink to="/internships" className="block rounded-lg px-3 py-2 text-sm font-semibold hover:bg-slate-50">Internships</NavLink>
          {user ? <Link to={dashboardPath(user.role)} className="block rounded-lg px-3 py-2 text-sm font-semibold text-primary">Dashboard</Link> : (
            <>
              <Link to="/login" className="block rounded-lg px-3 py-2 text-sm font-semibold">Log in</Link>
              <Link to="/register" className="block rounded-lg bg-primary px-3 py-2 text-center text-sm font-semibold text-white">Get started</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};
