import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Button } from "../../components/common/Button";
import { InputField } from "../../components/forms/InputField";
import { dashboardPath } from "../../components/layout/Navbar";
import { AuthShell } from "./AuthShell";
import { clearAuthError, loginUser } from "../../features/auth/authSlice";

const schema = z.object({ email: z.string().email("Enter a valid email"), password: z.string().min(1, "Password is required") });
type Form = z.infer<typeof schema>;

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useAppSelector((s) => s.auth);
  const { register, handleSubmit, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: Form) => {
    dispatch(clearAuthError());
    const res = await dispatch(loginUser(values));
    if (loginUser.fulfilled.match(res)) {
      toast.success(`Welcome back, ${res.payload.name.split(" ")[0]}!`);
      const from = (location.state as { from?: string } | null)?.from;
      navigate(from && from.startsWith(`/${res.payload.role.toLowerCase()}`) || from?.startsWith("/internships") ? from! : dashboardPath(res.payload.role), { replace: true });
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Log in to continue to SkillBridge.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {error && <div role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</div>}
        <InputField label="Email" type="email" autoComplete="email" {...register("email")} error={errors.email?.message} />
        <InputField label="Password" type="password" autoComplete="current-password" {...register("password")} error={errors.password?.message} />
        <Button type="submit" className="w-full" size="lg" isLoading={loading}>Log in</Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">New to SkillBridge? <Link to="/register" className="font-semibold text-primary hover:underline">Create an account</Link></p>
    </AuthShell>
  );
}
