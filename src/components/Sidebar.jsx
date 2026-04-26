// Sidebar.jsx
import { Cloud, HardDrive, Plus, Share2, Star, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import ImportFromDrive from "./ImportFromDrive";
import Button from "../components/ui/Button";
import { cn } from "@/lib/utils";
import ProgressBar from "../components/ui/ProgressBar";
export default function Sidebar({
  isSidebarOpen,
  fileInputRef,
  handleFileSelect,
  activeTab,
  setActiveTab,
  storageUsed,
  maxStorage,
  formatFileSize,
}) {
  const isOwnerView = activeTab === "files";

  return (
    <motion.aside
      initial={false}
      animate={{
        width: isSidebarOpen ? 256 : 0,
        opacity: isSidebarOpen ? 1 : 0,
      }}
      className="flex-shrink-0 bg-slate-50 border-r border-slate-200 flex flex-col overflow-hidden"
    >
      <div className="p-4 flex items-center gap-2">
        <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Cloud className="h-5 w-5 text-white" />
        </div>
        <span className="font-bold text-lg tracking-tight">
          Stor<span className="text-blue-600">iX</span>
        </span>
      </div>

      {isOwnerView && (
        <div className="px-3 py-2 space-y-2 flex flex-col w-full">
          {/* System Upload */}
          <div className="relative ">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="absolute inset-0 z-10 opacity-0 cursor-pointer"
            />
            <Button
              type="button"
              className="w-full justify-start gap-2 shadow-sm pointer-events-none"
            >
              <Plus className="h-4 w-4" /> New Upload
            </Button>
          </div>

          {/* Google Drive Import */}
          <div className="w-full">
            <ImportFromDrive />
          </div>
        </div>
      )}

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {[
          { id: "files", icon: HardDrive, label: "My Files" },
          { id: "shared", icon: Share2, label: "Shared" },
          {
            id: "starred",
            icon: Star,
            label: "Starred (Upcoming)",
          },
          { id: "trash", icon: Trash2, label: "Trash (Upcoming)" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              activeTab === item.id
                ? "bg-white text-blue-600 shadow-sm ring-1 ring-slate-200"
                : "text-slate-600 hover:bg-slate-100",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Storage Widget */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-700">Storage</span>
          <span className="text-xs text-slate-500">
            {Math.round((storageUsed / maxStorage) * 100)} %
          </span>
        </div>
        <ProgressBar
          value={Math.round((storageUsed / maxStorage) * 100)}
          max={100}
          className="mb-2"
        />
        <p className="text-xs text-slate-500 mb-3">
          {formatFileSize(storageUsed)} of {formatFileSize(maxStorage)}
        </p>
        <button className="w-full py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors">
          Upgrade Plan
        </button>
      </div>
    </motion.aside>
  );
}
