import { Briefcase, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Button } from "../../components/common/Button";
import { Card } from "../../components/common/Card";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { EmptyState } from "../../components/common/EmptyState";
import { ErrorState } from "../../components/common/ErrorState";
import { PageHeader } from "../../components/common/PageHeader";
import { Pagination } from "../../components/common/Pagination";
import { TableSkeleton } from "../../components/common/Skeleton";
import { StatusBadge } from "../../components/common/StatusBadge";
import { SelectField } from "../../components/forms/SelectField";
import { useFetch } from "../../hooks/useFetch";
import { adminService } from "../../services/admin.service";
import { getErrorMessage } from "../../services/api";
import type { Internship } from "../../types";
import { formatDate } from "../../utils/format";

export default function AdminInternships() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [target, setTarget] = useState<Internship | null>(null);
  const [busy, setBusy] = useState(false);
  const { data, loading, error, reload } = useFetch(() => adminService.internships({ page, limit: 10, status: status || undefined }), [page, status]);

  const remove = async () => {
    if (!target) return;
    setBusy(true);
    try { await adminService.removeInternship(target._id); toast.success("Internship removed"); setTarget(null); await reload(); }
    catch (e) { toast.error(getErrorMessage(e)); } finally { setBusy(false); }
  };

  return (
    <div>
      <PageHeader title="Internships" subtitle="Moderate listings and remove inappropriate content." />
      <div className="mb-4 max-w-xs"><SelectField aria-label="Status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} options={["PUBLISHED", "DRAFT", "CLOSED", "REMOVED"]} placeholder="All statuses" /></div>
      {error ? <ErrorState message={error} onRetry={() => void reload()} /> : loading && !data ? <Card><TableSkeleton /></Card>
        : !data?.items.length ? <EmptyState icon={Briefcase} title="No internships" />
        : (
          <Card className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="p-4">Title</th><th className="p-4">Company</th><th className="p-4">Deadline</th><th className="p-4">Status</th><th className="p-4" /></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {data.items.map((i) => (
                  <tr key={i._id} className="hover:bg-slate-50/60">
                    <td className="p-4 font-semibold">{i.status === "PUBLISHED" ? <Link className="hover:text-primary" to={`/internships/${i._id}`}>{i.title}</Link> : i.title}<p className="text-xs font-normal text-slate-500">{i.category}</p></td>
                    <td className="p-4 text-slate-600">{typeof i.company === "object" ? i.company.companyName : "—"}</td>
                    <td className="p-4 text-slate-600">{formatDate(i.deadline)}</td>
                    <td className="p-4"><StatusBadge status={i.status} /></td>
                    <td className="p-4 text-right">{i.status !== "REMOVED" && <Button size="sm" variant="ghost" className="text-rose-600" onClick={() => setTarget(i)}><Trash2 className="h-4 w-4" />Remove</Button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      <Pagination meta={data?.meta ?? null} onPage={setPage} />
      <ConfirmDialog open={!!target} loading={busy} title="Remove internship?" message={`"${target?.title}" will be hidden from students and the company will be notified.`} confirmLabel="Remove" onConfirm={() => void remove()} onCancel={() => setTarget(null)} />
    </div>
  );
}
