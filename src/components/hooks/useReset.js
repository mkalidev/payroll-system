import { forgetPassword, resetPassword } from "../services/authApi";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useForget = () => {
  const { mutateAsync: forgetFn, isPending } = useMutation({
    mutationKey: ["forgetPassword"],
    mutationFn: async (body) => {
      return await forgetPassword(body);
    },
    onSuccess(data) {
      // console.log(data);
      toast.success(`${data.message}`);
    },
    onError(error) {
      console.log(error);

      toast.error(`${error.message}`);
    },
  });
  return { forgetFn, isPending };
};

export const useReset = () => {
  const navigate = useNavigate();
  const { mutateAsync: resetFn, isPending } = useMutation({
    mutationKey: ["resetPassword"],
    mutationFn: async (body) => {
      return await resetPassword(body);
    },
    onSuccess(data) {
      // console.log(data);
      toast.success(`${data.message}`);
      navigate("/login");
    },
    onError(error) {
      console.log(error);

      toast.error(`${error.message}`);
    },
  });
  return { resetFn, isPending };
};
