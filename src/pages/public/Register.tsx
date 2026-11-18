import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, GraduationCap } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Button } from "../../components/common/Button";
import { InputField } from "../../components/forms/InputField";
import { dashboardPath } from "../../components/layout/Navbar";
import { clearAuthError, registerUser } from "../../features/auth/authSlice";
import { AuthShell } from "./AuthShell";

const schema = z.object({
  role: z.enum(["STUDENT", "COMPANY"]),
  name: z.string().trim().min(2, "Enter your name"),
  companyName: z.string().trim().optional(),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "At least 8 characters").regex(/[A-Za-z]/, "Include a letter").regex(/[0-9]/, "Include a number"),
  confirm: z.string()
}).refine((d) => d.password === d.confirm, { path: ["confirm"], message: "Passwords do not match" })
  .refine((d) => d.role !== "COMPANY" || (d.companyName && d.companyName.length >= 2), { path: ["companyName"], message: "Company name is required" });
type Form = z.infer<typeof schema>;

export default function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((s) => s.auth);
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema), defaultValues: { role: "STUDENT" } });
  const role = watch("role");

  const onSubmit = async (v: Form) => {
    dispatch(clearAuthError());
    const res = await dispatch(registerUser({ name: v.name, email: v.email, password: v.password, role: v.role, companyName: v.role === "COMPANY" ? v.companyName : undefined }));
    if (registerUser.fulfilled.match(res)) { toast.success("Account created!"); navigate(dashboardPath(res.payload.role), { replace: true }); }
  };

  const tab = (r: "STUDENT" | "COMPANY", label: string, Icon: typeof Building2) => (
    <button type="button" role="radio" aria-checked={role === r} onClick={() => setValue("role", r)}
      className={`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 px-3 py-3 text-sm font-bold transition ${role === r ? "border-primary bg-primary-50 text-primary" : "border-slate-200 text-slate-600 hover:border-slate-300"}`}>
      <Icon className="h-4 w-4" />{label}
    </button>
  );

  return (
    <AuthShell title="Create your account" subtitle="Join as a student or as a hiring company.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {error && <div role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</div>}
        <div role="radiogroup" aria-label="Account type" className="flex gap-3">{tab("STUDENT", "I'm a student", GraduationCap)}{tab("COMPANY", "I'm a company", Building2)}</div>
        <InputField label={role === "COMPANY" ? "Contact person" : "Full name"} autoComplete="name" {...register("name")} error={errors.name?.message} />
        {role === "COMPANY" && <InputField label="Company name" {...register("companyName")} error={errors.companyName?.message} />}
        <InputField label="Email" type="email" autoComplete="email" {...register("email")} error={errors.email?.message} />
        <InputField label="Password" type="password" autoComplete="new-password" hint="8+ characters with a letter and a number" {...register("password")} error={errors.password?.message} />
        <InputField label="Confirm password" type="password" autoComplete="new-password" {...register("confirm")} error={errors.confirm?.message} />
        <Button type="submit" className="w-full" size="lg" isLoading={loading}>Create account</Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">Already have an account? <Link to="/login" className="font-semibold text-primary hover:underline">Log in</Link></p>
    </AuthShell>
  );
}
