import React from "react";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <>
      <div className="p-4 h-screen flex flex-col gap-6 md:flex-row">
        <div className="min-w-[36rem] bg-gray-200 h-full overflow-hidden relative rounded-xl hidden md:flex bg-gradient-to-br from-c-color to-black">
          <div className="w-[240px] absolute bottom-0 right-0 opacity-5 h-full flex items-center justify-center">
            {/* <img src="/logo_sub.svg" alt="" className="w-full" /> */}
          </div>
        </div>
        <div className="w-full h-full flex items-center justify-center">
          <Outlet />
        </div>
      </div>
    </>
  );
}
``