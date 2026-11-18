import { Link } from "react-router-dom";
import { Logo } from "./Logo";

export const Footer = () => (
  <footer className="bg-secondary text-slate-300">
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
      <div>
        <Logo light />
        <p className="mt-3 max-w-xs text-sm text-slate-400">Bridging the gap between ambitious students and companies that want to grow new talent.</p>
      </div>
      <div>
        <h4 className="mb-3 text-sm font-bold text-white">Explore</h4>
        <ul className="space-y-2 text-sm"><li><Link className="hover:text-white" to="/internships">Browse internships</Link></li><li><Link className="hover:text-white" to="/register">Create an account</Link></li><li><Link className="hover:text-white" to="/login">Log in</Link></li></ul>
      </div>
      <div>
        <h4 className="mb-3 text-sm font-bold text-white">For everyone</h4>
        <p className="text-sm text-slate-400">Students build skills and apply. Companies find talent. Admins keep the platform healthy.</p>
      </div>
    </div>
    <div className="border-t border-white/10 py-4 text-center text-xs text-slate-500">© {new Date().getFullYear()} SkillBridge. Built for the RAD coursework.</div>
  </footer>
);
