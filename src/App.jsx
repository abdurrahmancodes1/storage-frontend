import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

// Update this import to point to your actual RTK Query slice
// import { useGetCurrentUserQuery } from "./your-api-slice-path";

import Register from "./Register";
import Login from "./Login";
import UsersPage from "./UserPage";
import CloudDashboard from "./CloudDashboard";
import Plans from "./Plans";
import Homepage from "./Homepage";
import PrivacyPolicy from "./PrivacyPage";
import TermsOfService from "./TermsOfServicePage";
import { useGetCurrentUserQuery } from "./apis/authApi";
import PreviewPage from "./PreviewPage";
import PublicSharePage from "./PublicSharePage";

// ----------------------------------------------------------------------
// ROUTE PROTECTORS using RTK Query
// ----------------------------------------------------------------------

// Restricts logged-in users from seeing Login/Register again
const GuestRoute = ({ children }) => {
  const { data: user, isLoading } = useGetCurrentUserQuery();

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    ); // Prevents flickering before RTK finishes

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

// Requires a user to be logged in. Kicks guests to login.
const ProtectedRoute = ({ children }) => {
  const { data: user, isLoading } = useGetCurrentUserQuery();

  if (isLoading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Requires a user to be logged in AND have a specific role
const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { data: user, isLoading } = useGetCurrentUserQuery();

  if (isLoading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Adjust 'user.role' if your API returns the role under a different property name
  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// ----------------------------------------------------------------------
// ROUTER CONFIGURATION
// ----------------------------------------------------------------------
const router = createBrowserRouter([
  // --- Public Routes ---
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/terms-of-service",
    element: <TermsOfService />,
  },

  // --- Guest Routes ---
  {
    path: "/login",
    element: (
      <GuestRoute>
        <Login />
      </GuestRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <GuestRoute>
        <Register />
      </GuestRoute>
    ),
  },

  // --- Protected Routes ---
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <CloudDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/directory/:dirId",
    element: (
      <ProtectedRoute>
        <CloudDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/preview/:id",
    element: (
      <ProtectedRoute>
        <PreviewPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/share/:token",
    element: <PublicSharePage />,
  },
  // --- Role-Protected Routes ---
  {
    path: "/user",
    element: (
      <RoleProtectedRoute allowedRoles={["manager", "admin"]}>
        <UsersPage />
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/plans",
    element: (
      <ProtectedRoute>
        <Plans />
      </ProtectedRoute>
    ),
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
