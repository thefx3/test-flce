import { useContext, useState } from "react";
import { AdminContext } from "../context/AdminContext";
import "./Dashboard.css";

import { useTestsQuery } from "../components/hooks/test-hooks/useTestsQuery";
import { useToGradeQuery } from "../components/hooks/test-hooks/useToGradeQuery";
import { useDeleteTest } from "../components/hooks/test-hooks/useDeleteTest";
import { useFinalizeTest } from "../components/hooks/test-hooks/useCorrectTest";
import TestsList from "../components/tests-components/TestsList";
import TestDetailModal from "../components/tests-components/TestDetailModal";
import TestDeleteModal from "../components/tests-components/TestDeleteModal";
import TestCorrectModal from "../components/tests-components/TestCorrectModal";

export default function TestsPage() {
  const { token } = useContext(AdminContext);
  const { data: tests = [], isLoading, isError } = useTestsQuery(token);
  const toGradeQuery = useToGradeQuery(token);
  const deleteMutation = useDeleteTest();
  const finalizeMutation = useFinalizeTest();

  const [modal, setModal] = useState(null); // detail | delete | correct
  const [selected, setSelected] = useState(null);
  const [expandedId, setExpandedId] = useState(null);


  if (isLoading || toGradeQuery.isLoading) return <p>Chargement...</p>;
  if (isError || toGradeQuery.isError) return <p>Erreur de chargement</p>;
  const toGrade = toGradeQuery.data?.count ?? tests.filter(t => t.status !== "CORRECTED" && t.status !== "AUTO_GRADED").length;

  return (
    <div className="admin-wrapper">
      <div className="tests-header">
        <div className="test-stats">
          <p className="eyebrow">Total Tests</p>
          <h1>{tests.length}</h1>
        </div>
        <div className="test-stats">
          <p className="eyebrow">A corriger</p>
          <h1>{toGrade}</h1>
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
          onConfirm={() => finalizeMutation.mutate(selected.testId || selected.id, {
            onSuccess: () => { setModal(null), setSelected(null);}
          }
          )}
          isLoading={finalizeMutation.isPending}
          error={finalizeMutation.isError ? finalizeMutation.error?.message : null}
        />
      )}
    </div>
  );
}
