// import axios from "axios";

// export const createSubscription = async (planId) => {
//   const { data } = await axios.post(
//     `${import.meta.env.VITE_BACKEND_BASE_URL}/subscription`,
//     { planId },
//     {
//       withCredentials: true,
//     },
//   );
//   return data;
// };

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const subscriptionApi = createApi({
  reducerPath: "subscriptionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_BASE_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createSubscription: builder.mutation({
      query: (planId) => ({
        url: "/subscription",
        method: "POST",
        body: { planId },
      }),
    }),
  }),
});
export const { useCreateSubscriptionMutation } = subscriptionApi;
