import { Download, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Button } from "../../components/common/Button";
import { Card } from "../../components/common/Card";
import { PageHeader } from "../../components/common/PageHeader";
import { Skeleton } from "../../components/common/Skeleton";
import { FileDropzone } from "../../components/forms/FileDropzone";
import { aiService } from "../../services/ai.service";
import { getErrorMessage } from "../../services/api";
import { reportService } from "../../services/report.service";
import type { CVAnalysis } from "../../types";
import { formatDate } from "../../utils/format";
import { useAppSelector } from "../../app/hooks";

const Chips = ({ items, tone }: { items: string[]; tone: string }) =>
  items.length ? <div className="flex flex-wrap gap-1.5">{items.map((s) => <span key={s} className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${tone}`}>{s}</span>)}</div> : <p className="text-sm text-slate-400">None found</p>;
const List = ({ items }: { items: string[] }) => items.length ? <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">{items.map((s) => <li key={s}>{s}</li>)}</ul> : <p className="text-sm text-slate-400">None</p>;

const ScoreRing = ({ score }: { score: number }) => {
  const r = 52, c = 2 * Math.PI * r;
  return (
    <div className="relative h-36 w-36" role="img" aria-label={`CV score ${score} out of 100`}>
      <svg viewBox="0 0 120 120" className="-rotate-90"><circle cx="60" cy="60" r={r} fill="none" stroke="#E2E8F0" strokeWidth="10" /><circle cx="60" cy="60" r={r} fill="none" stroke="#4F46E5" strokeWidth="10" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)} /></svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="font-display text-4xl font-extrabold">{Math.round(score)}</span><span className="text-xs text-slate-500">/ 100</span></div>
    </div>
  );
};

export default function CvAnalyzer() {
  const hasCv = useAppSelector((s) => s.student.profile?.hasCv);
  const [analysis, setAnalysis] = useState<CVAnalysis | null>(null);
  const [history, setHistory] = useState<CVAnalysis[]>([]);
  const [initial, setInitial] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    Promise.all([aiService.latest(), aiService.history()]).then(([l, h]) => { setAnalysis(l); setHistory(h); }).catch(() => undefined).finally(() => setInitial(false));
  }, []);

  const run = async (file?: File) => {
    setBusy(true);
    try { const a = await aiService.analyzeCv(file); setAnalysis(a); setHistory((h) => [a, ...h]); toast.success("CV analysed!"); }
    catch (e) { toast.error(getErrorMessage(e)); } finally { setBusy(false); }
  };

  return (
    <div>
      <PageHeader title="AI CV analyzer" subtitle="Powered by Google Gemini. Your CV is analysed on our server – never in your browser."
        actions={analysis && <Button size="sm" variant="outline" onClick={() => reportService.studentCvAnalysis().catch((e) => toast.error(getErrorMessage(e)))}><Download className="h-4 w-4" />PDF report</Button>} />
      <Card className="mb-6 grid gap-5 p-5 md:grid-cols-2">
        <FileDropzone label="Drop a CV PDF to analyse" accept={{ "application/pdf": [".pdf"] }} maxSizeMB={5} onFile={(f) => void run(f)} busy={busy} hint="PDF with selectable text, max 5MB" />
        <div className="flex flex-col justify-center gap-3 text-sm text-slate-600">
          <p>Or analyse the CV already on your profile.</p>
          <Button isLoading={busy} disabled={!hasCv && hasCv !== undefined} onClick={() => void run()}><Sparkles className="h-4 w-4" />Analyse my profile CV</Button>
          {hasCv === false && <p className="text-xs">No CV on your profile yet – <Link to="/student/profile" className="font-semibold text-primary">upload one</Link>.</p>}
        </div>
      </Card>

      {busy ? <div className="space-y-3"><Skeleton className="h-40" /><Skeleton className="h-64" /><p className="text-center text-sm text-slate-500">Analysing… this can take up to a minute.</p></div>
        : initial ? <Skeleton className="h-64" /> : analysis ? (
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="flex flex-col items-center gap-3 p-6 text-center">
              <ScoreRing score={analysis.score} />
              <p className="text-sm text-slate-600">{analysis.summary}</p>
              <p className="text-xs text-slate-400">{analysis.fileName} · {formatDate(analysis.createdAt)}</p>
            </Card>
            <Card className="space-y-5 p-6 lg:col-span-2">
              <div><h3 className="mb-2 font-bold">Technical skills</h3><Chips items={analysis.technicalSkills} tone="bg-primary-50 text-primary" /></div>
              <div><h3 className="mb-2 font-bold">Soft skills</h3><Chips items={analysis.softSkills} tone="bg-accent-50 text-cyan-700" /></div>
              <div><h3 className="mb-2 font-bold">Missing skills</h3><Chips items={analysis.missingSkills} tone="bg-rose-50 text-rose-700" /></div>
              <div><h3 className="mb-2 font-bold">Recommended categories</h3><Chips items={analysis.recommendedCategories} tone="bg-emerald-50 text-emerald-700" /></div>
            </Card>
            <Card className="p-6"><h3 className="mb-2 font-bold">Education</h3><List items={analysis.education} /></Card>
            <Card className="p-6"><h3 className="mb-2 font-bold">Experience</h3><List items={analysis.experience} /></Card>
            <Card className="p-6"><h3 className="mb-2 font-bold">Improvement suggestions</h3><List items={analysis.suggestions} /></Card>
            <Card className="p-6 lg:col-span-3"><h3 className="mb-2 font-bold">Formatting recommendations</h3><List items={analysis.formattingRecommendations} /></Card>
          </div>
        ) : <p className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">No analysis yet. Upload a CV to get started.</p>}

      {history.length > 1 && (
        <Card className="mt-6 p-5"><h3 className="mb-3 font-bold">Previous analyses</h3>
          <ul className="divide-y divide-slate-100 text-sm">{history.slice(1).map((h) => <li key={h._id} className="flex justify-between py-2"><span className="truncate">{h.fileName}</span><span className="text-slate-500">{formatDate(h.createdAt)} · score {Math.round(h.score)}</span></li>)}</ul></Card>
      )}
    </div>
  );
}
