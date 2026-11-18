import { Search, Users as UsersIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../../components/common/Button";
import { Card } from "../../components/common/Card";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { EmptyState } from "../../components/common/EmptyState";
import { ErrorState } from "../../components/common/ErrorState";
import { PageHeader } from "../../components/common/PageHeader";
import { Pagination } from "../../components/common/Pagination";
import { TableSkeleton } from "../../components/common/Skeleton";
import { StatusBadge } from "../../components/common/StatusBadge";
import { useDebounce } from "../../hooks/useDebounce";
import { useFetch } from "../../hooks/useFetch";
import { adminService } from "../../services/admin.service";
import { getErrorMessage } from "../../services/api";
import type { AdminUser, Role } from "../../types";
import { formatDate } from "../../utils/format";

const titles: Record<string, string> = { STUDENT: "Students", COMPANY: "Companies", all: "All users" };

export default function AdminUsers({ role }: { role?: Role }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const q = useDebounce(search);
  const [target, setTarget] = useState<AdminUser | null>(null);
  const [busy, setBusy] = useState(false);
  const { data, loading, error, reload } = useFetch(() => adminService.users({ page, limit: 10, role, search: q || undefined }), [page, q, role]);

  const toggle = async () => {
    if (!target) return;
    setBusy(true);
    try { await adminService.setBlocked(target.id, !target.isBlocked); toast.success(target.isBlocked ? "User unblocked" : "User blocked"); setTarget(null); await reload(); }
    catch (e) { toast.error(getErrorMessage(e)); } finally { setBusy(false); }
  };

  return (
    <div>
      <PageHeader title={titles[role ?? "all"]!} subtitle="Search, review and block or unblock accounts." />
      <div className="relative mb-4 max-w-sm"><Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search name or email" aria-label="Search users" className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10" /></div>
      {error ? <ErrorState message={error} onRetry={() => void reload()} /> : loading && !data ? <Card><TableSkeleton /></Card>
        : !data?.items.length ? <EmptyState icon={UsersIcon} title="No users found" />
        : (
          <Card className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="p-4">Name</th><th className="p-4">Role</th><th className="p-4">Joined</th><th className="p-4">Last login</th><th className="p-4">Status</th><th className="p-4" /></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {data.items.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60">
                    <td className="p-4"><p className="font-semibold">{u.profile?.companyName ?? u.name}</p><p className="text-xs text-slate-500">{u.email}</p></td>
                    <td className="p-4 text-slate-600">{u.role.charAt(0) + u.role.slice(1).toLowerCase()}</td>
                    <td className="p-4 text-slate-600">{formatDate(u.createdAt)}</td>
                    <td className="p-4 text-slate-600">{formatDate(u.lastLoginAt)}</td>
                    <td className="p-4"><StatusBadge status={u.isBlocked ? "BLOCKED" : "ACTIVE"} /></td>
                    <td className="p-4 text-right">{u.role !== "ADMIN" && <Button size="sm" variant={u.isBlocked ? "outline" : "ghost"} className={u.isBlocked ? "" : "text-rose-600"} onClick={() => setTarget(u)}>{u.isBlocked ? "Unblock" : "Block"}</Button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      <Pagination meta={data?.meta ?? null} onPage={setPage} />
      <ConfirmDialog open={!!target} loading={busy} title={target?.isBlocked ? "Unblock user?" : "Block user?"} message={target?.isBlocked ? `${target?.email} will be able to log in again.` : `${target?.email} will be signed out and unable to log in.`} confirmLabel={target?.isBlocked ? "Unblock" : "Block"} onConfirm={() => void toggle()} onCancel={() => setTarget(null)} />
    </div>
  );
}
