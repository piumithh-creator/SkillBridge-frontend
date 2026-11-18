import { Download, FileText } from "lucide-react";
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
import { fetchMyApplications, withdrawApplication } from "../../features/application/applicationSlice";
import { getErrorMessage } from "../../services/api";
import { reportService } from "../../services/report.service";
import { APPLICATION_STATUSES, type ApplicationStatus } from "../../types";
import { formatDate } from "../../utils/format";

export default function StudentApplications() {
  const dispatch = useAppDispatch();
  const { mine, mineMeta, loading, error } = useAppSelector((s) => s.application);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<ApplicationStatus | "">("");
  const [target, setTarget] = useState<string | null>(null);
  const load = () => dispatch(fetchMyApplications({ page, limit: 10, status: status || undefined }));
  useEffect(() => { void load(); }, [page, status]); // eslint-disable-line react-hooks/exhaustive-deps

  const withdraw = async () => {
    if (!target) return;
    const res = await dispatch(withdrawApplication(target));
    if (withdrawApplication.fulfilled.match(res)) toast.success("Application withdrawn"); else toast.error(res.payload ?? "Failed");
    setTarget(null);
  };

  return (
    <div>
      <PageHeader title="My applications" subtitle="Track every application in one place."
        actions={<Button size="sm" variant="outline" onClick={() => reportService.studentApplications().catch((e) => toast.error(getErrorMessage(e)))}><Download className="h-4 w-4" />PDF report</Button>} />
      <div className="mb-4 max-w-xs"><SelectField aria-label="Filter by status" value={status} onChange={(e) => { setStatus(e.target.value as ApplicationStatus | ""); setPage(1); }} options={APPLICATION_STATUSES} placeholder="All statuses" /></div>
      {error ? <ErrorState message={error} onRetry={() => void load()} /> : loading && !mine.length ? <Card><TableSkeleton /></Card>
        : !mine.length ? <EmptyState icon={FileText} title="No applications" message="Applications you submit will appear here." action={<Link to="/student/internships"><Button>Browse internships</Button></Link>} />
        : (
          <Card className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="p-4">Internship</th><th className="p-4">Company</th><th className="p-4">Applied</th><th className="p-4">Status</th><th className="p-4" /></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {mine.map((a) => {
                  const c = a.internship?.company;
                  return (
                    <tr key={a._id} className="hover:bg-slate-50/60">
                      <td className="p-4 font-semibold"><Link className="hover:text-primary" to={`/student/internships/${a.internship._id}`}>{a.internship.title}</Link></td>
                      <td className="p-4 text-slate-600">{typeof c === "object" ? c.companyName : "—"}</td>
                      <td className="p-4 text-slate-600">{formatDate(a.createdAt)}</td>
                      <td className="p-4"><StatusBadge status={a.status} /></td>
                      <td className="p-4 text-right">{a.status !== "ACCEPTED" && <Button size="sm" variant="ghost" onClick={() => setTarget(a._id)}>Withdraw</Button>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        )}
      <Pagination meta={mineMeta} onPage={setPage} />
      <ConfirmDialog open={!!target} title="Withdraw application?" message="The company will be notified." confirmLabel="Withdraw" onConfirm={() => void withdraw()} onCancel={() => setTarget(null)} />
    </div>
  );
}
