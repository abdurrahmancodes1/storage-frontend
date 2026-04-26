import React, { useEffect, useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  useFetchUsersQuery,
  useSharePublicQuery,
  useShareWithMutation,
} from "@/apis/authApi";

const ShareModel = ({ onClose, fileId, fileName }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const toogleUser = (user) => {
    const alreadySelected = selectedUsers.find((u) => u._id === user._id);
    if (alreadySelected) {
      setSelectedUsers((prev) => prev.filter((u) => u._id !== user._id));
    } else {
      setSelectedUsers((prev) => [...prev, user]);
    }
  };
  const { data } = useSharePublicQuery();
  console.log(data);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: users = [], isLoading } = useFetchUsersQuery(searchTerm, {
    skip: false,
  });

  console.log(users, "this is empty ");
  const [shareWith, { isLoading: shareLoading, isSuccess, reset }] =
    useShareWithMutation();
  useEffect(() => {
    reset();
    setSelectedUsers([]);
    setSearchTerm("");
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
          className="w-full  p-6 max-w-md bg-white rounded-xl shadow-xl border border-slate-200"
        >
          {/* Header */}
          <div className="flex  items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Share File</h2>
            <button onClick={onClose}>
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>

          {/* Share With Users */}
          <div className="space-y-3">
            <p className="text-sm text-slate-600">Share with people</p>

            <input
              type="email"
              placeholder="Enter user email"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSelectedUsers([]);
              }}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
            <ul>
              <ul className="max-h-32 overflow-y-auto border rounded-md">
                {isLoading ? (
                  <div className="flex justify-center p-2">
                    <Loader2 className="animate-spin h-4 w-4" />
                  </div>
                ) : (
                  users.map((user) => (
                    <li
                      key={user._id}
                      onClick={() => toogleUser(user)}
                      className="flex items-center justify-between px-3 py-2 text-sm hover:bg-slate-100 cursor-pointer"
                    >
                      <span>{user.email}</span>

                      {selectedUsers.some((u) => u._id === user._id) && (
                        <Check className="h-4 w-4 text-green-600" />
                      )}
                    </li>
                  ))
                )}
              </ul>
            </ul>
            <button
              disabled={shareLoading}
              onClick={async () => {
                if (!selectedUsers.length) return;

                try {
                  await shareWith({
                    fileId,
                    targetUserId: selectedUsers.map((u) => u._id),
                    permission: "view",
                  }).unwrap();

                  onClose(); // close immediately on success
                } catch (err) {
                  console.error(err);
                }
              }}
              className="cursor-pointer w-full bg-blue-600 text-white py-2 rounded-md text-sm"
            >
              {shareLoading ? (
                <div className="flex items-center gap-4">
                  <Loader2 className="animate-spin" />
                  <span>Sharing</span>
                </div>
              ) : isSuccess ? (
                "Shared"
              ) : (
                "Share"
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="my-5 border-t" />

          {/* Public Link Section */}
          <div className="space-y-3">
            <p className="text-sm text-slate-600">Anyone with the link</p>

            <button
              onClick={() => {}}
              className="w-full border py-2 rounded-md text-sm"
            >
              Generate Link
            </button>
          </div>

          {/* Body */}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ShareModel;
