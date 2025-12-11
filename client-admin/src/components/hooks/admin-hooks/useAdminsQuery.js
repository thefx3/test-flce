import { useQuery } from "@tanstack/react-query";
import { getAllAdmins } from "../../../api/adminApi";

export function useAdminsQuery(token) {
  return useQuery({
    queryKey: ["admins"],
    queryFn: () => getAllAdmins(token),
    staleTime: 1000 * 60 * 5,
  });
}
