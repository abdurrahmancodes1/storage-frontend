import { useParams } from "react-router-dom";
import { useGetPublicFileQuery } from "./apis/fileApi2";
import FilePreviewViewer from "./FilePreviewViewer";
import Loader from "./Loader";

const PublicSharePage = () => {
  const { token } = useParams();

  const { data, isLoading, isError } = useGetPublicFileQuery(token);

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <div className="rounded-2xl border bg-white px-10 py-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold">Unable to access this file</h2>

          <p className="mt-2 text-[#64748b]">
            This link may have been revoked or expired.
          </p>
        </div>
      </div>
    );
  }

  const { url, name, extension } = data;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#172033]">
      {/* Header */}
      <header className="border-b border-[#e5e7eb] bg-white">
        <div className="mx-auto flex h-[90px] max-w-[1360px] items-center px-8">
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

            <span className="text-xl font-semibold">StorageApp</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-6 py-5">
        {/* File information */}
        <div className="mb-4 flex items-center justify-between">
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold">{name}</h1>

            <p className="text-xs text-[#64748b]">
              {extension.toUpperCase().replace(".", "")} Document
            </p>
          </div>

          <a
            href={`${import.meta.env.VITE_BACKEND_BASE_URL}/share/${token}?action=download`}
            className="flex shrink-0 items-center gap-2 rounded-xl bg-[#2563eb] px-5 py-3 font-medium text-white transition hover:bg-[#1d4ed8]"
          >
            Download
          </a>
        </div>

        {/* Viewer */}
        <div className="overflow-hidden rounded-2xl border border-[#dfe5ee] bg-white shadow-sm">
          <FilePreviewViewer url={url} name={name} extension={extension} />
        </div>
      </main>
    </div>
  );
};

export default PublicSharePage;
