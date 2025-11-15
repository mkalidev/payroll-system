import React, { useState } from "react";
import Drawer from "../ui/Drawer";
import { useGetWorkspace } from "../hooks/useWorkspace";
import WorkspaceCard from "./WorkspaceCard";

export default function AllWorkspace() {
  const [isOpen, setIsOpen] = useState(false);
  const { workspace, isLoadingWorkspace, error } = useGetWorkspace();

  if (error) {
    return (
      <div className="w-full h-full min-h-[70dvh] flex flex-col gap-3 items-center justify-center">
        <img src="/error.svg" alt="" className="w-36" />
        <p className="text-gray-500 text-center max-w-[230px]">
          {error?.message}
        </p>
      </div>
    );
  }

  const sortedWorkspace = workspace
    ?.slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <>
      <div className="space-y-4 w-full">
        <div className="flex items-center justify-between gap-3">
          <p className="font-semibold text-[16px] md:text-[24px]">Workspace</p>
          <button
            className="bg-c-bg-2 px-5 py-3 rounded-lg text-xs text-white md:text-sm font-medium bg-c-color hover:bg-c-bg transition-colors cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            Create New Workspace
          </button>
        </div>
        {isLoadingWorkspace ? (
          <div className="w-full min-h-[320px] p-6 flex gap-3 flex-col items-center justify-center bg-white">
            <img src="loading.svg" alt="" className="w-30" />
            <p className="text-sm font-light">Loading workspace...</p>
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedWorkspace?.length === 0 && (
              <div className="w-full h-[320px] bg-white rounded-lg flex flex-col items-center justify-center gap-4 p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200 ease-in-out">
                <img src="empty.svg" alt="" className="w-20" />
                <p className="text-gray-500 text-sm font-light">
                  No workspace yet!
                </p>
                <button
                  className="bg-c-color hover:bg-c-bg px-6 py-2.5 text-white rounded-lg cursor-pointer"
                  onClick={() => setIsOpen(true)}
                >
                  Create Workspace
                </button>
              </div>
            )}
            {sortedWorkspace?.map((space, index) => (
              <WorkspaceCard space={space} key={index} />
            ))}
          </div>
        )}
      </div>
      {isOpen && <Drawer setIsOpen={setIsOpen} />}
    </>
  );
}
