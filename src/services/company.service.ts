import api, { unwrap } from "./api";
import type { ApplicationStatus, CompanyProfile, StudentProfile } from "../types";

export interface CompanyDashboard {
  totalInternships: number; publishedInternships: number; totalApplications: number;
  applicationsByStatus: Record<ApplicationStatus, number>;
}

export const companyService = {
  dashboard: () => unwrap<CompanyDashboard>(api.get("/companies/dashboard")),
  profile: () => unwrap<CompanyProfile>(api.get("/companies/profile")),
  updateProfile: (body: Partial<CompanyProfile>) => unwrap<CompanyProfile>(api.put("/companies/profile", body)),
  uploadLogo: (file: File) => {
    const form = new FormData();
    form.append("logo", file);
    return unwrap<{ logo: string }>(api.post("/companies/logo", form));
  },
  applicant: (userId: string) => unwrap<StudentProfile>(api.get(`/companies/applicants/${userId}`))
};
