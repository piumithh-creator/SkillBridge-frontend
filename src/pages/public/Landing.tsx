import { ArrowRight, BarChart3, FileCheck2, Search, Sparkles, UserPlus } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Button } from "../../components/common/Button";
import { CardSkeletons } from "../../components/common/Skeleton";
import { InternshipCard } from "../../components/internship/InternshipCard";
import { fetchInternships } from "../../features/internship/internshipSlice";

const steps = [
  { icon: UserPlus, title: "Build your profile", text: "Add skills, education and your CV once. Reuse them for every application." },
  { icon: Search, title: "Find the right fit", text: "Search and filter live internships by category, mode, location and stipend." },
  { icon: FileCheck2, title: "Apply and track", text: "Follow each application from pending to accepted and get notified on every change." }
];

export default function Landing() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((s) => s.internship);
  useEffect(() => { void dispatch(fetchInternships({ page: 1, limit: 3, sort: "newest" })); }, [dispatch]);

  return (
    <>
      <section className="relative overflow-hidden bg-secondary text-white">
        <div className="bridge-grid absolute inset-0 opacity-50" aria-hidden />
        <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-primary/50 blur-3xl" aria-hidden />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-accent/30 blur-3xl" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-accent ring-1 ring-white/15"><Sparkles className="h-3.5 w-3.5" />AI-powered CV analysis</span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] sm:text-5xl lg:text-6xl">Bridge the gap between <span className="bg-gradient-to-r from-indigo-300 to-accent bg-clip-text text-transparent">skills</span> and your first internship.</h1>
            <p className="mt-5 max-w-lg text-lg text-slate-300">SkillBridge connects students with companies that are ready to grow new talent – with smart matching, transparent tracking and honest feedback on your CV.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register"><Button size="lg">Get started free <ArrowRight className="h-4 w-4" /></Button></Link>
              <Link to="/internships"><Button size="lg" variant="outline" className="!border-white/25 !bg-white/5 !text-white hover:!bg-white/10">Browse internships</Button></Link>
            </div>
          </div>
          <div className="relative hidden lg:block" aria-hidden>
            <svg viewBox="0 0 480 320" className="w-full">
              <path d="M20 250 C 120 80, 360 80, 460 250" fill="none" stroke="#4F46E5" strokeWidth="6" strokeLinecap="round" />
              {[80, 160, 240, 320, 400].map((x, i) => {
                const y = 250 - Math.sin(((x - 20) / 440) * Math.PI) * 135 + 6;
                return <g key={x}><line x1={x} y1={y} x2={x} y2="250" stroke="#06B6D4" strokeWidth="4" strokeLinecap="round" opacity={0.5 + i * 0.1} /><circle cx={x} cy={y} r="7" fill="#fff" /></g>;
              })}
              <line x1="0" y1="252" x2="480" y2="252" stroke="#334155" strokeWidth="3" />
              <text x="20" y="285" fill="#94A3B8" fontSize="14" fontWeight="600">Student</text>
              <text x="395" y="285" fill="#94A3B8" fontSize="14" fontWeight="600">Company</text>
            </svg>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <h2 className="text-3xl font-extrabold">How SkillBridge works</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <div key={title} className="rounded-2xl border border-slate-200/80 bg-surface p-6 shadow-card">
              <div className="mb-4 flex items-center gap-3"><span className="rounded-xl bg-primary-50 p-2.5 text-primary"><Icon className="h-5 w-5" /></span><span className="font-display text-sm font-bold text-slate-400">0{i + 1}</span></div>
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="mt-1 text-sm text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-extrabold">An honest second opinion on your CV</h2>
            <p className="mt-3 text-slate-600">Upload a PDF and receive a score, a skills inventory, missing skills, formatting advice and the internship categories that suit you best. Then see how well your CV matches any listing.</p>
            <Link to="/register" className="mt-6 inline-flex items-center gap-2 font-semibold text-primary hover:underline">Try the CV analyzer <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[{ icon: Sparkles, t: "AI CV score" }, { icon: BarChart3, t: "Match percentage" }, { icon: FileCheck2, t: "PDF reports" }, { icon: Search, t: "Smart filters" }].map(({ icon: Icon, t }) => (
              <div key={t} className="flex items-center gap-3 rounded-2xl bg-background p-4 ring-1 ring-slate-200"><Icon className="h-5 w-5 text-primary" /><span className="text-sm font-bold">{t}</span></div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mb-8 flex items-end justify-between"><h2 className="text-3xl font-extrabold">Latest internships</h2><Link to="/internships" className="text-sm font-semibold text-primary hover:underline">View all</Link></div>
        {loading && !items.length ? <CardSkeletons count={3} /> : items.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.slice(0, 3).map((i) => <InternshipCard key={i._id} internship={i} basePath="/internships" />)}</div>
        ) : <p className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">No internships have been published yet. Check back soon!</p>}
      </section>
    </>
  );
}
