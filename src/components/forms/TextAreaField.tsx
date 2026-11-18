import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "../../utils/format";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> { label: string; error?: string }

export const TextAreaField = forwardRef<HTMLTextAreaElement, Props>(({ label, error, className, id, rows = 4, ...rest }, ref) => {
  const fieldId = id ?? rest.name;
  return (
    <div className="w-full">
      <label htmlFor={fieldId} className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</label>
      <textarea id={fieldId} ref={ref} rows={rows} aria-invalid={!!error}
        className={cn("w-full rounded-xl border bg-surface px-3.5 py-2.5 text-sm placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10",
          error ? "border-rose-400" : "border-slate-300", className)} {...rest} />
      {error && <p className="mt-1 text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );
});
TextAreaField.displayName = "TextAreaField";
