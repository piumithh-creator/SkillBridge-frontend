import { PageHeader } from "../../components/common/PageHeader";
import { InternshipBrowser } from "../../components/internship/InternshipBrowser";

export default function StudentInternships() {
  return <div><PageHeader title="Find internships" subtitle="Search, filter and save opportunities." /><InternshipBrowser basePath="/student/internships" isStudent /></div>;
}
