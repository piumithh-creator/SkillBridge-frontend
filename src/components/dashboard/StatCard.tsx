import type { LucideIcon } from "lucide-react";
import { Card } from "../common/Card";

const tones = {
  primary: "bg-primary-50 text-primary", accent: "bg-accent-50 text-cyan-700", amber: "bg-amber-50 text-amber-600",
  emerald: "bg-emerald-50 text-emerald-600", rose: "bg-rose-50 text-rose-600", violet: "bg-violet-50 text-violet-600"
};

export const StatCard = ({ label, value, icon: Icon, tone = "primary" }: { label: string; value: number | string; icon: LucideIcon; tone?: keyof typeof tones }) => (
  <Card className="p-5">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <span className={`rounded-xl p-2 ${tones[tone]}`}><Icon className="h-5 w-5" /></span>
    </div>
    <p className="mt-3 font-display text-3xl font-extrabold tabular-nums">{value}</p>
  </Card>
);
