import { Download, Eye, Users } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ApplicationStatusSelect } from "../../components/application/ApplicationStatusSelect";
import { Avatar } from "../../components/common/Avatar";
import { Button } from "../../components/common/Button";
import { Card } from "../../components/common/Card";
import { EmptyState } from "../../components/common/EmptyState";
import { ErrorState } from "../../components/common/ErrorState";
import { Modal } from "../../components/common/Modal";
import { PageHeader } from "../../components/common/PageHeader";
import { Pagination } from "../../components/common/Pagination";
import { Skeleton, TableSkeleton } from "../../components/common/Skeleton";
import { StatusBadge } from "../../components/common/StatusBadge";
import { SelectField } from "../../components/forms/SelectField";
import { changeApplicationStatus, fetchReceivedApplications } from "../../features/application/applicationSlice";
import { applicationService } from "../../services/application.service";
import { companyService } from "../../services/company.service";
import { getErrorMessage } from "../../services/api";
import { reportService } from "../../services/report.service";
import { APPLICATION_STATUSES, type Application, type ApplicationStatus, type StudentProfile } from "../../types";
import { formatDate } from "../../utils/format";

export default function Applicants() {
  const dispatch = useAppDispatch();
  const [params] = useSearchParams();
  const internshipId = params.get("internshipId") ?? undefined;
  const { received, receivedMeta, loading, error } = useAppSelector((s) => s.application);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<ApplicationStatus | "">("");
  const [view, setView] = useState<Application | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const load = () => dispatch(fetchReceivedApplications({ page, limit: 10, status: status || undefined, internshipId }));
  useEffect(() => { void load(); }, [page, status, internshipId]); // eslint-disable-line react-hooks/exhaustive-deps

  const open = async (a: Application) => {
    setView(a); setProfile(null); setProfileLoading(true);
    try { setProfile(await companyService.applicant(typeof a.student === "string" ? a.student : a.student._id)); }
    catch (e) { toast.error(getErrorMessage(e)); } finally { setProfileLoading(false); }
  };
  const setAppStatus = async (a: Application, s: ApplicationStatus) => {
    const res = await dispatch(changeApplicationStatus({ id: a._id, status: s }));
    if (changeApplicationStatus.fulfilled.match(res)) toast.success(`Marked ${s.toLowerCase()}`); else toast.error(res.payload ?? "Failed");
  };

  return (
    <div>
      <PageHeader title="Applicants" subtitle={internshipId ? "Showing applicants for one internship." : "Everyone who applied to your internships."}
        actions={<Button size="sm" variant="outline" onClick={() => reportService.companyApplicants().catch((e) => toast.error(getErrorMessage(e)))}><Download className="h-4 w-4" />PDF report</Button>} />
      <div className="mb-4 max-w-xs"><SelectField aria-label="Filter by status" value={status} onChange={(e) => { setStatus(e.target.value as ApplicationStatus | ""); setPage(1); }} options={APPLICATION_STATUSES} placeholder="All statuses" /></div>
      {error ? <ErrorState message={error} onRetry={() => void load()} /> : loading && !received.length ? <Card><TableSkeleton /></Card>
        : !received.length ? <EmptyState icon={Users} title="No applicants yet" message="Applications will appear here as students apply." />
        : (
          <Card className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="p-4">Applicant</th><th className="p-4">Internship</th><th className="p-4">Applied</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {received.map((a) => {
                  const s = typeof a.student === "object" ? a.student : null;
                  return (
                    <tr key={a._id} className="hover:bg-slate-50/60">
                      <td className="p-4"><div className="flex items-center gap-3"><Avatar name={s?.name ?? "?"} src={a.studentProfile?.profileImage} size={36} /><div><p className="font-semibold">{s?.name}</p><p className="text-xs text-slate-500">{s?.email}</p></div></div></td>
                      <td className="p-4 text-slate-600">{a.internship?.title}</td>
                      <td className="p-4 text-slate-600">{formatDate(a.createdAt)}</td>
                      <td className="p-4"><div className="flex flex-col items-start gap-1.5"><StatusBadge status={a.status} />
                        <ApplicationStatusSelect value={a.status} onChange={(st) => void setAppStatus(a, st)} /></div></td>
                      <td className="p-4"><div className="flex justify-end gap-1">
                        <Button size="sm" variant="ghost" aria-label="View profile" onClick={() => void open(a)}><Eye className="h-4 w-4" /></Button>
                        {a.studentProfile?.hasCv && <Button size="sm" variant="ghost" aria-label="Download CV" onClick={() => applicationService.downloadCv(a._id).catch((e) => toast.error(getErrorMessage(e)))}><Download className="h-4 w-4" /></Button>}
                      </div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        )}
      <Pagination meta={receivedMeta} onPage={setPage} />

      <Modal open={!!view} onClose={() => setView(null)} title="Applicant profile" wide>
        {profileLoading || !profile ? <Skeleton className="h-48" /> : (
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3"><Avatar name={profile.fullName} src={profile.profileImage} size={56} /><div><p className="text-lg font-bold">{profile.fullName}</p><p className="text-slate-500">{profile.headline}</p><p className="text-xs text-slate-400">{profile.email} {profile.phone && `· ${profile.phone}`} {profile.location && `· ${profile.location}`}</p></div></div>
            {profile.bio && <p className="text-slate-600">{profile.bio}</p>}
            <div><p className="mb-1 font-semibold">Technical skills</p><div className="flex flex-wrap gap-1.5">{profile.technicalSkills.map((t) => <span key={t} className="rounded-md bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary">{t}</span>)}</div></div>
            <div><p className="mb-1 font-semibold">Soft skills</p><div className="flex flex-wrap gap-1.5">{profile.softSkills.map((t) => <span key={t} className="rounded-md bg-accent-50 px-2 py-0.5 text-xs font-semibold text-cyan-700">{t}</span>)}</div></div>
            <div><p className="mb-1 font-semibold">Education</p><ul className="space-y-1 text-slate-600">{profile.education.map((e) => <li key={e._id}>{e.degree}{e.field && `, ${e.field}`} – {e.institution} {e.startYear && `(${e.startYear}–${e.endYear ?? "present"})`}</li>)}</ul></div>
            <div><p className="mb-1 font-semibold">Experience</p><ul className="space-y-1 text-slate-600">{profile.experience.map((e) => <li key={e._id}>{e.title} – {e.company}</li>)}</ul></div>
            {view?.coverLetter && <div><p className="mb-1 font-semibold">Cover letter</p><p className="whitespace-pre-line rounded-xl bg-slate-50 p-3 text-slate-600">{view.coverLetter}</p></div>}
            {view && profile.hasCv && <Button variant="outline" onClick={() => applicationService.downloadCv(view._id).catch((e) => toast.error(getErrorMessage(e)))}><Download className="h-4 w-4" />Download CV</Button>}
          </div>
        )}
      </Modal>
    </div>
  );
}
