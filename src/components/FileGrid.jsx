import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  File,
  FileCode,
  FileText,
  Folder,
  FolderOpen,
  ImageIcon,
  Share2,
  Upload,
  Video,
} from "lucide-react";
import Button from "../components/ui/Button";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ProgressBar from "./ui/ProgressBar";
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
const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const FileGrid = ({
  combinedItems,
  setSelection,
  fileInputRef,
  viewMode,
  selection,
  formatFileSize,
  setShowCreateDirModal,
  setShowInspector,
  toggleSelection,
  progressMap,
  activeTab,
}) => {
  const navigate = useNavigate();
  function handleRowClick(type, id) {
    console.log("I am called");
    if (type === "directory") {
      navigate(`/directory/${id}`);
    } else {
      window.location.href = `${BASE_URL}/file/${id}`;
    }
  }

  return (
    <div
      className="flex-1 overflow-y-auto p-4 md:p-6 relative"
      onClick={() => setSelection([])} // Deselect on click bg
    >
      {combinedItems.length === 0 ? (
        activeTab === "files" ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-500">
            <FolderOpen className="h-20 w-20 text-slate-300 mb-4" />

            <h3 className="text-lg font-semibold text-slate-700">
              This folder is empty
            </h3>

            <p className="text-sm text-slate-400 mt-1 max-w-sm">
              Upload files or create a new folder to get started.
            </p>

            <div className="flex gap-3 mt-6">
              <Button onClick={() => setShowCreateDirModal(true)}>
                <Folder className="h-4 w-4 mr-2" />
                New Folder
              </Button>

              <Button
                variant="outline"
                onClick={() => fileInputRef.current.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-500">
            <Share2 className="h-20 w-20 text-slate-300 mb-4" />

            <h3 className="text-lg font-semibold text-slate-700">
              No shared files
            </h3>

            <p className="text-sm text-slate-400 mt-1 max-w-sm">
              Files shared with you will appear here.
            </p>
          </div>
        )
      ) : (
        <div
          className={cn(
            "grid gap-4",
            viewMode === "grid"
              ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
              : "grid-cols-1",
          )}
        >
          {combinedItems.map((file) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15 }}
              key={file.id}
              onClick={(e) => {
                e.stopPropagation();
                toggleSelection(file.id, e.metaKey || e.ctrlKey);
                setShowInspector(false); //
              }}
              onDoubleClick={() =>
                handleRowClick(file.isDirectory ? "directory" : "file", file.id)
              }
              className={cn(
                "group relative border rounded-xl cursor-pointer transition-all duration-200 select-none",
                selection?.includes(file.id)
                  ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/20 z-10"
                  : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5",
                viewMode === "list"
                  ? "flex items-center p-3 gap-4"
                  : "p-4 flex flex-col aspect-[4/5] justify-between",
              )}
            >
              {/* Selection Checkbox */}
              <div
                className={cn(
                  "absolute top-3 left-3 w-5 h-5 rounded border bg-white flex items-center justify-center transition-opacity",
                  selection.includes(file.id)
                    ? "opacity-100 border-blue-500 bg-blue-500"
                    : "opacity-0 group-hover:opacity-100 border-slate-300",
                )}
              >
                {selection.includes(file.id) && (
                  <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                )}
              </div>

              {/* Icon Area */}
              <div
                className={cn(
                  "flex items-center justify-center",
                  viewMode === "list"
                    ? "h-10 w-10 bg-slate-50 rounded-lg flex-shrink-0"
                    : "flex-1 mb-2",
                )}
              >
                <FileIcon
                  name={file?.name}
                  isDirectory={file?.isDirectory}
                  className={viewMode === "grid" ? "h-16 w-16" : "h-6 w-6"}
                />
              </div>

              {/* Text Area */}
              {/* Text Area */}
              <div className="flex-1 min-w-0 text-center md:text-left">
                <p
                  className={cn(
                    "text-sm font-medium truncate",
                    file?.isUploading
                      ? "text-slate-400"
                      : "text-slate-700 group-hover:text-blue-700",
                    viewMode === "list" && "text-base",
                  )}
                >
                  {file?.name}
                </p>

                {file?.isUploading && (
                  <div className="mt-2">
                    <div className="h-1.5">
                      <ProgressBar
                        value={progressMap[file?.id] || 0}
                        max={100}
                      />
                    </div>
                    <p className="mt-1 text-[11px] text-slate-400 text-center md:text-left">
                      Uploading… {Math.round(progressMap[file.id] || 0)}%
                    </p>
                  </div>
                )}

                {/* Normal metadata */}
                {!file.isUploading && (
                  <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                    {viewMode === "list" && (
                      <span className="text-xs text-slate-400 w-24">
                        {file.date}
                      </span>
                    )}
                    <span className="text-xs text-slate-400">
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileGrid;
