import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { FullPageSpinner } from "../components/common/Spinner";
import { PublicLayout } from "../layouts/PublicLayout";
import { AdminLayout, CompanyLayout, StudentLayout } from "../layouts/roleLayouts";
import { GuestRoute, ProtectedRoute } from "./ProtectedRoute";

const Landing = lazy(() => import("../pages/public/Landing"));
const BrowseInternships = lazy(() => import("../pages/public/BrowseInternships"));
const PublicInternshipDetail = lazy(() => import("../pages/public/InternshipDetail"));
const Login = lazy(() => import("../pages/public/Login"));
const Register = lazy(() => import("../pages/public/Register"));
const NotFound = lazy(() => import("../pages/public/NotFound"));
const Notifications = lazy(() => import("../pages/shared/Notifications"));

const StudentDashboard = lazy(() => import("../pages/student/Dashboard"));
const StudentInternships = lazy(() => import("../pages/student/Internships"));
const StudentInternshipDetail = lazy(() => import("../pages/student/InternshipDetail"));
const StudentApplications = lazy(() => import("../pages/student/Applications"));
const StudentSaved = lazy(() => import("../pages/student/Saved"));
const StudentProfile = lazy(() => import("../pages/student/Profile"));
const CvAnalyzer = lazy(() => import("../pages/student/CvAnalyzer"));

const CompanyDashboard = lazy(() => import("../pages/company/Dashboard"));
const CompanyInternships = lazy(() => import("../pages/company/Internships"));
const InternshipForm = lazy(() => import("../pages/company/InternshipForm"));
const CompanyApplicants = lazy(() => import("../pages/company/Applicants"));
const CompanyProfile = lazy(() => import("../pages/company/Profile"));

const AdminDashboard = lazy(() => import("../pages/admin/Dashboard"));
const AdminAnalytics = lazy(() => import("../pages/admin/Analytics"));
const AdminUsers = lazy(() => import("../pages/admin/Users"));
const AdminInternships = lazy(() => import("../pages/admin/Internships"));
const AdminApplications = lazy(() => import("../pages/admin/Applications"));

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <Landing /> },
      { path: "/internships", element: <BrowseInternships /> },
      { path: "/internships/:id", element: <PublicInternshipDetail /> }
    ]
  },
  { element: <GuestRoute />, children: [{ path: "/login", element: <Login /> }, { path: "/register", element: <Register /> }] },
  {
    element: <ProtectedRoute roles={["STUDENT"]} />,
    children: [{
      path: "/student", element: <StudentLayout />,
      children: [
        { index: true, element: <StudentDashboard /> },
        { path: "internships", element: <StudentInternships /> },
        { path: "internships/:id", element: <StudentInternshipDetail /> },
        { path: "applications", element: <StudentApplications /> },
        { path: "saved", element: <StudentSaved /> },
        { path: "cv-analyzer", element: <CvAnalyzer /> },
        { path: "profile", element: <StudentProfile /> },
        { path: "notifications", element: <Notifications /> }
      ]
    }]
  },
  {
    element: <ProtectedRoute roles={["COMPANY"]} />,
    children: [{
      path: "/company", element: <CompanyLayout />,
      children: [
        { index: true, element: <CompanyDashboard /> },
        { path: "internships", element: <CompanyInternships /> },
        { path: "internships/new", element: <InternshipForm /> },
        { path: "internships/:id/edit", element: <InternshipForm /> },
        { path: "applicants", element: <CompanyApplicants /> },
        { path: "profile", element: <CompanyProfile /> },
        { path: "notifications", element: <Notifications /> }
      ]
    }]
  },
  {
    element: <ProtectedRoute roles={["ADMIN"]} />,
    children: [{
      path: "/admin", element: <AdminLayout />,
      children: [
        { index: true, element: <AdminDashboard /> },
        { path: "analytics", element: <AdminAnalytics /> },
        { path: "users", element: <AdminUsers /> },
        { path: "students", element: <AdminUsers role="STUDENT" /> },
        { path: "companies", element: <AdminUsers role="COMPANY" /> },
        { path: "internships", element: <AdminInternships /> },
        { path: "applications", element: <AdminApplications /> },
        { path: "notifications", element: <Notifications /> }
      ]
    }]
  },
  { path: "/home", element: <Navigate to="/" replace /> },
  { path: "*", element: <NotFound /> }
]);

export const AppRouter = () => (
  <Suspense fallback={<FullPageSpinner />}>
    <RouterProvider router={router} />
  </Suspense>
);
