import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetSingleWorkspace } from "../../hooks/useWorkspace";
import { useInviteAdmin, useRemoveAdmin } from "../../hooks/useAcceptAdmin";
import InviteAdminModal from "../../ui/InviteAdminModal";
import { useUser } from "../../hooks/useUser";
import { Trash2 } from "lucide-react";
import Spinner from "../../ui/Spinner";

export default function Admins() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const { slug } = useParams();
  const { singleWorkspace } = useGetSingleWorkspace(slug);
  const { user } = useUser();

  const { inviteFn, isPending: isInvitingAdmin } = useInviteAdmin();
  const { removeFn, isPending: isRemovingAdmin } = useRemoveAdmin();

  const handleInviteAdmin = async (email) => {
    try {
      const id = singleWorkspace?.id;

      await inviteFn({ body: { email }, id });
      setShowInviteModal(false);
    } catch (error) {
      console.error("Error inviting admin:", error);
      // Handle error, e.g., show an error message
    }
  };

  const handleRemoveAdmin = async (adminId) => {
    try {
      await removeFn({
        workspaceId: singleWorkspace?.id,
        adminId: adminId,
      });
    } catch (error) {
      console.error("Error removing admin:", error);
      // Handle error, e.g., show an error message
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between w-full gap-2">
        <h1 className="text-xl font-bold text-gray-800">Admins</h1>
        {user?._id === singleWorkspace?.userId?._id && (
          <button
            className="bg-c-color text-white px-6 py-2.5 text-sm rounded-lg cursor-pointer hover:bg-c-bg transition-colors duration-200"
            onClick={() => setShowInviteModal(true)}
            disabled={isInvitingAdmin}
          >
            Add admin
          </button>
        )}
      </div>

      <div className="w-full">
        {singleWorkspace?.admins?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {singleWorkspace?.admins.map((admin) => (
              <div
                key={admin?.id}
                className="border border-black/10 w-full p-4 rounded-lg flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={admin?.avatar || "/default-avatar.png"}
                    alt={admin?.name}
                    className={
                      "w-12 h-12 rounded-full object-cover" +
                      (user?._id === admin?._id
                        ? " border-4 border-c-color"
                        : "")
                    }
                  />
                  <div>
                    <h2 className="text-sm md:text-lg font-semibold">
                      {admin.name}
                    </h2>
                    <p className="text-gray-600 text-xs mdtext-md">
                      {admin.email}
                    </p>
                  </div>
                </div>
                {user?._id === singleWorkspace?.userId?._id && (
                  <>
                    <span
                      className="text-xs bg-c-color px-2 py-2 rounded-lg text-white"
                      onClick={() => handleRemoveAdmin(admin?.id)}
                    >
                      {isRemovingAdmin ? <Spinner /> : <Trash2 size={16} />}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-[320px] bg-white rounded-lg flex flex-col items-center justify-center gap-2 p-6">
            <img src="/empty.svg" alt="No admins" className="w-20" />
            <p className="text-gray-500">No admins found.</p>
            <p className="text-gray-400 text-center text-sm">
              You can add admins to your workspace.
            </p>
            <span className="text-c-color text-sm font-semibold">
              Click on "Add Admin" to get started.
            </span>
          </div>
        )}
      </div>
      {showInviteModal && (
        <InviteAdminModal
          setIsOpen={setShowInviteModal}
          handleInviteAdmin={handleInviteAdmin}
          isInvitingAdmin={isInvitingAdmin}
        />
      )}
    </div>
  );
}
