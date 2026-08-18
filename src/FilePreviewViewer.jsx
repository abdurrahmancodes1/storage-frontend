import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const FilePreviewViewer = ({ url, name, extension }) => {
  const ext = extension.toLowerCase();

  const [numPages, setNumPages] = useState(null);

  const isImage = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"].includes(
    ext,
  );

  const isPdf = ext === ".pdf";

  const isVideo = [".mp4", ".webm", ".ogg", ".mov"].includes(ext);

  const isAudio = [".mp3", ".wav", ".ogg", ".m4a"].includes(ext);

  // -----------------------------
  // PDF
  // -----------------------------

  if (isPdf) {
    return (
      <div className="min-h-[calc(100vh-190px)] bg-slate-100 p-3 sm:p-6">
        <Document
          file={url}
          onLoadSuccess={({ numPages }) => {
            setNumPages(numPages);
          }}
          onLoadError={(error) => {
            console.error("PDF loading error:", error);
          }}
          loading={
            <div className="flex min-h-[500px] items-center justify-center">
              <p className="text-sm text-slate-500">Loading PDF...</p>
            </div>
          }
          error={
            <div className="flex min-h-[500px] items-center justify-center">
              <div className="text-center">
                <h2 className="font-semibold text-slate-700">
                  Unable to preview PDF
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Try downloading the file instead.
                </p>
              </div>
            </div>
          }
          className="flex flex-col items-center gap-4"
        >
          {Array.from(new Array(numPages), (_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              width={Math.min(window.innerWidth - 32, 900)}
              renderTextLayer
              renderAnnotationLayer
            />
          ))}
        </Document>
      </div>
    );
  }

  // -----------------------------
  // Images
  // -----------------------------

  if (isImage) {
    return (
      <div className="flex min-h-[calc(100vh-190px)] items-center justify-center bg-slate-100 p-6">
        <img
          src={url}
          alt={name}
          className="max-h-[calc(100vh-240px)] max-w-full rounded-lg object-contain shadow-sm"
        />
      </div>
    );
  }

  // -----------------------------
  // Video
  // -----------------------------

  if (isVideo) {
    return (
      <div className="flex min-h-[calc(100vh-190px)] items-center justify-center bg-slate-950 p-4">
        <video
          src={url}
          controls
          playsInline
          preload="metadata"
          className="max-h-[calc(100vh-220px)] max-w-full rounded-xl"
        />
      </div>
    );
  }

  // -----------------------------
  // Audio
  // -----------------------------

  if (isAudio) {
    return (
      <div className="flex min-h-[calc(100vh-190px)] items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-blue-50">
            <svg
              className="h-10 w-10 text-blue-600"
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

  // -----------------------------
  // Unsupported
  // -----------------------------

  return (
    <div className="flex min-h-[calc(100vh-190px)] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50">
          <svg
            className="h-9 w-9 text-blue-600"
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

        <p className="mt-2 text-sm text-slate-500">
          This file type cannot be previewed in StorageApp.
        </p>
      </div>
    </div>
  );
};

export default FilePreviewViewer;
