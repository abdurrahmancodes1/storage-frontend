import { useGetDirectoryQuery } from "./apis/authApi";
import CTA from "./components/homepage/CTA";
import Features from "./components/homepage/Features";
import Footer from "./components/homepage/Footer";
import Hero from "./components/homepage/Hero";
import Navbar from "./components/homepage/Navbar";
import Pricing from "./components/homepage/Pricing";

export default function Homepage() {
  const { isSuccess } = useGetDirectoryQuery("");
  console.log(isSuccess);
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar isLoggedIn={isSuccess} />
      <Hero isLoggedIn={isSuccess} />
      <Features isLoggedIn={isSuccess} />
      <CTA isLoggedIn={isSuccess} />
      <Pricing />
      <Footer />
    </div>
  );
}
