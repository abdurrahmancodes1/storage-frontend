import { cn } from "@/lib/utils";
import {
  Download,
  Folder,
  Info,
  LayoutGrid,
  ListIcon,
  Share2,
  Trash2,
} from "lucide-react";
import React from "react";
import ShareModel from "./ShareModel";
import Button from "../components/ui/Button";
const Toolbar = ({
  selection,
  viewMode,
  shareModel,
  openDeleteModal,
  setIsViewSwitching,
  setViewMode,
  setShareModel,
  openRenameModal,
  combinedItems,
  setShowInspector,
  setShowCreateDirModal,
  activeTab,
}) => {
  return (
    <div className="h-12 border-b border-slate-100 flex items-center justify-between px-4 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center gap-1">
        {activeTab === "files" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCreateDirModal(true)}
          >
            <Folder className="h-4 w-4 mr-2 text-blue-500" /> New Folder
          </Button>
        )}

        {selection.length === 1 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowInspector(true)}
          >
            <Info className="h-4 w-4 mr-2" />
            Details
          </Button>
        )}

        {activeTab === "files" && selection.length > 0 && (
          <>
            <div className="h-4 w-px bg-slate-200 mx-2"></div>
            {selection.length === 1 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-600"
                onClick={() => {
                  const item = combinedItems.find((i) => i.id === selection[0]);
                  if (!item) return;

                  openRenameModal(
                    item?.isDirectory ? "directory" : "file",
                    item?.id,
                    item?.name,
                  );
                }}
              >
                Rename
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-600"
              onClick={() => {
                if (selection.length !== 1) return;
                const id = selection[0];
                window.location.href = `${import.meta.env.VITE_BACKEND_BASE_URL}/file/${id}?action=download`;
              }}
            >
              <Download className="h-4 w-4 mr-2" /> Download
            </Button>
            <Button
              onClick={() => setShareModel(true)}
              variant="ghost"
              size="sm"
              className="text-slate-600"
            >
              <Share2 className="h-4 w-4 mr-2" /> Share
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={openDeleteModal}
            >
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>
          </>
        )}

        {/* {activeTab==="shared" && ()} */}
      </div>

      <div className="flex items-center bg-slate-100 p-0.5 rounded-lg">
        <button
          onClick={() => {
            setViewMode("grid");
            setIsViewSwitching(true);
            setTimeout(() => setIsViewSwitching(false), 150);
          }}
          className={cn(
            "p-1.5 rounded-md transition-all",
            viewMode === "grid"
              ? "bg-white shadow-sm text-blue-600"
              : "text-slate-500 hover:text-slate-700",
          )}
        >
          <LayoutGrid className="h-4 w-4" />
        </button>
        <button
          onClick={() => setViewMode("list")}
          className={cn(
            "p-1.5 rounded-md transition-all",
            viewMode === "list"
              ? "bg-white shadow-sm text-blue-600"
              : "text-slate-500 hover:text-slate-700",
          )}
        >
          <ListIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
