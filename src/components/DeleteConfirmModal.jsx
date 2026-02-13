import { Trash2, X, Folder, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function DeleteConfirmModal({ name, isDirectory, onCancel, onConfirm }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
        onClick={onCancel}
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
          <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-200">
            <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">
              Delete {isDirectory ? "Folder" : "File"}
            </h2>
          </div>

          {/* Body */}
          <div className="px-6 py-5 text-sm text-slate-600">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-slate-900">{name}</span>?
            <p className="mt-2 text-xs text-red-500">
              This action cannot be undone.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg text-sm font-medium
                         text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-lg text-sm font-medium
                         bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
