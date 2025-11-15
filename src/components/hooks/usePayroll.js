import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  createPayroll,
  getAllPayroll,
  getPayroll,
  getPayrollByTx,
} from "../services/payrollApi";
import { useNavigate } from "react-router-dom";

export function useGetPayroll(workspaceId) {
  const {
    isPending: isLoadingPayroll,
    data: payroll,
    error,
  } = useQuery({
    queryKey: ["payroll", workspaceId],
    queryFn: () => getPayroll(workspaceId),
  });

  return {
    isLoadingPayroll,
    payrolls: payroll?.data,
    error,
  };
}

// export function useGetSinglePayroll(slug) {
//   const {
//     isPending: isLoadingSinglePayroll,
//     data: payroll,
//     error,
//   } = useQuery({
//     queryKey: ["singlePayroll", slug],
//     queryFn: () => getSingleWorkspace(slug),
//   });

//   return {
//     isLoadingSinglePayroll,
//     singlePayroll: payroll?.data,
//     error,
//   };
// }

export const useCreatePayroll = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutateAsync: createPayrollFn, isPending } = useMutation({
    mutationKey: ["createPayroll"],
    mutationFn: async (body) => {
      return await createPayroll(body);
    },
    onSuccess(data) {
      // console.log(data);
      toast.success(`${data.message}`);
      queryClient.refetchQueries({ queryKey: ["payroll"] });
      navigate(`/workspace`);
    },
    onError(error) {
      console.log(error);

      toast.error(`${error.message}`);
    },
  });
  return { createPayrollFn, isPending };
};

export const useGetAllPayroll = () => {
  const {
    isPending: isLoadingAllPayroll,
    data: payroll,
    error,
  } = useQuery({
    queryKey: ["allPayroll"],
    queryFn: () => getAllPayroll(),
  });

  return {
    isLoadingAllPayroll,
    allPayrolls: payroll?.data,
    error,
  };
};

export const usePayroll = () => {
  const fetchPayrollByTx = async (txHash) => {
    const response = await getPayrollByTx(txHash);
    return response.data;
  };

  return {
    getPayrollByTx: fetchPayrollByTx,
  };
};
