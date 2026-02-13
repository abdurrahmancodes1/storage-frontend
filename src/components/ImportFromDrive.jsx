// import { google } from "googleapis";
import { Cloud } from "lucide-react";
import useDrivePicker from "react-google-drive-picker";

export default function ImportFromDrive({ key, setKey }) {
  const [openPicker] = useDrivePicker();

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

  const handleImport = async () => {
    const token = await getAccessToken(clientId);
    if (!token) return;

    openPicker({
      clientId,
      developerKey: apiKey,
      token,
      viewId: "DOCS",
      multiselect: true,
      supportDrives: true,
      callbackFunction: async (data) => {
        if (data.action === "picked") {
          if (!Array.isArray(data.docs)) return;
          await fetch(
            `${import.meta.env.VITE_BACKEND_BASE_URL}/api/drive/import`,
            {
              method: "POST",

              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                token,
                items: data.docs,
              }),
            },
          );
          setKey((value) => !value);
          console.log("SELECTED FILES:", data.docs);
        }
      },
    });
  };

  return (
    <div className="px-3 py-2">
      <button
        onClick={handleImport}
        className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                   border border-slate-200 bg-white hover:bg-slate-50
                   text-slate-700 shadow-sm transition-colors"
      >
        <Cloud className="h-4 w-4 text-blue-500" />
        Import from Google Drive
      </button>
    </div>
  );
}

// ---- GIS TOKEN (frontend-only, safe) ----
function getAccessToken(clientId) {
  return new Promise((resolve) => {
    google.accounts.oauth2
      .initTokenClient({
        client_id: clientId,
        scope: "https://www.googleapis.com/auth/drive.readonly",
        callback: (resp) => resolve(resp.access_token),
      })
      .requestAccessToken();
  });
}
