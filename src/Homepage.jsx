import { useGetCurrentUserQuery, useGetDirectoryQuery } from "./apis/authApi";
import Features from "./components/homepage/Features";
import Footer from "./components/homepage/Footer";
import Hero from "./components/homepage/Hero";
import Navbar from "./components/homepage/Navbar";
import Pricing from "./components/homepage/Pricing";

export default function Homepage() {
  const { data: user, isLoading, isSuccess } = useGetCurrentUserQuery();
  if (isLoading) return null;
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar isLoggedIn={isSuccess} />
      <Hero isLoggedIn={isSuccess} />
      <Features isLoggedIn={isSuccess} />

      <Pricing />
      <Footer />
    </div>
  );
}
