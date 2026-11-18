import type { ReactNode } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "../../components/common/Card";
import { ErrorState } from "../../components/common/ErrorState";
import { PageHeader } from "../../components/common/PageHeader";
import { Skeleton } from "../../components/common/Skeleton";
import { useFetch } from "../../hooks/useFetch";
import { adminService } from "../../services/admin.service";
import { CHART_COLORS } from "./Dashboard";

const ChartCard = ({ title, empty, children }: { title: string; empty: boolean; children: ReactNode }) => (
  <Card className="p-5"><h2 className="mb-3 font-bold">{title}</h2><div className="h-72" role="img" aria-label={title}>{empty ? <p className="flex h-full items-center justify-center text-sm text-slate-400">Not enough data yet</p> : children}</div></Card>
);
const axis = { tickLine: false, axisLine: false, fontSize: 11 } as const;

export default function Analytics() {
  const { data, loading, error, reload } = useFetch(() => adminService.analytics());
  if (error) return <ErrorState message={error} onRetry={() => void reload()} />;
  if (loading || !data) return <div className="grid gap-6 lg:grid-cols-2">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-80 rounded-2xl" />)}</div>;
  const shortDate = (d: string) => d.slice(5);
  const any = (a: { count: number }[]) => a.some((x) => x.count > 0);

  return (
    <div>
      <PageHeader title="Analytics" subtitle="Real platform activity over the last 30 days." />
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Applications per day" empty={!any(data.applicationsOverTime)}>
          <ResponsiveContainer><LineChart data={data.applicationsOverTime}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" /><XAxis dataKey="date" tickFormatter={shortDate} {...axis} /><YAxis allowDecimals={false} {...axis} /><Tooltip /><Line type="monotone" dataKey="count" name="Applications" stroke="#4F46E5" strokeWidth={2.5} dot={false} /></LineChart></ResponsiveContainer>
        </ChartCard>
        <ChartCard title="New registrations per day" empty={!any(data.registrationsOverTime)}>
          <ResponsiveContainer><LineChart data={data.registrationsOverTime}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" /><XAxis dataKey="date" tickFormatter={shortDate} {...axis} /><YAxis allowDecimals={false} {...axis} /><Tooltip /><Line type="monotone" dataKey="count" name="Users" stroke="#06B6D4" strokeWidth={2.5} dot={false} /></LineChart></ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Application status distribution" empty={!data.applicationStatusDistribution.some((d) => d.value)}>
          <ResponsiveContainer><PieChart><Pie data={data.applicationStatusDistribution} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={2}>{data.applicationStatusDistribution.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Users by role" empty={!data.usersByRole.some((d) => d.value)}>
          <ResponsiveContainer><PieChart><Pie data={data.usersByRole} dataKey="value" nameKey="name" outerRadius={95}>{data.usersByRole.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Published internships by category" empty={!data.internshipsByCategory.length}>
          <ResponsiveContainer><BarChart data={data.internshipsByCategory} layout="vertical" margin={{ left: 40 }}><CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" /><XAxis type="number" allowDecimals={false} {...axis} /><YAxis type="category" dataKey="name" width={130} {...axis} /><Tooltip /><Bar dataKey="value" name="Internships" fill="#4F46E5" radius={[0, 6, 6, 0]} /></BarChart></ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Most requested skills" empty={!data.topSkills.length}>
          <ResponsiveContainer><BarChart data={data.topSkills} layout="vertical" margin={{ left: 30 }}><CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" /><XAxis type="number" allowDecimals={false} {...axis} /><YAxis type="category" dataKey="name" width={100} {...axis} /><Tooltip /><Bar dataKey="value" name="Internships" fill="#06B6D4" radius={[0, 6, 6, 0]} /></BarChart></ResponsiveContainer>
        </ChartCard>
        <div className="lg:col-span-2"><ChartCard title="Most applied internships" empty={!data.topInternships.length}>
          <ResponsiveContainer><BarChart data={data.topInternships}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" /><XAxis dataKey="name" {...axis} /><YAxis allowDecimals={false} {...axis} /><Tooltip /><Bar dataKey="value" name="Applications" fill="#8B5CF6" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer>
        </ChartCard></div>
      </div>
    </div>
  );
}
