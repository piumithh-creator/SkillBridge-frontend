import { Inbox, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export const EmptyState = ({ title, message, icon: Icon = Inbox, action }: { title: string; message?: string; icon?: LucideIcon; action?: ReactNode }) => (
  <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-surface px-6 py-14 text-center">
    <div className="mb-4 rounded-2xl bg-primary-50 p-3 text-primary"><Icon className="h-7 w-7" /></div>
    <h3 className="text-base font-bold">{title}</h3>
    {message && <p className="mt-1 max-w-sm text-sm text-slate-500">{message}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);
