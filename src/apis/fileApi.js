import axios from "axios";
export const uploadInitiate = async (fileData) => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/file/upload/initiate`,
    fileData,
    {
      withCredentials: true,
    },
  );
  return data;
};
export const uploadComplete = async (fileId) => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/file/upload/complete`,
    { fileId },
    {
      withCredentials: true,
    },
  );
  return data;
};
