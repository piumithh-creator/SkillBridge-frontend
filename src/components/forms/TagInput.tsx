import { X } from "lucide-react";
import { useState, type KeyboardEvent } from "react";

interface Props { label: string; value: string[]; onChange: (v: string[]) => void; placeholder?: string; max?: number }

/** Comma/Enter separated chips – used for technical skills, soft skills and required skills. */
export const TagInput = ({ label, value, onChange, placeholder = "Type and press Enter", max = 40 }: Props) => {
  const [draft, setDraft] = useState("");
  const add = (raw: string) => {
    const t = raw.trim();
    if (!t || value.some((v) => v.toLowerCase() === t.toLowerCase()) || value.length >= max) return setDraft("");
    onChange([...value, t.slice(0, 50)]);
    setDraft("");
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(draft); }
    else if (e.key === "Backspace" && !draft && value.length) onChange(value.slice(0, -1));
  };
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</label>
      <div className="flex min-h-[44px] flex-wrap gap-1.5 rounded-xl border border-slate-300 bg-surface p-2 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
        {value.map((t) => (
          <span key={t} className="inline-flex items-center gap-1 rounded-lg bg-primary-50 px-2 py-1 text-xs font-semibold text-primary">
            {t}
            <button type="button" aria-label={`Remove ${t}`} onClick={() => onChange(value.filter((v) => v !== t))}><X className="h-3 w-3" /></button>
          </span>
        ))}
        <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={onKey} onBlur={() => add(draft)} placeholder={value.length ? "" : placeholder}
          aria-label={label} className="min-w-[8rem] flex-1 bg-transparent px-1 py-1 text-sm outline-none" />
      </div>
    </div>
  );
};
