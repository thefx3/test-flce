import TestCard from "./TestCard";

export default function TestsList({ tests, onView, onDelete, onCorrect }) {
  if (!tests || tests.length === 0) {
    return (
      <div className="state-card">
        <p className="eyebrow">Aucun test</p>
        <p>Ajoutez un premier test pour commencer.</p>
      </div>
    );
  }

  return (
    <div className="test-table">
      <div className="test-table__head">
        <span>Date</span>
        <span>Nom</span>
        <span>Prénom</span>
        <span>Nationalité</span>
        <span>Âge</span>
        <span>Email</span>
        <span>Score</span>
        <span>Statut</span>
      </div>
      <div className="test-table__body">
        {tests.map((test) => (
          <TestCard
            key={test.testId || test.id}
            test={test}
            onView={onView}
            onDelete={onDelete}
            onCorrect={onCorrect}
          />
        ))}
      </div>
    </div>
  );
}
