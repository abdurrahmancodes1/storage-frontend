import { useState, useEffect } from "react";
import { Cloud, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ isLoggedIn }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 border-b transition-all ${
        scrolled
          ? "bg-white/90 backdrop-blur border-slate-200 py-3"
          : "bg-transparent border-transparent py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white p-1.5 rounded-md">
            <Cloud size={18} />
          </div>
          <span className="font-bold">StorageApp</span>
        </div>

        <div className=" flex items-center gap-8">
          <a
            href="#features"
            className="hidden sm:block text-slate-600 hover:text-blue-600"
          >
            Features
          </a>
          {!isLoggedIn ? (
            <button
              onClick={() => navigate("/login")}
              className="cursor-pointer border border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white transition"
            >
              Login
            </button>
          ) : (
            <button
              onClick={() => navigate("/dashboard")}
              className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Dashboard
            </button>
          )}
        </div>
        {/*
        <button className="md:hidden" onClick={() => setOpen((prev) => !prev)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button> */}
      </div>

      {/* {open && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-3">
          <a href="#features" className="block">
            Features
          </a>
          <button
            onClick={() => navigate("/login")}
            className="block w-full text-left"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="w-full cursor-pointer bg-blue-600 text-white py-2 rounded-md"
          >
            Get Started
          </button>
        </div>
      )} */}
    </nav>
  );
}
