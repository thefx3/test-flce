import { useQuery } from "@tanstack/react-query";
import { countTestsToGradeAdmin } from "../../../api/adminApi";

export function useToGradeQuery(token) {
  return useQuery({
    queryKey: ["tests", "to-grade"],
    queryFn: () => countTestsToGradeAdmin(token),
    staleTime: 1000 * 60 * 5,
  });
}
