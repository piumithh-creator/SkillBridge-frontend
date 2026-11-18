import { Briefcase, Download, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
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
import { deleteInternship, fetchMyInternships } from "../../features/internship/internshipSlice";
import { getErrorMessage } from "../../services/api";
import { reportService } from "../../services/report.service";
import { formatDate } from "../../utils/format";

export default function CompanyInternships() {
  const dispatch = useAppDispatch();
  const { mine, mineMeta, loading, error } = useAppSelector((s) => s.internship);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [target, setTarget] = useState<string | null>(null);
  const load = () => dispatch(fetchMyInternships({ page, limit: 10, status: status || undefined }));
  useEffect(() => { void load(); }, [page, status]); // eslint-disable-line react-hooks/exhaustive-deps

  const remove = async () => {
    if (!target) return;
    const res = await dispatch(deleteInternship(target));
    if (deleteInternship.fulfilled.match(res)) toast.success("Internship deleted"); else toast.error(res.payload ?? "Failed");
    setTarget(null);
  };

  return (
    <div>
      <PageHeader title="My internships" subtitle="Create, edit and manage your listings." actions={<Link to="/company/internships/new"><Button size="sm"><Plus className="h-4 w-4" />New internship</Button></Link>} />
      <div className="mb-4 max-w-xs"><SelectField aria-label="Status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} options={["DRAFT", "PUBLISHED", "CLOSED"]} placeholder="All statuses" /></div>
      {error ? <ErrorState message={error} onRetry={() => void load()} /> : loading && !mine.length ? <Card><TableSkeleton /></Card>
        : !mine.length ? <EmptyState icon={Briefcase} title="No internships yet" message="Post your first internship to start receiving applications." action={<Link to="/company/internships/new"><Button>Post internship</Button></Link>} />
        : (
          <Card className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="p-4">Title</th><th className="p-4">Status</th><th className="p-4">Deadline</th><th className="p-4">Applicants</th><th className="p-4 text-right">Actions</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {mine.map((i) => (
                  <tr key={i._id} className="hover:bg-slate-50/60">
                    <td className="p-4"><p className="font-semibold">{i.title}</p><p className="text-xs text-slate-500">{i.category} · {i.location}</p></td>
                    <td className="p-4"><StatusBadge status={i.status} /></td>
                    <td className="p-4 text-slate-600">{formatDate(i.deadline)}</td>
                    <td className="p-4"><Link className="font-semibold text-primary hover:underline" to={`/company/applicants?internshipId=${i._id}`}>{i.applicationCount ?? 0}</Link></td>
                    <td className="p-4"><div className="flex justify-end gap-1">
                      <Button size="sm" variant="ghost" aria-label="Download report" onClick={() => reportService.companyInternship(i._id).catch((e) => toast.error(getErrorMessage(e)))}><Download className="h-4 w-4" /></Button>
                      <Link to={`/company/internships/${i._id}/edit`}><Button size="sm" variant="ghost" aria-label="Edit"><Pencil className="h-4 w-4" /></Button></Link>
                      <Button size="sm" variant="ghost" aria-label="Delete" className="text-rose-600" onClick={() => setTarget(i._id)}><Trash2 className="h-4 w-4" /></Button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      <Pagination meta={mineMeta} onPage={setPage} />
      <ConfirmDialog open={!!target} title="Delete internship?" message="This also deletes all applications for it. This cannot be undone." confirmLabel="Delete" onConfirm={() => void remove()} onCancel={() => setTarget(null)} />
    </div>
  );
}
