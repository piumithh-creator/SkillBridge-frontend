import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Button } from "../../components/common/Button";
import { Card } from "../../components/common/Card";
import { PageHeader } from "../../components/common/PageHeader";
import { Skeleton } from "../../components/common/Skeleton";
import { InputField } from "../../components/forms/InputField";
import { SelectField } from "../../components/forms/SelectField";
import { TagInput } from "../../components/forms/TagInput";
import { TextAreaField } from "../../components/forms/TextAreaField";
import { createInternship, updateInternship } from "../../features/internship/internshipSlice";
import { internshipService } from "../../services/internship.service";
import { getErrorMessage } from "../../services/api";
import { CATEGORIES, WORK_MODES } from "../../types";

const schema = z.object({
  title: z.string().trim().min(3, "At least 3 characters").max(150),
  description: z.string().trim().min(20, "Describe the role in at least 20 characters"),
  category: z.enum(CATEGORIES),
  requiredSkills: z.array(z.string()).min(1, "Add at least one skill"),
  qualifications: z.string().optional(), requirements: z.string().optional(),
  location: z.string().trim().min(2, "Required"),
  workMode: z.enum(WORK_MODES),
  duration: z.string().trim().min(1, "Required"),
  stipend: z.number({ message: "Enter a number" }).min(0),
  vacancies: z.number({ message: "Enter a number" }).int().min(1),
  deadline: z.string().min(1, "Required"),
  status: z.enum(["DRAFT", "PUBLISHED", "CLOSED"])
});
type Form = z.infer<typeof schema>;

export default function InternshipForm() {
  const { id } = useParams();
  const editing = !!id;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const saving = useAppSelector((s) => s.internship.saving);
  const [loading, setLoading] = useState(editing);
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { category: "Software Engineering", workMode: "ONSITE", requiredSkills: [], status: "PUBLISHED", stipend: 0, vacancies: 1 }
  });

  useEffect(() => {
    if (!id) return;
    internshipService.get(id).then((i) => reset({
      title: i.title, description: i.description, category: i.category as Form["category"], requiredSkills: i.requiredSkills, qualifications: i.qualifications, requirements: i.requirements,
      location: i.location, workMode: i.workMode, duration: i.duration, stipend: i.stipend, vacancies: i.vacancies, deadline: i.deadline.slice(0, 10),
      status: (i.status === "REMOVED" ? "CLOSED" : i.status) as Form["status"]
    })).catch((e) => { toast.error(getErrorMessage(e)); navigate("/company/internships"); }).finally(() => setLoading(false));
  }, [id, reset, navigate]);

  const onSubmit = async (v: Form) => {
    // deadline is end of the selected day
    const body = { ...v, deadline: new Date(`${v.deadline}T23:59:59`).toISOString() };
    const res = editing ? await dispatch(updateInternship({ id: id!, body })) : await dispatch(createInternship(body));
    if (res.type.endsWith("fulfilled")) { toast.success(editing ? "Internship updated" : "Internship created"); navigate("/company/internships"); }
    else toast.error((res.payload as string) ?? "Could not save");
  };

  if (loading) return <div className="space-y-4"><Skeleton className="h-10 w-1/3" /><Skeleton className="h-96" /></div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <PageHeader title={editing ? "Edit internship" : "Post a new internship"} subtitle="Be specific – clear listings attract better candidates." />
      <Card className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
        <div className="sm:col-span-2"><InputField label="Title" {...register("title")} error={errors.title?.message} /></div>
        <SelectField label="Category" options={CATEGORIES} {...register("category")} error={errors.category?.message} />
        <SelectField label="Work mode" options={WORK_MODES.map((m) => ({ value: m, label: m.charAt(0) + m.slice(1).toLowerCase() }))} {...register("workMode")} />
        <div className="sm:col-span-2"><TextAreaField label="Description" rows={6} {...register("description")} error={errors.description?.message} /></div>
        <div className="sm:col-span-2"><Controller control={control} name="requiredSkills" render={({ field }) => <TagInput label="Required skills" value={field.value} onChange={field.onChange} placeholder="React, Node.js…" />} />{errors.requiredSkills && <p className="mt-1 text-xs font-medium text-rose-600">{errors.requiredSkills.message}</p>}</div>
        <TextAreaField label="Qualifications" rows={3} {...register("qualifications")} />
        <TextAreaField label="Requirements" rows={3} {...register("requirements")} />
        <InputField label="Location" {...register("location")} error={errors.location?.message} />
        <InputField label="Duration" placeholder="e.g. 6 months" {...register("duration")} error={errors.duration?.message} />
        <InputField label="Monthly stipend (LKR)" type="number" min={0} {...register("stipend", { valueAsNumber: true })} error={errors.stipend?.message} />
        <InputField label="Vacancies" type="number" min={1} {...register("vacancies", { valueAsNumber: true })} error={errors.vacancies?.message} />
        <InputField label="Application deadline" type="date" {...register("deadline")} error={errors.deadline?.message} />
        <SelectField label="Status" options={[{ value: "PUBLISHED", label: "Published" }, { value: "DRAFT", label: "Draft (hidden)" }, { value: "CLOSED", label: "Closed" }]} {...register("status")} />
      </Card>
      <div className="mt-6 flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => navigate("/company/internships")}>Cancel</Button><Button type="submit" isLoading={saving}>{editing ? "Save changes" : "Create internship"}</Button></div>
    </form>
  );
}
