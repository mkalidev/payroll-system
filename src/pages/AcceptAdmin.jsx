import React from "react";
import { useLocation } from "react-router-dom";
import { useAcceptAdmin } from "../components/hooks/useAcceptAdmin";
import toast from "react-hot-toast";

export default function AcceptAdmin() {
  const queryParams = new URLSearchParams(useLocation().search);
  const token = queryParams.get("token");

  const { acceptFn, isPending } = useAcceptAdmin();

  const handleAccept = async () => {
    if (!token) {
      toast.error("No token provided");
      console.error("No token provided");
      return;
    }
    try {
      await acceptFn({ token });
    } catch (error) {
      console.error("Error accepting admin invite:", error);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center p-6 md:p-10">
      <div className="flex flex-col items-center gap-4 bg-white w-[26rem] p-8 rounded-lg">
        <img src="/gloc-logo.svg" alt="logo" className="w-13 mb-2" />
        <h1 className="text-2xl font-bold text-gray-800">
          Accept Admin Invite
        </h1>
        {/* <p>{token}</p> */}
        <p className="text-gray-600 text-sm text-center">
          You have been invited to be an admin. Please click the button below to
          accept the invitation.
        </p>
        <div
          className="bg-c-color text-white px-4 py-2 rounded hover:bg-c-bg transition-colors cursor-pointer w-full text-center"
          onClick={handleAccept}
        >
          {isPending ? "Accepting..." : "Accept Invitation"}
        </div>
        <p className="text-black/40 text-xs mt-4 text-center">
          If you did not receive an invitation, please contact the workspace
          owner.
        </p>
      </div>
    </div>
  );
}
