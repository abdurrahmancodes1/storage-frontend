import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import UsersPage from "./UserPage";
import CloudDashboard from "./CloudDashboard";
import Plans from "./Plans";
import Homepage from "./Homepage";
import PublicRoute from "./PublicRoutes";
import ProtectedRoute from "./ProtectedRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "/dashboard",
    element: <CloudDashboard />,
  },
  {
    element: <PublicRoute />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <CloudDashboard />,
      },
      {
        path: "/directory/:dirId",
        element: <CloudDashboard />,
      },
      {
        path: "/user",
        element: <UsersPage />,
      },
      {
        path: "/plans",
        element: <Plans />,
      },
    ],
  }, // {
  //   path: "/dashboard",
  //   element: <CloudDashboard />,
  // },
  // {
  //   path: "/dashboard/directory/:dirId",
  //   element: <CloudDashboard />,
  // },
]);

function App() {
  console.log(import.meta.env.VITE_BACKEND_BASE_URL);

  return <RouterProvider router={router} />;
}

export default App;
