import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Search,
  Plus,
  Folder,
  FileText,
  Image as ImageIcon,
  MoreHorizontal,
  Settings,
  Trash2,
  Cloud,
  Star,
  ChevronRight,
  ArrowUp,
  LayoutGrid,
  List as ListIcon,
  Info,
  Download,
  Share2,
  X,
  Bell,
  Menu,
  CheckCircle2,
  HardDrive,
  LogOut,
  Loader2,
  File,
  FileCode,
  Video,
  Upload,
  FolderOpen,
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useNavigate, useParams } from "react-router-dom";
import ImportFromDrive from "./components/ImportFromDrive";
import CreateDirectoryModal from "./components/CreateDirectoryModal";
import RenameModal from "./components/RenameModal";
import { DeleteConfirmModal } from "./components/DeleteConfirmModal";
import { createPortal } from "react-dom";
import { uploadComplete, uploadInitiate } from "./apis/fileApi";

// --- Utility: Class Merger ---
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

function UserMenuPortal({ anchorRef, open, children }) {
  if (!open || !anchorRef.current) return null;

  const rect = anchorRef.current.getBoundingClientRect();

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: rect.bottom + 12,
        right: window.innerWidth - rect.right,
        zIndex: 9999,
      }}
    >
      {children}
    </div>,
    document.body,
  );
}

const Button = ({
  className,
  variant = "default",
  size = "default",
  children,
  loading,
  ...props
}) => {
  const variants = {
    default:
      "bg-blue-600 text-white hover:bg-blue-700 shadow-sm border border-transparent",
    outline:
      "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700",
    ghost: "hover:bg-slate-100 text-slate-600 hover:text-slate-900",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100",
  };
  const sizes = {
    default: "h-9 px-4 py-2",
    sm: "h-8 px-3 text-xs",
    icon: "h-9 w-9 p-0 flex items-center justify-center",
  };
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={loading}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};

const Avatar = ({ src, fallback }) => (
  <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
    {src ? (
      <img src={src} alt="Avatar" className="h-full w-full object-cover" />
    ) : (
      <span className="text-xs font-semibold text-slate-600">{fallback}</span>
    )}
  </div>
);

const ProgressBar = ({ value, max, className }) => (
  <div
    className={cn(
      "h-1.5 w-full bg-slate-100 rounded-full overflow-hidden",
      className,
    )}
  >
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${(value / max) * 100}%` }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="h-full bg-blue-600 rounded-full"
    />
  </div>
);

const Badge = ({ children, className }) => (
  <span
    className={cn(
      "px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wide",
      className,
    )}
  >
    {children}
  </span>
);
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
const Toast = ({ message, visible, onClose }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl"
      >
        <CheckCircle2 className="h-5 w-5 text-green-400" />
        <span className="text-sm font-medium">{message}</span>
        <button onClick={onClose} className="ml-2 hover:text-slate-300">
          <X className="h-4 w-4" />
        </button>
      </motion.div>
    )}
  </AnimatePresence>
);

// --- Main Application ---
export default function CloudDashboard() {
  // State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  // { id, isDirectory, name }

  // Stack of folder IDs
  const [selection, setSelection] = useState([]); // Array of IDs
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("files");
  const [toast, setToast] = useState({ show: false, message: "" });
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameType, setRenameType] = useState(null); // "directory" or "file"
  const [renameId, setRenameId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("Guest User");
  const [userEmail, setUserEmail] = useState("guest@example.com");

  const userMenuRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function openRenameModal(type, id, currentName) {
    setRenameType(type);
    setRenameId(id);
    setRenameValue(currentName);
    setShowRenameModal(true);
  }
  const openDeleteModal = () => {
    if (selection.length === 0) return;

    // only support single delete for now (safe UX)
    if (selection.length === 1) {
      const item = combinedItems.find((i) => i.id === selection[0]);
      if (!item) return;

      setDeleteTarget({
        id: item.id,
        isDirectory: item.isDirectory,
        name: item.name,
      });
      setShowDeleteModal(true);
    }
  };
  async function handleDeleteFile(id) {
    setErrorMessage("");
    try {
      const response = await fetch(`${BASE_URL}/file/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      getDirectoryItems();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function handleDeleteDirectory(id) {
    setErrorMessage("");
    try {
      const response = await fetch(`${BASE_URL}/directory/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      getDirectoryItems();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    try {
      if (deleteTarget.isDirectory) {
        await handleDeleteDirectory(deleteTarget.id);
      } else {
        await handleDeleteFile(deleteTarget.id);
      }
    } finally {
      setShowDeleteModal(false);
      setDeleteTarget(null);
      setSelection([]);
    }
  }

  async function handleRenameSubmit(e) {
    e.preventDefault();
    setErrorMessage("");
    try {
      const url =
        renameType === "file"
          ? `${BASE_URL}/file/${renameId}`
          : `${BASE_URL}/directory/${renameId}`;
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          renameType === "file"
            ? { newFilename: renameValue }
            : { newDirName: renameValue },
        ),
        credentials: "include",
      });

      setShowRenameModal(false);
      setRenameValue("");
      setRenameType(null);
      setRenameId(null);
      getDirectoryItems();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
  const { dirId } = useParams();
  const navigate = useNavigate();
  const [directoryName, setDirectoryName] = useState("My Drive");
  const [directoriesList, setDirectoriesList] = useState([]);
  const [filesList, setFilesList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  async function getDirectoryItems() {
    setErrorMessage(""); // clear any existing error
    try {
      const response = await fetch(`${BASE_URL}/directory/${dirId || ""}`, {
        credentials: "include",
      });

      if (response.status === 401) {
        navigate("/login");
        return;
      }
      const data = await response.json();

      // Set directory name
      setDirectoryName(dirId ? data.name : "My Drive");
      // Reverse directories and files so new items show on top
      setDirectoriesList([...data.directories].reverse());
      setFilesList([...data.files].reverse());
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  useEffect(() => {
    getDirectoryItems();
    // Reset context menu
  }, [dirId]);
  const combinedItems = [
    ...directoriesList.map((d) => ({ ...d, isDirectory: true })),
    ...filesList.map((f) => ({ ...f, isDirectory: false })),
  ];
  console.log("comnined data", combinedItems);
  // Actions

  function handleRowClick(type, id) {
    console.log("I am called");
    if (type === "directory") {
      navigate(`/directory/${id}`);
    } else {
      window.location.href = `${BASE_URL}/file/${id}`;
    }
  }
  const [newDirname, setNewDirname] = useState("New Folder");
  const [showCreateDirModal, setShowCreateDirModal] = useState(false);

  const fileInputRef = useRef(null);
  const [progressMap, setProgressMap] = useState({}); // track progress per item
  const [isViewSwitching, setIsViewSwitching] = useState(false);

  async function handleCreateDirectory(e) {
    e.preventDefault();
    setErrorMessage("");
    try {
      const response = await fetch(`${BASE_URL}/directory/${dirId || ""}`, {
        method: "POST",
        headers: {
          dirname: newDirname,
        },
        credentials: "include",
      });
      setNewDirname("New Folder");
      setShowCreateDirModal(false);
      getDirectoryItems();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }
  const handleLogout = async () => {
    try {
      const response = await fetch(`${BASE_URL}/user/logout`, {
        method: "POST",
        credentials: "include",
      });
      console.log("I am called");
      if (response.ok) {
        console.log("Logged out successfully");
        // Optionally reset local state
        setLoggedIn(false);

        navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setShowUserMenu(false);
    }
  };
  const handleLogoutFromALl = async () => {
    try {
      const response = await fetch(`${BASE_URL}/user/logout-all`, {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        console.log("Logged out successfully");
        // Optionally reset local state
        setLoggedIn(false);
        setUserName("Guest User");
        setUserEmail("guest@example.com");
        navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setShowUserMenu(false);
    }
  };
  async function handleFileSelect(e) {
    console.log("Im am called");
    const file = e.target.files?.[0];
    if (!file) return;

    const tempId = `temp-${Date.now()}`;

    const newItem = {
      file,
      name: file.name,
      size: file.size,
      id: tempId,
      isUploading: true,
    };
    const data = await uploadInitiate({
      name: file.name,
      size: file.size,
      contentType: file.type,
      parentDirId: dirId || "",
    });
    const { uploadSignedUrl, fileId } = data;

    setFilesList((prev) => [newItem, ...prev]);
    setProgressMap((prev) => ({ ...prev, [tempId]: 0 }));

    uploadSingleFile({ item: newItem, uploadUrl: uploadSignedUrl, fileId });
    // Clear file input so the same file can be chosen again if needed
    e.target.value = "";

    // Start uploading queue if not already uploading
  }
  function uploadSingleFile({ item, uploadUrl, fileId }) {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", item.file.type);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = (e.loaded / e.total) * 100;
        setProgressMap((prev) => ({
          ...prev,
          [item.id]: percent,
        }));
      }
    };
    xhr.onload = async () => {
      if (xhr.status === 200) {
        const fileUploadResponse = await uploadComplete(fileId);
        setFilesList((prev) =>
          prev.map((f) =>
            f.id === item.id
              ? {
                  ...f,
                  id: fileId,
                  isUploading: false,
                }
              : f,
          ),
        );
      }

      getDirectoryItems();
      fetchUser();
    };
    xhr.onerror = () => {
      console.error("Upload failed");
    };
    xhr.send(item.file);
  }

  const [storageUsed, setStorageUsed] = useState(0);
  const [maxStorage, setMaxStorage] = useState(0);
  async function fetchUser() {
    try {
      const response = await fetch(`${BASE_URL}/user`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data, "i am called");
        setStorageUsed(data.storageUsed);
        setMaxStorage(data.maxStorageLimit);
        setUserName(data.name);
        setUserEmail(data.email);
        setLoggedIn(true);
      } else if (response.status === 401) {
        // User not logged in
        setUserName("Guest User");
        setUserEmail("guest@example.com");
        setLoggedIn(false);
      } else {
        // Handle other error statuses if needed
        console.error("Error fetching user info:", response.status);
      }
    } catch (err) {
      console.error("Error fetching user info:", err);
    }
  }
  useEffect(() => {
    fetchUser();
  }, [BASE_URL, []]);

  const selectedItem =
    selection.length === 1
      ? combinedItems.find((item) => item.id === selection[0])
      : null;

  const toggleSelection = (id, multi) => {
    if (multi) {
      setSelection((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
      );
    } else {
      setSelection([id]);
    }
  };
  const [showInspector, setShowInspector] = useState(false);

  function formatFileSize(bytes) {
    if (!bytes && bytes !== 0) return "--";
    const units = ["B", "KB", "MB", "GB"];
    let i = 0;
    let size = bytes;
    while (size >= 1024 && i < units.length - 1) {
      size /= 1024;
      i++;
    }
    return `${size.toFixed(size < 10 ? 1 : 0)} ${units[i]}`;
  }

  function formatDate(date) {
    if (!date) return "--";
    return new Date(date).toLocaleDateString();
  }
  const handleUserIconClick = () => {
    setShowUserMenu((prev) => !prev);
  };
  return (
    <div className="flex h-screen bg-white text-slate-900 font-sans overflow-hidden">
      {/* --- Sidebar --- */}
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

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {[
            { id: "files", icon: HardDrive, label: "My Files" },
            { id: "shared", icon: Share2, label: "Shared (Upcoming)" },
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

      {/* --- Main Content --- */}
      <main className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Top Bar */}
        <header className="h-16 border-b border-slate-200 flex items-center justify-between px-4 gap-4 bg-white z-10">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
            >
              <Menu className="h-5 w-5" />
            </button>
            {/* ✅ CURRENT DIRECTORY NAME */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
                title="Go back"
              >
                <ArrowUp className="h-5 w-5" />
              </button>

              <div className="flex flex-col min-w-0">
                <h1 className="text-lg font-semibold text-slate-900 truncate">
                  {directoryName}
                </h1>
                <span className="text-xs text-slate-400">
                  {combinedItems.length} items
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block group">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-64 pl-9 pr-4 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
              />
            </div>

            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>
            <div className="h-6 w-px bg-slate-200 mx-1"></div>
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={handleUserIconClick}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100"
              >
                <Avatar fallback={userName[0] || "U"} />
              </button>

              <UserMenuPortal anchorRef={userMenuRef} open={showUserMenu}>
                <div className="w-64 rounded-xl border border-slate-200 bg-white shadow-lg">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-900">
                      {userName}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {userEmail}
                    </p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100"
                    >
                      Logout
                    </button>
                    <button
                      onClick={handleLogoutFromALl}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Logout from all devices
                    </button>
                  </div>
                </div>
              </UserMenuPortal>
            </div>
          </div>
        </header>

        {/* Toolbar */}
        <div className="h-12 border-b border-slate-100 flex items-center justify-between px-4 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCreateDirModal(true)}
            >
              <Folder className="h-4 w-4 mr-2 text-blue-500" /> New Folder
            </Button>

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

            {selection.length > 0 && (
              <>
                <div className="h-4 w-px bg-slate-200 mx-2"></div>
                {selection.length === 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-600"
                    onClick={() => {
                      const item = combinedItems.find(
                        (i) => i.id === selection[0],
                      );
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
                <Button variant="ghost" size="sm" className="text-slate-600">
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

        {/* File Grid/List Area */}
        <div
          className="flex-1 overflow-y-auto p-4 md:p-6 relative"
          onClick={() => setSelection([])} // Deselect on click bg
        >
          {combinedItems.length === 0 ? (
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
                    handleRowClick(
                      file.isDirectory ? "directory" : "file",
                      file.id,
                    )
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
      </main>

      {/* --- Inspector Panel (Right) --- */}
      <AnimatePresence>
        {showInspector && selectedItem && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-80 bg-white border-l border-slate-200 shadow-xl z-20 flex flex-col"
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
                    <p className="text-sm text-slate-700 mt-1">You</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full">
                  Download
                </Button>
                <Button className="w-full">Share</Button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
      {showCreateDirModal && (
        <CreateDirectoryModal
          newDirname={newDirname}
          setNewDirname={setNewDirname}
          onClose={() => setShowCreateDirModal(false)}
          onCreateDirectory={handleCreateDirectory}
        />
      )}

      {showRenameModal && (
        <RenameModal
          renameType={renameType}
          renameValue={renameValue}
          setRenameValue={setRenameValue}
          onClose={() => setShowRenameModal(false)}
          onRenameSubmit={handleRenameSubmit}
        />
      )}
      {showDeleteModal && (
        <DeleteConfirmModal
          name={deleteTarget?.name}
          isDirectory={deleteTarget?.isDirectory}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
        />
      )}

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        visible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}
