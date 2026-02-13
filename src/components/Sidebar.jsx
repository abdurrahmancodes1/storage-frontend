// Sidebar.jsx
import { Plus } from "lucide-react";

export default function Sidebar({ onUpload }) {
  return (
    <div className="w-64 border-r bg-slate-50 p-4">
      <button
        onClick={onUpload}
        className="w-full flex items-center gap-2 bg-blue-600 text-white p-2 rounded"
      >
        <Plus /> New Upload
      </button>
    </div>
  );
}
