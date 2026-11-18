import { FileText } from "lucide-react";
import { useState } from "react";
import { Card } from "../../components/common/Card";
import { EmptyState } from "../../components/common/EmptyState";
import { ErrorState } from "../../components/common/ErrorState";
import { PageHeader } from "../../components/common/PageHeader";
import { Pagination } from "../../components/common/Pagination";
import { TableSkeleton } from "../../components/common/Skeleton";
import { StatusBadge } from "../../components/common/StatusBadge";
import { SelectField } from "../../components/forms/SelectField";
import { useFetch } from "../../hooks/useFetch";
import { adminService } from "../../services/admin.service";
import { APPLICATION_STATUSES } from "../../types";
import { formatDate } from "../../utils/format";

export default function AdminApplications() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const { data, loading, error, reload } = useFetch(() => adminService.applications({ page, limit: 10, status: status || undefined }), [page, status]);

  return (
    <div>
      <PageHeader title="Applications" subtitle="Read-only monitoring of all applications on the platform." />
      <div className="mb-4 max-w-xs"><SelectField aria-label="Status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} options={APPLICATION_STATUSES} placeholder="All statuses" /></div>
      {error ? <ErrorState message={error} onRetry={() => void reload()} /> : loading && !data ? <Card><TableSkeleton /></Card>
        : !data?.items.length ? <EmptyState icon={FileText} title="No applications" />
        : (
          <Card className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="p-4">Student</th><th className="p-4">Internship</th><th className="p-4">Company</th><th className="p-4">Applied</th><th className="p-4">Status</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {data.items.map((a) => (
                  <tr key={a._id} className="hover:bg-slate-50/60">
                    <td className="p-4"><p className="font-semibold">{typeof a.student === "object" ? a.student.name : "—"}</p><p className="text-xs text-slate-500">{typeof a.student === "object" ? a.student.email : ""}</p></td>
                    <td className="p-4">{a.internship?.title ?? "(deleted)"}</td>
                    <td className="p-4 text-slate-600">{typeof a.company === "object" ? a.company.companyName : "—"}</td>
                    <td className="p-4 text-slate-600">{formatDate(a.createdAt)}</td>
                    <td className="p-4"><StatusBadge status={a.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      <Pagination meta={data?.meta ?? null} onPage={setPage} />
    </div>
  );
}
