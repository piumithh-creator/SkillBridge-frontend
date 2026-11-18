import { Briefcase, Download, Inbox, Plus, Users } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Button } from "../../components/common/Button";
import { Card } from "../../components/common/Card";
import { ErrorState } from "../../components/common/ErrorState";
import { PageHeader } from "../../components/common/PageHeader";
import { StatSkeletons } from "../../components/common/Skeleton";
import { StatCard } from "../../components/dashboard/StatCard";
import { fetchCompanyDashboard } from "../../features/company/companySlice";
import { getErrorMessage } from "../../services/api";
import { reportService } from "../../services/report.service";

export default function CompanyDashboard() {
  const dispatch = useAppDispatch();
  const { dashboard, loading, error } = useAppSelector((s) => s.company);
  useEffect(() => { void dispatch(fetchCompanyDashboard()); }, [dispatch]);
  const data = dashboard ? Object.entries(dashboard.applicationsByStatus).map(([name, value]) => ({ name: name.charAt(0) + name.slice(1).toLowerCase(), value })) : [];

  return (
    <div className="space-y-8">
      <PageHeader title="Company dashboard" subtitle="Your hiring pipeline at a glance."
        actions={<><Link to="/company/internships/new"><Button size="sm"><Plus className="h-4 w-4" />Post internship</Button></Link>
          <Button size="sm" variant="outline" onClick={() => reportService.companyApplicants().catch((e) => toast.error(getErrorMessage(e)))}><Download className="h-4 w-4" />Applicant report</Button></>} />
      {error ? <ErrorState message={error} onRetry={() => dispatch(fetchCompanyDashboard())} /> : loading && !dashboard ? <StatSkeletons count={3} /> : dashboard && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Total internships" value={dashboard.totalInternships} icon={Briefcase} />
            <StatCard label="Published" value={dashboard.publishedInternships} icon={Inbox} tone="emerald" />
            <StatCard label="Applications received" value={dashboard.totalApplications} icon={Users} tone="accent" />
          </div>
          <Card className="p-5">
            <h2 className="mb-4 font-bold">Applications by status</h2>
            <div className="h-64" role="img" aria-label="Bar chart of applications by status">
              <ResponsiveContainer width="100%" height="100%"><BarChart data={data}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" /><XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} /><YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} /><Tooltip /><Bar dataKey="value" fill="#4F46E5" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
