import api, { refreshSession, unwrap } from "./api";
import type { AuthUser, CompanyProfile, StudentProfile } from "../types";

export interface RegisterPayload { name: string; email: string; password: string; role: "STUDENT" | "COMPANY"; companyName?: string }
export interface AuthResult { user: AuthUser; accessToken: string }

export const authService = {
  register: (p: RegisterPayload) => unwrap<AuthResult>(api.post("/auth/register", p)),
  login: (email: string, password: string) => unwrap<AuthResult>(api.post("/auth/login", { email, password })),
  logout: () => unwrap<null>(api.post("/auth/logout")),
  restore: () => refreshSession(),
  me: () => unwrap<{ user: AuthUser; profile: StudentProfile | CompanyProfile | null }>(api.get("/auth/me"))
};
