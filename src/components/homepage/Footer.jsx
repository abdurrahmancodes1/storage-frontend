import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-10">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-2xl font-bold text-slate-900">StorVault</h2>

        <p className="mt-2 text-slate-600">
          Secure, reliable, and private cloud storage for your files.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-8 text-sm">
          <Link
            to="/privacy-policy"
            className="font-medium text-blue-600 hover:text-blue-800 underline"
          >
            Privacy Policy
          </Link>

          <Link
            to="/terms-of-service"
            className="font-medium text-blue-600 hover:text-blue-800 underline"
          >
            Terms of Service
          </Link>

          <a
            href="mailto:support@storvault.xyz"
            className="font-medium text-blue-600 hover:text-blue-800 underline"
          >
            Contact Support
          </a>
        </div>

        <p className="mt-6 text-sm text-slate-500">
          © {new Date().getFullYear()} StorVault. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
