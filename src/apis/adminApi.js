import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_BASE_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    allUsers: builder.query({
      query: () => ({
        url: "/admin/users",
        provideTags: ["Users"],
      }),
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/admin/users/${id}/delete`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
    deactivateUser: builder.mutation({
      query: (id) => ({
        url: `/admin/users/${id}/deactivate`,
        method: "PATCH",
      }),
    }),
    changeUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `admin/users/${id}/change-role`,
        method: "PATCH",
        body: { role },
      }),
    }),
  }),
});

export const {
  useAllUsersQuery,
  useDeleteUserMutation,
  useDeactivateUserMutation,
  useChangeUserRoleMutation,
} = adminApi;
