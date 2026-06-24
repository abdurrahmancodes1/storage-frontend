import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="py-8 text-center text-slate-600">
      <div className="mb-4">
        <h2 className="font-bold text-xl text-slate-900">StorVault</h2>
        <p>Secure cloud storage for your files.</p>
      </div>

      <div className="flex justify-center gap-6">
        <Link to="/privacy-policy" className="hover:text-slate-900">
          Privacy Policy
        </Link>

        <Link to="/terms-of-service" className="hover:text-slate-900">
          Terms of Service
        </Link>
      </div>
    </footer>
  );
}
