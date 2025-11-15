import React, { useState } from "react";
import { useGetWorkspace } from "../../hooks/useWorkspace";
import { ChevronDown } from "lucide-react";

export default function TotalWorkspace() {
  const { isLoadingWorkspace, workspace } = useGetWorkspace();
  const [selectedRole, setSelectedRole] = useState("all");
  const [showDropdown, setShowDropdown] = useState(false);

  // Helper function to ensure workspace is an array
  const getWorkspaceArray = () => (Array.isArray(workspace) ? workspace : []);

  // Filter workspaces by selected role
  const getFilteredWorkspaces = () => {
    const workspaceArray = getWorkspaceArray();
    return workspaceArray.filter((ws) => ws?.myRole === selectedRole);
  };

  // Get counts for different roles
  const getRoleCounts = () => {
    const workspaceArray = getWorkspaceArray();
    return {
      owner: workspaceArray.filter((ws) => ws?.myRole === "owner").length,
      admin: workspaceArray.filter((ws) => ws?.myRole === "admin").length,
      total: workspaceArray.length,
    };
  };

  const filteredWorkspaces = getFilteredWorkspaces();
  const roleCounts = getRoleCounts();
  const currentCount = filteredWorkspaces.length;

  // Role options for dropdown
  const roleOptions = [
    { value: "owner", label: "Owner", count: roleCounts.owner },
    { value: "admin", label: "Admin", count: roleCounts.admin },
    { value: "all", label: "All Roles", count: roleCounts.total },
  ];

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setShowDropdown(false);
  };

  const getCurrentRoleLabel = () => {
    const option = roleOptions.find((opt) => opt.value === selectedRole);
    return option ? option.label : "Owner";
  };

  const getCurrentCount = () => {
    if (selectedRole === "all") return roleCounts.total;
    return currentCount;
  };

  if (isLoadingWorkspace) {
    return (
      <div className="w-full flex bg-white min-h-[180px] border border-gray-200 rounded-lg items-center justify-center p-3">
        <div className="w-8 h-8 border-4 border-c-color border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="w-full min-h-[180px] h-auto rounded-lg bg-white border border-gray-200 flex flex-col items-left gap-3 p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-black/50">Total Workspace</p>

          {/* Role Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-1 border border-gray-200 rounded-lg px-2 py-1 text-xs text-black/70 hover:bg-gray-50 transition-colors"
            >
              {getCurrentRoleLabel()}
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  showDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                {roleOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleRoleChange(option.value)}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg flex items-center justify-between ${
                      selectedRole === option.value
                        ? "bg-c-color/20 text-c-color"
                        : "text-gray-700"
                    }`}
                  >
                    <span>{option.label}</span>
                    <span className="text-gray-500 font-medium">
                      ({option.count})
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Workspace Count Display */}
        <div className="w-full flex items-center justify-between">
          <div className="space-y-2">
            <p className="font-bold text-[46px] text-gray-800">
              {getCurrentCount()}
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>Owner: {roleCounts.owner}</span>
              <span>Admin: {roleCounts.admin}</span>
              <span>Total: {roleCounts.total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}
