export type Role = "ADMIN" | "STUDENT" | "COMPANY";
export type ApplicationStatus = "PENDING" | "REVIEWING" | "SHORTLISTED" | "ACCEPTED" | "REJECTED";
export type WorkMode = "ONSITE" | "REMOTE" | "HYBRID";
export type InternshipStatus = "DRAFT" | "PUBLISHED" | "CLOSED" | "REMOVED";

export const APPLICATION_STATUSES: ApplicationStatus[] = ["PENDING", "REVIEWING", "SHORTLISTED", "ACCEPTED", "REJECTED"];
export const WORK_MODES = ["ONSITE", "REMOTE", "HYBRID"] as const satisfies readonly WorkMode[];
export const CATEGORIES = [
  "Software Engineering", "Data Science & AI", "Cyber Security", "UI/UX Design", "Quality Assurance",
  "DevOps & Cloud", "Business Analysis", "Marketing", "Finance", "Other"
] as const;

export interface AuthUser { id: string; name: string; email: string; role: Role }

export interface PageMeta { total: number; page: number; limit: number; totalPages: number; unreadCount?: number }
export interface Paginated<T> { items: T[]; meta: PageMeta }
export interface ApiEnvelope<T> { success: boolean; message: string; data: T; meta?: PageMeta }

export interface Education { _id?: string; institution: string; degree: string; field?: string; startYear?: number; endYear?: number }
export interface Experience { _id?: string; title: string; company: string; startDate?: string; endDate?: string; description?: string }

export interface StudentProfile {
  _id: string; user: string; fullName: string; email?: string; phone?: string; headline?: string; bio?: string; location?: string;
  profileImage?: string; technicalSkills: string[]; softSkills: string[]; education: Education[]; experience: Experience[];
  cvOriginalName?: string; cvUploadedAt?: string; hasCv?: boolean;
}

export interface CompanyProfile {
  _id: string; user?: string; companyName: string; email?: string; industry?: string; website?: string; location?: string;
  size?: string; description?: string; logo?: string;
}

export interface Internship {
  _id: string;
  company: Pick<CompanyProfile, "_id" | "companyName" | "logo" | "location" | "industry" | "website" | "description"> | string;
  title: string; description: string; category: string; requiredSkills: string[]; qualifications: string; location: string;
  workMode: WorkMode; duration: string; stipend: number; deadline: string; vacancies: number; requirements: string;
  status: InternshipStatus; createdAt: string; applicationCount?: number;
  hasApplied?: boolean; applicationId?: string; applicationStatus?: ApplicationStatus; isSaved?: boolean;
}

export interface Application {
  _id: string; student: string | { _id: string; name: string; email: string };
  internship: Partial<Internship> & { _id: string; title: string };
  company: string | { _id: string; companyName: string };
  coverLetter?: string; status: ApplicationStatus; createdAt: string; updatedAt: string;
  statusHistory: { status: ApplicationStatus; changedAt: string }[];
  studentProfile?: Pick<StudentProfile, "user" | "headline" | "location" | "technicalSkills" | "profileImage" | "hasCv"> | null;
}

export interface AppNotification {
  _id: string; type: string; title: string; message: string; link?: string; isRead: boolean; createdAt: string;
}

export interface CVAnalysis {
  _id: string; fileName: string; score: number; summary: string; technicalSkills: string[]; softSkills: string[];
  education: string[]; experience: string[]; missingSkills: string[]; suggestions: string[];
  formattingRecommendations: string[]; recommendedCategories: string[]; createdAt: string;
}

export interface MatchResult {
  internshipId: string; internshipTitle: string; matchPercentage: number; matchingSkills: string[];
  missingSkills: string[]; suggestions: string[]; summary: string;
}

export interface AdminUser {
  id: string; name: string; email: string; role: Role; isBlocked: boolean; createdAt: string; lastLoginAt?: string;
  profile: { companyName?: string; headline?: string; location?: string; industry?: string } | null;
}

export interface PlatformStats {
  users: { total: number; students: number; companies: number; admins: number; blocked: number };
  internships: { total: number; DRAFT: number; PUBLISHED: number; CLOSED: number; REMOVED: number };
  applications: { total: number; byStatus: Record<ApplicationStatus, number> };
}

export interface NamedValue { name: string; value: number }
export interface Analytics {
  applicationsOverTime: { date: string; count: number }[];
  registrationsOverTime: { date: string; count: number }[];
  applicationStatusDistribution: NamedValue[];
  usersByRole: NamedValue[];
  internshipsByCategory: NamedValue[];
  topSkills: NamedValue[];
  topInternships: NamedValue[];
}

export interface InternshipFilters {
  page: number; limit: number; search?: string; category?: string; workMode?: string; location?: string;
  minStipend?: number; skills?: string; sort: "newest" | "deadline" | "stipend";
}
