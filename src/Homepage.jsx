import CTA from "./components/homepage/CTA";
import Features from "./components/homepage/Features";
import Footer from "./components/homepage/Footer";
import Hero from "./components/homepage/Hero";
import Navbar from "./components/homepage/Navbar";
import Pricing from "./components/homepage/Pricing";

export default function Homepage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar />
      <Hero />
      <Features />
      <CTA />
      <Pricing />
      <Footer />
    </div>
  );
}
