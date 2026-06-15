import { Navigate, Outlet } from "react-router-dom";
import { useGetDirectoryQuery } from "./apis/authApi";

const ProtectedRoute = () => {
  const { isError, isLoading } = useGetDirectoryQuery("");

  if (isLoading) return null;

  if (isError) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
