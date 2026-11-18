import { InternshipBrowser } from "../../components/internship/InternshipBrowser";
import { PageHeader } from "../../components/common/PageHeader";
import { useAuth } from "../../hooks/useAuth";

export default function BrowseInternships() {
  const { user } = useAuth();
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <PageHeader title="Browse internships" subtitle="Find an opportunity that fits your skills and goals." />
      <InternshipBrowser basePath="/internships" isStudent={user?.role === "STUDENT"} />
    </div>
  );
}
