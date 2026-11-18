import { Bookmark, BookmarkCheck, Calendar, Clock, MapPin, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import type { Internship } from "../../types";
import { daysLeft, formatStipend } from "../../utils/format";
import { Avatar } from "../common/Avatar";
import { Card } from "../common/Card";

interface Props { internship: Internship; basePath: string; saved?: boolean; onToggleSave?: () => void }

export const InternshipCard = ({ internship: i, basePath, saved, onToggleSave }: Props) => {
  const company = typeof i.company === "string" ? null : i.company;
  const left = daysLeft(i.deadline);
  return (
    <Card className="group relative flex h-full flex-col p-5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg">
      <div className="flex items-start gap-3">
        <Avatar name={company?.companyName ?? "Company"} src={company?.logo} size={44} />
        <div className="min-w-0 flex-1">
          <Link to={`${basePath}/${i._id}`} className="line-clamp-1 font-display text-base font-bold after:absolute after:inset-0 hover:text-primary">
            <span className="relative">{i.title}</span>
          </Link>
          <p className="line-clamp-1 text-sm text-slate-500">{company?.companyName ?? "Company"}</p>
        </div>
        {onToggleSave && (
          <button onClick={onToggleSave} aria-label={saved ? "Remove from saved" : "Save internship"} aria-pressed={saved}
            className="relative z-10 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-primary">
            {saved ? <BookmarkCheck className="h-5 w-5 text-primary" /> : <Bookmark className="h-5 w-5" />}
          </button>
        )}
      </div>
      <p className="mt-3 line-clamp-2 flex-1 text-sm text-slate-600">{i.description}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {i.requiredSkills.slice(0, 4).map((s) => <span key={s} className="rounded-md bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary">{s}</span>)}
        {i.requiredSkills.length > 4 && <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">+{i.requiredSkills.length - 4}</span>}
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
        <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /><dt className="sr-only">Location</dt><dd className="truncate">{i.location} · {i.workMode.toLowerCase()}</dd></div>
        <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /><dt className="sr-only">Duration</dt><dd>{i.duration}</dd></div>
        <div className="flex items-center gap-1.5"><Wallet className="h-3.5 w-3.5" /><dt className="sr-only">Stipend</dt><dd>{formatStipend(i.stipend)}</dd></div>
        <div className={`flex items-center gap-1.5 ${left <= 3 ? "font-semibold text-rose-600" : ""}`}><Calendar className="h-3.5 w-3.5" /><dt className="sr-only">Deadline</dt><dd>{left > 0 ? `${left}d left` : "Closing today"}</dd></div>
      </dl>
    </Card>
  );
};
