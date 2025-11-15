import React from "react";
import { useForm } from "react-hook-form";
import { useForget } from "../components/hooks/useReset";

export default function ForgetPassword() {
  const { register, handleSubmit } = useForm();
  const { forgetFn, isPending } = useForget();

  const onSubmit = (data) => {
    forgetFn(data);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center p-6 md:p-10">
      <div className="flex flex-col items-center gap-4 bg-white w-[26rem] p-8 rounded-lg">
        <img src="/gloc-logo.svg" alt="logo" className="w-13 mb-2" />
        <h1 className="text-2xl font-bold text-gray-800">Forgot Pasword</h1>
        {/* <p>{token}</p> */}
        <p className="text-gray-600 text-sm text-center">
          Enter your email address to receive a link to reset your password.
          Please check your spam folder if you do not see the email in your
          inbox.
        </p>
        <input
          type="text"
          name="email"
          placeholder="Enter your email"
          className="p-3 w-full rounded-md border border-black/10 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Invalid email address",
            },
          })}
        />
        <button
          className="bg-c-color text-white px-4 py-3 rounded hover:bg-c-bg transition-colors cursor-pointer w-full text-center"
          onClick={handleSubmit(onSubmit)}
          disabled={isPending}
        >
          {isPending ? "Sending..." : " Send Reset Link"}
        </button>
      </div>
    </div>
  );
}
