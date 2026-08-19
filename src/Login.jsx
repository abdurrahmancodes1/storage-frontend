import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { loginWithGoogle } from "./apis/loginWihtGoogle";
import { authApi, useLoginMutation } from "./apis/authApi";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  // serverError will hold the error message from the server
  const [serverError, setServerError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Clear the server error as soon as the user starts typing in either field
    if (serverError) {
      setServerError("");
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData).unwrap();
      dispatch(authApi.util.resetApiState());
      navigate("/dashboard", { replace: true });
      setServerError(error);
    } catch (error) {
      console.log("Login Failed");
    }
  };

  // If there's an error, we'll add "input-error" class to both fields
  const hasError = Boolean(serverError);

  return (
    <div className="min-h-screen flex">
      {/* LEFT – LOGIN FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 px-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <span className="font-bold text-lg tracking-tight">
            Stor<span className="text-blue-600">Vault</span>
          </span>

          <h3 className="text-xl font-semibold text-gray-800 mb-1">
            Welcome back
          </h3>

          <p className="text-sm text-gray-500 mb-6">
            Access your files securely from anywhere
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                className={`w-full mt-1 px-4 py-2 border rounded-lg outline-none focus:ring-2 ${
                  hasError
                    ? "border-red-500 focus:ring-red-400"
                    : "focus:ring-blue-500"
                }`}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-600">Password</label>
              <input
                className={`w-full mt-1 px-4 py-2 border rounded-lg outline-none focus:ring-2 ${
                  hasError
                    ? "border-red-500 focus:ring-red-400"
                    : "focus:ring-blue-500"
                }`}
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              {serverError && (
                <p className="text-xs text-red-500 mt-1">{serverError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" />
                  Login In...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex justify-center items-center gap-2">
            {/* <div className="flex-1 h-px bg-gray-300" /> */}
            <div className="flex items-center">
              {error && (
                <span className="text-xs text-red-500">
                  Invalid credentials
                </span>
              )}
            </div>
            {/* <span className="text-xs text-gray-400">OR</span> */}
            {/* <div className="flex-1 h-px bg-gray-300" /> */}
          </div>

          {/* Google Login */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                const data = await loginWithGoogle(
                  credentialResponse.credential,
                );
                if (data.success) navigate("/");
              }}
              useOneTap
              shape="pill"
              theme="filled_blue"
              text="continue_with"
              onError={() => console.log("Login Failed")}
            />
          </div>

          <p className="text-sm text-center text-gray-600 mt-6">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-medium hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT – STORAGE BRANDING */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 text-white items-center justify-center px-12">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-white/20 flex items-center justify-center text-3xl">
            📁
          </div>
          <h2 className="text-3xl font-bold mb-4">Your digital storage hub</h2>
          <p className="text-blue-100">
            Store, organize, and manage your files with enterprise-grade
            security and lightning-fast access.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
