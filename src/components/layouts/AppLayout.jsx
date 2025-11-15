import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import WorkspaceLayout from "./WorkspaceLayout";
import NetworkStatusBanner from "../ui/NetworkStatusBanner";

export default function AppLayout() {
  return (
    <div className="w-full flex gap-0 relative h-full">
      <NetworkStatusBanner />
      <Sidebar />
      {/* <WorkspaceLayout /> */}
      <div className="space-y-0 w-full relative">
        <Navbar />
        <div className="max-w-[1280px] py-10 px-4 md:px-6 mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
