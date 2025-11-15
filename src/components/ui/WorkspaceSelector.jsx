import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetWorkspace } from "../hooks/useWorkspace";
import { useCreateWorkspace } from "../hooks/useWorkspace";
import Drawer from "./Drawer";

const WorkspaceSelector = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { workspace, isLoadingWorkspace } = useGetWorkspace();
  const { createWorkspaceFn } = useCreateWorkspace();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  // Set default workspace (owner workspace or first workspace)
  useEffect(() => {
    if (workspace && workspace.length > 0) {
      // Find workspace where user is owner
      const ownerWorkspace = workspace.find((ws) => ws.myRole === "owner");
      // If no owner workspace, use the first one
      const defaultWorkspace = ownerWorkspace || workspace[0];
      setSelectedWorkspace(defaultWorkspace);
    }
  }, [workspace]);

  const handleWorkspaceSelect = (workspace) => {
    setSelectedWorkspace(workspace);
    setShowDropdown(false);
    navigate(`/workspace/${workspace.slug}/overview`);
  };

  const handleCreateWorkspace = () => {
    setShowDropdown(false);
    setShowCreateModal(true);
  };

  if (isLoadingWorkspace) {
    return (
      <div className="w-full p-2 border border-white/10 flex items-center justify-between gap-4 rounded-lg">
        <div className="flex gap-2 items-center">
          <div className="w-8 h-8 rounded-lg bg-white/20 animate-pulse"></div>
          <p className="text-sm font-light text-white/60">Loading...</p>
        </div>
        <ChevronDown size={16} className="text-white/40" />
      </div>
    );
  }

  // If no workspaces, show create workspace button
  if (!workspace || workspace.length === 0) {
    return (
      <div className="px-3">
        <button
          onClick={handleCreateWorkspace}
          className="w-full p-2 border border-white/10 flex items-center justify-center gap-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <Plus size={16} className="text-white" />
          <p className="text-sm font-light text-white">Create Workspace</p>
        </button>
        {showCreateModal && <Drawer setIsOpen={setShowCreateModal} />}
      </div>
    );
  }

  return (
    <div className="px-3">
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-full p-2 border border-white/10 flex items-center justify-between gap-4 rounded-lg hover:bg-white/10 transition-colors"
        >
          <div className="flex gap-2 items-center">
            <div className="w-8 h-8 rounded-lg bg-white/20 overflow-hidden">
              {selectedWorkspace?.logo && (
                <img
                  src={selectedWorkspace.logo}
                  alt={selectedWorkspace.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <p className="text-sm font-light text-white truncate">
              {selectedWorkspace?.name || "Select Workspace"}
            </p>
          </div>
          <ChevronDown
            size={16}
            className={`text-white transition-transform ${
              showDropdown ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            {/* Create Workspace Option */}
            <button
              onClick={handleCreateWorkspace}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg flex items-center gap-2 border-b border-gray-100"
            >
              <Plus size={16} className="text-gray-600" />
              <span className="text-gray-700">Create New Workspace</span>
            </button>

            {/* Workspace List */}
            {workspace.map((ws) => (
              <button
                key={ws._id}
                onClick={() => handleWorkspaceSelect(ws)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 last:rounded-b-lg flex items-center gap-3 ${
                  selectedWorkspace?._id === ws._id
                    ? "bg-c-color/20 text-c-color"
                    : "text-gray-700"
                }`}
              >
                <div className="w-6 h-6 rounded bg-gray-200 overflow-hidden flex-shrink-0">
                  {ws.logo && (
                    <img
                      src={ws.logo}
                      alt={ws.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-medium">{ws.name}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full capitalize ${
                        ws.myRole === "owner"
                          ? "bg-c-color text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {ws.myRole}
                    </span>
                  </div>
                  {ws.description && (
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {ws.description}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Create Workspace Modal */}
      {showCreateModal && <Drawer setIsOpen={setShowCreateModal} />}
    </div>
  );
};

export default WorkspaceSelector;
