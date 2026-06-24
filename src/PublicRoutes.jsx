import { Navigate, Outlet } from "react-router-dom";
import { useGetCurrentUserQuery } from "./apis/authApi";
// import { useGetMeQuery } from "./apis/userApi";

const PublicRoute = () => {
  const { data, isLoading } = useGetCurrentUserQuery();
  console.log(data, "from route");
  if (isLoading) return null;

  if (data) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
