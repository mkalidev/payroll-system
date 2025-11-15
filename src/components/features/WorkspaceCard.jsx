import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { GoKebabHorizontal } from "react-icons/go";
import { Link } from "react-router-dom";
import { truncate } from "../lib/utils";
import { useDeleteWorkspace } from "../hooks/useWorkspace";
import { FiCopy, FiMail, FiX, FiShare2 } from "react-icons/fi";
import toast from "react-hot-toast";

export default function WorkspaceCard({ space }) {
  const [showOption, setShowOption] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const optionsRef = useRef(null);

  const { deleteWorkspaceFn } = useDeleteWorkspace();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOption(false);
      }
    };

    if (showOption) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOption]);

  const handleKebabClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowOption(!showOption);
  };

  const handleOptionClick = (e, action) => {
    e.preventDefault();
    e.stopPropagation();

    // Handle different actions
    switch (action) {
      case "edit":
        console.log("Edit clicked");
        break;
      case "delete":
        deleteWorkspaceFn(space?._id);
        break;
      case "share":
        setShowShareModal(true);
        break;
      default:
        break;
    }

    setShowOption(false);
  };

  // Share functionality
  const workspaceUrl = `${window.location.origin}/workspace/${space?.slug}/overview`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(workspaceUrl);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error("Failed to copy link");
    }
  };

  const shareViaEmail = () => {
    const subject = `Join my workspace: ${space?.name}`;
    const body = `Hi! I'd like to invite you to join my workspace "${space?.name}" on our payroll platform.\n\nWorkspace: ${space?.name}\nDescription: ${space?.description}\n\nClick the link below to join:\n${workspaceUrl}\n\nBest regards!`;

    const mailtoLink = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  const shareViaNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: space?.name,
          text: `Join my workspace: ${space?.description}`,
          url: workspaceUrl,
        });
      } catch (err) {
        console.error("Error sharing:", err);
        toast.error("Failed to share");
      }
    } else {
      // Fallback to copy
      copyToClipboard();
    }
  };

  return (
    <>
      <div>
        <Link to={`/workspace/${space?.slug}/overview`}>
          <div className="w-full h-full max-h-[320px] bg-white rounded-lg flex flex-col gap-5 p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200 ease-in-out">
            <div className="flex w-full items-center justify-between gap-5">
              <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden object-cover object-center">
                <img
                  src={space?.logo}
                  alt=""
                  className="object-cover object-center"
                />
              </div>
              <div className="relative">
                <button
                  className="cursor-pointer px-2 py-1"
                  onClick={handleKebabClick}
                >
                  <GoKebabHorizontal size={26} />
                </button>
                {showOption && (
                  <div
                    ref={optionsRef}
                    className="absolute top-8 right-0 w-30 min-h-fit bg-gray-50 overflow-hidden rounded-lg"
                  >
                    {space?.myRole === "owner" && (
                      <>
                        <div
                          className="p-3 w-full text-sm hover:bg-black/20 cursor-pointer"
                          onClick={(e) => handleOptionClick(e, "edit")}
                        >
                          Edit
                        </div>
                        <div
                          className="p-3 w-full text-sm hover:bg-black/20 cursor-pointer"
                          onClick={(e) => handleOptionClick(e, "delete")}
                        >
                          Delete
                        </div>
                      </>
                    )}
                    <div
                      className="p-3 w-full text-sm hover:bg-black/20 cursor-pointer"
                      onClick={(e) => handleOptionClick(e, "share")}
                    >
                      Share
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[20px] font-semibold">
                {space?.name}{" "}
                <span className="bg-c-color text-[10px] text-white px-2 py-1 font-medium capitalize rounded-full">
                  {space?.myRole}
                </span>
              </p>
              <p className="text-gray-500 text-sm font-light">
                {truncate(space?.description, 50)}
              </p>
            </div>
            <hr className="border-black/10" />
            <div className="space-y-2">
              <p className="font-light text-xs">Admins/Staffs</p>
              {space?.admins?.length === 0 && (
                <p className="text-xs font-light text-gray-600">
                  No admins yet
                </p>
              )}
              {space?.admins?.length > 0 && (
                <div className="flex items-center">
                  {space?.admins.slice(0, 4).map((admin, index) => (
                    <div
                      key={admin?._id}
                      className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative"
                      style={{
                        marginLeft: index > 0 ? "-12px" : "0",
                        zIndex: space?.admins.length - index,
                      }}
                    >
                      <img
                        src={admin?.avatar || "/default-avatar.png"}
                        alt={admin?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}

                  {space?.admins.length > 4 && (
                    <div
                      className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white flex items-center justify-center text-xs text-white font-medium"
                      style={{ marginLeft: "-8px", zIndex: 0 }}
                    >
                      +{space?.admins.length - 4}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-gray-500 text-xs">
                Created at: {moment(space?.createdAt).format("LLL")}
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowShareModal(false)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-md bg-white rounded-lg shadow-2xl mx-4">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Share Workspace</h2>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Workspace Info */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden">
                  <img
                    src={space?.logo}
                    alt=""
                    className="object-contain object-center w-full h-full"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{space?.name}</h3>
                  <p className="text-sm text-gray-600">
                    {truncate(space?.description, 60)}
                  </p>
                </div>
              </div>

              {/* Share URL */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Workspace Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={workspaceUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-c-color text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <FiCopy size={16} />
                    Copy
                  </button>
                </div>
              </div>

              {/* Share Options */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Share via:</h4>

                {/* Native Share */}
                <button
                  onClick={shareViaNative}
                  className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FiShare2 size={20} className="text-c-color" />
                  <span className="text-left">
                    <div className="font-medium">Share</div>
                    <div className="text-sm text-gray-600">
                      {navigator.share
                        ? "Use system share dialog"
                        : "Copy link to clipboard"}
                    </div>
                  </span>
                </button>

                {/* Email */}
                <button
                  onClick={shareViaEmail}
                  className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FiMail size={20} className="text-c-color" />
                  <span className="text-left">
                    <div className="font-medium">Email</div>
                    <div className="text-sm text-gray-600">
                      Send invitation via email
                    </div>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
