export const Skeleton = ({ className = "h-4 w-full" }: { className?: string }) => <div className={`skeleton ${className}`} aria-hidden />;

export const CardSkeletons = ({ count = 6 }: { count?: number }) => (
  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3" role="status" aria-label="Loading">
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="space-y-3 rounded-2xl border border-slate-200/80 bg-surface p-5">
        <div className="flex gap-3"><Skeleton className="h-11 w-11 rounded-xl" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-2/3" /><Skeleton className="h-3 w-1/3" /></div></div>
        <Skeleton className="h-3 w-full" /><Skeleton className="h-3 w-5/6" />
        <div className="flex gap-2"><Skeleton className="h-6 w-16 rounded-full" /><Skeleton className="h-6 w-16 rounded-full" /></div>
      </div>
    ))}
  </div>
);

export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <div className="space-y-3 p-5" role="status" aria-label="Loading">
    {Array.from({ length: rows }, (_, i) => <Skeleton key={i} className="h-10 w-full" />)}
  </div>
);

export const StatSkeletons = ({ count = 4 }: { count?: number }) => (
  <div className="grid grid-cols-2 gap-4 lg:grid-cols-4" role="status" aria-label="Loading">
    {Array.from({ length: count }, (_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
  </div>
);
