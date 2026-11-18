import { Search, X } from "lucide-react";
import { CATEGORIES, WORK_MODES, type InternshipFilters as Filters } from "../../types";
import { Button } from "../common/Button";
import { SelectField } from "../forms/SelectField";

interface Props { filters: Filters; search: string; onSearch: (v: string) => void; onChange: (f: Partial<Filters>) => void; onReset: () => void }

export const InternshipFilters = ({ filters, search, onSearch, onChange, onReset }: Props) => (
  <div className="mb-6 rounded-2xl border border-slate-200/80 bg-surface p-4 shadow-card">
    <div className="relative">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Search by title, skill or keyword…" aria-label="Search internships"
        className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10" />
    </div>
    <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <SelectField aria-label="Category" value={filters.category ?? ""} onChange={(e) => onChange({ category: e.target.value || undefined, page: 1 })} options={CATEGORIES} placeholder="All categories" />
      <SelectField aria-label="Work mode" value={filters.workMode ?? ""} onChange={(e) => onChange({ workMode: e.target.value || undefined, page: 1 })} options={WORK_MODES.map((m) => ({ value: m, label: m.charAt(0) + m.slice(1).toLowerCase() }))} placeholder="Any work mode" />
      <input aria-label="Location" value={filters.location ?? ""} onChange={(e) => onChange({ location: e.target.value || undefined, page: 1 })} placeholder="Location"
        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10" />
      <input aria-label="Minimum stipend" type="number" min={0} value={filters.minStipend ?? ""} onChange={(e) => onChange({ minStipend: e.target.value ? Number(e.target.value) : undefined, page: 1 })} placeholder="Min stipend (LKR)"
        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10" />
      <SelectField aria-label="Sort" value={filters.sort} onChange={(e) => onChange({ sort: e.target.value as Filters["sort"], page: 1 })}
        options={[{ value: "newest", label: "Newest first" }, { value: "deadline", label: "Closing soon" }, { value: "stipend", label: "Highest stipend" }]} />
    </div>
    <div className="mt-3 flex justify-end"><Button variant="ghost" size="sm" onClick={onReset}><X className="h-3.5 w-3.5" />Reset filters</Button></div>
  </div>
);
