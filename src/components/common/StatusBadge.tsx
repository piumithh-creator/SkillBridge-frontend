import type { ApplicationStatus, InternshipStatus } from "../../types";
import { cn } from "../../utils/format";

const styles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 ring-amber-600/20",
  REVIEWING: "bg-sky-50 text-sky-700 ring-sky-600/20",
  SHORTLISTED: "bg-violet-50 text-violet-700 ring-violet-600/20",
  ACCEPTED: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  REJECTED: "bg-rose-50 text-rose-700 ring-rose-600/20",
  PUBLISHED: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  DRAFT: "bg-slate-100 text-slate-600 ring-slate-500/20",
  CLOSED: "bg-amber-50 text-amber-700 ring-amber-600/20",
  REMOVED: "bg-rose-50 text-rose-700 ring-rose-600/20",
  BLOCKED: "bg-rose-50 text-rose-700 ring-rose-600/20",
  ACTIVE: "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
};

export const StatusBadge = ({ status }: { status: ApplicationStatus | InternshipStatus | "BLOCKED" | "ACTIVE" }) => (
  <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset", styles[status])}>
    {status.charAt(0) + status.slice(1).toLowerCase()}
  </span>
);
