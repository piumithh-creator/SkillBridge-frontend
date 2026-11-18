import api, { unwrap, unwrapPage } from "./api";
import type { AdminUser, Analytics, Application, Internship, PlatformStats, Role } from "../types";

export const adminService = {
  dashboard: () => unwrap<PlatformStats>(api.get("/admin/dashboard")),
  analytics: () => unwrap<Analytics>(api.get("/admin/analytics")),
  users: (params: { page?: number; limit?: number; role?: Role; search?: string; blocked?: "true" | "false" }) => unwrapPage<AdminUser>(api.get("/admin/users", { params })),
  setBlocked: (id: string, isBlocked: boolean) => unwrap<{ id: string; isBlocked: boolean }>(api.patch(`/admin/users/${id}/status`, { isBlocked })),
  internships: (params: { page?: number; limit?: number; status?: string; search?: string }) => unwrapPage<Internship>(api.get("/admin/internships", { params })),
  removeInternship: (id: string) => unwrap<unknown>(api.delete(`/admin/internships/${id}`)),
  applications: (params: { page?: number; limit?: number; status?: string }) => unwrapPage<Application>(api.get("/admin/applications", { params }))
};
