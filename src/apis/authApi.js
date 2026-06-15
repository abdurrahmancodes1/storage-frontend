import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_BASE_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (formData) => ({
        url: "/user/login",
        method: "POST",
        body: formData,
      }),
    }),
    getDirectory: builder.query({
      query: (dirId = "") => `/directory/${dirId}`,
    }),
    register: builder.mutation({
      query: (formData) => ({
        url: "/user/register",
        method: "POST",
        body: formData,
      }),
    }),
    verigyOtp: builder.mutation({
      query: ({ email, otp }) => ({
        url: "/user/verify-otp",
        method: "POST",
        body: { email, otp },
      }),
    }),
    fetchUsers: builder.query({
      query: (search) => ({
        url: "/user/users",
        params: { search },
      }),
    }),
    shareWith: builder.mutation({
      query: ({ fileId, targetUserId, permission }) => ({
        url: "/user/share",
        method: "POST",
        body: { fileId, targetUserId, permission },
      }),
    }),
    sharedWithMe: builder.query({
      query: () => "/user/share/me",
    }),
    sharePublic: builder.query({
      query: () => "/user/share/public",
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerigyOtpMutation,
  useFetchUsersQuery,
  useShareWithMutation,
  useSharedWithMeQuery,
  useSharePublicQuery,
  useGetDirectoryQuery,
} = authApi;
