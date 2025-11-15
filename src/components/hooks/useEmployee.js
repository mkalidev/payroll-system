import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  createEmployee,
  deleteEmployee,
  updateEmployee,
} from "../services/employeeApi";

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: createEmployeeFn, isPending } = useMutation({
    mutationKey: ["createEmployee"],
    mutationFn: async (body) => {
      return await createEmployee(body);
    },
    onSuccess(data) {
      // console.log(data);
      toast.success(`${data.message}`);
      queryClient.refetchQueries({
        queryKey: ["singleWorkspace"],
      });
    },
    onError(error) {
      console.log(error);

      toast.error(`${error.message}`);
    },
  });
  return { createEmployeeFn, isPending };
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: deleteEmployeeFn, isPending } = useMutation({
    mutationKey: ["deleteEmployee"],
    mutationFn: async (employeeId) => {
      return await deleteEmployee(employeeId);
    },
    onSuccess(data) {
      // console.log(data);
      toast.success(`${data.message}`);
      queryClient.refetchQueries({
        queryKey: ["singleWorkspace"],
      });
    },
    onError(error) {
      console.log(error);
      toast.error(`${error.message}`);
    },
  });
  return { deleteEmployeeFn, isPending };
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: updateEmployeeFn, isPending } = useMutation({
    mutationKey: ["updateEmployee"],
    mutationFn: async ({ body, id }) => {
      return await updateEmployee(body, id);
    },
    onSuccess(data) {
      // console.log(data);
      toast.success(`${data.message}`);
      queryClient.refetchQueries({
        queryKey: ["singleWorkspace"],
      });
    },
    onError(error) {
      console.log(error);
      toast.error(`${error.message}`);
    },
  });
  return { updateEmployeeFn, isPending };
};
