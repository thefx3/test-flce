import { useQuery } from "@tanstack/react-query";
import { getAllTests } from "../../../api/adminApi";

export function useTestsQuery(token) {
  return useQuery({
    queryKey: ["tests"],
    queryFn: () => getAllTests(token),
    staleTime: 1000 * 60 * 5,
  });
}
