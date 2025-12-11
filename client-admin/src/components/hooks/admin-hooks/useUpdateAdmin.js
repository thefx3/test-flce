import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAdmin } from "../../../api/adminApi";

export function useUpdateAdmin() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: ({ adminId, data }) => updateAdmin({ adminId, data }),
      onSuccess: () => {
        queryClient.invalidateQueries(["admins"]);
      }
    });
  }
