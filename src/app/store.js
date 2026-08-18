import { adminApi } from "@/apis/adminApi";
import { authApi } from "@/apis/authApi";
import { fileApi } from "@/apis/fileApi2";
import { subscriptionApi } from "@/apis/subscriptionApi";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [subscriptionApi.reducerPath]: subscriptionApi.reducer,
    [fileApi.reducerPath]: fileApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      adminApi.middleware,
      subscriptionApi.middleware,
      fileApi.middleware,
    ),
});
