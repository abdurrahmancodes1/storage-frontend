import { useEffect, useRef } from "react";
import { X, FileText, Folder } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RenameModal({
  renameType,
  renameValue,
  setRenameValue,
  onClose,
  onRenameSubmit,
}) {
  const inputRef = useRef(null);
  const hasSelectedRef = useRef(false); // ✅ KEY FIX

  useEffect(() => {
    if (!inputRef.current || hasSelectedRef.current) return;

    inputRef.current.focus();

    const dotIndex = renameValue.lastIndexOf(".");
    if (dotIndex > 0) {
      inputRef.current.setSelectionRange(0, dotIndex);
    } else {
      inputRef.current.select();
    }

    hasSelectedRef.current = true; // ✅ prevent future selection

    const handleKeyDown = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              {renameType === "file" ? (
                <FileText className="h-5 w-5 text-blue-600" />
              ) : (
                <Folder className="h-5 w-5 text-blue-600" />
              )}
              <h2 className="text-lg font-semibold text-slate-900">
                Rename {renameType === "file" ? "File" : "Folder"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={onRenameSubmit} className="px-6 py-5 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">
                New name
              </label>
              <input
                ref={inputRef}
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                className="mt-1 w-full h-10 px-3 rounded-lg border border-slate-200
                           focus:outline-none focus:ring-2 focus:ring-blue-500/20
                           focus:border-blue-500 text-sm"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm font-medium
                           text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!renameValue.trim()}
                className="px-4 py-2 rounded-lg text-sm font-medium
                           bg-blue-600 text-white hover:bg-blue-700
                           disabled:opacity-50 disabled:pointer-events-none"
              >
                Save
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
