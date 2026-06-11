import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { loginWithGoogle } from "./apis/loginWihtGoogle";
import { useRegisterMutation, useVerigyOtpMutation } from "./apis/authApi";
import { Loader2 } from "lucide-react";

const Register = () => {
  const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
  const [otp, setOtp] = useState("");
  const [otpSent, SetOtpSent] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // serverError will hold the error message from the server
  const [serverError, setServerError] = useState("");

  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const [verifyOtp, { isLoading: isOtpLoading }] = useVerigyOtpMutation();
  // Handler for input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Clear the server error as soon as the user starts typing in Email
    if (name === "email" && serverError) {
      setServerError("");
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSuccess(false); // reset success if any

    try {
      await register(formData).unwrap();
      SetOtpSent(true);
    } catch (error) {
      setServerError(error?.data?.message || "Registration failed");
    }
  };
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      await verifyOtp({
        email: formData.email,
        otp,
      }).unwrap();
      setIsSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setServerError(error?.data?.message || "OTP verification failed");
    }
  };
  return (
    <div className="min-h-screen flex">
      {/* LEFT – AUTH FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 px-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <span className="font-bold text-lg tracking-tight">
            Stor<span className="text-blue-600">Vault</span>
          </span>

          <h3 className="text-xl font-semibold text-gray-800 mb-1">
            {otpSent ? "Verify OTP" : "Create your account"}
          </h3>

          <p className="text-sm text-gray-500 mb-6">
            {otpSent
              ? "Enter the verification code sent to your email"
              : "Secure cloud storage for all your files"}
          </p>

          {!otpSent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Name</label>
                <input
                  className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  className={`w-full mt-1 px-4 py-2 border rounded-lg outline-none focus:ring-2 ${
                    serverError
                      ? "border-red-500 focus:ring-red-400"
                      : "focus:ring-blue-500"
                  }`}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {serverError && (
                  <p className="text-xs text-red-500 mt-1">{serverError}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-600">Password</label>
                <input
                  className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isRegisterLoading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium
             hover:bg-blue-700 transition
             flex items-center justify-center gap-2
             disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isRegisterLoading ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4" />
                    Sending OTP...
                  </>
                ) : (
                  "Send OTP"
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Enter OTP</label>
                <input
                  className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
                {serverError && (
                  <p className="text-xs text-red-500 mt-1">{serverError}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={isOtpLoading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium
             hover:bg-blue-700 transition
             flex items-center justify-center gap-2
             disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isOtpLoading ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4" />
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </button>
            </form>
          )}

          <div className="my-6 flex items-center gap-2">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* <div className="flex justify-center">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                const { success } = await loginWithGoogle(
                  credentialResponse.credential,
                );
                if (success) navigate("/");
              }}
              onError={() => console.log("Login Failed")}
              useOneTap
              shape="pill"
              theme="filled_blue"
              text="continue_with"
            />
          </div> */}

          <p className="text-sm text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT – STORAGE BRANDING */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 text-white items-center justify-center px-12">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-white/20 flex items-center justify-center text-3xl">
            ☁️
          </div>
          <h2 className="text-3xl font-bold mb-4">Your files. Anywhere.</h2>
          <p className="text-blue-100">
            Upload, organize, and access your documents securely from any
            device. Fast, private, and built for modern storage needs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
