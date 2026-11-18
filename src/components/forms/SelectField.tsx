import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "../../utils/format";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> { label?: string; error?: string; options: readonly string[] | { value: string; label: string }[]; placeholder?: string }

export const SelectField = forwardRef<HTMLSelectElement, Props>(({ label, error, options, placeholder, className, id, ...rest }, ref) => {
  const fieldId = id ?? rest.name;
  return (
    <div className="w-full">
      {label && <label htmlFor={fieldId} className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</label>}
      <select id={fieldId} ref={ref} aria-invalid={!!error}
        className={cn("w-full rounded-xl border bg-surface px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10", error ? "border-rose-400" : "border-slate-300", className)} {...rest}>
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) => typeof o === "string" ? <option key={o} value={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {error && <p className="mt-1 text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );
});
SelectField.displayName = "SelectField";
