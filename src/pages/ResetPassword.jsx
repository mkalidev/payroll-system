import React, { useState } from "react";
import { useReset } from "../components/hooks/useReset";
import { Check, Eye, EyeOff, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const queryParams = new URLSearchParams(useLocation().search);
  const token = queryParams.get("token");

  const { resetFn, isPending } = useReset();

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
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
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

  const onSubmit = () => {
    if (!token || token.trim() === "" || !password) {
      toast.error("Please provide a valid token and password");
      console.error("No token provided");
      return;
    }
    const updatedData = {
      password: password,
      token: token,
    };
    resetFn(updatedData);
    console.log("Reset Password Data:", updatedData);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center p-6 md:p-10">
      <div className="flex flex-col items-center gap-4 bg-white w-[26rem] p-8 rounded-lg">
        <img src="/gloc-logo.svg" alt="logo" className="w-13 mb-2" />
        <h1 className="text-2xl font-bold text-gray-800">Reset Pasword</h1>
        {/* <p>{token}</p> */}
        <p className="text-gray-600 text-sm text-center">
          Enter a new password to reset your account password. Please ensure it
          meets the security requirements. You will need to log in with this new
          password after resetting.
        </p>
        <div className="space-y-2 w-full">
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
            </div>
          </div>
          <div className="space-y-2 w-full">
            <p className="text-sm">Confirm password*</p>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                placeholder="Enter confirm password"
                className={`p-3 w-full pr-12 rounded-md border ${
                  confirmPassword && isPasswordValid
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
            </div>
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
          className="bg-c-color text-white px-4 py-3 rounded hover:bg-c-bg transition-colors cursor-pointer w-full text-center"
          onClick={() => onSubmit()}
          disabled={isPending}
        >
          {isPending ? "Sending..." : "Reset Password"}
        </button>
      </div>
    </div>
  );
}
