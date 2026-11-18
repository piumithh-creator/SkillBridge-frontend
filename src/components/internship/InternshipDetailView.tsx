import { ArrowLeft, Bookmark, BookmarkCheck, Building2, Calendar, Clock, FileText, MapPin, Sparkles, Users, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { submitApplication, withdrawApplication } from "../../features/application/applicationSlice";
import { clearCurrent, fetchInternship, markApplied, markWithdrawn } from "../../features/internship/internshipSlice";
import { fetchSavedIds, toggleSaved } from "../../features/student/studentSlice";
import { useAuth } from "../../hooks/useAuth";
import { aiService } from "../../services/ai.service";
import { getErrorMessage } from "../../services/api";
import type { MatchResult } from "../../types";
import { daysLeft, formatDate, formatStipend } from "../../utils/format";
import { Avatar } from "../common/Avatar";
import { Button } from "../common/Button";
import { Card } from "../common/Card";
import { ConfirmDialog } from "../common/ConfirmDialog";
import { ErrorState } from "../common/ErrorState";
import { Modal } from "../common/Modal";
import { Skeleton } from "../common/Skeleton";
import { StatusBadge } from "../common/StatusBadge";
import { TextAreaField } from "../forms/TextAreaField";

const Section = ({ title, children }: { title: string; children?: string }) =>
  children ? <section className="mt-6"><h2 className="mb-2 text-lg font-bold">{title}</h2><p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">{children}</p></section> : null;

export const InternshipDetailView = ({ backTo }: { backTo: string }) => {
  const { id = "" } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { current: i, loading, error } = useAppSelector((s) => s.internship);
  const { submitting } = useAppSelector((s) => s.application);
  const savedIds = useAppSelector((s) => s.student.savedIds);
  const [applyOpen, setApplyOpen] = useState(false);
  const [cover, setCover] = useState("");
  const [confirmWithdraw, setConfirmWithdraw] = useState(false);
  const [match, setMatch] = useState<MatchResult | null>(null);
  const [matching, setMatching] = useState(false);
  const isStudent = user?.role === "STUDENT";

  useEffect(() => { void dispatch(fetchInternship(id)); return () => { dispatch(clearCurrent()); }; }, [dispatch, id]);
  useEffect(() => { if (isStudent) void dispatch(fetchSavedIds()); }, [dispatch, isStudent]);

  if (error) return <ErrorState message={error} onRetry={() => dispatch(fetchInternship(id))} />;
  if (loading || !i) return <div className="space-y-4"><Skeleton className="h-8 w-1/2" /><Skeleton className="h-40" /><Skeleton className="h-64" /></div>;

  const company = typeof i.company === "string" ? null : i.company;
  const left = daysLeft(i.deadline);
  const saved = savedIds.includes(i._id);
  const closed = i.status !== "PUBLISHED" || left < 0;

  const apply = async () => {
    const res = await dispatch(submitApplication({ internshipId: i._id, coverLetter: cover || undefined }));
    if (submitApplication.fulfilled.match(res)) { dispatch(markApplied({ applicationId: res.payload._id })); setApplyOpen(false); toast.success("Application submitted!"); }
    else toast.error(res.payload ?? "Could not submit application");
  };
  const withdraw = async () => {
    if (!i.applicationId) return;
    const res = await dispatch(withdrawApplication(i.applicationId));
    if (withdrawApplication.fulfilled.match(res)) { dispatch(markWithdrawn()); toast.success("Application withdrawn"); }
    else toast.error(res.payload ?? "Could not withdraw");
    setConfirmWithdraw(false);
  };
  const runMatch = async () => {
    setMatching(true);
    try { setMatch(await aiService.match(i._id)); }
    catch (e) { toast.error(getErrorMessage(e)); }
    finally { setMatching(false); }
  };
  const save = async () => { await dispatch(toggleSaved({ id: i._id, saved })); };

  return (
    <div>
      <Link to={backTo} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-primary"><ArrowLeft className="h-4 w-4" />Back to internships</Link>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-start gap-4">
            <Avatar name={company?.companyName ?? "Company"} src={company?.logo} size={56} />
            <div className="flex-1">
              <h1 className="text-2xl font-extrabold">{i.title}</h1>
              <p className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-500"><Building2 className="h-4 w-4" />{company?.companyName}</p>
            </div>
            <StatusBadge status={i.status} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-lg bg-primary-50 px-2.5 py-1 text-primary">{i.category}</span>
            <span className="rounded-lg bg-accent-50 px-2.5 py-1 text-cyan-700">{i.workMode.charAt(0) + i.workMode.slice(1).toLowerCase()}</span>
          </div>
          <Section title="About the internship">{i.description}</Section>
          <Section title="Qualifications">{i.qualifications}</Section>
          <Section title="Requirements">{i.requirements}</Section>
          <section className="mt-6">
            <h2 className="mb-2 text-lg font-bold">Required skills</h2>
            <div className="flex flex-wrap gap-2">{i.requiredSkills.map((s) => <span key={s} className="rounded-lg bg-slate-100 px-3 py-1 text-sm font-medium">{s}</span>)}</div>
          </section>
          {company?.description && <Section title={`About ${company.companyName}`}>{company.description}</Section>}
        </Card>

        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <Card className="space-y-3 p-5 text-sm">
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-400" />{i.location}</div>
            <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-slate-400" />{i.duration}</div>
            <div className="flex items-center gap-2"><Wallet className="h-4 w-4 text-slate-400" />{formatStipend(i.stipend)}</div>
            <div className="flex items-center gap-2"><Users className="h-4 w-4 text-slate-400" />{i.vacancies} vacanc{i.vacancies === 1 ? "y" : "ies"}</div>
            <div className={`flex items-center gap-2 ${left <= 3 && left >= 0 ? "font-semibold text-rose-600" : ""}`}><Calendar className="h-4 w-4 text-slate-400" />Deadline {formatDate(i.deadline)} {left >= 0 && `(${left}d left)`}</div>

            {isStudent ? (
              <div className="space-y-2 border-t border-slate-100 pt-4">
                {i.hasApplied ? (
                  <>
                    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2"><span className="font-semibold">Your application</span>{i.applicationStatus && <StatusBadge status={i.applicationStatus} />}</div>
                    {i.applicationStatus !== "ACCEPTED" && <Button variant="outline" className="w-full" onClick={() => setConfirmWithdraw(true)}>Withdraw application</Button>}
                  </>
                ) : (
                  <Button className="w-full" disabled={closed} onClick={() => setApplyOpen(true)}>{closed ? "Applications closed" : "Apply now"}</Button>
                )}
                <Button variant="outline" className="w-full" onClick={() => void save()}>{saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}{saved ? "Saved" : "Save for later"}</Button>
                <Button variant="outline" className="w-full" isLoading={matching} onClick={() => void runMatch()}><Sparkles className="h-4 w-4 text-primary" />AI match with my CV</Button>
              </div>
            ) : !user ? (
              <Button className="w-full" onClick={() => navigate("/login", { state: { from: location.pathname } })}>Log in to apply</Button>
            ) : null}
          </Card>

          {match && (
            <Card className="space-y-3 p-5 text-sm">
              <div className="flex items-center justify-between"><h3 className="flex items-center gap-1.5 font-bold"><Sparkles className="h-4 w-4 text-primary" />AI match</h3><span className="font-display text-2xl font-extrabold text-primary">{Math.round(match.matchPercentage)}%</span></div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${match.matchPercentage}%` }} /></div>
              <p className="text-slate-600">{match.summary}</p>
              <div><p className="mb-1 font-semibold text-emerald-700">Matching skills</p><div className="flex flex-wrap gap-1">{match.matchingSkills.map((s) => <span key={s} className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">{s}</span>)}</div></div>
              <div><p className="mb-1 font-semibold text-rose-700">Missing skills</p><div className="flex flex-wrap gap-1">{match.missingSkills.map((s) => <span key={s} className="rounded-md bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700">{s}</span>)}</div></div>
              <ul className="list-disc space-y-1 pl-4 text-slate-600">{match.suggestions.map((s) => <li key={s}>{s}</li>)}</ul>
            </Card>
          )}
        </div>
      </div>

      <Modal open={applyOpen} onClose={() => setApplyOpen(false)} title={`Apply to ${i.title}`}>
        <p className="mb-3 flex items-center gap-2 text-sm text-slate-500"><FileText className="h-4 w-4" />Your profile and uploaded CV will be shared with the company.</p>
        <TextAreaField label="Cover letter (optional)" name="cover" value={cover} onChange={(e) => setCover(e.target.value)} maxLength={3000} placeholder="Tell the company why you are a great fit…" />
        <div className="mt-5 flex justify-end gap-2"><Button variant="ghost" onClick={() => setApplyOpen(false)}>Cancel</Button><Button isLoading={submitting} onClick={() => void apply()}>Submit application</Button></div>
      </Modal>
      <ConfirmDialog open={confirmWithdraw} title="Withdraw application?" message="The company will be notified and your application will be removed." confirmLabel="Withdraw" onConfirm={() => void withdraw()} onCancel={() => setConfirmWithdraw(false)} />
    </div>
  );
};
