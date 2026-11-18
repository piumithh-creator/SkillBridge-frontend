import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../utils/format";

interface Props extends InputHTMLAttributes<HTMLInputElement> { label: string; error?: string; hint?: string }

export const InputField = forwardRef<HTMLInputElement, Props>(({ label, error, hint, className, id, ...rest }, ref) => {
  const fieldId = id ?? rest.name;
  return (
    <div className="w-full">
      <label htmlFor={fieldId} className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</label>
      <input
        id={fieldId} ref={ref} aria-invalid={!!error} aria-describedby={error ? `${fieldId}-err` : undefined}
        className={cn("w-full rounded-xl border bg-surface px-3.5 py-2.5 text-sm transition placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10",
          error ? "border-rose-400" : "border-slate-300", className)}
        {...rest}
      />
      {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      {error && <p id={`${fieldId}-err`} className="mt-1 text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );
});
InputField.displayName = "InputField";
