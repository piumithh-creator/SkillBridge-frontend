import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
import { TextAreaField } from "../../components/forms/TextAreaField";
import { fetchCompanyProfile, updateCompanyProfile, uploadCompanyLogo } from "../../features/company/companySlice";

const schema = z.object({
  companyName: z.string().trim().min(2, "Required"), industry: z.string().optional(),
  website: z.string().url("Enter a full URL, e.g. https://example.com").optional().or(z.literal("")),
  location: z.string().optional(), size: z.string().optional(), description: z.string().max(3000).optional()
});
type Form = z.infer<typeof schema>;

export default function CompanyProfile() {
  const dispatch = useAppDispatch();
  const { profile, saving, error } = useAppSelector((s) => s.company);
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<Form>({ resolver: zodResolver(schema) });
  useEffect(() => { void dispatch(fetchCompanyProfile()); }, [dispatch]);
  useEffect(() => { if (profile) reset({ companyName: profile.companyName, industry: profile.industry ?? "", website: profile.website ?? "", location: profile.location ?? "", size: profile.size ?? "", description: profile.description ?? "" }); }, [profile, reset]);

  const onSubmit = async (v: Form) => {
    const res = await dispatch(updateCompanyProfile(v));
    if (updateCompanyProfile.fulfilled.match(res)) toast.success("Profile saved"); else toast.error(res.payload ?? "Could not save");
  };
  const logo = async (f: File) => { const r = await dispatch(uploadCompanyLogo(f)); if (uploadCompanyLogo.fulfilled.match(r)) toast.success("Logo updated"); else toast.error(r.payload ?? "Upload failed"); };

  if (error && !profile) return <ErrorState message={error} onRetry={() => dispatch(fetchCompanyProfile())} />;
  if (!profile) return <Skeleton className="h-96" />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <PageHeader title="Company profile" subtitle="Students see this on your internship listings." actions={<Button type="submit" isLoading={saving} disabled={!isDirty}>Save changes</Button>} />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="space-y-4 p-5"><div className="flex items-center gap-3"><Avatar name={profile.companyName} src={profile.logo} size={64} /><div><p className="font-bold">{profile.companyName}</p><p className="text-sm text-slate-500">{profile.email}</p></div></div>
          <FileDropzone label="Upload logo" accept={{ "image/png": [".png"], "image/jpeg": [".jpg", ".jpeg"] }} maxSizeMB={2} onFile={(f) => void logo(f)} /></Card>
        <Card className="grid gap-4 p-5 sm:grid-cols-2 lg:col-span-2">
          <InputField label="Company name" {...register("companyName")} error={errors.companyName?.message} />
          <InputField label="Industry" {...register("industry")} />
          <InputField label="Website" {...register("website")} error={errors.website?.message} />
          <InputField label="Location" {...register("location")} />
          <InputField label="Company size" placeholder="e.g. 11-50 employees" {...register("size")} />
          <div className="sm:col-span-2"><TextAreaField label="About the company" rows={5} {...register("description")} /></div>
        </Card>
      </div>
    </form>
  );
}
