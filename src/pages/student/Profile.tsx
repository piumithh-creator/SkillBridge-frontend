import { zodResolver } from "@hookform/resolvers/zod";
import { Download, Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Avatar } from "../../components/common/Avatar";
import { Button } from "../../components/common/Button";
import { Card } from "../../components/common/Card";
import { ErrorState } from "../../components/common/ErrorState";
import { PageHeader } from "../../components/common/PageHeader";
import { Skeleton } from "../../components/common/Skeleton";
import { FileDropzone } from "../../components/forms/FileDropzone";
import { InputField } from "../../components/forms/InputField";
import { TagInput } from "../../components/forms/TagInput";
import { TextAreaField } from "../../components/forms/TextAreaField";
import { fetchStudentProfile, updateStudentProfile, uploadStudentCv, uploadStudentImage } from "../../features/student/studentSlice";
import { getErrorMessage } from "../../services/api";
import { studentService } from "../../services/student.service";
import { formatDate, stripEmpty } from "../../utils/format";

const num = { setValueAs: (v: unknown) => (v === "" || v == null ? undefined : Number(v)) };
const schema = z.object({
  fullName: z.string().trim().min(2, "Name is required"),
  phone: z.string().optional(), headline: z.string().max(150).optional(), bio: z.string().max(2000).optional(), location: z.string().optional(),
  technicalSkills: z.array(z.string()), softSkills: z.array(z.string()),
  education: z.array(z.object({ institution: z.string().min(1, "Required"), degree: z.string().min(1, "Required"), field: z.string().optional(), startYear: z.number().optional(), endYear: z.number().optional() })),
  experience: z.array(z.object({ title: z.string().min(1, "Required"), company: z.string().min(1, "Required"), startDate: z.string().optional(), endDate: z.string().optional(), description: z.string().optional() }))
});
type Form = z.infer<typeof schema>;

export default function StudentProfile() {
  const dispatch = useAppDispatch();
  const { profile, loading, saving, error } = useAppSelector((s) => s.student);
  const { register, control, handleSubmit, reset, formState: { errors, isDirty } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: "", technicalSkills: [], softSkills: [], education: [], experience: [] }
  });
  const edu = useFieldArray({ control, name: "education" });
  const exp = useFieldArray({ control, name: "experience" });

  useEffect(() => { void dispatch(fetchStudentProfile()); }, [dispatch]);
  useEffect(() => {
    if (profile) reset({
      fullName: profile.fullName, phone: profile.phone ?? "", headline: profile.headline ?? "", bio: profile.bio ?? "", location: profile.location ?? "",
      technicalSkills: profile.technicalSkills, softSkills: profile.softSkills,
      education: profile.education.map((e) => ({ institution: e.institution, degree: e.degree, field: e.field ?? "", startYear: e.startYear, endYear: e.endYear })),
      experience: profile.experience.map((e) => ({ title: e.title, company: e.company, startDate: e.startDate?.slice(0, 10) ?? "", endDate: e.endDate?.slice(0, 10) ?? "", description: e.description ?? "" }))
    });
  }, [profile, reset]);

  const onSubmit = async (v: Form) => {
    const res = await dispatch(updateStudentProfile(stripEmpty(v) as never));
    if (updateStudentProfile.fulfilled.match(res)) toast.success("Profile saved"); else toast.error(res.payload ?? "Could not save");
  };
  const upload = async (kind: "cv" | "image", file: File) => {
    const res = kind === "cv" ? await dispatch(uploadStudentCv(file)) : await dispatch(uploadStudentImage(file));
    if (res.meta.requestStatus === "fulfilled") toast.success(kind === "cv" ? "CV uploaded" : "Photo updated"); else toast.error((res.payload as string | undefined) ?? "Upload failed");
  };

  if (error && !profile) return <ErrorState message={error} onRetry={() => dispatch(fetchStudentProfile())} />;
  if (!profile) return <div className="space-y-4"><Skeleton className="h-10 w-1/3" /><Skeleton className="h-64" /></div>;
  void loading;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <PageHeader title="My profile" subtitle="Complete profiles get noticed more by companies." actions={<Button type="submit" isLoading={saving} disabled={!isDirty}>Save changes</Button>} />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6">
          <Card className="space-y-4 p-5">
            <div className="flex items-center gap-4"><Avatar name={profile.fullName} src={profile.profileImage} size={72} /><div><p className="font-bold">{profile.fullName}</p><p className="text-sm text-slate-500">{profile.email}</p></div></div>
            <FileDropzone label="Upload profile photo" accept={{ "image/png": [".png"], "image/jpeg": [".jpg", ".jpeg"] }} maxSizeMB={2} onFile={(f) => void upload("image", f)} busy={saving} />
          </Card>
          <Card className="space-y-4 p-5">
            <h2 className="font-bold">CV (PDF)</h2>
            {profile.cvOriginalName && (
              <div className="flex items-center justify-between rounded-xl bg-emerald-50 p-3 text-sm"><div className="min-w-0"><p className="truncate font-semibold text-emerald-800">{profile.cvOriginalName}</p><p className="text-xs text-emerald-700">Uploaded {formatDate(profile.cvUploadedAt)}</p></div>
                <Button type="button" size="sm" variant="outline" onClick={() => studentService.downloadCv().catch((e) => toast.error(getErrorMessage(e)))}><Download className="h-4 w-4" /></Button></div>
            )}
            <FileDropzone label={profile.cvOriginalName ? "Replace CV" : "Upload your CV"} accept={{ "application/pdf": [".pdf"] }} maxSizeMB={5} onFile={(f) => void upload("cv", f)} busy={saving} />
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Card className="grid gap-4 p-5 sm:grid-cols-2">
            <InputField label="Full name" {...register("fullName")} error={errors.fullName?.message} />
            <InputField label="Phone" {...register("phone")} />
            <InputField label="Headline" placeholder="e.g. Final-year IT undergraduate" {...register("headline")} className="sm:col-span-2" />
            <InputField label="Location" {...register("location")} />
            <div className="sm:col-span-2"><TextAreaField label="About me" {...register("bio")} /></div>
          </Card>
          <Card className="space-y-4 p-5">
            <Controller control={control} name="technicalSkills" render={({ field }) => <TagInput label="Technical skills" value={field.value} onChange={field.onChange} placeholder="React, Python, SQL…" />} />
            <Controller control={control} name="softSkills" render={({ field }) => <TagInput label="Soft skills" value={field.value} onChange={field.onChange} placeholder="Teamwork, Communication…" />} />
          </Card>
          <Card className="space-y-4 p-5">
            <div className="flex items-center justify-between"><h2 className="font-bold">Education</h2><Button type="button" size="sm" variant="outline" onClick={() => edu.append({ institution: "", degree: "", field: "" })}><Plus className="h-4 w-4" />Add</Button></div>
            {!edu.fields.length && <p className="text-sm text-slate-500">No education added.</p>}
            {edu.fields.map((f, i) => (
              <div key={f.id} className="grid gap-3 rounded-xl border border-slate-200 p-4 sm:grid-cols-2">
                <InputField label="Institution" {...register(`education.${i}.institution`)} error={errors.education?.[i]?.institution?.message} />
                <InputField label="Degree" {...register(`education.${i}.degree`)} error={errors.education?.[i]?.degree?.message} />
                <InputField label="Field of study" {...register(`education.${i}.field`)} />
                <div className="grid grid-cols-2 gap-3"><InputField label="Start year" type="number" {...register(`education.${i}.startYear`, num)} /><InputField label="End year" type="number" {...register(`education.${i}.endYear`, num)} /></div>
                <Button type="button" variant="ghost" size="sm" className="justify-self-start text-rose-600" onClick={() => edu.remove(i)}><Trash2 className="h-4 w-4" />Remove</Button>
              </div>
            ))}
          </Card>
          <Card className="space-y-4 p-5">
            <div className="flex items-center justify-between"><h2 className="font-bold">Experience</h2><Button type="button" size="sm" variant="outline" onClick={() => exp.append({ title: "", company: "" })}><Plus className="h-4 w-4" />Add</Button></div>
            {!exp.fields.length && <p className="text-sm text-slate-500">No experience added.</p>}
            {exp.fields.map((f, i) => (
              <div key={f.id} className="grid gap-3 rounded-xl border border-slate-200 p-4 sm:grid-cols-2">
                <InputField label="Title" {...register(`experience.${i}.title`)} error={errors.experience?.[i]?.title?.message} />
                <InputField label="Company" {...register(`experience.${i}.company`)} error={errors.experience?.[i]?.company?.message} />
                <InputField label="Start date" type="date" {...register(`experience.${i}.startDate`)} />
                <InputField label="End date" type="date" {...register(`experience.${i}.endDate`)} />
                <div className="sm:col-span-2"><TextAreaField label="Description" rows={3} {...register(`experience.${i}.description`)} /></div>
                <Button type="button" variant="ghost" size="sm" className="justify-self-start text-rose-600" onClick={() => exp.remove(i)}><Trash2 className="h-4 w-4" />Remove</Button>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </form>
  );
}
