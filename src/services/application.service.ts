import api, { downloadBlob, unwrap, unwrapPage } from "./api";
import type { Application, ApplicationStatus } from "../types";

export const applicationService = {
  apply: (internshipId: string, coverLetter?: string) => unwrap<Application>(api.post("/applications", { internshipId, coverLetter })),
  mine: (params: { page?: number; limit?: number; status?: ApplicationStatus }) => unwrapPage<Application>(api.get("/applications/my", { params })),
  received: (params: { page?: number; limit?: number; status?: ApplicationStatus; internshipId?: string }) => unwrapPage<Application>(api.get("/applications/received", { params })),
  get: (id: string) => unwrap<Application>(api.get(`/applications/${id}`)),
  updateStatus: (id: string, status: ApplicationStatus) => unwrap<Application>(api.patch(`/applications/${id}/status`, { status })),
  withdraw: (id: string) => unwrap<null>(api.delete(`/applications/${id}`)),
  downloadCv: (id: string) => downloadBlob(`/applications/${id}/cv`, "cv.pdf")
};
