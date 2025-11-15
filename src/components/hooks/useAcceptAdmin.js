import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { acceptAdmin, inviteAdmin, removeAdmin } from "../services/adminApi";

export const useAcceptAdmin = () => {
  const navigate = useNavigate();

  const { mutateAsync: acceptFn, isPending } = useMutation({
    mutationKey: ["acceptAdmin"],
    mutationFn: async (body) => {
      return await acceptAdmin(body);
    },
    onSuccess(data) {
      // console.log(data);
      toast.success(`${data.message}`);

      //redirect to dashboard
      navigate("/");
    },
    onError(error) {
      console.log(error);
      toast.error(`${error.message}`);
      navigate("/");
    },
  });
  return { acceptFn, isPending };
};

export const useInviteAdmin = () => {
  const { mutateAsync: inviteFn, isPending } = useMutation({
    mutationKey: ["inviteAdmin"],
    mutationFn: async ({ body, id }) => {
      return await inviteAdmin(body, id);
    },
    onSuccess(data) {
      toast.success(data.message);
    },
    onError(error) {
      console.error(error);
      toast.error(error.message);
    },
  });
  return { inviteFn, isPending };
};

export const useRemoveAdmin = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: removeFn, isPending } = useMutation({
    mutationKey: ["removeAdmin"],
    mutationFn: async ({ workspaceId, adminId }) => {
      return await removeAdmin(workspaceId, adminId);
    },
    onSuccess(data) {
      toast.success(data.message);
      queryClient.refetchQueries({
        queryKey: ["SingleWorkspace"],
      });
    },
    onError(error) {
      console.error(error);
      toast.error(error.message);
    },
  });
  return { removeFn, isPending };
};
