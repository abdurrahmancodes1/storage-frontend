import { Navigate, Outlet } from "react-router-dom";
import { useGetCurrentUserQuery, useGetDirectoryQuery } from "./apis/authApi";

const ProtectedRoute = () => {
  // const { isError, isLoading } = useGetDirectoryQuery("");
  const { data, isLoading, isFetching, isError } = useGetCurrentUserQuery();
  if (isLoading || isFetching) return null;

  if (isError || !data?.user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
