import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { BASE_URL } from "./components/DirectoryHeader";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("");
  const [refetch, setRefetch] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/user`,
          {
            credentials: "include",
          },
        );
        if (response.ok) {
          const data = await response.json();
          setRole(data.role);
          console.log(data.role);
          // Set user info if logged in
        } else if (response.status === 401) {
          // User not logged in
        } else {
          // Handle other error statuses if needed
          console.error("Error fetching user info:", response.status);
        }
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    }
    fetchUser();
  }, [refetch]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/user/users`,
          {
            credentials: "include",
          },
        );
        if (!response.ok) {
          navigate("/");
          return;
        }

        if (response.ok) {
          const data = await response.json();

          setUsers(data.users);
        } else {
          console.error("Error fetching users data", response.status);
        }
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    }
    fetchUsers();
  }, [refetch]);

  const handleDeleteUser = async (id) => {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/user/users/${id}/delete`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );
    console.log(response);
    if (response.ok) {
      setRefetch((val) => !val);
    }
  };

  const handleLogoutUser = async (id) => {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/user/users/${id}/logout`,
      {
        method: "POST",
        credentials: "include",
      },
    );
    const data = await response.json();
    if (response.ok) {
      setRefetch((val) => !val);
    }
    console.log(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-800">All Users</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage active user sessions
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Status</th>
                {role === "Admin" ? (
                  <th className="px-6 py-3 text-right">Action</th>
                ) : (
                  <th></th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {user.name}
                  </td>

                  <td className="px-6 py-4 text-gray-600">{user.email}</td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                        ${
                          user.isLoggedIn
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-600"
                        }`}
                    >
                      {user.isLoggedIn ? "Logged In" : "Logged Out"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleLogoutUser(user._id)}
                      disabled={!user.isLoggedIn}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition
                        ${
                          user.isLoggedIn
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                    >
                      Logout
                    </button>
                  </td>

                  {role === "Admin" ? (
                    <td className="px-6 py-4 text-right">
                      <button
                        // onClick={() => deleteUSer(user.id)}
                        onClick={() => handleDeleteUser(user._id)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition
                        bg-red-700 text-white hover:bg-red-600`}
                      >
                        Delete
                      </button>
                    </td>
                  ) : (
                    ""
                  )}
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
