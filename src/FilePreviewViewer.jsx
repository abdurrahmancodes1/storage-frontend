const FilePreviewViewer = ({ url, name, extension }) => {
  const ext = extension.toLowerCase();

  const isImage = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"].includes(
    ext,
  );

  const isPdf = ext === ".pdf";

  const isVideo = [".mp4", ".webm", ".ogg", ".mov"].includes(ext);

  const isAudio = [".mp3", ".wav", ".ogg", ".m4a"].includes(ext);

  if (isImage) {
    return (
      <div className="flex min-h-[calc(100vh-190px)] items-center justify-center bg-[#f1f5f9] p-6">
        <img
          src={url}
          alt={name}
          className="max-h-[calc(100vh-240px)] max-w-full rounded-lg object-contain shadow-sm"
        />
      </div>
    );
  }

  if (isPdf) {
    return (
      <iframe
        src={url}
        title={name}
        className="block h-[calc(100vh-180px)] w-full border-0"
      />
    );
  }

  if (isVideo) {
    return (
      <div className="flex min-h-[calc(100vh-190px)] items-center justify-center bg-[#0f172a]">
        <video
          src={url}
          controls
          className="max-h-[calc(100vh-220px)] max-w-full rounded-xl"
        />
      </div>
    );
  }

  if (isAudio) {
    return (
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
    );
  }

  return (
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 3v6h5" />
          </svg>
        </div>

        <h2 className="mt-5 text-lg font-semibold">Preview unavailable</h2>

        <p className="mt-2 text-sm text-[#64748b]">
          This file type cannot be previewed in StorageApp.
        </p>
      </div>
    </div>
  );
};

export default FilePreviewViewer;
