import { useMutation, useQueryClient } from "@tanstack/react-query";
import { finalizeTest } from "../../../api/adminApi";

export function useFinalizeTest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (testId) => finalizeTest(testId),
    onSuccess: () => {
      queryClient.invalidateQueries(["tests"]);
    },
  })
}
