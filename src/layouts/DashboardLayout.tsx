import { Menu } from "lucide-react";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppDispatch } from "../app/hooks";
import { Avatar } from "../components/common/Avatar";
import { NotificationBell } from "../components/layout/NotificationBell";
import { Sidebar, type NavItem } from "../components/layout/Sidebar";
import { resetApplications } from "../features/application/applicationSlice";
import { logoutUser } from "../features/auth/authSlice";
import { resetCompany } from "../features/company/companySlice";
import { resetNotifications } from "../features/notification/notificationSlice";
import { resetStudent } from "../features/student/studentSlice";
import { useAuth } from "../hooks/useAuth";

interface Props { items: NavItem[]; roleLabel: string; base: string }

export const DashboardLayout = ({ items, roleLabel, base }: Props) => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await dispatch(logoutUser());
    dispatch(resetStudent()); dispatch(resetCompany()); dispatch(resetApplications()); dispatch(resetNotifications());
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <div className="min-h-screen lg:pl-64">
      <aside className="fixed inset-y-0 left-0 hidden w-64 lg:block"><Sidebar items={items} roleLabel={roleLabel} onLogout={() => void logout()} homePath={base} /></aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-secondary/60" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64"><Sidebar items={items} roleLabel={roleLabel} onLogout={() => void logout()} onNavigate={() => setOpen(false)} homePath={base} /></aside>
        </div>
      )}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/70 bg-background/85 px-4 backdrop-blur sm:px-6">
        <button className="rounded-lg p-2 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu className="h-5 w-5" /></button>
        <div className="hidden lg:block" />
        <div className="flex items-center gap-2">
          <NotificationBell to={`${base}/notifications`} />
          <div className="flex items-center gap-2.5 pl-2">
            <Avatar name={user?.name ?? "User"} size={36} />
            <div className="hidden text-left sm:block"><p className="text-sm font-bold leading-tight">{user?.name}</p><p className="text-xs text-slate-500">{user?.email}</p></div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl p-4 sm:p-6"><Outlet /></main>
    </div>
  );
};
