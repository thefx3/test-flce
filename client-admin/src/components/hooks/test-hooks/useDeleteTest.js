import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTest } from "../../../api/adminApi";

export function useDeleteTest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (testId) => deleteTest(testId),
    onSuccess: () => {
      queryClient.invalidateQueries(["tests"]);
    },
  });
}
