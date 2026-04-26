import { useEffect, useState } from "react";
import {
  useAllUsersQuery,
  useChangeUserRoleMutation,
  useDeactivateUserMutation,
  useDeleteUserMutation,
} from "./apis/adminApi";
import Loader from "./Loader";
import { Loader2, Trash2, RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { formatFileSize } from "./utils/formatFileSize";
import ProgressBar from "./components/ui/ProgressBar";
export default function UsersPage() {
  const [role, setRole] = useState("");
  const [refetch, setRefetch] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/user`,
          { credentials: "include" },
        );
        if (response.ok) {
          const data = await response.json();
          setRole(data.role);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchUser();
  }, [refetch]);
  const [userToDeactivate, setUserToDeactivate] = useState(null);
  const [useRoleChange, setUserChangeRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const { data: usersData, isLoading } = useAllUsersQuery();
  const users = usersData?.users || [];
  const [
    deactivateUser,
    { isLoading: isDeactivating, isSuccess: successDeactivated },
  ] = useDeactivateUserMutation();
  const [changeUserRole, { isLoading: isChangingRole }] =
    useChangeUserRoleMutation();
  console.log(users);
  const [deleteUser, { isLoading: deleteLoading }] = useDeleteUserMutation();

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-slate-50 px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800">
            User Management
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Manage user access, sessions and storage limits
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => {
            const used = formatFileSize(user.storageUsed) || 5;
            const total = formatFileSize(user.maxStorageLimit) || 100;
            const percent = Math.min((used / total) * 100, 100);

            return (
              <div
                key={user._id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 p-7"
              >
                {/* Top Section */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center font-semibold text-slate-700 text-base">
                      {user.name?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 text-base">
                        {user.name}
                      </h3>
                      <p className="text-sm text-slate-500 truncate max-w-[180px]">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium
                      ${
                        user.role === "Admin"
                          ? "bg-purple-100 text-purple-700"
                          : user.role === "Manager"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-100 text-slate-600"
                      }`}
                  >
                    {user.role}
                  </span>
                </div>

                {/* Storage */}
                <div className="mt-7">
                  <div className="flex justify-between text-xs text-slate-500 mb-2">
                    <span>Storage Usage</span>
                    <span>
                      {used} / {total}
                    </span>
                  </div>
                  <ProgressBar value={percent} />
                </div>

                <div className="flex items-center justify-between mt-7 text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        user.isLoggedIn ? "bg-green-500" : "bg-slate-400"
                      }`}
                    />
                    <span className="text-slate-600">
                      {user.isLoggedIn ? "Online" : "Offline"}
                    </span>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                      ${
                        user.deleted
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-700"
                      }`}
                  >
                    {user.deleted ? "Deactivated" : "Active"}
                  </span>
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-col gap-3">
                  {/* Change Role */}
                  <button
                    onClick={() => setUserChangeRole(user)}
                    className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white text-sm py-2.5 rounded-lg transition"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Change Role
                  </button>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setUserToDeactivate(user)}
                      className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm py-2.5 rounded-lg transition"
                    >
                      Deactivate
                    </button>

                    <button
                      onClick={() => setUserToDelete(user)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm py-2.5 rounded-lg transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {useRoleChange && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="w-full max-w-md bg-white rounded-2xl shadow-xl"
            >
              {/* Header */}
              <div className="px-6 py-6 border-b">
                <h2 className="text-lg font-semibold text-slate-800">
                  Change User Role
                </h2>
              </div>

              {/* Body */}
              <div className="px-6 py-6 space-y-4">
                <p className="text-sm text-slate-600">
                  Assign new role to{" "}
                  <span className="font-semibold text-slate-900">
                    {useRoleChange?.name}
                  </span>
                </p>

                {["User", "Manager", "Admin"].map((role) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`w-full py-2.5 rounded-lg text-sm font-medium transition border
                ${
                  selectedRole === role
                    ? "bg-slate-800 text-white border-slate-800"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-transparent"
                }`}
                  >
                    {role}
                  </button>
                ))}
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 px-6 py-5 bg-slate-50 rounded-b-2xl">
                <button
                  onClick={() => {
                    setUserChangeRole(null);
                    setSelectedRole("");
                  }}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-200 transition"
                >
                  Cancel
                </button>

                <button
                  disabled={
                    !selectedRole ||
                    selectedRole === useRoleChange?.role ||
                    isChangingRole
                  }
                  onClick={async () => {
                    await changeUserRole({
                      id: useRoleChange._id,
                      role: selectedRole,
                    });
                    setUserChangeRole(null);
                    setSelectedRole("");
                  }}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-800 text-white hover:bg-slate-900 transition inline-flex items-center gap-2 disabled:opacity-50"
                >
                  {isChangingRole ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Changing
                    </>
                  ) : (
                    "Confirm"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}

      {userToDeactivate && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="w-full max-w-md bg-white rounded-2xl shadow-xl"
            >
              <div className="px-6 py-6 border-b">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-red-50 rounded-full flex items-center justify-center">
                    <Trash2 className="h-5 w-5 text-red-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-800">
                    Deactivate User
                  </h2>
                </div>
              </div>

              <div className="px-6 py-6 text-sm text-slate-600">
                Are you sure you want to deactivate{" "}
                <span className="font-semibold text-slate-900">
                  {userToDeactivate?.name}?
                  <p>User will not to able access his/her account .</p>
                </span>
              </div>

              <div className="flex justify-end gap-3 px-6 py-5 bg-slate-50 rounded-b-2xl">
                <button
                  onClick={() => setUserToDeactivate(null)}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-200 transition"
                >
                  Cancel
                </button>

                <button
                  disabled={isDeactivating}
                  onClick={async () => {
                    await deactivateUser(userToDeactivate?._id);
                    setTimeout(() => {
                      setUserToDeactivate(null);
                    }, 200);
                  }}
                  className={`${successDeactivated ? "bg-blue-600" : "bg-red-600"} px-4 py-2.5 rounded-lg text-sm font-medium  text-white hover:bg-red-700 transition inline-flex items-center gap-2`}
                >
                  {successDeactivated ? (
                    isDeactivating ? (
                      <div className="flex items-center ">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Deactivating</span>
                      </div>
                    ) : (
                      "Deactivate"
                    )
                  ) : (
                    "Deactivated"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
      {/* Delete Modal */}
      {userToDelete && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="w-full max-w-md bg-white rounded-2xl shadow-xl"
            >
              <div className="px-6 py-6 border-b">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-red-50 rounded-full flex items-center justify-center">
                    <Trash2 className="h-5 w-5 text-red-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-800">
                    Delete User
                  </h2>
                </div>
              </div>

              <div className="px-6 py-6 text-sm text-slate-600">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-slate-900">
                  {userToDelete?.name}
                </span>
                ?
                <p className="mt-3 text-xs text-red-500">
                  This action cannot be undone.
                </p>
              </div>

              <div className="flex justify-end gap-3 px-6 py-5 bg-slate-50 rounded-b-2xl">
                <button
                  onClick={() => setUserToDelete(null)}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-200 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={async () => {
                    await deleteUser(userToDelete._id);
                    setUserToDelete(null);
                  }}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition inline-flex items-center gap-2"
                >
                  {deleteLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Deleting
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
