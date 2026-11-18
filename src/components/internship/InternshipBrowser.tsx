import { SearchX } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchInternships, resetFilters, setFilters } from "../../features/internship/internshipSlice";
import { fetchSavedIds, toggleSaved } from "../../features/student/studentSlice";
import { useDebounce } from "../../hooks/useDebounce";
import { CardSkeletons } from "../common/Skeleton";
import { EmptyState } from "../common/EmptyState";
import { ErrorState } from "../common/ErrorState";
import { Pagination } from "../common/Pagination";
import { InternshipCard } from "./InternshipCard";
import { InternshipFilters } from "./InternshipFilters";

/** Search + filter + sort + paginate grid. Used on the public site and inside the student dashboard. */
export const InternshipBrowser = ({ basePath, isStudent }: { basePath: string; isStudent?: boolean }) => {
  const dispatch = useAppDispatch();
  const { items, meta, filters, loading, error } = useAppSelector((s) => s.internship);
  const savedIds = useAppSelector((s) => s.student.savedIds);
  const [search, setSearch] = useState(filters.search ?? "");
  const debounced = useDebounce(search);

  useEffect(() => { if (debounced !== (filters.search ?? "")) dispatch(setFilters({ search: debounced || undefined, page: 1 })); }, [debounced]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { void dispatch(fetchInternships(filters)); }, [dispatch, filters]);
  useEffect(() => { if (isStudent) void dispatch(fetchSavedIds()); }, [dispatch, isStudent]);

  const onToggle = async (id: string) => {
    const res = await dispatch(toggleSaved({ id, saved: savedIds.includes(id) }));
    if (toggleSaved.rejected.match(res)) toast.error(res.payload ?? "Could not update saved internships");
    else toast.success(res.payload.nowSaved ? "Saved" : "Removed from saved");
  };

  return (
    <div>
      <InternshipFilters filters={filters} search={search} onSearch={setSearch} onChange={(f) => dispatch(setFilters(f))}
        onReset={() => { setSearch(""); dispatch(resetFilters()); }} />
      {error ? <ErrorState message={error} onRetry={() => dispatch(fetchInternships(filters))} />
        : loading && !items.length ? <CardSkeletons />
        : !items.length ? <EmptyState icon={SearchX} title="No internships found" message="Try changing or clearing your filters." />
        : (
          <div className={`grid gap-5 sm:grid-cols-2 xl:grid-cols-3 ${loading ? "opacity-60" : ""}`}>
            {items.map((i) => (
              <InternshipCard key={i._id} internship={i} basePath={basePath}
                saved={isStudent ? savedIds.includes(i._id) : undefined} onToggleSave={isStudent ? () => void onToggle(i._id) : undefined} />
            ))}
          </div>
        )}
      <Pagination meta={meta} onPage={(page) => { dispatch(setFilters({ page })); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
    </div>
  );
};
