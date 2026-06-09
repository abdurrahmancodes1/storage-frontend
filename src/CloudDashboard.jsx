import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Search, Bell, Menu, ArrowUp } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useNavigate, useParams } from "react-router-dom";
import CreateDirectoryModal from "./components/CreateDirectoryModal";
import RenameModal from "./components/RenameModal";
import { DeleteConfirmModal } from "./components/DeleteConfirmModal";
import { createPortal } from "react-dom";
import { uploadComplete, uploadInitiate } from "./apis/fileApi";
import InspectorPanel from "./layouts/InspectorPanel";
import ShareModel from "./components/ShareModel";
import Toolbar from "./components/Toolbar";
import FileGrid from "./components/FileGrid";
import Sidebar from "./components/Sidebar";
import { useSharedWithMeQuery } from "./apis/authApi";
import Avatar from "./components/ui/Avatar";

// --- Utility: Class Merger ---

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("files");
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameType, setRenameType] = useState(null); // "directory" or "file"
  const [renameId, setRenameId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("Guest User");
  const [userEmail, setUserEmail] = useState("guest@example.com");
  // if (isLoading) return;
  const { data: sharedFiles = [], isLoading: sharedLoading } =
    useSharedWithMeQuery(undefined, {
      skip: activeTab !== "shared",
    });

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
  const [directoryName, setDirectoryName] = useState("Home");
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
      if (activeTab === "shared") {
        setDirectoryName("Shared With Me");
      } else {
        setDirectoryName(dirId ? data.name : "Home");
      }
      // Reverse directories and files so new items show on top
      setDirectoriesList([...data.directories].reverse());
      setFilesList([...data.files].reverse());
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  // Reset context menu
  useEffect(() => {
    switch (activeTab) {
      case "files":
        getDirectoryItems();
        break;
    }
  }, [activeTab, dirId]);

  const combinedItems = useMemo(() => {
    if (activeTab === "shared") {
      console.log(sharedFiles);
      return sharedFiles.map((f) => ({
        ...f,
        isDirectory: false,
      }));
    }

    return [
      ...directoriesList.map((d) => ({ ...d, isDirectory: true })),
      ...filesList.map((f) => ({ ...f, isDirectory: false })),
    ];
  }, [activeTab, sharedFiles, directoriesList, filesList]);

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
  const [shareModel, setShareModel] = useState(false);
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
        navigate("/login");
      } else {
        console.error("Error fetching user info:", response.status);
      }
    } catch (err) {
      console.error("Error fetching user info:", err);
    }
  }
  useEffect(() => {
    fetchUser();
  }, [BASE_URL]);

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

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        fileInputRef={fileInputRef}
        handleFileSelect={handleFileSelect}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        storageUsed={storageUsed}
        maxStorage={maxStorage}
        formatFileSize={formatFileSize}
      />
      {/* --- Main Content --- */}
      <main className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Top Bar */}
        <header className="h-16 border-b border-slate-200 flex items-center justify-between px-4 gap-4 bg-white z-10">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1 hover:bg-slate-100 rounded-lg text-slate-500"
            >
              <Menu className="h-5 w-5" />
            </button>
            {/* ✅ CURRENT DIRECTORY NAME */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <button
                onClick={() => navigate(-1)}
                className="p-1 rounded-lg text-slate-500 hover:bg-slate-100"
                title="Go back"
              >
                <ArrowUp className="h-5 w-5" />
              </button>

              <div className="flex flex-col min-w-0">
                <h1 className="text-sm sm:text-sm font-semibold text-slate-900 truncate">
                  {directoryName}
                </h1>
                <span className="text-xs text-slate-400">
                  {combinedItems.length} items
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`relative   md:block group flex-1 max-w-sm  ${isSidebarOpen ? "hidden" : ""} `}
            >
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`h-9 w-64 pl-9 pr-4 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400`}
              />
            </div>

            {/* <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button> */}
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

        <Toolbar
          selection={selection}
          viewMode={viewMode}
          shareModel={shareModel}
          openDeleteModal={openDeleteModal}
          setIsViewSwitching={setIsViewSwitching}
          setViewMode={setViewMode}
          setShareModel={setShareModel}
          openRenameModal={openRenameModal}
          combinedItems={combinedItems}
          setShowInspector={setShowInspector}
          setShowCreateDirModal={setShowCreateDirModal}
          activeTab={activeTab}
        />

        <FileGrid
          combinedItems={combinedItems}
          setSelection={setSelection}
          fileInputRef={fileInputRef}
          viewMode={viewMode}
          selection={selection}
          formatFileSize={formatFileSize}
          setShowCreateDirModal={setShowCreateDirModal}
          toggleSelection={toggleSelection}
          setShowInspector={setShowInspector}
          progressMap={progressMap}
          activeTab={activeTab}
        />
      </main>

      {/* --- Inspector Panel (Right) --- */}
      <AnimatePresence>
        {showInspector && selectedItem && (
          <InspectorPanel
            selectedItem={selectedItem}
            formatFileSize={formatFileSize}
            formatDate={formatDate}
            setSelection={setSelection}
            activeTab={activeTab}
            sharedFiles={sharedFiles}
          />
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

      {shareModel && selectedItem && (
        <ShareModel
          onClose={() => setShareModel(false)}
          fileId={selectedItem.id}
          fileName={selectedItem.name}
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
    </div>
  );
}
