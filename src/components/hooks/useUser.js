import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser, updateUser } from "../services/authApi";
import toast from "react-hot-toast";

export function useUser() {
  const token = document.cookie.includes("token=")
    ? document.cookie.split("token=")[1].split(";")[0]
    : null;
  const {
    isPending: isLoadingUser,
    data: user,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    // enabled: token === null, // Only run the query if the token exists
    retry: 2,
  });

  return {
    isLoadingUser,
    user: user?.data,
    error,
    isAuthenticated: token !== null,
  };
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { mutateAsync: updateUserFn, isPending } = useMutation({
    mutationKey: ["updateUser"],
    mutationFn: async (body) => {
      return await updateUser(body);
    },
    onSuccess(data) {
      console.log(data);
      toast.success(data?.success === true && "Profile updated successfully");
      queryClient.refetchQueries({
        queryKey: ["user"],
      });
    },
    onError(error) {
      console.log(error);

      toast.error(`${error.message}`);
    },
  });
  return { updateUserFn, isPending };
}
