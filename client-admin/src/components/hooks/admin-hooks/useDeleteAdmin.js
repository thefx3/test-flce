import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAdmin } from "../../../api/adminApi";

export function useDeleteAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (adminId) => deleteAdmin(adminId),
    onSuccess: () => {
      queryClient.invalidateQueries(["admins"]);
    }
  });
}
