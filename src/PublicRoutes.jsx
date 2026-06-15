import { Navigate, Outlet } from "react-router-dom";
import { useGetDirectoryQuery } from "./apis/authApi";

const PublicRoute = () => {
  const { isSuccess, isLoading } = useGetDirectoryQuery("");

  if (isLoading) return null;

  if (isSuccess) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
