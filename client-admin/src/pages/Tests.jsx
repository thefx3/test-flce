import { useContext, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminContext } from "../context/AdminContext";
import "./Dashboard.css";

import { useTestsQuery } from "../components/hooks/test-hooks/useTestsQuery";
import TestsList from "../components/tests-components/TestsList";
import TestDetailModal from "../components/tests-components/TestDetailModal";
import TestDeleteModal from "../components/tests-components/TestDeleteModal";
import TestCorrectModal from "../components/tests-components/TestCorrectModal";
import { deleteTest, finalizeTest } from "../api/adminApi";

export default function TestsPage() {
  const { token } = useContext(AdminContext);
  const queryClient = useQueryClient();
  const { data: tests = [], isLoading, isError } = useTestsQuery(token);

  const [modal, setModal] = useState(null); // detail | delete | correct
  const [selected, setSelected] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const deleteMutation = useMutation({
    mutationFn: (testId) => deleteTest(testId),
    onSuccess: () => {
      queryClient.invalidateQueries(["tests"]);
      setModal(null);
      setSelected(null);
    },
  });

  const finalizeMutation = useMutation({
    mutationFn: (testId) => finalizeTest(testId),
    onSuccess: () => {
      queryClient.invalidateQueries(["tests"]);
      setModal(null);
      setSelected(null);
    },
  });

  if (isLoading) return <p>Chargement...</p>;
  if (isError) return <p>Erreur de chargement</p>;

  return (
    <div className="admin-wrapper">
      <div className="tests-header">
        <div className="test-stats">
          <p className="eyebrow">Total Tests</p>
          <h1>{tests.length}</h1>
        </div>
        <div className="test-stats">
          <p className="eyebrow">Taux de réussite</p>
          <h1>64%</h1>
        </div>
      </div>

      <TestsList
        tests={tests}
        expandedId={expandedId}
        onToggle={(id) => setExpandedId((prev) => (prev === id ? null : id))}
        onView={(test) => {
          setSelected(test);
          setModal("detail");
        }}
        onDelete={(test) => {
          setSelected(test);
          setModal("delete");
        }}
        onCorrect={(test) => {
          setSelected(test);
          setModal("correct");
        }}
      />

      {modal === "detail" && selected && (
        <TestDetailModal test={selected} onClose={() => { setModal(null); setSelected(null); }} />
      )}

      {modal === "delete" && selected && (
        <TestDeleteModal
          test={selected}
          onClose={() => { setModal(null); setSelected(null); }}
          onConfirm={() => deleteMutation.mutate(selected.testId || selected.id)}
          isLoading={deleteMutation.isPending}
          error={deleteMutation.isError ? deleteMutation.error?.message : null}
        />
      )}

      {modal === "correct" && selected && (
        <TestCorrectModal
          test={selected}
          onClose={() => { setModal(null); setSelected(null); }}
          onConfirm={() => finalizeMutation.mutate(selected.testId || selected.id)}
          isLoading={finalizeMutation.isPending}
          error={finalizeMutation.isError ? finalizeMutation.error?.message : null}
        />
      )}
    </div>
  );
}
