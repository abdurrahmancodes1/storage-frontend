import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const fileApi = createApi({
  reducerPath: "fileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_BASE_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getFilePreview: builder.query({
      query: (id) => ({
        url: `/file/${id}`,
        params: {
          action: "preview",
        },
      }),
    }),
    getPublicFile: builder.query({
      query: (token) => `/share/${token}`,
    }),
  }),
});

export const { useGetFilePreviewQuery, useGetPublicFileQuery } = fileApi;
