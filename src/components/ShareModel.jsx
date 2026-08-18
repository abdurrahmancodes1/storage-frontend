import React, { useEffect, useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import {
  useFetchUsersQuery,
  useGetPublicShareQuery,
  useRevokePublicShareMutation,
  useSharePublicMutation,
  useShareWithMutation,
} from "@/apis/authApi";

const ShareModel = ({ onClose, fileId, fileName }) => {
  // -----------------------------
  // User sharing state
  // -----------------------------
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // -----------------------------
  // Public sharing state
  // -----------------------------
  const [copied, setCopied] = useState(false);

  // -----------------------------
  // Fetch users
  // -----------------------------
  const { data: users = [], isLoading: usersLoading } =
    useFetchUsersQuery(searchTerm);

  // -----------------------------
  // Fetch current public-share status
  // -----------------------------
  const { data: publicShare, isLoading: publicShareLoading } =
    useGetPublicShareQuery(fileId);

  // -----------------------------
  // Share with specific users
  // -----------------------------
  const [
    shareWith,
    { isLoading: shareLoading, isSuccess: shareSuccess, reset: resetShare },
  ] = useShareWithMutation();

  // -----------------------------
  // Generate public link
  // -----------------------------
  const [sharePublic, { isLoading: sharePublicLoading }] =
    useSharePublicMutation();

  // -----------------------------
  // Revoke public link
  // -----------------------------
  const [revokePublicShare, { isLoading: revokeLoading }] =
    useRevokePublicShareMutation();

  // -----------------------------
  // Reset modal state when opened
  // -----------------------------
  useEffect(() => {
    resetShare();
    setSelectedUsers([]);
    setSearchTerm("");
    setCopied(false);
  }, [resetShare]);

  // -----------------------------
  // Toggle selected user
  // -----------------------------
  const toggleUser = (user) => {
    const alreadySelected = selectedUsers.some(
      (selectedUser) => selectedUser._id === user._id,
    );

    if (alreadySelected) {
      setSelectedUsers((prev) =>
        prev.filter((selectedUser) => selectedUser._id !== user._id),
      );
    } else {
      setSelectedUsers((prev) => [...prev, user]);
    }
  };

  // -----------------------------
  // Share with selected users
  // -----------------------------
  const handleShareWithUsers = async () => {
    if (!selectedUsers.length) return;

    try {
      await shareWith({
        fileId,
        targetUserId: selectedUsers.map((user) => user._id),
        permission: "view",
      }).unwrap();

      onClose();
    } catch (error) {
      console.error("Failed to share file:", error);
    }
  };

  // -----------------------------
  // Generate public link
  // -----------------------------
  const handleGeneratePublicLink = async () => {
    try {
      await sharePublic({ fileId }).unwrap();
    } catch (error) {
      console.error("Failed to generate public link:", error);
    }
  };

  // -----------------------------
  // Copy public link
  // -----------------------------
  const handleCopyLink = async () => {
    if (!publicShare?.shareUrl) return;

    try {
      await navigator.clipboard.writeText(publicShare.shareUrl);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  // -----------------------------
  // Revoke public link
  // -----------------------------
  const handleRevokeLink = async () => {
    const confirmed = window.confirm(
      "Anyone using this link will lose access. Continue?",
    );

    if (!confirmed) return;

    try {
      await revokePublicShare({ fileId }).unwrap();

      setCopied(false);
    } catch (error) {
      console.error("Failed to revoke public link:", error);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl"
        >
          {/* =========================
              Header
          ========================== */}
          <div className="mb-5 flex items-start justify-between">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-slate-900">
                Share File
              </h2>

              <p className="mt-1 truncate text-xs text-slate-500">{fileName}</p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1 transition hover:bg-slate-100"
            >
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>

          {/* =========================
              Share With People
          ========================== */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-700">
              Share with people
            </p>

            {/* Search */}
            <input
              type="email"
              placeholder="Enter user email"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSelectedUsers([]);
              }}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            {/* User list */}
            {searchTerm && (
              <ul className="max-h-32 overflow-y-auto rounded-md border border-slate-200">
                {usersLoading ? (
                  <li className="flex justify-center p-3">
                    <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
                  </li>
                ) : users.length === 0 ? (
                  <li className="p-3 text-center text-xs text-slate-500">
                    No users found
                  </li>
                ) : (
                  users.map((user) => (
                    <li
                      key={user._id}
                      onClick={() => toggleUser(user)}
                      className="flex cursor-pointer items-center justify-between px-3 py-2 text-sm transition hover:bg-slate-100"
                    >
                      <span className="truncate">{user.email}</span>

                      {selectedUsers.some(
                        (selectedUser) => selectedUser._id === user._id,
                      ) && (
                        <Check className="h-4 w-4 shrink-0 text-green-600" />
                      )}
                    </li>
                  ))
                )}
              </ul>
            )}

            {/* Selected users */}
            {selectedUsers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700"
                  >
                    <span className="max-w-[180px] truncate">{user.email}</span>

                    <button
                      type="button"
                      onClick={() => toggleUser(user)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Share button */}
            <button
              type="button"
              disabled={shareLoading || selectedUsers.length === 0}
              onClick={handleShareWithUsers}
              className="w-full cursor-pointer rounded-md bg-blue-600 py-2 text-sm text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {shareLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Sharing...</span>
                </div>
              ) : shareSuccess ? (
                "Shared"
              ) : (
                "Share"
              )}
            </button>
          </div>

          {/* =========================
              Divider
          ========================== */}
          <div className="my-5 border-t border-slate-200" />

          {/* =========================
              Public Link
          ========================== */}
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-slate-700">
                Anyone with the link
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Anyone with this link can view this file.
              </p>
            </div>

            {/* Loading public-share state */}
            {publicShareLoading ? (
              <div className="flex items-center justify-center py-3">
                <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
              </div>
            ) : publicShare?.enabled ? (
              /* =========================
                 Public Link Active
              ========================== */
              <div className="space-y-3">
                {/* Link + Copy */}
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={publicShare.shareUrl}
                    className="min-w-0 flex-1 rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-600 outline-none"
                  />

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="shrink-0 rounded-md bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>

                {/* Active status */}
                <div className="flex items-center gap-2 text-xs text-green-600">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Public link is active
                </div>

                {/* Revoke */}
                <button
                  type="button"
                  disabled={revokeLoading}
                  onClick={handleRevokeLink}
                  className="w-full rounded-md border border-red-200 py-2 text-sm text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {revokeLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Revoking...
                    </div>
                  ) : (
                    "Revoke link"
                  )}
                </button>
              </div>
            ) : (
              /* =========================
                 Public Link Not Active
              ========================== */
              <button
                type="button"
                disabled={sharePublicLoading}
                onClick={handleGeneratePublicLink}
                className="w-full rounded-md bg-blue-600 py-2 text-sm text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sharePublicLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </div>
                ) : (
                  "Generate Link"
                )}
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ShareModel;
