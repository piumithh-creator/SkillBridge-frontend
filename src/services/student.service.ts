import api, { downloadBlob, unwrap, unwrapPage } from "./api";
import type { Application, ApplicationStatus, Internship, StudentProfile } from "../types";

export interface StudentDashboard {
  totalApplications: number; pendingApplications: number; shortlistedApplications: number; rejectedApplications: number;
  acceptedApplications: number; reviewingApplications: number; savedInternships: number;
}

export const studentService = {
  dashboard: () => unwrap<StudentDashboard>(api.get("/students/dashboard")),
  profile: () => unwrap<StudentProfile>(api.get("/students/profile")),
  updateProfile: (body: Partial<StudentProfile>) => unwrap<StudentProfile>(api.put("/students/profile", body)),
  uploadCv: (file: File) => {
    const form = new FormData();
    form.append("cv", file);
    return unwrap<{ cvOriginalName: string; cvUploadedAt: string }>(api.post("/students/cv", form));
  },
  downloadCv: () => downloadBlob("/students/cv", "cv.pdf"),
  uploadImage: (file: File) => {
    const form = new FormData();
    form.append("image", file);
    return unwrap<{ profileImage: string }>(api.post("/students/profile-image", form));
  },
  applications: (params: { page?: number; limit?: number; status?: ApplicationStatus }) => unwrapPage<Application>(api.get("/students/applications", { params })),
  saved: (params: { page?: number; limit?: number }) => unwrapPage<{ _id: string; internship: Internship }>(api.get("/students/saved", { params })),
  savedIds: () => unwrap<string[]>(api.get("/students/saved/ids")),
  save: (id: string) => unwrap<unknown>(api.post(`/students/saved/${id}`)),
  unsave: (id: string) => unwrap<unknown>(api.delete(`/students/saved/${id}`))
};
