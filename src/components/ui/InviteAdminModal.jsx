import React from "react";
import { useForm } from "react-hook-form";

export default function InviteAdminModal({
  setIsOpen,
  handleInviteAdmin,
  isInvitingAdmin,
}) {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    handleInviteAdmin(data.email);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white h-[16rem] rounded-lg shadow-2xl mx-4">
        {/* Modal content goes here */}
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Invite Admin</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
            <div className="space-y-2 w-full">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter admin's email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-c-color"
                required
                {...register("email", { required: true })}
              />
            </div>
            <button
              className="bg-c-color w-full text-white px-6 py-2.5 rounded-lg"
              type="submit"
              disabled={isInvitingAdmin}
            >
              {isInvitingAdmin ? "Inviting..." : "Invite Admin"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
