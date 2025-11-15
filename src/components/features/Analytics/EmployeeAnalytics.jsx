import React from "react";
import { useGetWorkspace } from "../../hooks/useWorkspace";

export default function EmployeeAnalytics() {
  const { workspace, isLoadingWorkspace } = useGetWorkspace();
  const getWorkspaceArray = () => (Array.isArray(workspace) ? workspace : []);

  const getSortedWorkspaces = () => {
    const workspaceArray = getWorkspaceArray();
    return [...workspaceArray].sort((a, b) => {
      const aEmployeeCount = a?.employees?.length || 0;
      const bEmployeeCount = b?.employees?.length || 0;
      return bEmployeeCount - aEmployeeCount;
    });
  };

  const getMaxEmployees = () => {
    const workspaceArray = getWorkspaceArray();
    if (workspaceArray.length === 0) return 0;
    return Math.max(...workspaceArray.map((w) => w?.employees?.length || 0));
  };

  const sortedWorkspaces = getSortedWorkspaces();

  const maxEmployees = getMaxEmployees();
  const totalEmployees = workspace?.reduce((total, ws) => {
    return total + (ws?.employees?.length || 0);
  }, 0);

  if (isLoadingWorkspace) {
    return (
      <div className="w-full flex bg-white min-h-[180px] border border-gray-200 rounded-lg items-center justify-center p-3">
        <div className="w-8 h-8 border-4 border-c-color border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      {sortedWorkspaces?.length === 0 ? (
        <div className="w-full min-h-[180px] h-auto rounded-lg bg-white border border-gray-200 flex flex-col items-left gap-3 p-5">
          <p className="text-sm font-medium text-black/50">Total Employees</p>
          <div className="w-full flex flex-col gap-2 items-center justify-center p-3">
            <img src="empty.svg" alt="" className="w-14" />
            <p className="text-sm text-gray-500">No workspaces available</p>
          </div>
        </div>
      ) : null}
      {sortedWorkspaces?.length > 0 && (
        <div className="w-full min-h-[180px] h-auto rounded-lg bg-white border border-gray-200 flex flex-col items-left gap-3 p-5">
          <p className="text-sm font-medium text-black/50">
            Total Employees ({totalEmployees})
          </p>
          <div className="flex flex-col gap-2 w-full">
            {sortedWorkspaces?.slice(0, 4)?.map((ws, index) => {
              const employeeCount = ws?.employees?.length || 0;
              const percentage =
                maxEmployees > 0 ? (employeeCount / maxEmployees) * 100 : 0;

              return (
                <div
                  key={index}
                  className="flex items-center justify-center gap-3"
                >
                  {/* Workspace Name */}
                  <div className="w-24 text-xs text-gray-700 font-medium truncate">
                    {ws?.name}
                  </div>

                  {/* Progress Bar Container */}
                  <div className="w-full relative">
                    <div className="w-full h-4 bg-c-color/20 rounded-sm relative overflow-hidden">
                      {/* Blue Bar */}
                      <div
                        className="h-full bg-c-color rounded-sm transition-all duration-300 ease-out"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Employee Count */}
                  <div className="text-sm font-medium text-gray-800 min-w-[30px] text-right">
                    {ws?.employees?.length}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
