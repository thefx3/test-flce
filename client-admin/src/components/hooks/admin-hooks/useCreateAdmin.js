import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerAdmin } from "../../../api/adminApi";

export function useCreateAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => registerAdmin(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["admins"]);
    },
  });
}
