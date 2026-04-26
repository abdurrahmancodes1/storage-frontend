import { Cloud } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-10">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <div className="flex justify-center items-center gap-2 mb-4">
          <div className="bg-blue-600 text-white p-1 rounded-sm">
            <Cloud size={16} />
          </div>
          <span className="font-bold">StorageApp</span>
        </div>

        <p className="text-slate-500 text-sm">
          © 2024 StorageApp. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
