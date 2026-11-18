import { Briefcase, Download, FileText, GraduationCap, Building2, ShieldBan } from "lucide-react";
import toast from "react-hot-toast";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Button } from "../../components/common/Button";
import { Card } from "../../components/common/Card";
import { ErrorState } from "../../components/common/ErrorState";
import { PageHeader } from "../../components/common/PageHeader";
import { StatSkeletons } from "../../components/common/Skeleton";
import { StatCard } from "../../components/dashboard/StatCard";
import { useFetch } from "../../hooks/useFetch";
import { adminService } from "../../services/admin.service";
import { getErrorMessage } from "../../services/api";
import { reportService } from "../../services/report.service";

export const CHART_COLORS = ["#4F46E5", "#06B6D4", "#F59E0B", "#10B981", "#F43F5E", "#8B5CF6", "#64748B"];

export default function AdminDashboard() {
  const { data, loading, error, reload } = useFetch(() => adminService.dashboard());
  const pie = data ? Object.entries(data.applications.byStatus).map(([name, value]) => ({ name, value })) : [];

  return (
    <div className="space-y-8">
      <PageHeader title="Admin dashboard" subtitle="Platform health, live from the database."
        actions={<Button size="sm" variant="outline" onClick={() => reportService.adminPlatform().catch((e) => toast.error(getErrorMessage(e)))}><Download className="h-4 w-4" />Platform report</Button>} />
      {error ? <ErrorState message={error} onRetry={() => void reload()} /> : loading || !data ? <StatSkeletons count={5} /> : (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
            <StatCard label="Students" value={data.users.students} icon={GraduationCap} />
            <StatCard label="Companies" value={data.users.companies} icon={Building2} tone="accent" />
            <StatCard label="Published internships" value={data.internships.PUBLISHED} icon={Briefcase} tone="emerald" />
            <StatCard label="Applications" value={data.applications.total} icon={FileText} tone="violet" />
            <StatCard label="Blocked users" value={data.users.blocked} icon={ShieldBan} tone="rose" />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-5"><h2 className="mb-2 font-bold">Applications by status</h2>
              <div className="h-72" role="img" aria-label="Pie chart of applications by status">
                {data.applications.total ? <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={pie} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>{pie.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer> : <p className="flex h-full items-center justify-center text-sm text-slate-400">No applications yet</p>}
              </div></Card>
            <Card className="p-5"><h2 className="mb-4 font-bold">Internships</h2>
              <dl className="space-y-3 text-sm">{(["PUBLISHED", "DRAFT", "CLOSED", "REMOVED"] as const).map((k) => (
                <div key={k}><div className="mb-1 flex justify-between"><dt className="font-semibold">{k.charAt(0) + k.slice(1).toLowerCase()}</dt><dd className="tabular-nums text-slate-500">{data.internships[k]}</dd></div>
                  <div className="h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-primary" style={{ width: `${data.internships.total ? (data.internships[k] / data.internships.total) * 100 : 0}%` }} /></div></div>
              ))}</dl></Card>
          </div>
        </>
      )}
    </div>
  );
}
