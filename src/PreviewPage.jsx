import { useParams, useNavigate } from "react-router-dom";
import { useGetFilePreviewQuery } from "./apis/fileApi2";

const PreviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetFilePreviewQuery(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-[#111827]">
        <header className="border-b border-[#e5e7eb] bg-white">
          <div className="mx-auto flex h-[90px] max-w-[1360px] items-center justify-between px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563eb]">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 15.5V9a2 2 0 012-2h3.5l2-2h4L16.5 7H19a2 2 0 012 2v6.5a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                  />
                </svg>
              </div>

              <span className="text-xl font-semibold text-[#172033]">
                StorageApp
              </span>
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-xl bg-[#2563eb] px-5 py-3 font-medium text-white transition hover:bg-[#1d4ed8]"
            >
              Dashboard
            </button>
          </div>
        </header>

        <main className="flex min-h-[calc(100vh-90px)] items-center justify-center">
          <div className="text-[#64748b]">Loading preview...</div>
        </main>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <header className="border-b border-[#e5e7eb] bg-white">
          <div className="mx-auto flex h-[90px] max-w-[1360px] items-center justify-between px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563eb]">
                <span className="text-xl text-white">☁</span>
              </div>

              <span className="text-xl font-semibold text-[#172033]">
                StorageApp
              </span>
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-xl bg-[#2563eb] px-5 py-3 font-medium text-white"
            >
              Dashboard
            </button>
          </div>
        </header>

        <main className="flex min-h-[calc(100vh-90px)] items-center justify-center">
          <div className="rounded-2xl border border-[#e2e8f0] bg-white px-10 py-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-[#172033]">
              Unable to preview file
            </h2>

            <p className="mt-2 text-[#64748b]">The file could not be loaded.</p>

            <button
              onClick={() => navigate("/dashboard")}
              className="mt-6 rounded-xl bg-[#2563eb] px-5 py-3 font-medium text-white"
            >
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  const { url, name, extension } = data;

  const ext = extension.toLowerCase();

  const isImage = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"].includes(
    ext,
  );

  const isPdf = ext === ".pdf";

  const isVideo = [".mp4", ".webm", ".ogg", ".mov"].includes(ext);

  const isAudio = [".mp3", ".wav", ".ogg", ".m4a"].includes(ext);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#172033]">
      {/* Header */}
      <header className="border-b border-[#e5e7eb] bg-white">
        <div className="mx-auto flex h-[90px] max-w-[1360px] items-center justify-between px-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563eb]">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 18a4 4 0 01-.88-7.903A5 5 0 0116.9 8.1 4.5 4.5 0 0117 17H7z"
                />
              </svg>
            </div>

            <span className="text-xl font-semibold text-[#172033]">
              StorageApp
            </span>
          </div>

          {/* Right side */}
          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-xl bg-[#2563eb] px-5 py-3 font-medium text-white transition hover:bg-[#1d4ed8]"
          >
            Dashboard
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-[1500px] px-6 py-5">
        {/* Top bar */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex shrink-0 items-center gap-2 text-sm font-medium text-[#64748b] transition hover:text-[#2563eb]"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </button>

            <div className="h-5 w-px bg-[#e2e8f0]" />

            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold text-[#172033]">
                {name}
              </h1>

              <p className="text-xs text-[#64748b]">
                {extension.toUpperCase().replace(".", "")} Document
              </p>
            </div>
          </div>

          {/* Download */}
          <a
            href={`${import.meta.env.VITE_BACKEND_BASE_URL}/file/${id}?action=download`}
            className="flex shrink-0 items-center gap-2 rounded-xl bg-[#2563eb] px-5 py-3 font-medium text-white transition hover:bg-[#1d4ed8]"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v12m0 0l4-4m-4 4l-4-4M5 21h14"
              />
            </svg>
            Download
          </a>
        </div>

        {/* Preview */}
        <div className="overflow-hidden rounded-2xl border border-[#dfe5ee] bg-white shadow-sm">
          {isImage && (
            <div className="flex min-h-[calc(100vh-190px)] items-center justify-center bg-[#f1f5f9] p-6">
              <img
                src={url}
                alt={name}
                className="max-h-[calc(100vh-240px)] max-w-full rounded-lg object-contain shadow-sm"
              />
            </div>
          )}

          {isPdf && (
            <iframe
              src={url}
              title={name}
              className="block h-[calc(100vh-180px)] w-full border-0"
            />
          )}

          {isVideo && (
            <div className="flex min-h-[calc(100vh-190px)] items-center justify-center bg-[#0f172a]">
              <video
                src={url}
                controls
                className="max-h-[calc(100vh-220px)] max-w-full"
              />
            </div>
          )}

          {isAudio && (
            <div className="flex min-h-[calc(100vh-190px)] items-center justify-center">
              <div className="flex flex-col items-center gap-6">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-[#eff6ff]">
                  <svg
                    className="h-10 w-10 text-[#2563eb]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 19V6l12-3v13M9 19a3 3 0 11-6 0 3 3 0 016 0zm12-3a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>

                <p className="font-medium">{name}</p>

                <audio src={url} controls />
              </div>
            </div>
          )}

          {!isImage && !isPdf && !isVideo && !isAudio && (
            <div className="flex min-h-[calc(100vh-190px)] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#eff6ff]">
                  <svg
                    className="h-9 w-9 text-[#2563eb]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 3h7l5 5v13H7a2 2 0 01-2-2V5a2 2 0 012-2z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 3v6h5"
                    />
                  </svg>
                </div>

                <h2 className="mt-5 text-lg font-semibold">
                  Preview unavailable
                </h2>

                <p className="mt-2 text-sm text-[#64748b]">
                  This file type cannot be previewed in StorageApp.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PreviewPage;
