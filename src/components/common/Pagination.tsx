import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PageMeta } from "../../types";

export const Pagination = ({ meta, onPage }: { meta: PageMeta | null; onPage: (p: number) => void }) => {
  if (!meta || meta.totalPages <= 1) return null;
  const { page, totalPages, total } = meta;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1);
  return (
    <nav className="mt-6 flex flex-wrap items-center justify-between gap-3" aria-label="Pagination">
      <p className="text-sm text-slate-500">{total} results</p>
      <div className="flex items-center gap-1">
        <button disabled={page <= 1} onClick={() => onPage(page - 1)} aria-label="Previous page" className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-30"><ChevronLeft className="h-4 w-4" /></button>
        {pages.map((p, i) => (
          <span key={p} className="flex items-center">
            {i > 0 && p - pages[i - 1]! > 1 && <span className="px-1 text-slate-400">…</span>}
            <button onClick={() => onPage(p)} aria-current={p === page ? "page" : undefined}
              className={`h-9 min-w-9 rounded-lg px-2 text-sm font-semibold ${p === page ? "bg-primary text-white" : "text-slate-600 hover:bg-slate-100"}`}>{p}</button>
          </span>
        ))}
        <button disabled={page >= totalPages} onClick={() => onPage(page + 1)} aria-label="Next page" className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-30"><ChevronRight className="h-4 w-4" /></button>
      </div>
    </nav>
  );
};
