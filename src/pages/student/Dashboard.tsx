import { Bookmark, CheckCircle2, Clock, Download, FileText, Sparkles, XCircle } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Button } from "../../components/common/Button";
import { Card } from "../../components/common/Card";
import { ErrorState } from "../../components/common/ErrorState";
import { PageHeader } from "../../components/common/PageHeader";
import { StatSkeletons } from "../../components/common/Skeleton";
import { StatusBadge } from "../../components/common/StatusBadge";
import { StatCard } from "../../components/dashboard/StatCard";
import { fetchMyApplications } from "../../features/application/applicationSlice";
import { fetchStudentDashboard } from "../../features/student/studentSlice";
import { useAuth } from "../../hooks/useAuth";
import { getErrorMessage } from "../../services/api";
import { reportService } from "../../services/report.service";
import { formatDate } from "../../utils/format";

export default function StudentDashboard() {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { dashboard, loading, error } = useAppSelector((s) => s.student);
  const recent = useAppSelector((s) => s.application.mine);

  useEffect(() => { void dispatch(fetchStudentDashboard()); void dispatch(fetchMyApplications({ page: 1, limit: 5 })); }, [dispatch]);

  const report = async () => { try { await reportService.studentApplications(); } catch (e) { toast.error(getErrorMessage(e)); } };

  return (
    <div className="space-y-8">
      <PageHeader title={`Hi ${user?.name.split(" ")[0]} 👋`} subtitle="Here is where your internship search stands."
        actions={<><Link to="/student/internships"><Button size="sm">Find internships</Button></Link><Button size="sm" variant="outline" onClick={() => void report()}><Download className="h-4 w-4" />Application report</Button></>} />
      {error ? <ErrorState message={error} onRetry={() => dispatch(fetchStudentDashboard())} /> : loading && !dashboard ? <StatSkeletons count={5} /> : dashboard && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <StatCard label="Total applications" value={dashboard.totalApplications} icon={FileText} />
          <StatCard label="Pending" value={dashboard.pendingApplications} icon={Clock} tone="amber" />
          <StatCard label="Shortlisted" value={dashboard.shortlistedApplications} icon={CheckCircle2} tone="emerald" />
          <StatCard label="Rejected" value={dashboard.rejectedApplications} icon={XCircle} tone="rose" />
          <StatCard label="Saved" value={dashboard.savedInternships} icon={Bookmark} tone="accent" />
        </div>
      )}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 p-5"><h2 className="font-bold">Recent applications</h2><Link to="/student/applications" className="text-sm font-semibold text-primary hover:underline">View all</Link></div>
          {recent.length ? <ul className="divide-y divide-slate-100">{recent.map((a) => (
            <li key={a._id} className="flex items-center justify-between gap-3 p-4"><div className="min-w-0"><p className="truncate font-semibold">{a.internship?.title}</p><p className="text-xs text-slate-500">Applied {formatDate(a.createdAt)}</p></div><StatusBadge status={a.status} /></li>
          ))}</ul> : <p className="p-8 text-center text-sm text-slate-500">You haven't applied to anything yet.</p>}
        </Card>
        <Card className="bg-gradient-to-br from-primary to-indigo-700 p-6 text-white">
          <Sparkles className="mb-3 h-7 w-7 text-accent" />
          <h2 className="text-lg font-bold">Polish your CV with AI</h2>
          <p className="mt-1 text-sm text-indigo-100">Get a score, missing skills and tailored suggestions in seconds.</p>
          <Link to="/student/cv-analyzer"><Button variant="secondary" className="mt-5 w-full">Analyze my CV</Button></Link>
        </Card>
      </div>
    </div>
  );
}
