import api, { unwrap, unwrapPage } from "./api";
import type { Internship, InternshipFilters } from "../types";

export type InternshipInput = Omit<Internship, "_id" | "company" | "createdAt" | "applicationCount" | "hasApplied" | "applicationId" | "applicationStatus" | "isSaved">;

export const internshipService = {
  list: (filters: Partial<InternshipFilters>) => {
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== "" && v !== undefined));
    return unwrapPage<Internship>(api.get("/internships", { params }));
  },
  mine: (params: { page?: number; limit?: number; status?: string; search?: string }) => unwrapPage<Internship>(api.get("/internships/mine", { params })),
  get: (id: string) => unwrap<Internship>(api.get(`/internships/${id}`)),
  create: (body: Partial<InternshipInput>) => unwrap<Internship>(api.post("/internships", body)),
  update: (id: string, body: Partial<InternshipInput>) => unwrap<Internship>(api.put(`/internships/${id}`, body)),
  remove: (id: string) => unwrap<null>(api.delete(`/internships/${id}`))
};
