import React, { useState } from "react";
import { useResendVerification, useVerify } from "../components/hooks/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../components/lib/utils";
import toast from "react-hot-toast";

export default function VerifyEmail() {
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const userEmail = localStorage.getItem("userEmail");

  const navigate = useNavigate();

  useEffect(() => {
    const token = getCookie("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const { verifyFn, isPending } = useVerify();
  const { resendVerificationFn } = useResendVerification();

  // Handle OTP change
  const handleOtpChange = (element, index) => {
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Auto-focus to next input
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  // Handle OTP submit
  const handleVerify = () => {
    const otpInput = otp.join("");
    if (otpInput) {
      verifyFn({ email: userEmail, code: otpInput });
    } else {
      toast.error("Please enter the OTP code.");
    }
  };

  const handleResend = () => {
    resendVerificationFn({ email: userEmail });
  };

  return (
    <>
      <div className="w-full max-w-[36rem] space-y-6 p-6 md:p-20">
        <div className="space-y-2 place-items-center">
          <div className="">
            <img src="/gloc-logo.svg" alt="logo" className="w-13 mb-2" />
          </div>
          <p className="font-semibold text-2xl ">Verify your email</p>
          <p className="font-light text-sm">
            We sent a code to your email address.
          </p>
        </div>
        <div className="space-y-7 w-full">
          <form className="flex flex-col gap-4 w-full">
            <div className="space-y-2 w-full">
              <div className="flex justify-center space-x-2">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    className="w-12 h-12 text-center form-control border !border-black/10 text-black rounded-lg"
                    maxLength="1"
                    value={data}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    autoFocus={!index} // Auto-focus the first input
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              className={`px-5 py-3 rounded-md text-white cursor-pointer transition-colors bg-c-color hover:bg-c-bg`}
              onClick={(e) => {
                e.preventDefault();
                handleVerify();
              }}
            >
              {isPending ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          <div className="text-center w-full">
            <p className="text-sm font-light" onClick={handleResend}>
              Resend code?{" "}
              <span className="text-c-color font-bold cursor-pointer">
                Resend
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
