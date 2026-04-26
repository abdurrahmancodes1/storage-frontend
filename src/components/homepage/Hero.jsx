import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="pt-32 pb-24 px-4 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
          Secure. Organize.
          <br /> <span className="text-blue-700">Access Anywhere.</span>
        </h1>

        <p className="text-slate-500 text-lg mb-10 max-w-2xl mx-auto">
          Simple cloud storage for managing your files with clarity and speed.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-md flex items-center justify-center">
            Get Started <ArrowRight size={18} className="ml-2" />
          </button>
          <button className="border border-slate-300 px-8 py-3 rounded-md">
            Login to Dashboard
          </button>
        </div>
      </div>
    </section>
  );
}
