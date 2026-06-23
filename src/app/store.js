import { adminApi } from "@/apis/adminApi";
import { authApi } from "@/apis/authApi";
import { subscriptionApi } from "@/apis/subscriptionApi";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [subscriptionApi.reducerPath]: subscriptionApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      adminApi.middleware,
      subscriptionApi.middleware,
    ),
});
