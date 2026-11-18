import { Outlet } from "react-router-dom";
import { Footer } from "../components/layout/Footer";
import { Navbar } from "../components/layout/Navbar";

export const PublicLayout = () => (
  <div className="flex min-h-screen flex-col">
    <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded-lg focus:bg-primary focus:p-2 focus:text-white">Skip to content</a>
    <Navbar />
    <main id="main" className="flex-1"><Outlet /></main>
    <Footer />
  </div>
);
