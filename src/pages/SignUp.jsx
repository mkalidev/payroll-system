import { Trash2, Eye, EyeOff, Check, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useSignup } from "../components/hooks/useAuth";
import { getCookie } from "../components/lib/utils";

export default function SignUp() {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getCookie("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const { signupFn, isPending: isSigningUp } = useSignup();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
  });

  const MAX_SIZE_MB = 3;

  const handleUploadClick = () => {
    setError("");
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type - reject SVG and only allow JPG, JPEG, PNG, GIF
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    const fileType = file.type.toLowerCase();

    if (!allowedTypes.includes(fileType)) {
      setError(
        "Only JPG, JPEG, PNG, and GIF files are allowed. SVG files are not supported."
      );
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // Additional check using file extension as backup
    const fileName = file.name.toLowerCase();
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];
    const hasValidExtension = allowedExtensions.some((ext) =>
      fileName.endsWith(ext)
    );

    if (!hasValidExtension) {
      setError(
        "Invalid file format. Please upload JPG, JPEG, PNG, or GIF files only."
      );
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    const fileSizeInMB = file.size / (1024 * 1024);

    if (fileSizeInMB > MAX_SIZE_MB) {
      setError("File size exceeds 3MB. Please upload a smaller image.");
      return;
    }

    // Store the actual File object
    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageSrc(reader.result);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setImageFile(null);
    setImageSrc(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Enhanced password validation with individual checks
  const passwordValidation = {
    minLength: password.length >= 6,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[@$!%*?&#.]/.test(password),
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const onSubmit = (data) => {
    // Method 1: Using FormData (recommended for file uploads)
    const formData = new FormData();

    // Append text fields
    formData.append("email", data.email);
    formData.append("fullName", data.fullName);
    formData.append("username", data.username);
    formData.append("password", password);

    // Append file if exists
    if (imageFile) {
      formData.append("avatar", imageFile, imageFile.name);
    }

    localStorage.setItem("userEmail", formData.get("email"));
    signupFn(formData);
  };

  const ValidationItem = ({ isValid, text }) => (
    <div
      className={`flex items-center gap-2 text-xs ${
        isValid ? "text-green-600" : "text-gray-500"
      }`}
    >
      {isValid ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="w-full max-w-[36rem] space-y-6 overflow-y-auto p-6 md:p-20">
      <div className="space-y-2 place-items-center">
        <div className="">
          <img src="/gloc-logo.svg" alt="logo" className="w-13 mb-2" />
        </div>
        <p className="font-semibold text-2xl ">Create a free account</p>
        <p className="font-light text-sm">
          Provide your details and choose a password
        </p>
      </div>
      <div className="space-y-7 w-full">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full"
        >
          <div className="flex items-end space-x-4 justify-between">
            <div className="h-24 w-24 rounded-lg border border-dashed overflow-hidden relative">
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt="avatar"
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
            <div className="flex-1">
              <button
                type="button"
                className="text-c-color hover:text-c-color/50 font-medium text-sm"
                onClick={handleUploadClick}
              >
                Upload
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
              <p className="text-xs text-gray-500 mt-1">
                JPG, GIF or PNG. 3MB Max.
              </p>
              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
              {imageSrc && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="p-2 flex gap-2 items-center text-sm text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-gray-400" />
                  Remove
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2 w-full">
            <p className="text-sm">Email*</p>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="p-3 w-full rounded-md border border-black/10 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2 w-full">
            <p className="text-sm">Full name*</p>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              className="p-3 w-full rounded-md border border-black/10 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
              {...register("fullName", {
                required: "Full name is required",
                minLength: {
                  value: 3,
                  message: "Full name must be at least 3 characters long",
                },
              })}
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div className="space-y-2 w-full">
            <p className="text-sm">Username*</p>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              className="p-3 w-full rounded-md border border-black/10 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
              {...register("username", {
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "Username must be at least 3 characters long",
                },
              })}
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="space-y-2 w-full">
            <p className="text-sm">Password*</p>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handlePasswordChange}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                placeholder="Enter your password"
                className={`p-3 w-full pr-12 rounded-md border ${
                  password && isPasswordValid
                    ? "border-green-500 focus:border-green-500 focus:ring-green-500"
                    : "border-black/10 focus:border-blue-500 focus:ring-blue-500"
                } focus:outline-none focus:ring-1`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Password requirements - show when password field is focused or has content */}
            {(passwordFocused || password) && (
              <div className="mt-2 p-3 bg-gray-50 rounded-md space-y-1">
                <p className="text-xs font-medium text-gray-700 mb-2">
                  Password must contain:
                </p>
                <ValidationItem
                  isValid={passwordValidation.minLength}
                  text="At least 6 characters"
                />
                <ValidationItem
                  isValid={passwordValidation.hasUpperCase}
                  text="One uppercase letter (A-Z)"
                />
                <ValidationItem
                  isValid={passwordValidation.hasLowerCase}
                  text="One lowercase letter (a-z)"
                />
                <ValidationItem
                  isValid={passwordValidation.hasNumber}
                  text="One number (0-9)"
                />
                <ValidationItem
                  isValid={passwordValidation.hasSpecialChar}
                  text="One special character (@$!%*?&#)"
                />
              </div>
            )}
          </div>
          <button
            type="submit"
            className={`px-5 py-3 rounded-md text-white cursor-pointer transition-colors ${
              isPasswordValid && imageFile
                ? "bg-c-color hover:bg-c-bg"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!isPasswordValid || !imageFile || isSigningUp}
          >
            {isSigningUp ? "Signing Up..." : "Sign Up"}
          </button>

          {/* <div className="w-full flex gap-3 my-3 items-center justify-between">
            <hr className="border-gray-200 w-full" />
            <p className="text-sm text-gray-500">OR</p>
            <hr className="border-gray-200 w-full" />
          </div>

          <div
            className="px-5 py-3 rounded-md flex justify-center text-white cursor-pointer transition-colors bg-c-color hover:bg-c-bg"
            onClick={() => login()}
          >
            Signup with Privy
          </div> */}

          {/* <Connect /> */}
        </form>

        <div className="text-center w-full">
          <p className="text-sm font-light ">
            Already have an account?{" "}
            <Link to="/login">
              <span className="text-c-color font-bold cursor-pointer">
                Login
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
