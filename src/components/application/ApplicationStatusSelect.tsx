import { APPLICATION_STATUSES, type ApplicationStatus } from "../../types";

export const ApplicationStatusSelect = ({ value, onChange }: { value: ApplicationStatus; onChange: (s: ApplicationStatus) => void }) => (
  <select aria-label="Change status" value={value} onChange={(e) => onChange(e.target.value as ApplicationStatus)} className="rounded-lg border border-slate-300 px-2 py-1 text-xs">
    {APPLICATION_STATUSES.map((st) => <option key={st}>{st}</option>)}
  </select>
);
