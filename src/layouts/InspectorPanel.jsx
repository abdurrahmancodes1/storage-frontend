import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Button from "../components/ui/Button";
import { useGetFileActivityQuery } from "../apis/fileApi2";
import {
  Activity,
  Download,
  Eye,
  File,
  FileCode,
  FileText,
  Folder,
  ImageIcon,
  Share2,
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
  currentUser,
  setShareModel,
}) {
  const { data: activity, isLoading: activityLoading, isError: activityError } =
    useGetFileActivityQuery(selectedItem?.id, {
      skip: !selectedItem || selectedItem.isDirectory || !selectedItem.id,
    });

  if (!selectedItem) return null;

  const isShared =
    !selectedItem.isDirectory &&
    (selectedItem.publicShare?.enabled || selectedItem.sharedWith?.length > 0);

  const formatActivityDate = (value) =>
    value
      ? new Intl.DateTimeFormat(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date(value))
      : "No activity yet";

  return (
    <motion.aside
      initial={{ x: 320 }}
      animate={{ x: 0 }}
      exit={{ x: 320 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed right-0 top-0 z-40 flex h-[100dvh] w-[min(100vw,390px)] flex-col overflow-hidden border-l border-slate-200 bg-white shadow-xl sm:w-[390px]"
    >
      {/* Header */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-100 px-5">
        <h3 className="font-semibold text-slate-800">Details</h3>
        <button
          onClick={() => setSelection([])}
          className="text-slate-400 hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Body */}
      <div className="min-h-0 flex-1 overflow-hidden p-5">
        <div className="mb-4 flex h-24 items-center justify-center rounded-xl border border-slate-100 bg-slate-50">
          <FileIcon
            name={selectedItem.name}
            isDirectory={selectedItem.isDirectory}
            className="h-16 w-16 opacity-50"
          />
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <label className="text-xs font-semibold text-slate-500 uppercase">
                  Name
                </label>
                <p className="text-sm font-medium text-slate-900 mt-1 break-words">
                  {selectedItem.name}
                </p>
              </div>
              {isShared && (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                  <Share2 className="h-3 w-3" />
                  Shared
                </span>
              )}
            </div>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-2 gap-x-5 gap-y-3">
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
                {selectedItem.userId?.name ||
                  (activeTab === "files" ? currentUser?.name || "You" : "Unavailable")}
                {(selectedItem.userId?.email || currentUser?.email) && (
                  <>
                    <br />({selectedItem.userId?.email || currentUser?.email})
                  </>
                )}
              </p>
            </div>
          </div>

          {!selectedItem.isDirectory && (
            <div className="border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-slate-500" />
                  <h4 className="text-sm font-semibold text-slate-800">Activity</h4>
                </div>
                {activity?.lastAccessAt && (
                  <span className="text-[11px] text-slate-400">
                    {formatActivityDate(activity.lastAccessAt)}
                  </span>
                )}
              </div>

              {activityLoading ? (
                <p className="mt-3 text-xs text-slate-500">Loading activity...</p>
              ) : activityError ? (
                <p className="mt-3 text-xs text-red-600">Activity unavailable.</p>
              ) : (
                <>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-slate-50 p-2.5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Eye className="h-3.5 w-3.5" /> Views
                      </div>
                      <p className="mt-0.5 text-lg font-semibold text-slate-900">
                        {activity?.previewCount || 0}
                      </p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-2.5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Download className="h-3.5 w-3.5" /> Downloads
                      </div>
                      <p className="mt-0.5 text-lg font-semibold text-slate-900">
                        {activity?.downloadCount || 0}
                      </p>
                    </div>
                  </div>

                  {activity?.recent?.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                      {activity.recent.slice(0, 3).map((event) => (
                        <div
                          key={event._id}
                          className="flex items-center justify-between text-xs"
                        >
                          <span className="capitalize text-slate-600">
                            {event.eventType} · {event.actorType}
                          </span>
                          <span className="text-slate-400">
                            {formatActivityDate(event.createdAt)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      {activeTab === "files" && (
        <div className="shrink-0 border-t border-slate-100 bg-slate-50 p-4">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                if (!selectedItem.isDirectory) {
                  window.location.href = `${import.meta.env.VITE_BACKEND_BASE_URL}/file/${selectedItem.id}?action=download`;
                }
              }}
            >
              Download
            </Button>
            <Button className="w-full" onClick={() => setShareModel(true)}>
              Share
            </Button>
          </div>
        </div>
      )}
    </motion.aside>
  );
}
