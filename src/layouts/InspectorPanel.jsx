import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Button from "../components/ui/Button";
import {
  File,
  FileCode,
  FileText,
  Folder,
  ImageIcon,
  Video,
  X,
} from "lucide-react";
const FileIcon = ({ name, isDirectory, className }) => {
  // Folder first (same behavior as before)
  if (isDirectory) {
    return (
      <Folder className={cn("text-blue-500 fill-blue-500/20", className)} />
    );
  }

  const ext = name?.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "pdf":
      return <FileText className={cn("text-red-500", className)} />;

    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "webp":
      return <ImageIcon className={cn("text-purple-500", className)} />;

    case "zip":
    case "rar":
    case "tar":
    case "gz":
      return <Folder className={cn("text-amber-500", className)} />;

    case "mp4":
    case "mov":
    case "avi":
    case "mkv":
      return <Video className={cn("text-indigo-500", className)} />;

    case "js":
    case "jsx":
    case "ts":
    case "tsx":
    case "html":
    case "css":
    case "py":
    case "java":
    case "json":
      return <FileCode className={cn("text-emerald-500", className)} />;

    default:
      return <File className={cn("text-slate-400", className)} />;
  }
};
export default function InspectorPanel({
  selectedItem,
  activeTab,
  formatFileSize,
  formatDate,
  setSelection,
  sharedFiles,
}) {
  if (!selectedItem) return null;
  console.log(sharedFiles, "form here");
  return (
    <motion.aside
      initial={{ x: 320 }}
      animate={{ x: 0 }}
      exit={{ x: 320 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 right-0 h-full w-80 bg-white border-l border-slate-200 shadow-xl z-40 flex flex-col"
    >
      {/* Header */}
      <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6">
        <h3 className="font-semibold text-slate-800">Details</h3>
        <button
          onClick={() => setSelection([])}
          className="text-slate-400 hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="aspect-video bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center mb-6">
          <FileIcon
            name={selectedItem.name}
            isDirectory={selectedItem.isDirectory}
            className="h-16 w-16 opacity-50"
          />
        </div>

        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">
              Name
            </label>
            <p className="text-sm font-medium text-slate-900 mt-1 break-words">
              {selectedItem.name}
            </p>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">
                Type
              </label>
              <p className="text-sm text-slate-700 mt-1">
                {selectedItem.isDirectory ? "Folder" : "File"}
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">
                Size
              </label>
              <p className="text-sm text-slate-700 mt-1">
                {selectedItem.isDirectory
                  ? "--"
                  : formatFileSize(selectedItem.size)}
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">
                Created
              </label>
              <p className="text-sm text-slate-700 mt-1">
                {formatDate(selectedItem.createdAt)}
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">
                Owner
              </label>
              <p className="text-sm text-slate-700 mt-1">
                {selectedItem.userId?.name}
                <br />({selectedItem.userId?.email})
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      {activeTab === "files" && (
        <div className="p-6 border-t border-slate-100 bg-slate-50">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full">
              Download
            </Button>
            <Button className="w-full">Share</Button>
          </div>
        </div>
      )}
    </motion.aside>
  );
}
