import { Eye, EyeOff } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../components/hooks/useAuth";
import { getCookie } from "../components/lib/utils";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getCookie("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const { loginFn, isPending: isLoginingIn } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
  });

  const onSubmit = (data) => {
    loginFn(data);
  };

  return (
    <div className="w-full max-w-[36rem] space-y-6 p-6 md:p-20">
      <div className="space-y-2 place-items-center">
        <div className="">
          <img src="/gloc-logo.svg" alt="logo" className="w-13 mb-2" />
        </div>
        <p className="font-semibold text-2xl ">Welcome back!</p>
        <p className="font-light text-sm">Provide your username and password</p>
      </div>
      <div className="space-y-7 w-full">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full"
        >
          <div className="space-y-2 w-full">
            <p className="text-sm">Email*</p>
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              className="p-3 w-full rounded-md border border-black/10 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
              {...register("email", {
                required: "Email address is required",
                minLength: {
                  value: 3,
                  message: "Must be a valid email address",
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
                placeholder="Enter your password"
                className={`p-3 w-full pr-12 rounded-md border border-black/10 focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1`}
                required
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long",
                  },
                })}
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
          </div>
          <button
            type="submit"
            className={`px-5 py-3 rounded-md text-white cursor-pointer transition-colors bg-c-color hover:bg-c-bg`}
            disabled={errors.username || errors.password}
          >
            {isLoginingIn ? "Logging in..." : "Login"}
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
            Login with Privy
          </div> */}
        </form>
        <div className="space-y-2">
          <div className="w-full flex justify-center">
            <Link to="/forget-password">
              <span className="text-c-color font-medium cursor-pointer text-sm">
                Forget Password?
              </span>
            </Link>
          </div>
          <div className="text-center w-full">
            <p className="text-sm font-light ">
              Don't have an account?{" "}
              <Link to="/signup">
                <span className="text-c-color font-bold cursor-pointer">
                  SignUp
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
