import { downloadBlob } from "./api";

export const reportService = {
  studentApplications: () => downloadBlob("/reports/student/applications", "application-history.pdf"),
  studentCvAnalysis: () => downloadBlob("/reports/student/cv-analysis", "cv-analysis.pdf"),
  companyApplicants: () => downloadBlob("/reports/company/applicants", "applicant-report.pdf"),
  companyInternship: (id: string) => downloadBlob(`/reports/company/internships/${id}`, "internship-report.pdf"),
  adminPlatform: () => downloadBlob("/reports/admin/platform", "platform-report.pdf")
};
