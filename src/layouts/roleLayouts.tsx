import { BarChart3, Bell, Bookmark, Briefcase, Building2, FileText, GraduationCap, LayoutDashboard, Search, Sparkles, UserCircle, Users } from "lucide-react";
import type { NavItem } from "../components/layout/Sidebar";
import { DashboardLayout } from "./DashboardLayout";

const student: NavItem[] = [
  { to: "/student", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/student/internships", label: "Find internships", icon: Search },
  { to: "/student/applications", label: "My applications", icon: FileText },
  { to: "/student/saved", label: "Saved", icon: Bookmark },
  { to: "/student/cv-analyzer", label: "AI CV analyzer", icon: Sparkles },
  { to: "/student/profile", label: "Profile", icon: UserCircle },
  { to: "/student/notifications", label: "Notifications", icon: Bell }
];
const company: NavItem[] = [
  { to: "/company", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/company/internships", label: "My internships", icon: Briefcase },
  { to: "/company/applicants", label: "Applicants", icon: Users },
  { to: "/company/profile", label: "Company profile", icon: Building2 },
  { to: "/company/notifications", label: "Notifications", icon: Bell }
];
const admin: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/students", label: "Students", icon: GraduationCap },
  { to: "/admin/companies", label: "Companies", icon: Building2 },
  { to: "/admin/internships", label: "Internships", icon: Briefcase },
  { to: "/admin/applications", label: "Applications", icon: FileText },
  { to: "/admin/notifications", label: "Notifications", icon: Bell }
];

export const StudentLayout = () => <DashboardLayout items={student} roleLabel="Student" base="/student" />;
export const CompanyLayout = () => <DashboardLayout items={company} roleLabel="Company" base="/company" />;
export const AdminLayout = () => <DashboardLayout items={admin} roleLabel="Admin" base="/admin" />;
