import { Bookmark } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { Button } from "../../components/common/Button";
import { EmptyState } from "../../components/common/EmptyState";
import { ErrorState } from "../../components/common/ErrorState";
import { PageHeader } from "../../components/common/PageHeader";
import { Pagination } from "../../components/common/Pagination";
import { CardSkeletons } from "../../components/common/Skeleton";
import { InternshipCard } from "../../components/internship/InternshipCard";
import { toggleSaved } from "../../features/student/studentSlice";
import { getErrorMessage } from "../../services/api";
import { studentService } from "../../services/student.service";
import type { Internship, PageMeta } from "../../types";

export default function Saved() {
  const dispatch = useAppDispatch();
  const [items, setItems] = useState<Internship[]>([]);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try { const r = await studentService.saved({ page, limit: 9 }); setItems(r.items.map((x) => x.internship)); setMeta(r.meta); }
    catch (e) { setError(getErrorMessage(e)); } finally { setLoading(false); }
  }, [page]);
  useEffect(() => { void load(); }, [load]);

  const unsave = async (id: string) => {
    const res = await dispatch(toggleSaved({ id, saved: true }));
    if (toggleSaved.fulfilled.match(res)) { setItems((p) => p.filter((i) => i._id !== id)); toast.success("Removed"); } else toast.error("Could not remove");
  };

  return (
    <div>
      <PageHeader title="Saved internships" subtitle="Opportunities you bookmarked for later." />
      {error ? <ErrorState message={error} onRetry={() => void load()} /> : loading ? <CardSkeletons count={3} />
        : !items.length ? <EmptyState icon={Bookmark} title="Nothing saved yet" message="Tap the bookmark on any internship to keep it here." action={<Link to="/student/internships"><Button>Browse internships</Button></Link>} />
        : <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{items.map((i) => <InternshipCard key={i._id} internship={i} basePath="/student/internships" saved onToggleSave={() => void unsave(i._id)} />)}</div>}
      <Pagination meta={meta} onPage={setPage} />
    </div>
  );
}
