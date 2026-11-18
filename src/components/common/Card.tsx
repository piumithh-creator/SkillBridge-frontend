import type { HTMLAttributes } from "react";
import { cn } from "../../utils/format";

export const Card = ({ className, ...rest }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("rounded-2xl border border-slate-200/80 bg-surface shadow-card", className)} {...rest} />
);
